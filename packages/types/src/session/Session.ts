import { z } from "zod";

export const SessionSchema = z.object({
  id: z.number().int().positive(),
  token: z.string(),
  userId: z.number().int().positive(),
  createdAt: z.date(),
  expiresAt: z.date(),
});

export type Session = z.infer<typeof SessionSchema>;
