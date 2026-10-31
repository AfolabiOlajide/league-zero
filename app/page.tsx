import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { LandingPage } from "@/components/landing-page";
import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";

export default async function RootPage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return <LandingPage />;
  }

  const user = await getUserByClerkId(userId);
  redirect(user ? "/home" : "/onboarding");
}
