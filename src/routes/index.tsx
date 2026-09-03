import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarClock, ListChecks, Mail, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { ActivityTimeline } from "@/components/workflow/ActivityTimeline";
import { AiOutputCard } from "@/components/workflow/AiOutputCard";
import { TaskCard } from "@/components/workflow/TaskCard";
import {
  AiDisclaimer,
  PageHeader,
  Panel,
  StatCard,
} from "@/components/workflow/primitives";
import {
  aiActivity,
  currentUser,
  dashboardStats,
  meetings,
  sampleEmailDraft,
  tasks,
} from "@/lib/mock-data";

const title = "WorkFlow AI — Dashboard";
const description =
  "Your AI workplace productivity dashboard: today's tasks, deadlines, meetings and recent AI activity in one place.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function Dashboard() {
  const todaysTasks = tasks.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Good morning"
          title={`Here's your workspace, ${currentUser.displayName.split(" ")[0]}`}
          description="3 emails drafted, 2 meetings summarised since yesterday."
          action={
            <Link
              to="/task-planner"
              className="rounded-lg bg-lumen px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-lumen/90"
            >
              New task
            </Link>
          }
        />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Today's tasks"
            value={dashboardStats.tasksToday}
            hint="+3 since 9am"
            accent
            delay={40}
          />
          <StatCard
            label="High-priority"
            value={dashboardStats.highPriority}
            hint="2 due today"
            delay={90}
          />
          <StatCard
            label="Upcoming deadlines"
            value={dashboardStats.upcomingDeadlines}
            hint="Next in 2 days"
            delay={140}
          />
          <StatCard
            label="Today's meetings"
            value={dashboardStats.meetingsToday}
            hint={meetings[0] ? `Next ${formatTime(meetings[0].startsAt)}` : "None scheduled"}
            delay={190}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Panel label="Quick actions" className="wf-rise">
              <div className="grid gap-3 sm:grid-cols-3">
                <Link
                  to="/email-assistant"
                  className="wf-sheen rounded-lg border border-edge bg-obsidian/50 p-3 text-left transition-colors hover:border-lumen/30"
                >
                  <Mail className="size-4 text-inkmuted" strokeWidth={1.75} aria-hidden />
                  <p className="mt-2 text-sm font-semibold">Draft an Email</p>
                  <p className="mt-1 text-xs text-inkfaint">Compose from context</p>
                </Link>
                <Link
                  to="/meeting-assistant"
                  className="wf-sheen rounded-lg border border-edge bg-obsidian/50 p-3 text-left transition-colors hover:border-lumen/30"
                >
                  <CalendarClock className="size-4 text-inkmuted" strokeWidth={1.75} aria-hidden />
                  <p className="mt-2 text-sm font-semibold">Summarise Meeting</p>
                  <p className="mt-1 text-xs text-inkfaint">Notes to action items</p>
                </Link>
                <Link
                  to="/task-planner"
                  className="rounded-lg bg-lumen-soft p-3 text-left ring-1 ring-lumen/25 transition-colors hover:bg-lumen/20"
                >
                  <Sparkles className="size-4 text-lumen" strokeWidth={1.75} aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-lumen">Plan My Day</p>
                  <p className="mt-1 text-xs text-inkmuted">AI-sequenced schedule</p>
                </Link>
              </div>
            </Panel>

            <AiOutputCard label="AI output · Draft email" timestamp="08:12" delay={320}>
              <div className="rounded-lg border border-edge bg-obsidian/60 p-3">
                <p className="text-sm font-medium">{sampleEmailDraft.subject}</p>
                <p className="mt-1 whitespace-pre-line text-pretty text-sm text-inkmuted">
                  {sampleEmailDraft.body}
                </p>
              </div>
            </AiOutputCard>

            <Panel label="Today's plan" action={<Link to="/task-planner" className="text-xs font-medium text-lumen">View all</Link>}>
              <div className="space-y-3">
                {todaysTasks.map((task, i) => (
                  <TaskCard key={task.id} task={task} delay={360 + i * 60} />
                ))}
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel label="Recent AI activity">
              <ActivityTimeline items={aiActivity} />
            </Panel>

            <Panel label="Today's meetings">
              <div className="space-y-3">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="rounded-lg border border-edge bg-obsidian/40 p-3">
                    <p className="font-mono text-[11px] text-lumen">
                      {formatTime(meeting.startsAt)} – {formatTime(meeting.endsAt)}
                    </p>
                    <p className="mt-1 text-sm font-medium">{meeting.title}</p>
                    <p className="text-xs text-inkfaint">
                      {meeting.attendees} attendees · {meeting.location}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel label="Upcoming deadlines">
              <ul className="space-y-2.5 text-sm">
                {tasks
                  .filter((task) => task.status !== "done")
                  .map((task) => (
                    <li key={task.id} className="flex items-start justify-between gap-3">
                      <span className="min-w-0 truncate">{task.title}</span>
                      <span className="shrink-0 font-mono text-xs text-inkfaint">
                        {new Date(task.deadline).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </li>
                  ))}
              </ul>
            </Panel>
          </div>
        </div>

        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
