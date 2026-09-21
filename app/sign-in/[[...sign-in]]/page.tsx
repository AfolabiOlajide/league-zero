import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Your record continues"
      title="Pick up where the rivalry left off."
      description="Sign in to log results, confirm scorelines, and keep every head-to-head record honest."
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        // New sessions always establish their LeagueZero profile before they
        // enter the private app. Existing profiles are forwarded to /home by
        // the onboarding page, avoiding a second auth handoff through /.
        forceRedirectUrl="/onboarding"
      />
    </AuthShell>
  );
}
