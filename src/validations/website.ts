import { z } from "zod";

const domainRegex =
  /^(?!-)(?!.*--)[a-zA-Z0-9-]{1,63}(?<!-)(?:\.(?!-)(?!.*--)[a-zA-Z0-9-]{1,63}(?<!-))*\.[a-zA-Z]{2,}$/;

export const createWebsiteSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),

  domain: z
    .string()
    .min(3, "Domain is required")
    .max(253, "Domain is too long")
    .trim()
    .toLowerCase()
    .transform((val) =>
      val.replace(/^https?:\/\//i, "").replace(/\/.*$/, "")
    )
    .refine(
      (val) => domainRegex.test(val),
      "Please enter a valid domain (e.g. example.com)"
    ),
});
