import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/workflow/TaskCard";
import {
  ActionButton,
  AiDisclaimer,
  EmptyState,
  FieldLabel,
  LoadingState,
  PageHeader,
  Panel,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/workflow/primitives";
import { sampleSchedule, tasks as seedTasks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { ScheduleBlock, Task, TaskPriority, TaskStatus } from "@/types/workflow";

const title = "Task Planner — WorkFlow AI";
const description =
  "Track tasks with priority, deadlines and estimates, then let AI sequence them into a realistic daily schedule.";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: TaskPlanner,
});

const blockStyles: Record<ScheduleBlock["kind"], string> = {
  task: "border-l-lumen",
  meeting: "border-l-warn",
  focus: "border-l-lumen",
  break: "border-l-inkfaint",
};

function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [showForm, setShowForm] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleBlock[] | null>(null);
  const [planning, setPlanning] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    description: "",
    priority: "medium" as TaskPriority,
    deadline: "",
    estimatedMinutes: "30",
    status: "todo" as TaskStatus,
  });

  function addTask() {
    if (!draft.title.trim()) return;
    setTasks((prev) => [
      {
        id: `task-${Date.now()}`,
        title: draft.title,
        description: draft.description,
        priority: draft.priority,
        status: draft.status,
        deadline: draft.deadline ? new Date(draft.deadline).toISOString() : new Date().toISOString(),
        estimatedMinutes: Number(draft.estimatedMinutes) || 30,
      },
      ...prev,
    ]);
    setDraft({
      title: "",
      description: "",
      priority: "medium",
      deadline: "",
      estimatedMinutes: "30",
      status: "todo",
    });
    setShowForm(false);
  }

  // Placeholder planner. Replaced by a server function + AI call in stage two.
  function planDay() {
    setPlanning(true);
    setTimeout(() => {
      setSchedule(sampleSchedule);
      setPlanning(false);
    }, 800);
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Task Planner"
          title="Your tasks and daily plan"
          description="Capture the work, then let AI order it around your meetings."
          action={
            <ActionButton variant="primary" onClick={planDay}>
              <Sparkles className="size-4" strokeWidth={1.75} aria-hidden />
              Plan My Day
            </ActionButton>
          }
        />

        <div className="grid gap-4 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-3">
            <Panel
              label={`Task list · ${tasks.length}`}
              action={
                <ActionButton variant="outline" onClick={() => setShowForm((v) => !v)}>
                  <Plus className="size-4" strokeWidth={1.75} aria-hidden />
                  Add Task
                </ActionButton>
              }
            >
              {showForm && (
                <div className="mb-4 space-y-3 rounded-lg border border-edge bg-obsidian/40 p-3">
                  <div>
                    <FieldLabel htmlFor="task-title">Task title</FieldLabel>
                    <TextField
                      id="task-title"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      placeholder="Draft the Q4 planning brief"
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="task-description">Description</FieldLabel>
                    <TextAreaField
                      id="task-description"
                      rows={3}
                      value={draft.description}
                      onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                      placeholder="What does done look like?"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="task-priority">Priority</FieldLabel>
                      <SelectField
                        id="task-priority"
                        value={draft.priority}
                        onChange={(e) =>
                          setDraft({ ...draft, priority: e.target.value as TaskPriority })
                        }
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </SelectField>
                    </div>
                    <div>
                      <FieldLabel htmlFor="task-status">Status</FieldLabel>
                      <SelectField
                        id="task-status"
                        value={draft.status}
                        onChange={(e) => setDraft({ ...draft, status: e.target.value as TaskStatus })}
                      >
                        <option value="todo">To do</option>
                        <option value="in_progress">In progress</option>
                        <option value="done">Done</option>
                      </SelectField>
                    </div>
                    <div>
                      <FieldLabel htmlFor="task-deadline">Deadline</FieldLabel>
                      <TextField
                        id="task-deadline"
                        type="datetime-local"
                        value={draft.deadline}
                        onChange={(e) => setDraft({ ...draft, deadline: e.target.value })}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor="task-duration">Estimated duration (min)</FieldLabel>
                      <TextField
                        id="task-duration"
                        type="number"
                        min={5}
                        step={5}
                        value={draft.estimatedMinutes}
                        onChange={(e) => setDraft({ ...draft, estimatedMinutes: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <ActionButton variant="primary" onClick={addTask}>
                      Save task
                    </ActionButton>
                    <ActionButton onClick={() => setShowForm(false)}>Cancel</ActionButton>
                  </div>
                </div>
              )}

              {tasks.length === 0 ? (
                <EmptyState
                  title="No tasks yet"
                  description="Add your first task to start building today's plan."
                  action={
                    <ActionButton variant="primary" onClick={() => setShowForm(true)}>
                      Add Task
                    </ActionButton>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {tasks.map((task, i) => (
                    <TaskCard key={task.id} task={task} delay={i * 50} />
                  ))}
                </div>
              )}
            </Panel>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <Panel label="AI daily schedule" glass>
              {planning ? (
                <LoadingState label="Sequencing your day…" />
              ) : schedule ? (
                <div className="space-y-2.5">
                  {schedule.map((block) => (
                    <div
                      key={block.id}
                      className={cn(
                        "rounded-r-lg border-l-2 bg-obsidian/40 px-3 py-2.5",
                        blockStyles[block.kind],
                      )}
                    >
                      <p className="font-mono text-[11px] text-inkfaint">
                        {block.start} – {block.end}
                      </p>
                      <p className="mt-0.5 text-sm">{block.title}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No schedule generated"
                  description="Press Plan My Day and the AI-ordered timeline for today will appear here."
                />
              )}
            </Panel>
            <AiDisclaimer />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
