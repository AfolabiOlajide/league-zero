import { SearchX } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-5">
      <div className="max-w-lg text-center">
        <SearchX aria-hidden="true" className="mx-auto size-10 text-primary" />
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          404
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.045em]">
          This record does not exist.
        </h1>
        <p className="mt-4 leading-7 text-muted-foreground">
          The page may have moved, or the link may be incomplete.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-5")}
        >
          Return to LeagueZero
        </Link>
      </div>
    </main>
  );
}
