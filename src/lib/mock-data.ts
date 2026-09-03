import type {
  AiActivity,
  Meeting,
  MeetingSummary,
  ScheduleBlock,
  Task,
  UserProfile,
} from "@/types/workflow";

/**
 * Placeholder data for the stage-one UI. Every export here maps 1:1 to a
 * planned table so it can be replaced by a database/AI call later.
 */

export const currentUser: UserProfile = {
  id: "user-1",
  displayName: "Amara Reyes",
  jobTitle: "Product Lead",
  email: "amara.reyes@northwind.io",
  initials: "AR",
};

export const tasks: Task[] = [
  {
    id: "task-1",
    title: "Finalise onboarding email sequence",
    description: "Three steps left — copy review, legal sign-off, scheduling.",
    priority: "high",
    status: "in_progress",
    deadline: "2026-09-03T16:00:00Z",
    estimatedMinutes: 45,
  },
  {
    id: "task-2",
    title: "Consolidate Q3 roadmap threads into a decision doc",
    description: "Merge the pricing, packaging and rollout threads.",
    priority: "high",
    status: "todo",
    deadline: "2026-09-03T11:30:00Z",
    estimatedMinutes: 60,
  },
  {
    id: "task-3",
    title: "Review 6 open support escalations",
    description: "Flag anything that needs an engineering handoff.",
    priority: "medium",
    status: "todo",
    deadline: "2026-09-04T15:00:00Z",
    estimatedMinutes: 30,
  },
  {
    id: "task-4",
    title: "Prep notes for the design review",
    description: "Pull the latest prototype links and open questions.",
    priority: "low",
    status: "todo",
    deadline: "2026-09-05T09:00:00Z",
    estimatedMinutes: 15,
  },
  {
    id: "task-5",
    title: "Send procurement brief to Northwind",
    description: "Final version approved by finance.",
    priority: "medium",
    status: "done",
    deadline: "2026-09-02T09:15:00Z",
    estimatedMinutes: 20,
  },
];

export const meetings: Meeting[] = [
  {
    id: "meeting-1",
    title: "Sales pipeline sync",
    startsAt: "2026-09-03T12:00:00Z",
    endsAt: "2026-09-03T12:45:00Z",
    attendees: 4,
    location: "Room 2B",
  },
  {
    id: "meeting-2",
    title: "1:1 with Priya",
    startsAt: "2026-09-03T14:00:00Z",
    endsAt: "2026-09-03T14:30:00Z",
    attendees: 2,
    location: "Video call",
  },
  {
    id: "meeting-3",
    title: "Design review",
    startsAt: "2026-09-03T16:00:00Z",
    endsAt: "2026-09-03T17:00:00Z",
    attendees: 6,
    location: "Shared doc",
  },
];

export const aiActivity: AiActivity[] = [
  {
    id: "act-1",
    kind: "email",
    title: "Drafted email to Dana",
    detail: "Tone: direct · Q3 roadmap alignment",
    when: "8m ago",
  },
  {
    id: "act-2",
    kind: "meeting",
    title: 'Summarised "Sprint 14 retro"',
    detail: "4 decisions · 3 action items",
    when: "26m ago",
  },
  {
    id: "act-3",
    kind: "meeting",
    title: "Created 3 action items",
    detail: "From Sprint 14 retro",
    when: "1h ago",
  },
  {
    id: "act-4",
    kind: "plan",
    title: "Replanned afternoon schedule",
    detail: "6 tasks sequenced",
    when: "2h ago",
  },
];

export const sampleEmailDraft = {
  subject: "Re: Q3 roadmap alignment — for the 14:00 sync",
  body: `Hi Dana — I've consolidated the three open threads into a single decision doc. Could we prioritise the pricing flag first? I've left a 20-min buffer in your afternoon for follow-ups.

Thanks,
Amara`,
};

export const sampleMeetingSummary: MeetingSummary = {
  id: "summary-1",
  meetingTitle: "Sprint 14 retro",
  summary:
    "The team shipped the onboarding revamp a day early, but QA coverage on the billing edge cases slipped. Consensus was to hold the pricing experiment until the billing regression suite is green, and to move the design review earlier in the sprint.",
  decisions: [
    "Hold the pricing experiment until billing regressions pass.",
    "Move design review to day three of the sprint.",
    "Cap in-flight work at four items per engineer.",
  ],
  actionItems: [
    {
      id: "ai-1",
      content: "Write billing regression suite for the three failing edge cases",
      owner: "Priya",
      deadline: "2026-09-08",
    },
    {
      id: "ai-2",
      content: "Reschedule the recurring design review invite",
      owner: "Amara",
      deadline: "2026-09-04",
    },
    {
      id: "ai-3",
      content: "Draft the WIP limit note for the team handbook",
      owner: "Tom",
      deadline: "2026-09-10",
    },
  ],
  deadlines: ["Billing regression suite — 8 Sep", "Design review moved — 4 Sep", "Handbook note — 10 Sep"],
};

export const sampleSchedule: ScheduleBlock[] = [
  { id: "s1", start: "09:00", end: "10:00", title: "Deep work — Q3 decision doc", kind: "focus" },
  { id: "s2", start: "10:00", end: "10:45", title: "Onboarding email sequence", kind: "task" },
  { id: "s3", start: "12:00", end: "12:45", title: "Sales pipeline sync", kind: "meeting" },
  { id: "s4", start: "13:00", end: "13:30", title: "Support escalations triage", kind: "task" },
  { id: "s5", start: "14:00", end: "14:30", title: "1:1 with Priya", kind: "meeting" },
  { id: "s6", start: "15:30", end: "15:45", title: "Reset & inbox sweep", kind: "break" },
];

export const dashboardStats = {
  tasksToday: 12,
  highPriority: 4,
  upcomingDeadlines: 7,
  meetingsToday: 3,
};
