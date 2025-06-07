import { z } from "zod";
import { RoleSchema } from "../role/Role";

export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  roleId: z.number(),
  createdAt: z.date(),
  role: RoleSchema.optional(),
});

export const CreateUserSchema = UserSchema.partial({
  id: true,
  createdAt: true,
  role: true,
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
