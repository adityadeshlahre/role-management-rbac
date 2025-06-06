import { z } from "zod";
import { RoleSchema } from "../role/Role";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.number().int().positive(),
  createdAt: z.date(),
  role: RoleSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;
