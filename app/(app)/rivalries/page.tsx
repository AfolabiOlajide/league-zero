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
    <div className="mx-auto max-w-3xl">
      <header className="flex items-end justify-between gap-5 border-b border-border pb-7">
        <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Rivalries</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Your head-to-heads</h1></div>
        <Link href="/search" className="text-sm font-medium text-primary underline-offset-4 hover:underline">Find a rival</Link>
      </header>
      {incoming.length > 0 && <section className="mt-9" aria-labelledby="requests-heading"><div className="flex items-baseline justify-between border-b border-border pb-3"><h2 id="requests-heading" className="text-lg font-semibold">Waiting for your decision</h2><span className="text-sm text-muted-foreground">{incoming.length}</span></div><ul>{incoming.map((rivalry) => <RivalryRow key={rivalry.id} rivalry={rivalry} actorId={user.id} />)}</ul></section>}
      {active.length > 0 && <section className="mt-9" aria-labelledby="active-heading"><h2 id="active-heading" className="border-b border-border pb-3 text-lg font-semibold">Active rivalries</h2><ul>{active.map((rivalry) => <RivalryRow key={rivalry.id} rivalry={rivalry} actorId={user.id} />)}</ul></section>}
      {other.length > 0 && <section className="mt-9" aria-labelledby="other-heading"><h2 id="other-heading" className="border-b border-border pb-3 text-lg font-semibold">Request history</h2><ul>{other.map((rivalry) => <RivalryRow key={rivalry.id} rivalry={rivalry} actorId={user.id} />)}</ul></section>}
    </div>
  );
}
