import { z } from "zod";

export const PermissionSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

export type Permission = z.infer<typeof PermissionSchema>;
