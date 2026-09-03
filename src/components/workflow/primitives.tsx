import type { ReactNode } from "react";
import { AlertTriangle, Inbox, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="wf-rise flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="mb-1 font-mono text-xs uppercase tracking-wider text-lumen">{eyebrow}</p>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-inkmuted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  label,
  action,
  children,
  className,
  glass = false,
}: {
  label?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  glass?: boolean;
}) {
  return (
    <section className={cn(glass ? "wf-glass" : "wf-card", "rounded-xl p-4", className)}>
      {(label || action) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {label && <p className="wf-label">{label}</p>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent = false,
  delay = 0,
}: {
  label: string;
  value: string | number;
  hint: string;
  accent?: boolean;
  delay?: number;
}) {
  return (
    <div
      className="wf-card wf-rise rounded-xl p-4 transition-transform hover:-translate-y-0.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="wf-label">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className={cn("mt-1 text-xs", accent ? "text-lumen" : "text-inkmuted")}>{hint}</p>
    </div>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-inkmuted">
      {children}
    </label>
  );
}

const fieldClasses =
  "w-full rounded-lg border border-edge bg-obsidian/60 px-3 py-2 text-sm text-ink placeholder:text-inkfaint focus:border-lumen/40 focus:outline-none focus:ring-2 focus:ring-ring";

export function TextField(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldClasses, props.className)} />;
}

export function TextAreaField(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldClasses, "resize-y", props.className)} />;
}

export function SelectField(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldClasses, "appearance-none", props.className)} />;
}

export function ActionButton({
  variant = "ghost",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
}) {
  const variants: Record<string, string> = {
    primary: "bg-lumen text-primary-foreground font-semibold hover:bg-lumen/90",
    outline: "border border-edge text-inkmuted hover:text-ink hover:border-lumen/30",
    ghost: "text-inkfaint hover:text-ink",
  };
  return (
    <button
      type="button"
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
        variants[variant],
        className,
      )}
    />
  );
}

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const styles = {
    high: "bg-danger/15 text-danger",
    medium: "bg-lumen-soft text-lumen",
    low: "bg-muted text-inkmuted",
  } as const;
  return (
    <span
      className={cn(
        "shrink-0 rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider",
        styles[priority],
      )}
    >
      {priority}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-edge px-6 py-10 text-center">
      <Inbox className="size-5 text-inkfaint" strokeWidth={1.75} aria-hidden />
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 max-w-sm text-xs text-inkmuted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Working…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-edge bg-obsidian/40 px-3 py-3 text-sm text-inkmuted">
      <Loader2 className="size-4 animate-spin text-lumen" strokeWidth={1.75} aria-hidden />
      {label}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-danger/30 bg-danger/10 px-3 py-3 text-sm">
      <AlertTriangle className="size-4 text-danger" strokeWidth={1.75} aria-hidden />
      <span className="text-inkmuted">{message}</span>
      {onRetry && (
        <ActionButton variant="outline" className="ml-auto" onClick={onRetry}>
          Try again
        </ActionButton>
      )}
    </div>
  );
}

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <p className={cn("max-w-[70ch] text-pretty text-[11px] text-inkfaint", className)}>
      AI-generated content may contain errors. Review and verify important information before using
      or sharing it.
    </p>
  );
}
