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

export type Role = z.infer<typeof RoleSchema>;
