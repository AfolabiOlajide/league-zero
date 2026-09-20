"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="flex min-h-[65svh] items-center">
      <div className="max-w-lg">
        <AlertTriangle aria-hidden="true" className="size-8 text-destructive" />
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">
          This page did not load.
        </h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          Your profile is safe. Try loading this part of LeagueZero again.
        </p>
        <Button onClick={reset} size="lg" className="mt-7 h-11 px-5">
          Try again
        </Button>
      </div>
    </section>
  );
}
