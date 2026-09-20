import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeatureEmptyStateProps = {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
};

export function FeatureEmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
}: FeatureEmptyStateProps) {
  return (
    <section className="flex min-h-[65svh] items-center">
      <div className="max-w-xl">
        <div className="mb-8 grid size-16 place-items-center rounded-2xl bg-primary/15 text-primary">
          <Icon aria-hidden="true" className="size-7" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          {description}
        </p>
        {action && (
          <Link
            href={action.href}
            className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-5")}
          >
            {action.label}
          </Link>
        )}
      </div>
    </section>
  );
}
