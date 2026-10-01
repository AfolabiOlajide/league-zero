"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { profileSchema } from "@/features/users/schemas/profile";
import type { ProfileActionState } from "@/features/users/types";
import { connectToDatabase } from "@/lib/db/connect";
import { UserModel } from "@/models/user";

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === 11000
  );
}

export async function updateProfile(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated || !userId) {
    return {
      status: "error",
      message: "Your session expired. Sign in again to update your profile.",
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

  const currentUser = await UserModel.findOne({ clerkId: userId }).select({
    _id: 1,
    username: 1,
    displayName: 1,
  });

  if (!currentUser) {
    return {
      status: "error",
      message: "User profile not found.",
    };
  }

  const normalizedNewUsername = result.data.username;
  const isUsernameChanging = normalizedNewUsername !== currentUser.username;
  const isDisplayNameChanging =
    result.data.displayName !== currentUser.displayName;

  if (!isUsernameChanging && !isDisplayNameChanging) {
    return {
      status: "success",
      message: "Profile updated.",
    };
  }

  if (isUsernameChanging) {
    const existingUser = await UserModel.exists({
      username: normalizedNewUsername,
      _id: { $ne: currentUser._id },
    });

    if (existingUser) {
      return {
        status: "error",
        message: "This username is already taken.",
        fieldErrors: {
          username: ["This username is already taken"],
        },
      };
    }
  }

  try {
    await UserModel.updateOne(
      { _id: currentUser._id },
      {
        $set: {
          displayName: result.data.displayName,
          username: normalizedNewUsername,
        },
      },
    );
  } catch (error) {
    if (isDuplicateKeyError(error)) {
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
      message: "We could not update your profile. Try again in a moment.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/home");
  revalidatePath("/search");
  revalidatePath("/rivalries");

  return {
    status: "success",
    message: "Profile updated successfully.",
  };
}
