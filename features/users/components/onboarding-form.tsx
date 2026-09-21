"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/features/users/actions/complete-onboarding";
import type { OnboardingActionState } from "@/features/users/types";

type OnboardingFormProps = {
  defaultDisplayName: string;
  defaultUsername: string;
};

const initialOnboardingState: OnboardingActionState = {
  status: "idle",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      size="lg"
      className="h-11 w-full text-sm"
      disabled={pending}
    >
      {pending ? "Creating your profile…" : "Enter LeagueZero"}
    </Button>
  );
}

export function OnboardingForm({
  defaultDisplayName,
  defaultUsername,
}: OnboardingFormProps) {
  const [state, formAction] = useActionState(
    completeOnboarding,
    initialOnboardingState,
  );

  return (
    <form action={formAction} className="mt-9 space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="displayName">Display name</Label>
        <Input
          id="displayName"
          name="displayName"
          autoComplete="name"
          defaultValue={defaultDisplayName}
          aria-invalid={Boolean(state.fieldErrors?.displayName)}
          aria-describedby={
            state.fieldErrors?.displayName ? "displayName-error" : undefined
          }
          className="h-11"
          maxLength={50}
          required
        />
        {state.fieldErrors?.displayName && (
          <p id="displayName-error" className="text-sm text-destructive">
            {state.fieldErrors.displayName[0]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground"
          >
            @
          </span>
          <Input
            id="username"
            name="username"
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect="off"
            defaultValue={defaultUsername}
            aria-invalid={Boolean(state.fieldErrors?.username)}
            aria-describedby="username-help username-error"
            className="h-11 pl-8"
            minLength={3}
            maxLength={20}
            pattern="[A-Za-z0-9_]+"
            required
          />
        </div>
        <p id="username-help" className="text-sm text-muted-foreground">
          3–20 letters, numbers, or underscores. You can share this handle with
          rivals.
        </p>
        {state.fieldErrors?.username && (
          <p id="username-error" className="text-sm text-destructive">
            {state.fieldErrors.username[0]}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" aria-live="polite" className="text-sm text-destructive">
          {state.message}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
