import { z } from "zod";
import { PLATFORM_IDS, type PlatformId } from "./platform-types";

/** POST /api/contact */
export const ContactSchema = z.object({
  name: z
    .string({ error: "Missing required fields: name, email, message" })
    .trim()
    .min(1, "Missing required fields: name, email, message")
    .max(120, "Name exceeds 120 characters"),
  email: z
    .string({ error: "Missing required fields: name, email, message" })
    .trim()
    .max(254, "Email exceeds 254 characters")
    .email("Invalid return frequency (email)"),
  frequency: z.string().trim().max(32, "Frequency exceeds 32 characters").optional(),
  message: z
    .string({ error: "Missing required fields: name, email, message" })
    .trim()
    .min(1, "Missing required fields: name, email, message")
    .max(5000, "Message payload exceeds 5000 characters"),
});

export type ContactInput = z.infer<typeof ContactSchema>;

/** POST /api/testimonials */
export const TestimonialSchema = z.object({
  author: z
    .string({ error: "Missing required fields: author, role, quote" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name exceeds 120 characters"),
  role: z
    .string({ error: "Missing required fields: author, role, quote" })
    .trim()
    .min(1, "Missing required fields: author, role, quote")
    .max(120, "Role exceeds 120 characters"),
  relation: z.string().trim().max(120, "Relation exceeds 120 characters").optional(),
  quote: z
    .string({ error: "Missing required fields: author, role, quote" })
    .trim()
    .min(10, "Testimonial must be at least 10 characters")
    .max(600, "Testimonial exceeds 600 characters"),
  rating: z
    .coerce
    .number()
    .default(5)
    .transform((n) =>
      Number.isFinite(n) ? Math.min(5, Math.max(1, Math.round(n))) : 5
    ),
  accent: z.enum(["alien", "cyan", "plasma"]).default("alien").catch("alien"),
  verifyLink: z.string().trim().max(300).optional(),
});

export type TestimonialInput = z.infer<typeof TestimonialSchema>;

/** POST /api/platforms */
export const PlatformUpdateSchema = z.object({
  platform: z
    .string({ error: "platform must be one of: leetcode, codeforces, github" })
    .refine(
      (v): v is PlatformId =>
        (PLATFORM_IDS as string[]).includes(v),
      { error: `platform must be one of: ${PLATFORM_IDS.join(", ")}` }
    ),
  handle: z
    .string()
    .trim()
    .regex(
      /^[A-Za-z0-9_-]{1,39}$/,
      "Invalid handle format (max 39 chars, letters/digits/_/-)"
    )
    .nullish()
    .transform((v) => v ?? null),
  profileUrl: z
    .string()
    .trim()
    .refine(
      (v) => {
        try {
          const u = new URL(v);
          return u.protocol === "http:" || u.protocol === "https:";
        } catch {
          return false;
        }
      },
      { error: "profileUrl must be a valid http(s) URL" }
    )
    .nullish()
    .transform((v) => v ?? null),
  enabled: z.boolean().optional(),
});

export type PlatformUpdateInput = z.infer<typeof PlatformUpdateSchema>;

/** PATCH /api/contact — mark a transmission read/unread */
export const ContactPatchSchema = z.object({
  id: z.string().trim().min(1, "id is required").max(64, "id too long"),
  read: z.boolean(),
});

/** First human-readable issue message from a Zod result. */
export function firstIssue(
  result: { error: { issues: Array<{ message?: string }> } }
): string {
  return result.error.issues[0]?.message || "Invalid request";
}
