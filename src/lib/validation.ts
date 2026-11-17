import { z } from "zod";

// Error messages are codes; the client maps them to the localized dictionary (t.v.*).
const name = z.string().trim().min(1, "required").max(60, "required");
export const email = z.string().trim().toLowerCase().min(1, "required").email("email").max(160);
export const tvUsername = z.string().trim().min(1, "required").max(40, "tv").regex(/^[A-Za-z0-9_.-]+$/, "tv");

export const checkoutSchema = z.object({
  plan: z.string().trim().min(1).max(40),
  firstName: name, lastName: name, email, tradingViewUsername: tvUsername,
});

export const contactSchema = z.object({
  firstName: name, lastName: name, email, tradingViewUsername: tvUsername,
  subject: z.string().trim().max(140).optional().default(""),
  planInterest: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(10, "min").max(4000),
  website: z.string().max(500).optional(), // honeypot: must stay empty
});

export function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[String(i.path[0])] ??= i.message;
  return out;
}
