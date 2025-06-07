/* eslint-disable */
import { prisma } from "./prisma";
import { hashedPassword, issueToken } from "@repo/common/src/";

const DEFAULT_ROLES = [
  { name: "ADMIN", description: "Administrator role", isDefault: false },
  { name: "TEACHER", description: "Teacher role", isDefault: false },
  { name: "STUDENT", description: "Student role", isDefault: true },
];

const DEFAULT_PERMISSIONS = [
  { name: "CREATE_ROLES", description: "Create new roles" },
  { name: "READ_ROLES", description: "View roles" },
  { name: "UPDATE_ROLES", description: "Edit roles" },
  { name: "DELETE_ROLES", description: "Remove roles" },
  { name: "READ_USERS", description: "View users" },
  { name: "CREATE_USERS", description: "Create new users" },
  { name: "UPDATE_USERS", description: "Edit users" },
  { name: "DELETE_USERS", description: "Remove users" },
];

const DEFAULT_USERS = [
  {
    name: "Tim Apple",
    email: "tim@apple.com",
    password: "password",
    roleName: "ADMIN",
  },
  {
    name: "Jin Apple",
    email: "jin@apple.com",
    password: "password",
    roleName: "TEACHER",
  },
  {
    name: "Psh Apple",
    email: "psh@apple.com",
    password: "password",
    roleName: "STUDENT",
  },
];

const ROLE_PERMISSIONS_MAP: Record<string, string[]> = {
  ADMIN: [
    "READ_USERS",
    "CREATE_USERS",
    "UPDATE_USERS",
    "DELETE_USERS",
    "CREATE_ROLES",
    "READ_ROLES",
    "UPDATE_ROLES",
    "DELETE_ROLES",
  ],
  TEACHER: ["READ_USERS", "CREATE_USERS", "UPDATE_USERS", "READ_ROLES"],
  STUDENT: ["READ_USERS"],
};

(async () => {
  try {
    for (const role of DEFAULT_ROLES) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
    }

    for (const perm of DEFAULT_PERMISSIONS) {
      await prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      });
    }

    for (const [roleName, permissionNames] of Object.entries(
      ROLE_PERMISSIONS_MAP
    )) {
      const role = await prisma.role.findUnique({ where: { name: roleName } });
      if (!role) throw new Error(`Role "${roleName}" not found`);

      for (const permName of permissionNames) {
        const permission = await prisma.permission.findUnique({
          where: { name: permName },
        });
        if (!permission) throw new Error(`Permission "${permName}" not found`);

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        });
      }
    }

    for (const user of DEFAULT_USERS) {
      const role = await prisma.role.findUnique({
        where: { name: user.roleName },
      });

      if (!role) {
        throw new Error(`Role "${user.roleName}" not found`);
      }
      const hashed = await hashedPassword(user.password);

      const upsertedUser = await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          password: hashed,
          roleId: role.id,
        },
        create: {
          name: user.name,
          email: user.email,
          password: hashed,
          roleId: role.id,
        },
      });

      await prisma.session.create({
        data: {
          token: issueToken(upsertedUser.id, role.id.toString()),
          userId: upsertedUser.id,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
        },
      });
    }

    console.log("✅ Default users seeded.");
  } catch (error) {
    console.error("❌ Seeding users failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
