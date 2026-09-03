import type { ReactNode } from "react";

export function AiOutputCard({
  label,
  timestamp,
  children,
  footer,
  delay = 0,
}: {
  label: string;
  timestamp?: string;
  children: ReactNode;
  footer?: ReactNode;
  delay?: number;
}) {
  return (
    <section
      className="wf-glass wf-sheen wf-rise rounded-xl p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-wider text-lumen">{label}</p>
        {timestamp && <span className="font-mono text-[11px] text-inkfaint">{timestamp}</span>}
      </div>
      <div className="mt-3">{children}</div>
      {footer && <div className="mt-3 flex flex-wrap gap-2">{footer}</div>}
    </section>
  );
}
