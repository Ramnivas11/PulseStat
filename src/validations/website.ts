import { z } from "zod";

function normalizeDomain(value: string) {
  const trimmed = value.trim().toLowerCase();
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`).hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  }
}

export const createWebsiteSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  domain: z
    .string()
    .trim()
    .min(3, "Domain is required")
    .max(253)
    .transform(normalizeDomain)
    .pipe(
      z.string().regex(
        /^(?!-)(?:[a-z0-9-]{1,63}\.)+[a-z]{2,63}$/,
        "Enter a valid domain, for example example.com"
      )
    ),
});
