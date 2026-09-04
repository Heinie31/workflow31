import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ListPlus, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { AiOutputCard } from "@/components/workflow/AiOutputCard";
import {
  ActionButton,
  AiDisclaimer,
  EmptyState,
  ErrorState,
  FieldLabel,
  LoadingState,
  PageHeader,
  Panel,
  TextAreaField,
  TextField,
} from "@/components/workflow/primitives";
import { summariseMeeting } from "@/lib/ai.functions";
import type { MeetingSummary } from "@/types/workflow";


const title = "Meeting Assistant — WorkFlow AI";
const description =
  "Turn raw meeting notes into a clear summary with key decisions, action items and deadlines you can convert into tasks.";

export const Route = createFileRoute("/meeting-assistant")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MeetingAssistant,
});

function MeetingAssistant() {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [summary, setSummary] = useState<MeetingSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const summariseFn = useServerFn(summariseMeeting);

  async function summarise() {
    if (notes.trim().length < 20) {
      toast.error("Paste some meeting notes first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setSummary(await summariseFn({ data: { meetingTitle, notes } }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }


  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Meeting Assistant"
          title="Summarise a meeting"
          description="Paste notes or a transcript. The AI extracts decisions, action items and deadlines."
        />

        <div className="grid gap-4 lg:grid-cols-5">
          <Panel label="Meeting input" className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="meeting-title">Meeting title</FieldLabel>
                <TextField
                  id="meeting-title"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="Sprint 14 retro"
                />
              </div>
              <div>
                <FieldLabel htmlFor="notes">Notes / transcript</FieldLabel>
                <TextAreaField
                  id="notes"
                  rows={16}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Paste the full transcript or your rough notes here…"
                  className="min-h-72"
                />
              </div>
              <ActionButton variant="primary" className="w-full justify-center" onClick={summarise}>
                <Sparkles className="size-4" strokeWidth={1.75} aria-hidden />
                Summarise Meeting
              </ActionButton>
              <p className="text-[11px] text-inkfaint">
                Don't paste confidential or sensitive information unless this AI service has been
                approved for it.
              </p>
            </div>
          </Panel>

          <div className="space-y-4 lg:col-span-3">
            {loading ? (
              <Panel label="AI output">
                <LoadingState label="Reading the notes…" />
              </Panel>
            ) : summary ? (
              <>
                <AiOutputCard label={`AI output · ${summary.meetingTitle}`} timestamp="just now">
                  <p className="text-pretty text-sm text-inkmuted">{summary.summary}</p>
                </AiOutputCard>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Panel label="Key decisions">
                    <ul className="space-y-2.5 text-sm">
                      {summary.decisions.map((decision) => (
                        <li key={decision} className="flex gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lumen" />
                          <span className="text-inkmuted">{decision}</span>
                        </li>
                      ))}
                    </ul>
                  </Panel>

                  <Panel label="Deadlines">
                    <ul className="space-y-2.5 text-sm">
                      {summary.deadlines.map((deadline) => (
                        <li key={deadline} className="font-mono text-xs text-inkmuted">
                          {deadline}
                        </li>
                      ))}
                    </ul>
                  </Panel>
                </div>

                <Panel
                  label="Action items"
                  action={
                    <ActionButton
                      variant="primary"
                      onClick={() =>
                        toast.success("Tasks created", {
                          description: `${summary.actionItems.length} action items added to your planner.`,
                        })
                      }
                    >
                      <ListPlus className="size-4" strokeWidth={1.75} aria-hidden />
                      Create Tasks
                    </ActionButton>
                  }
                >
                  <div className="space-y-2.5">
                    {summary.actionItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-edge bg-obsidian/40 p-3"
                      >
                        <p className="min-w-0 text-sm">{item.content}</p>
                        <p className="font-mono text-[11px] text-inkfaint">
                          {item.owner} · {item.deadline}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            ) : (
              <Panel label="AI output">
                <EmptyState
                  title="No summary yet"
                  description="Add a meeting title and your notes, then summarise. Decisions, action items and deadlines appear here."
                />
              </Panel>
            )}
            <AiDisclaimer />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
