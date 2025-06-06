/* eslint-disable */
import { prisma } from "./prisma";

const DEFAULT_ROLES = [
  { name: "ADMIN", description: "Administrator role", isDefault: false },
  { name: "TEACHER", description: "Teacher role", isDefault: false },
  { name: "STUDENT", description: "Student role", isDefault: true },
];

const DEFAULT_PERMISSIONS = [
  { name: "CREATE_ROLE", description: "Create new roles" },
  { name: "READ_ROLE", description: "View roles" },
  { name: "UPDATE_ROLE", description: "Edit roles" },
  { name: "DELETE_ROLE", description: "Remove roles" },
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
  ADMIN: ["CREATE_ROLE", "READ_ROLE", "UPDATE_ROLE", "DELETE_ROLE"],
  TEACHER: ["READ_ROLE"],
  STUDENT: [],
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

      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          password: user.password,
          roleId: role.id,
        },
        create: {
          name: user.name,
          email: user.email,
          password: user.password,
          roleId: role.id,
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
