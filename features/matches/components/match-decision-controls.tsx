"use client";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { acceptMatch, initialMatchActionState, rejectMatch } from "@/features/matches/actions/match-actions";

export function MatchDecisionControls({ matchId }: { matchId: string }) {
  const [acceptState, acceptAction, accepting] = useActionState(acceptMatch, initialMatchActionState);
  const [rejectState, rejectAction, rejecting] = useActionState(rejectMatch, initialMatchActionState);
  const state = acceptState.status !== "idle" ? acceptState : rejectState;
  const pending = accepting || rejecting;
  return <section className="border-y border-border py-6"><p className="text-sm leading-6 text-muted-foreground">Confirming makes this scoreline part of the official record. Rejecting keeps it out of official history.</p><div className="mt-4 flex gap-2"><form action={rejectAction}><input type="hidden" name="matchId" value={matchId} /><Button type="submit" variant="outline" size="lg" className="h-11" disabled={pending}>{rejecting ? "Rejecting…" : "Reject result"}</Button></form><form action={acceptAction}><input type="hidden" name="matchId" value={matchId} /><Button type="submit" size="lg" className="h-11" disabled={pending}>{accepting ? "Confirming…" : "Confirm score"}</Button></form></div>{state.status !== "idle" && <p aria-live="polite" className={state.status === "error" ? "mt-3 text-sm text-destructive" : "mt-3 text-sm text-muted-foreground"}>{state.message}</p>}</section>;
}
