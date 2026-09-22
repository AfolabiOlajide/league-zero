import Link from "next/link";

import { MatchStatusBadge } from "@/components/match-status-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { canDecideMatch } from "@/features/matches/authorization";
import { MatchQuickDecisionControls } from "@/features/matches/components/match-quick-decision-controls";
import type { MatchView } from "@/features/matches/types";
import { cn } from "@/lib/utils";

const gameNames = {
    "ea-sports-fc": "EA Sports FC",
    efootball: "eFootball / PES",
    football: "Football",
    other: "Other",
} as const;

type EncounterPlayer = { displayName: string; avatarUrl?: string };

function initials(name: string) {
    return name
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function MatchRow({
    match,
    actorId,
    players,
}: {
    match: MatchView;
    actorId: string;
    players?: { actor: EncounterPlayer; opponent: EncounterPlayer };
}) {
    const actorIndex = match.participantIds.indexOf(actorId);
    const opponentIndex = actorIndex === 0 ? 1 : 0;
    const canDecide =
        match.status === "pending" &&
        canDecideMatch(match.participantIds, match.submittedBy, actorId);
    const actorScore = match.scores[actorIndex];
    const opponentScore = match.scores[opponentIndex];
    const outcome =
        match.status === "accepted"
            ? actorScore === opponentScore
                ? "D"
                : actorScore > opponentScore
                  ? "W"
                  : "L"
            : undefined;
    const outcomeTone =
        outcome === "W"
            ? "bg-primary/15 text-primary"
            : outcome === "L"
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-muted-foreground";
    const isPending = match.status === "pending";
    const isRejected = match.status === "rejected";
    const hasTonalStatus = isPending || isRejected;
    const game =
        match.game === "other" ? match.customGameLabel : gameNames[match.game];

    return (
        <li
            className={cn(
                "group flex items-center gap-2 rounded-xl px-3 py-3 transition-colors sm:gap-3",
                isPending
                    ? "bg-chart-4/10 hover:bg-chart-4/15"
                    : isRejected
                      ? "bg-destructive/10 hover:bg-destructive/15"
                      : "hover:bg-muted/65",
            )}
        >
            <Link
                href={`/matches/${match.id}`}
                className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
                {hasTonalStatus && (
                    <span className="sr-only">
                        {isPending
                            ? "Pending verification."
                            : "Rejected result."}
                    </span>
                )}
                {outcome ? (
                    <span
                        aria-label={
                            outcome === "W"
                                ? "Win"
                                : outcome === "L"
                                  ? "Loss"
                                  : "Draw"
                        }
                        className={cn(
                            "grid size-7 place-items-center rounded-lg text-[0.68rem] font-bold",
                            outcomeTone,
                        )}
                    >
                        {outcome}
                    </span>
                ) : hasTonalStatus ? (
                    <span aria-hidden="true" className="size-7" />
                ) : (
                    <MatchStatusBadge status={match.status} />
                )}
                <div className="min-w-0">
                    {players ? (
                        <div className="flex min-w-0 items-center gap-2">
                            <Avatar className="size-7" size="sm">
                                {players.actor.avatarUrl && (
                                    <AvatarImage
                                        src={players.actor.avatarUrl}
                                        alt=""
                                    />
                                )}
                                <AvatarFallback className="bg-primary/15 text-[0.6rem] font-semibold text-primary">
                                    {initials(players.actor.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <p className="truncate text-sm font-semibold">
                                {players.actor.displayName}
                            </p>
                            <span className="font-mono text-sm font-semibold tabular-nums tracking-[-0.06em]">
                                {actorScore} — {opponentScore}
                            </span>
                            <Avatar className="size-7" size="sm">
                                {players.opponent.avatarUrl && (
                                    <AvatarImage
                                        src={players.opponent.avatarUrl}
                                        alt=""
                                    />
                                )}
                                <AvatarFallback className="bg-muted text-[0.6rem] font-semibold">
                                    {initials(players.opponent.displayName)}
                                </AvatarFallback>
                            </Avatar>
                            <p className="truncate text-sm font-semibold">
                                {players.opponent.displayName}
                            </p>
                        </div>
                    ) : (
                        <p className="font-mono text-lg font-semibold tabular-nums tracking-[-0.06em]">
                            {actorScore} — {opponentScore}
                        </p>
                    )}
                </div>
                <div className="hidden text-right sm:block">
                    <p className="text-[0.68rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                        {game}
                    </p>
                    <time
                        className="mt-1 block text-xs text-muted-foreground"
                        dateTime={match.playedAt}
                    >
                        {new Intl.DateTimeFormat("en", {
                            month: "short",
                            day: "numeric",
                        }).format(new Date(match.playedAt))}
                    </time>
                </div>
            </Link>
            {canDecide && <MatchQuickDecisionControls matchId={match.id} />}
        </li>
    );
}
