import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { CreateUserSchema, UserSchema } from "@repo/types";
import { prisma } from "@repo/db";
import dotenv from "dotenv";
import { authenticate } from "./middleware/auth";
import { authorizeRoles, authorizePermissions } from "./middleware/authorize";
import {
  comparePassword,
  hashedPassword,
  issueToken,
} from "../../../packages/common/src/lib/utils";

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

app.get(
  "/",
  async (req: express.Request, res: express.Response): Promise<void> => {
    res.status(200).send({ message: "Hello World!" });
  }
);

app.post(
  "/login",
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
        include: {
          sessions: true,
          role: {
            include: {
              permission: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });

      if (!user || !(await comparePassword(password, user.password))) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const token = issueToken(user.id, user.role.id.toString());

      await prisma.session.create({
        data: {
          token,
          userId: user.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      res.status(200).json({
        token: user.sessions?.[0]?.token || null,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          permissions: user.role.permission.map((rp) => rp.permission.name),
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  }
);

app.get(
  "/me",
  authenticate,
  (req: express.Request, res: express.Response): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permission.map((rp) => rp.permission.name),
    });
  }
);

app.get(
  "/users",
  authenticate,
  authorizeRoles(["ADMIN", "TEACHER", "STUDENT"]),
  authorizePermissions(["READ_USERS"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        include: {
          role: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: error });
    }
  }
);

app.get(
  "/users/:id",
  authenticate,
  authorizeRoles(["ADMIN", "TEACHER"]),
  authorizePermissions(["READ_USERS"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const users = await prisma.user.findMany({
        where: { id: Number(req.params.id) },
        include: {
          role: true,
        },
      });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: error });
    }
  }
);

app.post(
  "/users",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["CREATE_USERS"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    const { name, email, password, roleId } = parsed.data;

    const hashedPass = await hashedPassword(password);

    try {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: hashedPass,
          roleId: roleId,
        },
      });

      res.status(201).json({ user: newUser });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the user." });
    }
  }
);

app.put(
  "/users/:id",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["UPDATE_USERS"]),
  async (req: express.Request, res: express.Response) => {
    const parsed = UserSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    const { name, email, password } = parsed.data;

    try {
      const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: { name, email, password },
        include: { role: true },
      });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Failed to update user" });
    }
  }
);

app.put(
  "/users/:id/role",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["READ_ROLES, UPDATE_ROLES"]),
  async (req: express.Request, res: express.Response) => {
    const { roleId } = req.body;
    if (!roleId) {
      res.status(400).json({ error: "Role ID is required" });
      return;
    }
    try {
      const user = await prisma.user.update({
        where: { id: Number(req.params.id) },
        data: { roleId: roleId },
        include: { role: true },
      });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Failed to update user role" });
    }
  }
);

app.delete(
  "/users/:id",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["DELETE_USERS"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const user = await prisma.user.delete({
        where: { id: Number(req.params.id) },
      });
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: "Failed to delete user" });
    }
  }
);

app.get(
  "/roles",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["READ_ROLES"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const roles = await prisma.role.findMany({
        include: {
          permission: {
            include: {
              permission: true, // from RolePermission → Permission
            },
          },
        },
      });
      res.status(200).json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ error: error });
    }
  }
);

app.post(
  "/roles",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["CREATE_ROLES"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { name, description } = req.body;

    if (!name) {
      res.status(400).json({ error: "Role name is required" });
      return;
    }

    try {
      const newRole = await prisma.role.create({
        data: { name, description },
      });
      res.status(201).json(newRole);
    } catch (error) {
      console.error("Error creating role:", error);
      res
        .status(500)
        .json({ error: "An error occurred while creating the role." });
    }
  }
);

app.get(
  "/roles/:id",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["READ_ROLES"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const role = await prisma.role.findUnique({
        where: { id: Number(req.params.id) },
        include: {
          permission: {
            include: {
              permission: true, // from RolePermission → Permission
            },
          },
        },
      });
      if (!role) {
        res.status(404).json({ error: "Role not found" });
        return;
      }
      res.status(200).json(role);
    } catch (error) {
      console.error("Error fetching role:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the role." });
    }
  }
);

app.put(
  "/roles/:id",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["UPDATE_ROLES"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { name, description, permissions } = req.body;

    if (!Array.isArray(permissions)) {
      res.status(400).json({ error: "Permissions are required" });
      return;
    }

    const roleId = Number(req.params.id);
    const sanitized = permissions.map((p: string) => p.trim().toUpperCase());

    try {
      let existing = await prisma.permission.findMany({
        where: { name: { in: sanitized } },
      });
      const existingNames = existing.map((p) => p.name);

      const missing = sanitized.filter((p) => !existingNames.includes(p));
      if (missing.length) {
        await prisma.permission.createMany({
          data: missing.map((name) => ({ name })),
          skipDuplicates: true,
        });
        existing = await prisma.permission.findMany({
          where: { name: { in: sanitized } },
        });
      }

      await prisma.rolePermission.deleteMany({ where: { roleId } });
      await prisma.rolePermission.createMany({
        data: existing.map((perm) => ({ roleId, permissionId: perm.id })),
      });

      const updatedRole = await prisma.role.update({
        where: { id: roleId },
        data: { ...(name && { name }), ...(description && { description }) },
        include: {
          permission: { include: { permission: true } },
        },
      });
      res.status(200).json(updatedRole);
    } catch (error) {
      console.error("Error updating role:", error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the role." });
    }
  }
);

app.delete(
  "/roles/:id",
  authenticate,
  authorizeRoles(["ADMIN"]),
  authorizePermissions(["DELETE_ROLES"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const deletedRole = await prisma.role.delete({
        where: { id: Number(req.params.id) },
      });
      res.status(200).json(deletedRole);
    } catch (error) {
      console.error("Error deleting role:", error);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the role." });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
