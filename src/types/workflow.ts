/**
 * Domain model for WorkFlow AI.
 *
 * These shapes mirror the future Lovable Cloud (Postgres) schema so the
 * placeholder data in `src/lib/mock-data.ts` can be swapped for real
 * queries without touching the UI layer.
 *
 * Planned tables (all user-scoped via `user_id` + RLS):
 *   profiles           id, display_name, job_title, email, timezone, ai_opt_in
 *   tasks              id, user_id, title, description, priority, status,
 *                      deadline, estimated_minutes, created_at
 *   meetings           id, user_id, title, notes, summary, occurred_at
 *   meeting_decisions  id, meeting_id, content
 *   meeting_action_items id, meeting_id, content, owner, deadline, task_id
 *   email_generations  id, user_id, recipient, purpose, key_points, tone,
 *                      output, created_at
 *   ai_activity        id, user_id, kind, title, detail, created_at
 */

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  /** ISO date string. */
  deadline: string;
  estimatedMinutes: number;
}

export interface Meeting {
  id: string;
  title: string;
  /** ISO date-time string. */
  startsAt: string;
  endsAt: string;
  attendees: number;
  location: string;
}

export interface MeetingActionItem {
  id: string;
  content: string;
  owner: string;
  deadline: string;
}

export interface MeetingSummary {
  id: string;
  meetingTitle: string;
  summary: string;
  decisions: string[];
  actionItems: MeetingActionItem[];
  deadlines: string[];
}

export type EmailTone = "professional" | "friendly" | "direct" | "persuasive" | "apologetic";

export interface EmailGeneration {
  id: string;
  recipient: string;
  purpose: string;
  keyPoints: string;
  tone: EmailTone;
  output: string;
  createdAt: string;
}

export type AiActivityKind = "email" | "meeting" | "plan";

export interface AiActivity {
  id: string;
  kind: AiActivityKind;
  title: string;
  detail: string;
  /** Human-readable for now; will become a timestamp. */
  when: string;
}

export interface ScheduleBlock {
  id: string;
  start: string;
  end: string;
  title: string;
  kind: "task" | "meeting" | "focus" | "break";
}

export interface UserProfile {
  id: string;
  displayName: string;
  jobTitle: string;
  email: string;
  initials: string;
}
