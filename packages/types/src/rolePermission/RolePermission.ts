import { z } from "zod";

export const RolePermissionSchema = z.object({
  roleId: z.number().int().positive(),
  permissionId: z.number().int().positive(),
});

export type RolePermission = z.infer<typeof RolePermissionSchema>;
