import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchForm } from "@/features/matches/components/match-form";
import { PendingRivalResults } from "@/features/matches/components/pending-rival-results";
import { getPendingMatchesAwaitingRival } from "@/features/matches/queries/matches";
import { getRivalryDetail } from "@/features/rivalries/queries/rivalries";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";
import { calculatePendingAggregate } from "@/lib/domain/pending-aggregate";

export default async function LogMatchPage({
  params,
}: {
  params: Promise<{ rivalryId: string }>;
}) {
  const { rivalryId } = await params;
  const user = await getCurrentAppUser();
  const rivalry = user ? await getRivalryDetail(user.id, rivalryId) : null;
  if (!user || !rivalry || rivalry.status !== "active") notFound();

  const opponent = rivalry.participants.find(
    (participant) => participant.id !== user.id,
  );
  if (!opponent) notFound();

  const pendingMatches = await getPendingMatchesAwaitingRival(
    user.id,
    rivalryId,
  );
  const pendingAggregate = calculatePendingAggregate(
    user.id,
    opponent.id,
    pendingMatches,
  );

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none">
      <Link
        href={`/rivalries/${rivalryId}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to rivalry
      </Link>
      <header className="relative mt-7 overflow-hidden rounded-3xl bg-sidebar px-6 py-7 text-sidebar-accent-foreground shadow-lg sm:px-9 sm:py-10">
        <div className="absolute -right-15 -top-20 size-60 rounded-full border border-primary/20" />
        <div className="absolute right-14 top-18 size-24 rounded-full bg-primary/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            Log a match
          </p>
          <h1 className="mt-3 max-w-2xl text-balance text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">
            {user.displayName} <span className="text-primary">vs</span>{" "}
            {opponent.displayName}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-sidebar-foreground sm:text-base">
            Set the final score and send it to {opponent.displayName} for
            verification.
          </p>
        </div>
      </header>

      <MatchForm
        rivalryId={rivalryId}
        actor={{ id: user.id, displayName: user.displayName }}
        opponent={{ displayName: opponent.displayName }}
      />

      <PendingRivalResults
        actor={{
          id: user.id,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
        }}
        opponent={{
          id: opponent.id,
          displayName: opponent.displayName,
          avatarUrl: opponent.avatarUrl,
        }}
        pendingMatches={pendingMatches}
        aggregate={pendingAggregate}
      />
    </div>
  );
}
