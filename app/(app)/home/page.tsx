import { ArrowRight, Check, Search, Swords } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const user = await getCurrentAppUser();

  return (
    <div className="space-y-12">
      <header className="flex items-end justify-between gap-5 border-b border-border pb-7">
        <div>
          <p className="text-sm text-muted-foreground">Your competition record</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Welcome, {user?.displayName ?? "rival"}.
          </h1>
        </div>
        <p className="hidden text-sm font-medium text-muted-foreground sm:block">
          @{user?.username}
        </p>
      </header>

      <section className="relative overflow-hidden border-b border-border pb-12 pt-4">
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 hidden size-64 translate-x-1/4 -translate-y-1/4 rounded-full border-[4.5rem] border-primary/15 sm:block"
        />
        <div className="relative max-w-2xl">
          <div className="mb-8 flex items-center gap-3 text-sm font-semibold text-primary">
            <Swords aria-hidden="true" className="size-5" />
            No rivalries yet
          </div>
          <h2 className="text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
            Your record starts with one rival.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Find someone you already play, send the request, and let every result
            become part of a shared history.
          </p>
          <Link
            href="/search"
            className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-5")}
          >
            <Search aria-hidden="true" />
            Find a rival
          </Link>
        </div>
      </section>

      <section aria-labelledby="setup-heading">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="setup-heading" className="text-lg font-semibold">
            Setup progress
          </h2>
          <span className="text-sm text-muted-foreground">1 of 3 complete</span>
        </div>
        <ol className="mt-5 divide-y divide-border border-y border-border">
          <li className="flex items-center gap-4 py-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">LeagueZero profile created</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Your handle is ready to share.
              </p>
            </div>
          </li>
          <li className="flex items-center gap-4 py-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-sm font-semibold text-muted-foreground">
              2
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Establish your first rivalry</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Search by username and send a request.
              </p>
            </div>
            <ArrowRight aria-hidden="true" className="size-4 text-muted-foreground" />
          </li>
          <li className="flex items-center gap-4 py-5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-sm font-semibold text-muted-foreground">
              3
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Log the first result</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                A result becomes official when your opponent confirms it.
              </p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
}
