"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { profileSchema } from "@/features/users/schemas/profile";
import type { OnboardingActionState } from "@/features/users/types";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/models/user";

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}

export async function completeOnboarding(
  _previousState: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return {
      status: "error",
      message: "Your session expired. Sign in again to finish your profile.",
    };
  }

  const result = profileSchema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
  });

  if (!result.success) {
    return {
      status: "error",
      message: "Check the highlighted fields and try again.",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  await connectToDatabase();

  const existingUser = await UserModel.exists({ clerkId: userId });
  if (existingUser) {
    redirect("/home");
  }

  const clerkUser = await currentUser();

  try {
    await UserModel.create({
      clerkId: userId,
      username: result.data.username,
      displayName: result.data.displayName,
      avatarUrl: clerkUser?.imageUrl || undefined,
      onboardingCompletedAt: new Date(),
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      const nowExistingUser = await UserModel.exists({ clerkId: userId });
      if (nowExistingUser) {
        redirect("/home");
      }

      return {
        status: "error",
        message: "That username was just claimed. Choose another one.",
        fieldErrors: {
          username: ["This username is already taken"],
        },
      };
    }

    return {
      status: "error",
      message: "We could not create your profile. Try again in a moment.",
    };
  }

  redirect("/home");
}
