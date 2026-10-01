"use client";

import { CheckCheck, Loader2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { initialMatchActionState } from "@/features/matches/action-state";
import { acceptAllPendingMatches } from "@/features/matches/actions/match-actions";

export function AcceptAllMatchesButton({
  rivalryId,
  count,
}: {
  rivalryId: string;
  count: number;
}) {
  const [state, formAction, pending] = useActionState(
    acceptAllPendingMatches,
    initialMatchActionState,
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <form action={formAction}>
        <input type="hidden" name="rivalryId" value={rivalryId} />
        <Button
          type="submit"
          size="sm"
          disabled={pending}
          title="Accept all pending results"
          aria-label={`Accept all ${count} pending results`}
          className="h-8 gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/85 focus-visible:ring-2 focus-visible:ring-primary"
        >
          {pending ? (
            <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
          ) : (
            <CheckCheck aria-hidden="true" className="size-3.5" />
          )}
          <span>{pending ? "Accepting…" : `Accept all (${count})`}</span>
        </Button>
      </form>
      {state.status === "error" && state.message && (
        <p
          aria-live="polite"
          className="max-w-[220px] text-right text-xs text-destructive"
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
