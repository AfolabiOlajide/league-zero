import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getUserByClerkId } from "@/features/users/queries/get-user-by-clerk-id";

export default async function RootPage() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    redirect("/sign-in");
  }

  const user = await getUserByClerkId(userId);
  redirect(user ? "/home" : "/onboarding");
}
