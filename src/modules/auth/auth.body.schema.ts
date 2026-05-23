import { z } from "zod";

export const createAccountSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    email: z.string().min(1, "Email is required").email("Invalid email format"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),

    role: z
      .enum(["contributor", "maintainer"])
      .optional()
      .default("contributor"),
  })
  .strict();

export const LoginSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
  })
  .strict();
