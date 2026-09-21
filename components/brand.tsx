import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

type BrandProps = {
  className?: string;
  href?: string;
  compact?: boolean;
  inverse?: boolean;
};

export function Brand({ className, href = "/home", compact, inverse = false }: BrandProps) {
  return (
    <Link
      href={href}
      aria-label="LeagueZero home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="grid size-10 place-items-center overflow-hidden rounded-xl bg-primary/15 ring-1 ring-primary/20">
        <Image
          src="/images/logo.png"
          alt=""
          width={40}
          height={40}
          priority
          className="size-full object-cover"
        />
      </span>
      {!compact && (
        <span className={cn("text-lg font-bold tracking-[-0.055em]", inverse ? "text-sidebar-accent-foreground" : "text-foreground")}>
          League<span className="text-primary">Zero</span>
        </span>
      )}
    </Link>
  );
}
