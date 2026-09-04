import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles } from "lucide-react";
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
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/workflow/primitives";
import { generateEmail } from "@/lib/ai.functions";
import type { EmailTone } from "@/types/workflow";


const title = "Email Assistant — WorkFlow AI";
const description =
  "Draft professional emails in seconds: set the recipient, purpose, key information and tone, then refine the AI output.";

export const Route = createFileRoute("/email-assistant")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: EmailAssistant,
});

const tones: { value: EmailTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "direct", label: "Direct" },
  { value: "persuasive", label: "Persuasive" },
  { value: "apologetic", label: "Apologetic" },
];

function EmailAssistant() {
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<EmailTone>("professional");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generateFn = useServerFn(generateEmail);

  async function generate() {
    if (!purpose.trim() && !keyPoints.trim()) {
      toast.error("Add a purpose or some key information first");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generateFn({ data: { recipient, purpose, keyPoints, tone } });
      setOutput(result.output);
      toast.success("Draft ready", { description: "Review before sending." });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }


  async function copy() {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Email Assistant"
          title="Draft an email"
          description="Give the AI just enough context, pick a tone, then edit the draft in place."
        />

        <div className="grid gap-4 lg:grid-cols-5">
          <Panel label="Brief" className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <FieldLabel htmlFor="recipient">Recipient &amp; context</FieldLabel>
                <TextField
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Dana Whitfield, procurement lead at Northwind"
                />
              </div>
              <div>
                <FieldLabel htmlFor="purpose">Email purpose</FieldLabel>
                <TextField
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Ask for sign-off on the revised Q3 budget ceiling"
                />
              </div>
              <div>
                <FieldLabel htmlFor="key-points">Key information</FieldLabel>
                <TextAreaField
                  id="key-points"
                  rows={6}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                  placeholder="Two accounts pending sign-off · forecast locks Friday · 20-min buffer offered"
                />
              </div>
              <div>
                <FieldLabel htmlFor="tone">Tone</FieldLabel>
                <SelectField
                  id="tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as EmailTone)}
                >
                  {tones.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </SelectField>
              </div>
              <ActionButton
                variant="primary"
                className="w-full justify-center"
                onClick={generate}
                disabled={loading}
              >
                <Sparkles className="size-4" strokeWidth={1.75} aria-hidden />
                {loading ? "Generating…" : "Generate Email"}
              </ActionButton>
              <p className="text-[11px] text-inkfaint">
                Don't enter confidential or sensitive information unless this AI service has been
                approved for it.
              </p>
            </div>
          </Panel>

          <div className="space-y-4 lg:col-span-3">
            {loading ? (
              <Panel label="AI output">
                <LoadingState label="Drafting your email…" />
              </Panel>
            ) : error ? (
              <Panel label="AI output">
                <ErrorState message={error} onRetry={generate} />
              </Panel>
            ) : output ? (

              <AiOutputCard
                label="AI output · Draft email"
                timestamp="just now"
                footer={
                  <>
                    <ActionButton variant="primary" onClick={copy}>
                      Copy
                    </ActionButton>
                    <ActionButton variant="outline" onClick={generate}>
                      Regenerate
                    </ActionButton>
                    <ActionButton onClick={() => setOutput("")}>Clear</ActionButton>
                  </>
                }
              >
                <TextAreaField
                  aria-label="Generated email, editable"
                  rows={14}
                  value={output}
                  onChange={(e) => setOutput(e.target.value)}
                  className="min-h-64"
                />
              </AiOutputCard>
            ) : (
              <Panel label="AI output">
                <EmptyState
                  title="No draft yet"
                  description="Fill in the brief on the left and generate a draft. The output stays fully editable."
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
