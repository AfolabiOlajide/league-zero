"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-svh place-items-center px-5">
      <div className="max-w-lg text-center">
        <AlertTriangle
          aria-hidden="true"
          className="mx-auto size-9 text-destructive"
        />
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
          LeagueZero could not load.
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Nothing was changed. Check your connection and try again.
        </p>
        <Button onClick={reset} size="lg" className="mt-7 h-11 px-5">
          Try again
        </Button>
      </div>
    </main>
  );
}
