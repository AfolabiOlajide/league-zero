import { z } from "zod";

import {
  normalizeUsername,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "../username";

export const profileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters")
    .max(50, "Keep your display name under 50 characters"),
  username: z
    .string()
    .transform(normalizeUsername)
    .pipe(
      z
        .string()
        .min(
          USERNAME_MIN_LENGTH,
          `Use at least ${USERNAME_MIN_LENGTH} characters`,
        )
        .max(
          USERNAME_MAX_LENGTH,
          `Use no more than ${USERNAME_MAX_LENGTH} characters`,
        )
        .regex(
          USERNAME_PATTERN,
          "Use lowercase letters, numbers, and underscores only",
        ),
    ),
});

export type ProfileInput = z.infer<typeof profileSchema>;
