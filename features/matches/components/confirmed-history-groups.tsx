import type { MatchView } from "@/features/matches/types";
import { MatchRow } from "@/features/matches/components/match-row";
import { groupConfirmedHistoryByDay } from "@/lib/domain/confirmed-history-groups";

type EncounterPlayer = { displayName: string; avatarUrl?: string };

export function ConfirmedHistoryGroups({
  matches,
  actorId,
  players,
}: {
  matches: MatchView[];
  actorId: string;
  players: { actor: EncounterPlayer; opponent: EncounterPlayer };
}) {
  return (
    <div className="mt-4 space-y-6">
      {groupConfirmedHistoryByDay(matches, actorId).map((group) => (
        <section key={group.date} aria-labelledby={`history-day-${group.date}`}>
          <h3
            id={`history-day-${group.date}`}
            className="flex flex-wrap items-baseline gap-x-2 gap-y-1 px-1 text-sm"
          >
            <time
              dateTime={group.date}
              className="font-semibold tracking-[-0.02em]"
            >
              {new Intl.DateTimeFormat("en", {
                month: "long",
                day: "numeric",
              }).format(new Date(`${group.date}T12:00:00.000Z`))}
            </time>
            <span className="font-mono font-semibold tabular-nums tracking-[-0.06em]">
              {players.actor.displayName} {group.actorWins} — {group.opponentWins}{" "}
              {players.opponent.displayName}
            </span>
            {group.draws > 0 && (
              <span className="text-muted-foreground">
                · {group.draws} {group.draws === 1 ? "draw" : "draws"}
              </span>
            )}
          </h3>
          <ul className="mt-2 space-y-1.5 rounded-3xl bg-card p-2 shadow-xs">
            {group.matches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                actorId={actorId}
                players={players}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
