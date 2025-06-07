import { z } from "zod";
import { PermissionSchema } from "../permission/Permission";

export const RoleSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  createdBy: z.number().int().optional(),
  isDefault: z.boolean(),
  permission: z
    .array(
      z.object({
        permission: PermissionSchema,
      })
    )
    .optional(),
});

export const CreateRoleSchema = RoleSchema.partial({
  id: true,
  createdBy: true,
  permission: true,
  isDefault: true,
}).pick({
  name: true,
  description: true,
});

export const UpdateRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  permissions: z.array(z.string()).optional(),
});

export type Role = z.infer<typeof RoleSchema>;

export type CreateRole = z.infer<typeof CreateRoleSchema>;

export type UpdateRole = z.infer<typeof UpdateRoleSchema>;
