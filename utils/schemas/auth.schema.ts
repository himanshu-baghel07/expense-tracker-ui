import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Please enter the email address").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
