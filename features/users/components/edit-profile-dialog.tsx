"use client";

import { Loader2, Pencil } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialProfileActionState } from "@/features/users/action-state";
import { updateProfile } from "@/features/users/actions/update-profile";
import type { ProfileActionState } from "@/features/users/types";

type EditProfileDialogProps = {
  currentDisplayName: string;
  currentUsername: string;
};

export function EditProfileDialog({
  currentDisplayName,
  currentUsername,
}: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ProfileActionState>(
    initialProfileActionState,
  );
  const [pending, startTransition] = useTransition();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setState(initialProfileActionState);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(state, formData);
      setState(result);
      if (result.status === "success") {
        setOpen(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-lg border-border/80 text-xs font-semibold shadow-xs transition-colors hover:bg-muted"
          />
        }
      >
        <Pencil aria-hidden="true" className="size-3.5 text-primary" />
        <span>Edit profile</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Competition Identity</DialogTitle>
          <DialogDescription>
            Update your display name and unique handle. Your username must be
            unique across LeagueZero.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-xs font-medium">
              Display name
            </Label>
            <Input
              id="displayName"
              name="displayName"
              autoComplete="name"
              defaultValue={currentDisplayName}
              maxLength={50}
              required
              aria-invalid={Boolean(state.fieldErrors?.displayName)}
              aria-describedby={
                state.fieldErrors?.displayName
                  ? "displayName-error"
                  : "displayName-help"
              }
              className="h-10"
            />
            <p id="displayName-help" className="text-xs text-muted-foreground">
              2–50 characters. Seen by rivals on matches and leaderboards.
            </p>
            {state.fieldErrors?.displayName && (
              <p
                id="displayName-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {state.fieldErrors.displayName[0]}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-xs font-medium">
              Username
            </Label>
            <div className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-muted-foreground"
              >
                @
              </span>
              <Input
                id="username"
                name="username"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                defaultValue={currentUsername}
                minLength={3}
                maxLength={20}
                pattern="[A-Za-z0-9_]+"
                required
                aria-invalid={Boolean(state.fieldErrors?.username)}
                aria-describedby={
                  state.fieldErrors?.username
                    ? "username-error"
                    : "username-help"
                }
                className="h-10 pl-7 text-sm"
              />
            </div>
            <p id="username-help" className="text-xs text-muted-foreground">
              3–20 letters, numbers, or underscores. Used to find and challenge
              you.
            </p>
            {state.fieldErrors?.username && (
              <p
                id="username-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {state.fieldErrors.username[0]}
              </p>
            )}
          </div>

          {state.status === "error" && state.message && (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-lg bg-destructive/10 p-2.5 text-xs font-medium text-destructive"
            >
              {state.message}
            </p>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pending}
              className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {pending ? (
                <>
                  <Loader2
                    aria-hidden="true"
                    className="size-3.5 animate-spin"
                  />
                  <span>Saving…</span>
                </>
              ) : (
                <span>Save changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
