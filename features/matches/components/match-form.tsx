"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitMatch, updatePendingMatch } from "@/features/matches/actions/match-actions";
import { initialMatchActionState } from "@/features/matches/action-state";
import type { MatchGame, MatchView } from "@/features/matches/types";

type MatchFormProps = { rivalryId: string; actor: { id: string; displayName: string }; opponent: { displayName: string }; match?: MatchView };

export function MatchForm({ rivalryId, actor, opponent, match }: MatchFormProps) {
  const [game, setGame] = useState<MatchGame>(match?.game ?? "ea-sports-fc");
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [state, formAction, pending] = useActionState(match ? updatePendingMatch : submitMatch, initialMatchActionState);
  const actorIndex = match?.participantIds.indexOf(actor.id) ?? 0;
  const myScore = match ? match.scores[actorIndex] : "";
  const opponentScore = match ? match.scores[actorIndex === 0 ? 1 : 0] : "";
  const playedAt = match ? match.playedAt.slice(0, 10) : new Date().toISOString().slice(0, 10);

  return <form action={formAction} className="mt-8 space-y-7" noValidate>
    <input type="hidden" name={match ? "matchId" : "rivalryId"} value={match ? match.id : rivalryId} />
    {!match && <input type="hidden" name="idempotencyKey" value={idempotencyKey} />}
    <fieldset><legend className="text-sm font-medium">Score</legend><div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-3 sm:max-w-md"><ScoreInput id="myScore" label={actor.displayName} defaultValue={myScore} error={state.fieldErrors?.myScore?.[0]} /><span className="pb-3 text-lg text-muted-foreground">—</span><ScoreInput id="opponentScore" label={opponent.displayName} defaultValue={opponentScore} error={state.fieldErrors?.opponentScore?.[0]} /></div></fieldset>
    <div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="game">Game or activity</Label><select id="game" name="game" value={game} onChange={(event) => setGame(event.target.value as MatchGame)} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"><option value="ea-sports-fc">EA Sports FC</option><option value="efootball">eFootball / PES</option><option value="football">Football</option><option value="other">Other</option></select></div><div className="space-y-2"><Label htmlFor="playedAt">Date played</Label><Input id="playedAt" name="playedAt" type="date" defaultValue={playedAt} max={new Date().toISOString().slice(0, 10)} min="2000-01-01" className="h-11" required /></div></div>
    {game === "other" && <div className="space-y-2"><Label htmlFor="customGameLabel">Name the activity</Label><Input id="customGameLabel" name="customGameLabel" defaultValue={match?.customGameLabel} maxLength={40} className="h-11" aria-invalid={Boolean(state.fieldErrors?.customGameLabel)} required />{state.fieldErrors?.customGameLabel && <p className="text-sm text-destructive">{state.fieldErrors.customGameLabel[0]}</p>}</div>}
    {state.status !== "idle" && <p aria-live="polite" className={state.status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>{state.message}</p>}
    <div className="flex flex-wrap items-center gap-3"><Button type="submit" size="lg" className="h-11 px-5" disabled={pending}>{pending ? (match ? "Saving…" : "Submitting…") : match ? "Save pending result" : "Submit for verification"}</Button>{state.status === "success" && state.matchId && <Link href={`/matches/${state.matchId}`} className="text-sm font-medium text-primary underline-offset-4 hover:underline">Review result</Link>}</div>
  </form>;
}

function ScoreInput({ id, label, defaultValue, error }: { id: "myScore" | "opponentScore"; label: string; defaultValue: string | number; error?: string }) {
  return <div className="min-w-0 space-y-2"><Label htmlFor={id} className="block truncate text-center">{label}</Label><Input id={id} name={id} type="number" inputMode="numeric" min="0" max="99" step="1" defaultValue={defaultValue} aria-invalid={Boolean(error)} className="h-14 text-center text-2xl font-semibold tabular-nums" required />{error && <p className="text-center text-sm text-destructive">{error}</p>}</div>;
}
