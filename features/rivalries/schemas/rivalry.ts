import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "This request is no longer valid. Refresh and try again.");

export const createRivalrySchema = z.object({ targetUserId: objectId });
export const rivalryDecisionSchema = z.object({ rivalryId: objectId });

export function parseRivalryFormData(
  formData: FormData,
  field: "targetUserId" | "rivalryId",
) {
  return (field === "targetUserId" ? createRivalrySchema : rivalryDecisionSchema).safeParse({
    [field]: formData.get(field),
  });
}
