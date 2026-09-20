"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { acceptRivalry, cancelRivalry, initialRivalryActionState, rejectRivalry } from "@/features/rivalries/actions/rivalry-actions";

export function RivalryDecisionControls({ rivalryId, isRequester }: { rivalryId: string; isRequester: boolean }) {
  const [acceptState, acceptAction, accepting] = useActionState(acceptRivalry, initialRivalryActionState);
  const [rejectState, rejectAction, rejecting] = useActionState(rejectRivalry, initialRivalryActionState);
  const [cancelState, cancelAction, cancelling] = useActionState(cancelRivalry, initialRivalryActionState);
  const state = acceptState.status !== "idle" ? acceptState : rejectState.status !== "idle" ? rejectState : cancelState;
  const pending = accepting || rejecting || cancelling;

  return <section className="border-b border-border py-7" aria-label="Rivalry request actions"><p className="text-sm text-muted-foreground">{isRequester ? "Your request is waiting for their decision." : "Accept to open your shared record. You can request again later if you reject it."}</p><div className="mt-4 flex gap-2">{isRequester ? <form action={cancelAction}><input type="hidden" name="rivalryId" value={rivalryId} /><Button type="submit" variant="outline" size="lg" className="h-11" disabled={pending}>{cancelling ? "Cancelling…" : "Cancel request"}</Button></form> : <><form action={rejectAction}><input type="hidden" name="rivalryId" value={rivalryId} /><Button type="submit" variant="outline" size="lg" className="h-11" disabled={pending}>{rejecting ? "Rejecting…" : "Reject"}</Button></form><form action={acceptAction}><input type="hidden" name="rivalryId" value={rivalryId} /><Button type="submit" size="lg" className="h-11" disabled={pending}>{accepting ? "Accepting…" : "Accept rivalry"}</Button></form></>}</div>{state.status !== "idle" && <p aria-live="polite" className={state.status === "error" ? "mt-3 text-sm text-destructive" : "mt-3 text-sm text-muted-foreground"}>{state.message}</p>}</section>;
}
