import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandProps = {
  className?: string;
  href?: string;
  compact?: boolean;
};

export function Brand({ className, href = "/home", compact }: BrandProps) {
  return (
    <Link
      href={href}
      aria-label="LeagueZero home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-sm font-black tracking-[-0.08em] text-primary-foreground shadow-sm">
        L0
      </span>
      {!compact && (
        <span className="text-lg font-bold tracking-[-0.035em] text-foreground">
          LeagueZero
        </span>
      )}
    </Link>
  );
}
