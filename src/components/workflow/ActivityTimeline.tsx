import { cn } from "@/lib/utils";
import type { AiActivity } from "@/types/workflow";

export function ActivityTimeline({ items }: { items: AiActivity[] }) {
  return (
    <ol className="relative space-y-4 before:absolute before:bottom-1 before:left-[5px] before:top-1 before:w-px before:bg-edge">
      {items.map((item, index) => (
        <li key={item.id} className="relative pl-5">
          <span
            className={cn(
              "absolute left-0 top-1.5 size-2.5 rounded-full",
              index === 0 ? "bg-lumen ring-4 ring-lumen/15" : "bg-inkfaint",
            )}
          />
          <p className="text-sm">{item.title}</p>
          <p className="font-mono text-xs text-inkfaint">
            {item.when} · {item.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
