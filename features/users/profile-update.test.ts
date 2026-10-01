import { describe, expect, it } from "vitest";

import { profileSchema } from "./schemas/profile";
import { normalizeUsername } from "./username";

describe("profile update logic and schemas", () => {
  describe("username change detection", () => {
    it("recognizes when the username has not changed despite whitespace or casing differences", () => {
      const currentUsername = "cipherr_zero";
      const submittedUsername = "  @Cipherr_Zero  ";

      const normalized = normalizeUsername(submittedUsername);
      const isChanging = normalized !== currentUsername;

      expect(normalized).toBe("cipherr_zero");
      expect(isChanging).toBe(false);
    });

    it("recognizes when the username has genuinely changed to a new handle", () => {
      const currentUsername = "cipherr_zero";
      const submittedUsername = "cipherr_new";

      const normalized = normalizeUsername(submittedUsername);
      const isChanging = normalized !== currentUsername;

      expect(normalized).toBe("cipherr_new");
      expect(isChanging).toBe(true);
    });
  });

  describe("profile schema validation on update", () => {
    it("validates legitimate display name and username changes", () => {
      const parsed = profileSchema.safeParse({
        displayName: "Afolabi S.",
        username: "afolabi_zero",
      });

      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.displayName).toBe("Afolabi S.");
        expect(parsed.data.username).toBe("afolabi_zero");
      }
    });

    it("rejects display names shorter than 2 characters", () => {
      const parsed = profileSchema.safeParse({
        displayName: "A",
        username: "valid_name",
      });

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.flatten().fieldErrors.displayName).toBeDefined();
      }
    });

    it("rejects invalid characters in username", () => {
      const parsed = profileSchema.safeParse({
        displayName: "Valid Name",
        username: "invalid-user!",
      });

      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.flatten().fieldErrors.username).toBeDefined();
      }
    });
  });
});
