import { getMember } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function AvatarStack({ ids, max = 4, size = 28 }: { ids: string[]; max?: number; size?: number }) {
  const visible = ids.slice(0, max);
  const overflow = ids.length - visible.length;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((id) => {
        const m = getMember(id);
        return (
          <div
            key={id}
            title={m.name}
            className={cn("rounded-full grid place-items-center text-[11px] font-medium text-paper ring-2 ring-card")}
            style={{ background: m.avatarColor, width: size, height: size }}
          >
            {m.initials}
          </div>
        );
      })}
      {overflow > 0 && (
        <div
          className="rounded-full bg-paper-2 text-foreground/70 grid place-items-center text-[11px] ring-2 ring-card"
          style={{ width: size, height: size }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
