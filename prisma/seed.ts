// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@payperequals.com" },
    update: {},
    create: {
      name: "Admin PayPerEquals",
      email: "admin@payperequals.com",
      password: adminPassword,
      balance: 999999999,
      role: "ADMIN",
    },
  });

  // Create demo user
  const userPassword = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@payperequals.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@payperequals.com",
      password: userPassword,
      balance: 5000,
      role: "USER",
    },
  });

  // Seed transactions for demo user
  await prisma.transaction.createMany({
    data: [
      { userId: user.id, amount: 10000, type: "TOPUP", note: "Initial top up" },
      { userId: user.id, amount: -100, type: "DEDUCTION", note: "Calculation: 2 + 2" },
      { userId: user.id, amount: -100, type: "DEDUCTION", note: "Calculation: 100 * 50" },
      { userId: user.id, amount: -100, type: "DEDUCTION", note: "Calculation: 1337 / 7" },
      { userId: user.id, amount: 10000, type: "TOPUP", note: "Top up Rp10.000" },
    ],
  });

  // Seed calculations for demo user
  await prisma.calculation.createMany({
    data: [
      { userId: user.id, expression: "2 + 2", result: "4", cost: 100 },
      { userId: user.id, expression: "100 * 50", result: "5000", cost: 100 },
      { userId: user.id, expression: "1337 / 7", result: "191", cost: 100 },
      { userId: user.id, expression: "sqrt(144)", result: "12", cost: 100 },
      { userId: user.id, expression: "pi * 2^2", result: "12.566", cost: 100 },
    ],
  });

  // Suppress unused variable warning
  void admin;

  console.log("✅ Seed complete!");
  console.log("👑 Admin: admin@payperequals.com / admin123");
  console.log("👤 Demo:  demo@payperequals.com / demo123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
