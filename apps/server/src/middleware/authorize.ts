import { User } from "@repo/types/index";
import { Request, Response, NextFunction } from "express";

export const authorizeRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const user = req.user as User;

    if (!user?.role) {
      return res.status(403).json({ error: "Access denied: No role assigned" });
    }

    if (!allowedRoles.includes(user.role.name)) {
      return res
        .status(403)
        .json({ error: "Access denied: Role not permitted" });
    }

    next();
  };
};

export const authorizePermissions = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    const user = req.user as User;

    if (!user?.role?.permission) {
      return res.status(403).json({ error: "Access denied: No permissions" });
    }

    const userPermissions = user.role.permission
      .map((rp) => rp.permission?.name)
      .filter(Boolean);

    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (!hasAll) {
      return res
        .status(403)
        .json({ error: "Access denied: Missing permissions" });
    }

    next();
  };
};
