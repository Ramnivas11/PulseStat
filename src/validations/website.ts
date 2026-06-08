import { z } from "zod";

export const createWebsiteSchema = z.object({
  name: z
    .string()
    .min(2, "Name is too short"),

  domain: z
    .string()
    .min(3, "Domain is required")
    .max(253, "Domain is too long"),
});
