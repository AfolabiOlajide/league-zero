import { Swords } from "lucide-react";
import Link from "next/link";

import { FeatureEmptyState } from "@/components/feature-empty-state";
import { RivalryRow } from "@/features/rivalries/components/rivalry-row";
import { getRivalriesForUser } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

export default async function RivalriesPage() {
  const user = await getCurrentAppUser();
  const rivalries = user ? await getRivalriesForUser(user.id) : [];
  const incoming = rivalries.filter((rivalry) => rivalry.status === "pending" && rivalry.requestedBy !== user?.id);
  const active = rivalries.filter((rivalry) => rivalry.status === "active");
  const other = rivalries.filter((rivalry) => rivalry.status !== "active" && !incoming.includes(rivalry));

  if (!user || rivalries.length === 0) {
    return (
      <FeatureEmptyState icon={Swords} eyebrow="Rivalries" title="No head-to-head record yet." description="Once a player accepts your request, every confirmed match between you will live here." action={{ href: "/search", label: "Find a rival" }} />
    );
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
      <header className="relative overflow-hidden rounded-3xl bg-sidebar px-6 py-7 text-sidebar-accent-foreground shadow-lg sm:px-9 sm:py-10">
        <div className="absolute -right-18 -top-24 size-72 rounded-full border border-primary/20" />
        <div className="absolute right-12 top-18 size-28 rounded-full bg-primary/10" />
        <div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Your record</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">Head-to-heads.</h1>
            <p className="mt-3 text-sm leading-6 text-sidebar-foreground sm:text-base">Every active rivalry, request, and shared result in one place.</p>
          </div>
          <div className="flex items-end justify-between gap-6 sm:block sm:text-right">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sidebar-foreground">Active records</p>
              <p className="mt-1 text-3xl font-semibold tracking-[-0.06em] tabular-nums">{active.length}</p>
            </div>
            <Link href="/search" className="inline-flex h-11 items-center justify-center rounded-xl bg-background px-4 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-primary">Find a rival</Link>
          </div>
        </div>
      </header>

      <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-14">
        <div className="space-y-10">
          {incoming.length > 0 && (
            <section aria-labelledby="requests-heading">
              <SectionHeading id="requests-heading" eyebrow="Awaiting you" title="Requests to decide" count={incoming.length} />
              <ul className="mt-4 space-y-2">{incoming.map((rivalry) => <RivalryRow key={rivalry.id} rivalry={rivalry} actorId={user.id} />)}</ul>
            </section>
          )}

          {active.length > 0 && (
            <section aria-labelledby="active-heading">
              <SectionHeading id="active-heading" eyebrow="The main event" title="Active rivalries" count={active.length} />
              <ul className="mt-4 space-y-2">{active.map((rivalry) => <RivalryRow key={rivalry.id} rivalry={rivalry} actorId={user.id} />)}</ul>
            </section>
          )}
        </div>

        {other.length > 0 && (
          <aside className="xl:pt-1" aria-labelledby="other-heading">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Past requests</p>
            <h2 id="other-heading" className="mt-3 text-xl font-semibold tracking-[-0.04em]">Request history</h2>
            <ul className="mt-4 space-y-2">{other.map((rivalry) => <RivalryRow key={rivalry.id} rivalry={rivalry} actorId={user.id} />)}</ul>
          </aside>
        )}
      </div>
    </div>
  );
}

function SectionHeading({ id, eyebrow, title, count }: { id: string; eyebrow: string; title: string; count: number }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-2xl font-semibold tracking-[-0.05em]">{title}</h2>
      </div>
      <span className="pb-1 text-sm text-muted-foreground">{count} {count === 1 ? "record" : "records"}</span>
    </div>
  );
}
