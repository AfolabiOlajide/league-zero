import { Clock3 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MatchRow } from "@/features/matches/components/match-row";
import type { MatchView } from "@/features/matches/types";
import type { PendingAggregate } from "@/lib/domain/pending-aggregate";

type PlayerSummary = {
  id: string;
  displayName: string;
  avatarUrl?: string;
};

type PendingRivalResultsProps = {
  actor: PlayerSummary;
  opponent: PlayerSummary;
  pendingMatches: MatchView[];
  aggregate: PendingAggregate;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function goalShare(first: number, second: number) {
  const total = first + second;
  return total === 0 ? 50 : Math.round((first / total) * 100);
}

function leadCopy(
  actorName: string,
  actorScore: number,
  opponentName: string,
  opponentScore: number,
) {
  if (actorScore === opponentScore) return "Level on aggregate";
  const diff = Math.abs(actorScore - opponentScore);
  return actorScore > opponentScore
    ? `${actorName} leads by ${diff} ${diff === 1 ? "goal" : "goals"}`
    : `${opponentName} leads by ${diff} ${diff === 1 ? "goal" : "goals"}`;
}

export function PendingRivalResults({
  actor,
  opponent,
  pendingMatches,
  aggregate,
}: PendingRivalResultsProps) {
  const hasMatches = pendingMatches.length > 0;

  return (
    <section
      className="mt-14 border-t border-border pt-10"
      aria-labelledby="pending-results-heading"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2
              id="pending-results-heading"
              className="text-xl font-semibold tracking-[-0.04em]"
            >
              Pending results
            </h2>
            {hasMatches ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-chart-4/30 bg-chart-4/15 px-2.5 py-0.5 text-xs font-semibold text-chart-4">
                <Clock3 className="size-3.5" aria-hidden="true" />
                {pendingMatches.length}{" "}
                {pendingMatches.length === 1 ? "result" : "results"} awaiting
                verification
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted by you · Not yet accepted by {opponent.displayName}
          </p>
        </div>
      </div>

      {!hasMatches ? (
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-muted/20 p-8 text-center sm:p-10">
          <Clock3
            className="mx-auto size-7 text-muted-foreground"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-medium text-foreground">
            No pending submissions
          </p>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            When you submit a match score above, it will stay here with an
            aggregate tally until {opponent.displayName} confirms it.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* Aggregate card */}
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xs">
            <div className="flex items-center justify-between border-b border-border/80 px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-chart-4 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Pending Aggregate
                </span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {pendingMatches.length}{" "}
                {pendingMatches.length === 1 ? "match" : "matches"} · unofficial
              </span>
            </div>

            <div className="grid items-center gap-6 px-5 py-7 sm:grid-cols-[1fr_auto_1fr] sm:px-8">
              {/* Actor summary */}
              <div className="flex items-center gap-3 sm:justify-end">
                <div className="min-w-0 text-left sm:text-right">
                  <p className="truncate text-base font-semibold">
                    {actor.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {aggregate.actorWins}{" "}
                    {aggregate.actorWins === 1 ? "win" : "wins"}
                  </p>
                </div>
                <Avatar className="size-10 shrink-0" size="default">
                  {actor.avatarUrl ? (
                    <AvatarImage src={actor.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback className="bg-primary/15 font-semibold text-primary">
                    {initials(actor.displayName)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Aggregate scoreline */}
              <div className="order-first text-center sm:order-none">
                <div className="font-mono text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
                  <span className="text-primary">{aggregate.actorScore}</span>
                  <span className="mx-2 font-light text-muted-foreground">
                    —
                  </span>
                  <span className="text-chart-2">
                    {aggregate.opponentScore}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-muted-foreground">
                  {leadCopy(
                    actor.displayName,
                    aggregate.actorScore,
                    opponent.displayName,
                    aggregate.opponentScore,
                  )}
                </p>
              </div>

              {/* Opponent summary */}
              <div className="flex items-center gap-3 sm:justify-start">
                <Avatar className="size-10 shrink-0" size="default">
                  {opponent.avatarUrl ? (
                    <AvatarImage src={opponent.avatarUrl} alt="" />
                  ) : null}
                  <AvatarFallback className="bg-muted font-semibold text-muted-foreground">
                    {initials(opponent.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 text-left">
                  <p className="truncate text-base font-semibold">
                    {opponent.displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {aggregate.opponentWins}{" "}
                    {aggregate.opponentWins === 1 ? "win" : "wins"}
                  </p>
                </div>
              </div>
            </div>

            {/* Goal bar and breakdown footer */}
            <div className="border-t border-border/80 bg-muted/20 px-5 py-4 sm:px-8">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-primary">
                  {aggregate.actorScore} goals
                </span>
                <span className="font-medium">
                  {aggregate.actorWins}W — {aggregate.draws}D —{" "}
                  {aggregate.opponentWins}L
                </span>
                <span className="font-semibold text-chart-2">
                  {aggregate.opponentScore} goals
                </span>
              </div>
              <div className="mt-2.5 flex h-1.5 overflow-hidden rounded-full bg-muted">
                <span
                  className="bg-primary transition-all duration-300"
                  style={{
                    width: `${goalShare(aggregate.actorScore, aggregate.opponentScore)}%`,
                  }}
                />
                <span
                  className="bg-chart-2 transition-all duration-300"
                  style={{
                    width: `${100 - goalShare(aggregate.actorScore, aggregate.opponentScore)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* List of pending matches */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Unconfirmed submissions ({pendingMatches.length})
            </h3>
            <ul className="space-y-1.5 rounded-3xl bg-card p-2 shadow-xs">
              {pendingMatches.map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  actorId={actor.id}
                  players={{
                    actor: {
                      displayName: actor.displayName,
                      avatarUrl: actor.avatarUrl,
                    },
                    opponent: {
                      displayName: opponent.displayName,
                      avatarUrl: opponent.avatarUrl,
                    },
                  }}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
