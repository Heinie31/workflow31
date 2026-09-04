import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { MeetingSummary, ScheduleBlock } from "@/types/workflow";

/**
 * Stage-two AI wiring. All model calls run server-side through the Lovable AI
 * Gateway, so no key is ever exposed to the browser.
 */

const MODEL = "google/gemini-3.7-flash";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type ChatMessage = { role: "system" | "user"; content: string };

async function chat(messages: ChatMessage[], json = false): Promise<string> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this project yet.");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (response.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
  if (response.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
  if (!response.ok) {
    console.error("AI gateway error", response.status, await response.text());
    throw new Error("The AI service could not complete that request.");
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;
  if (!content) throw new Error("The AI returned an empty response.");
  return content;
}

function parseJson<T>(raw: string): T {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

/* ------------------------------- Email ------------------------------- */

const emailInput = z.object({
  recipient: z.string(),
  purpose: z.string(),
  keyPoints: z.string(),
  tone: z.string(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => emailInput.parse(input))
  .handler(async ({ data }) => {
    const content = await chat([
      {
        role: "system",
        content:
          "You are an expert workplace communication assistant. Write a complete, ready-to-send email. Start with a 'Subject: ' line, then a blank line, then the body. Keep it concise, well structured and free of placeholder brackets unless information is genuinely missing.",
      },
      {
        role: "user",
        content: `Recipient and context: ${data.recipient || "(not specified)"}
Purpose: ${data.purpose || "(not specified)"}
Key information to include:
${data.keyPoints || "(none provided)"}
Tone: ${data.tone}`,
      },
    ]);
    return { output: content.trim() };
  });

/* ------------------------------ Meeting ------------------------------ */

const meetingInput = z.object({
  meetingTitle: z.string(),
  notes: z.string(),
});

type RawSummary = {
  summary?: string;
  decisions?: string[];
  actionItems?: { content?: string; owner?: string; deadline?: string }[];
  deadlines?: string[];
};

export const summariseMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => meetingInput.parse(input))
  .handler(async ({ data }): Promise<MeetingSummary> => {
    const raw = await chat(
      [
        {
          role: "system",
          content:
            'You analyse meeting notes and transcripts. Reply with JSON only, shaped as {"summary": string, "decisions": string[], "actionItems": [{"content": string, "owner": string, "deadline": string}], "deadlines": string[]}. Keep the summary under 120 words. Use "Unassigned" when no owner is stated and "No date" when no date is stated. Never invent facts that are not in the notes.',
        },
        {
          role: "user",
          content: `Meeting title: ${data.meetingTitle || "(untitled)"}\n\nNotes / transcript:\n${data.notes}`,
        },
      ],
      true,
    );

    const parsed = parseJson<RawSummary>(raw);
    return {
      id: `summary-${Date.now()}`,
      meetingTitle: data.meetingTitle || "Untitled meeting",
      summary: parsed.summary ?? "No summary could be produced from these notes.",
      decisions: (parsed.decisions ?? []).filter(Boolean),
      actionItems: (parsed.actionItems ?? []).map((item, i) => ({
        id: `ai-${Date.now()}-${i}`,
        content: item.content ?? "",
        owner: item.owner ?? "Unassigned",
        deadline: item.deadline ?? "No date",
      })),
      deadlines: (parsed.deadlines ?? []).filter(Boolean),
    };
  });

/* ------------------------------ Planner ------------------------------ */

const planInput = z.object({
  tasks: z.array(
    z.object({
      title: z.string(),
      priority: z.string(),
      status: z.string(),
      deadline: z.string(),
      estimatedMinutes: z.number(),
    }),
  ),
  meetings: z.array(
    z.object({ title: z.string(), startsAt: z.string(), endsAt: z.string() }),
  ),
});

type RawBlock = { start?: string; end?: string; title?: string; kind?: string };
const kinds = new Set(["task", "meeting", "focus", "break"]);

export const planDay = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => planInput.parse(input))
  .handler(async ({ data }): Promise<ScheduleBlock[]> => {
    const raw = await chat(
      [
        {
          role: "system",
          content:
            'You are a scheduling assistant. Build a realistic working-day timeline between 09:00 and 18:00. Reply with JSON only, shaped as {"blocks": [{"start": "HH:MM", "end": "HH:MM", "title": string, "kind": "task"|"meeting"|"focus"|"break"}]}. Keep meetings at their given times, sequence unfinished tasks around them by priority and deadline, respect the estimated durations, and include at least one short break. Skip tasks already done.',
        },
        {
          role: "user",
          content: `Tasks:\n${JSON.stringify(data.tasks)}\n\nMeetings today:\n${JSON.stringify(data.meetings)}`,
        },
      ],
      true,
    );

    const parsed = parseJson<{ blocks?: RawBlock[] }>(raw);
    return (parsed.blocks ?? []).map((block, i) => ({
      id: `s-${Date.now()}-${i}`,
      start: block.start ?? "",
      end: block.end ?? "",
      title: block.title ?? "Untitled block",
      kind: (kinds.has(block.kind ?? "") ? block.kind : "task") as ScheduleBlock["kind"],
    }));
  });
