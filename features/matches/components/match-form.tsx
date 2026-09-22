"use client";

import { format } from "date-fns";
import { CalendarDays, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker";
import { initialMatchActionState } from "@/features/matches/action-state";
import {
    submitMatch,
    updatePendingMatch,
} from "@/features/matches/actions/match-actions";
import {
    EARLIEST_PLAYED_DATE,
    SCORE_MAXIMUM,
} from "@/features/matches/constants";
import type { MatchGame, MatchView } from "@/features/matches/types";
import { cn } from "@/lib/utils";

type MatchFormProps = {
    rivalryId: string;
    actor: { id: string; displayName: string };
    opponent: { displayName: string };
    match?: MatchView;
};

export function MatchForm({
    rivalryId,
    actor,
    opponent,
    match,
}: MatchFormProps) {
    const [game, setGame] = useState<MatchGame>(match?.game ?? "ea-sports-fc");
    const [idempotencyKey, setIdempotencyKey] = useState(() =>
        crypto.randomUUID(),
    );
    const [state, formAction, pending] = useActionState(
        match ? updatePendingMatch : submitMatch,
        initialMatchActionState,
    );
    const actorIndex = match?.participantIds.indexOf(actor.id) ?? 0;
    const [myScore, setMyScore] = useState(
        match ? match.scores[actorIndex] : 0,
    );
    const [opponentScore, setOpponentScore] = useState(
        match ? match.scores[actorIndex === 0 ? 1 : 0] : 0,
    );
    const [playedAt, setPlayedAt] = useState(
        match
            ? match.playedAt.slice(0, 10)
            : new Date().toISOString().slice(0, 10),
    );
    const [customGameLabel, setCustomGameLabel] = useState(
        match?.customGameLabel ?? "",
    );
    const submittedMatchId = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (
            match ||
            state.status !== "success" ||
            !state.matchId ||
            submittedMatchId.current === state.matchId
        )
            return;
        submittedMatchId.current = state.matchId;
        setIdempotencyKey(crypto.randomUUID());
        setMyScore(0);
        setOpponentScore(0);
        setCustomGameLabel("");
    }, [match, state.matchId, state.status]);

    const selectedDate = new Date(`${playedAt}T12:00:00`);

    return (
        <form action={formAction} className="mt-8 space-y-9" noValidate>
            <input
                type="hidden"
                name={match ? "matchId" : "rivalryId"}
                value={match ? match.id : rivalryId}
            />
            {!match && (
                <input
                    type="hidden"
                    name="idempotencyKey"
                    value={idempotencyKey}
                />
            )}
            <fieldset className="rounded-3xl bg-muted/55 p-5 sm:p-7">
                <legend className="sr-only">Score</legend>
                <div className="flex items-end justify-between gap-5">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Set the score
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em]">
                            How did it finish?
                        </h2>
                    </div>
                    {/* <span className="hidden text-sm text-muted-foreground sm:block">
                        0–{SCORE_MAXIMUM} goals
                    </span> */}
                </div>
                <div className="mt-7 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-6">
                    <ScoreWheel
                        id="myScore"
                        label={actor.displayName}
                        value={myScore}
                        onChange={setMyScore}
                        error={state.fieldErrors?.myScore?.[0]}
                    />
                    <span className="text-xl font-semibold tracking-[-0.05em] text-muted-foreground">
                        —
                    </span>
                    <ScoreWheel
                        id="opponentScore"
                        label={opponent.displayName}
                        value={opponentScore}
                        onChange={setOpponentScore}
                        error={state.fieldErrors?.opponentScore?.[0]}
                    />
                </div>
            </fieldset>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-12">
                <fieldset>
                    <legend className="flex items-center gap-2 text-sm font-semibold">
                        <Gamepad2
                            aria-hidden="true"
                            className="size-4 text-primary"
                        />
                        Game or activity
                    </legend>
                    <input type="hidden" name="game" value={game} />
                    <div className="mt-4 flex flex-wrap gap-2">
                        {gameOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setGame(option.value)}
                                aria-pressed={game === option.value}
                                className={cn(
                                    "rounded-lg px-3 py-2 text-sm font-medium outline-none transition-all focus-visible:ring-3 focus-visible:ring-ring/50",
                                    game === option.value
                                        ? "bg-sidebar text-sidebar-accent-foreground shadow-sm"
                                        : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                    {game === "other" && (
                        <div className="mt-4 space-y-2">
                            <Label htmlFor="customGameLabel">
                                Name the activity
                            </Label>
                            <Input
                                id="customGameLabel"
                                name="customGameLabel"
                                value={customGameLabel}
                                onChange={(event) =>
                                    setCustomGameLabel(event.target.value)
                                }
                                maxLength={40}
                                className="h-11 border-0 bg-muted/70 shadow-none"
                                aria-invalid={Boolean(
                                    state.fieldErrors?.customGameLabel,
                                )}
                                required
                            />
                            {state.fieldErrors?.customGameLabel && (
                                <p className="text-sm text-destructive">
                                    {state.fieldErrors.customGameLabel[0]}
                                </p>
                            )}
                        </div>
                    )}
                </fieldset>
                <div>
                    <Label
                        className="flex items-center gap-2 text-sm font-semibold"
                        htmlFor="playedAt"
                    >
                        <CalendarDays
                            aria-hidden="true"
                            className="size-4 text-primary"
                        />
                        Date played
                    </Label>
                    <input
                        id="playedAt"
                        type="hidden"
                        name="playedAt"
                        value={playedAt}
                    />
                    <Popover>
                        <PopoverTrigger
                            render={
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="mt-4 h-12 w-full justify-between rounded-xl bg-muted/70 px-4 text-left font-medium hover:bg-muted"
                                />
                            }
                        >
                            <span>{format(selectedDate, "MMM d, yyyy")}</span>
                            <CalendarDays
                                aria-hidden="true"
                                className="size-4 text-muted-foreground"
                            />
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-auto p-1.5">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) =>
                                    date &&
                                    setPlayedAt(format(date, "yyyy-MM-dd"))
                                }
                                disabled={{
                                    before: new Date(
                                        `${EARLIEST_PLAYED_DATE}T12:00:00`,
                                    ),
                                    after: new Date(),
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            {state.status !== "idle" && (
                <p
                    aria-live="polite"
                    className={
                        state.status === "error"
                            ? "text-sm text-destructive"
                            : "text-sm text-muted-foreground"
                    }
                >
                    {state.message}
                </p>
            )}
            <div className="flex flex-wrap items-center gap-4">
                <Button
                    type="submit"
                    size="lg"
                    className="h-12 rounded-xl px-5"
                    disabled={pending}
                >
                    {pending
                        ? match
                            ? "Saving…"
                            : "Submitting…"
                        : match
                          ? "Save pending result"
                          : "Submit for verification"}
                </Button>
                <p className="text-sm text-muted-foreground">
                    Your opponent confirms the score before it becomes official.
                </p>
                {state.status === "success" && state.matchId && (
                    <Link
                        href={`/matches/${state.matchId}`}
                        className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                    >
                        Review result
                    </Link>
                )}
            </div>
        </form>
    );
}

const gameOptions: Array<{ value: MatchGame; label: string }> = [
    { value: "ea-sports-fc", label: "EA Sports FC" },
    { value: "efootball", label: "eFootball / PES" },
    { value: "football", label: "Football" },
    { value: "other", label: "Other" },
];

const scoreOptions = Array.from({ length: SCORE_MAXIMUM + 1 }, (_, value) => ({
    value,
    label: String(value),
}));

function ScoreWheel({
    id,
    label,
    value,
    onChange,
    error,
}: {
    id: "myScore" | "opponentScore";
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string;
}) {
    return (
        <div className="min-w-0">
            <Label
                htmlFor={id}
                className="mb-3 block truncate text-center text-sm font-semibold"
            >
                {label}
            </Label>
            <input id={id} name={id} type="hidden" value={value} />
            <WheelPickerWrapper className="w-full rounded-2xl bg-background/80 p-1 shadow-xs">
                <WheelPicker
                    value={value}
                    onValueChange={onChange}
                    options={scoreOptions}
                    visibleCount={20}
                    optionItemHeight={28}
                    classNames={{
                        optionItem: "text-sm font-medium",
                        highlightItem: "text-base font-semibold tabular-nums",
                    }}
                />
            </WheelPickerWrapper>
            {error && (
                <p className="mt-3 text-center text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}
