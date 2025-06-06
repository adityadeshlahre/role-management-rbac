import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.number().int().positive(),
  createdAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;
