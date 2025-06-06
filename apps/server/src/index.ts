import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { User, UserSchema } from "@repo/types";
import { prisma } from "@repo/db";
import dotenv from "dotenv";
import { authenticate } from "./middleware/auth";
import { authorizeRoles, authorizePermissions } from "./middleware/authorize";

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

app.get(
  "/users",
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
  async (req: express.Request, res: express.Response): Promise<void> => {
    const parsed = UserSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.errors });
      return;
    }

    const { name, email, password, roleId } = parsed.data;

    try {
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
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

app.put("/users/:id", async (req: express.Request, res: express.Response) => {
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
});

app.put(
  "/users/:id/role",
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
  authorizeRoles(["Admin"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const roles = await prisma.role.findMany();
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
  authorizeRoles(["Admin"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Role name is required" });
      return;
    }

    try {
      const newRole = await prisma.role.create({
        data: { name },
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

app.put(
  "/roles/:id",
  authenticate,
  authorizeRoles(["Admin"]),
  async (req: express.Request, res: express.Response): Promise<void> => {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ error: "Role name is required" });
      return;
    }
    try {
      const updatedRole = await prisma.role.update({
        where: { id: Number(req.params.id) },
        data: { name },
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
  authorizeRoles(["Admin"]),
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
