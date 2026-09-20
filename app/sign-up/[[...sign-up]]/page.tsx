import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth-shell";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Start at zero"
      title="Every great rivalry needs a first result."
      description="Create your account, claim a LeagueZero username, and invite the first person you want on your record."
    >
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
      />
    </AuthShell>
  );
}
