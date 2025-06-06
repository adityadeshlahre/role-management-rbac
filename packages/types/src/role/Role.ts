import { z } from "zod";

export const RoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdBy: z.number().int().optional(),
  isDefault: z.boolean(),
});

export type Role = z.infer<typeof RoleSchema>;
