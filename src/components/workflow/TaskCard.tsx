import { cn } from "@/lib/utils";
import type { Task } from "@/types/workflow";
import { PriorityBadge } from "./primitives";

const statusLabel: Record<Task["status"], string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function formatDeadline(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TaskCard({ task, delay = 0 }: { task: Task; delay?: number }) {
  return (
    <article
      className="wf-card wf-rise rounded-xl p-4 transition-transform hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-medium",
              task.status === "done" && "text-inkmuted line-through",
            )}
          >
            {task.title}
          </p>
          <p className="mt-0.5 text-xs text-inkfaint">{task.description}</p>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-inkmuted">
        <span className="font-mono">Due {formatDeadline(task.deadline)}</span>
        <span className="font-mono">~{task.estimatedMinutes} min</span>
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              "size-1.5 rounded-full",
              task.status === "done" ? "bg-inkfaint" : "bg-lumen",
            )}
          />
          {statusLabel[task.status]}
        </span>
      </div>
    </article>
  );
}
