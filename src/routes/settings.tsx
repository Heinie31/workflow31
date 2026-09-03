import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import {
  ActionButton,
  FieldLabel,
  PageHeader,
  Panel,
  SelectField,
  TextField,
} from "@/components/workflow/primitives";
import { currentUser } from "@/lib/mock-data";

const title = "Settings — WorkFlow AI";
const description =
  "Manage your WorkFlow AI profile, AI and privacy preferences, and review the responsible AI guidance.";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Settings,
});

function Toggle({
  id,
  label,
  hint,
  defaultChecked = false,
}: {
  id: string;
  label: string;
  hint: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-edge bg-obsidian/40 p-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <p className="mt-0.5 text-xs text-inkmuted">{hint}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => setOn((v) => !v)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-lumen" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-obsidian transition-all ${on ? "left-[1.125rem]" : "left-0.5"}`}
        />
      </button>
    </div>
  );
}

function Settings() {
  return (
    <AppShell>
      <div className="max-w-3xl space-y-6">
        <PageHeader
          eyebrow="Settings"
          title="Workspace settings"
          description="Profile details, AI behaviour and the responsible use guidance for your team."
        />

        <Panel label="Profile">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="display-name">Display name</FieldLabel>
              <TextField id="display-name" defaultValue={currentUser.displayName} />
            </div>
            <div>
              <FieldLabel htmlFor="job-title">Job title</FieldLabel>
              <TextField id="job-title" defaultValue={currentUser.jobTitle} />
            </div>
            <div>
              <FieldLabel htmlFor="email">Work email</FieldLabel>
              <TextField id="email" type="email" defaultValue={currentUser.email} />
            </div>
            <div>
              <FieldLabel htmlFor="timezone">Time zone</FieldLabel>
              <SelectField id="timezone" defaultValue="Africa/Johannesburg">
                <option value="Africa/Johannesburg">Africa/Johannesburg (UTC+2)</option>
                <option value="Europe/London">Europe/London</option>
                <option value="America/New_York">America/New_York</option>
              </SelectField>
            </div>
          </div>
          <div className="mt-4">
            <ActionButton variant="primary">Save profile</ActionButton>
          </div>
        </Panel>

        <Panel label="AI & privacy">
          <div className="space-y-3">
            <Toggle
              id="ai-suggestions"
              label="AI suggestions on the dashboard"
              hint="Surface drafting and planning suggestions as you work."
              defaultChecked
            />
            <Toggle
              id="store-history"
              label="Store AI generation history"
              hint="Keeps drafts and summaries in your workspace so you can revisit them."
              defaultChecked
            />
            <Toggle
              id="training-optout"
              label="Exclude my content from model improvement"
              hint="Your inputs are never used to train models when this is on."
              defaultChecked
            />
            <div className="rounded-lg border border-edge bg-obsidian/40 p-3">
              <p className="text-sm font-medium">Privacy notice</p>
              <p className="mt-1 text-pretty text-xs text-inkmuted">
                Do not enter confidential, personal or otherwise sensitive information into WorkFlow
                AI unless the AI service has been formally approved by your organisation for that
                category of information. When in doubt, summarise or anonymise before submitting.
              </p>
            </div>
          </div>
        </Panel>

        <Panel label="Responsible AI">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-lumen" strokeWidth={1.75} aria-hidden />
            <div className="space-y-3 text-sm text-inkmuted">
              <p className="text-pretty rounded-lg border border-lumen/25 bg-lumen-soft p-3 text-ink">
                AI-generated content may contain errors. Review and verify important information
                before using or sharing it.
              </p>
              <ul className="space-y-2 text-xs">
                <li>Keep a human in the loop for any decision that affects people or contracts.</li>
                <li>Attribute AI assistance where your organisation's policy requires it.</li>
                <li>Report inaccurate or inappropriate output to your workspace administrator.</li>
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
