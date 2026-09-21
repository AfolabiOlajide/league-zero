"use client";

import { Check, Loader2, X } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { initialMatchActionState } from "@/features/matches/action-state";
import { acceptMatch, rejectMatch } from "@/features/matches/actions/match-actions";

export function MatchQuickDecisionControls({ matchId }: { matchId: string }) {
  const [acceptState, acceptAction, accepting] = useActionState(acceptMatch, initialMatchActionState);
  const [rejectState, rejectAction, rejecting] = useActionState(rejectMatch, initialMatchActionState);
  const state = acceptState.status !== "idle" ? acceptState : rejectState;
  const pending = accepting || rejecting;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1.5">
        <form action={rejectAction}>
          <input type="hidden" name="matchId" value={matchId} />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={pending}
            title="Reject result"
            aria-label="Reject result"
            className="size-8 rounded-lg border-border/80 text-muted-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive"
          >
            {rejecting ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin text-destructive" />
            ) : (
              <X aria-hidden="true" className="size-4" />
            )}
          </Button>
        </form>

        <form action={acceptAction}>
          <input type="hidden" name="matchId" value={matchId} />
          <Button
            type="submit"
            size="icon"
            disabled={pending}
            title="Confirm score"
            aria-label="Confirm score"
            className="size-8 rounded-lg bg-primary text-primary-foreground shadow-xs transition-colors hover:bg-primary/80 focus-visible:ring-2 focus-visible:ring-primary"
          >
            {accepting ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : (
              <Check aria-hidden="true" className="size-4" />
            )}
          </Button>
        </form>
      </div>
      {state.status === "error" && state.message && (
        <p aria-live="polite" className="max-w-[180px] text-right text-xs text-destructive">
          {state.message}
        </p>
      )}
    </div>
  );
}
