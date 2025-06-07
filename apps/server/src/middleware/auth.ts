import { Request, Response, NextFunction } from "express";
import { prisma } from "@repo/db";
import { verifyToken } from "@repo/common/src";
import { Permission, Role, User } from "@repo/types/index";

declare global {
  namespace Express {
    interface Request {
      user?: User & {
        role?: Role & {
          permission: {
            permission: Permission;
          }[];
        };
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = verifyToken(token || "") as { id: number; roleId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        role: {
          include: {
            permission: {
              include: {
                permission: true, // from RolePermission → Permission
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user as User & {
      role?: Role & {
        permission: {
          permission: Permission;
        }[];
      };
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
