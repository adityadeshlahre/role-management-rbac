/* eslint-disable */
import { prisma } from "./prisma";

const DEFAULT_ROLES = [
  { name: "Admin", description: "Administrator role", isDefault: false },
  { name: "Teacher", description: "Teacher role", isDefault: false },
  { name: "Student", description: "Student role", isDefault: true },
];

const DEFAULT_USERS = [
  {
    name: "Tim Apple",
    email: "tim@apple.com",
    password: "password",
    roleName: "Admin",
  },
  {
    name: "Jin Apple",
    email: "jin@apple.com",
    password: "password",
    roleName: "Teacher",
  },
  {
    name: "Psh Apple",
    email: "psh@apple.com",
    password: "password",
    roleName: "Student",
  },
];

(async () => {
  try {
    for (const role of DEFAULT_ROLES) {
      await prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      });
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
