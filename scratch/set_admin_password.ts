import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function updateAdminPassword() {
  const email = "sayababbasi806@gmail.com";
  const password = "@dmin@SAYAB123";
  const hashedPassword = await hashPassword(password);

  console.log(`Setting admin user ${email}...`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: "ADMIN",
      name: "Sayab Abbasi (Super Admin)",
    },
    create: {
      email,
      name: "Sayab Abbasi (Super Admin)",
      passwordHash: hashedPassword,
      role: "ADMIN",
      phone: "+92 316 0513841",
      isActive: true,
    },
  });

  console.log("✓ Admin user updated successfully:", {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
}

updateAdminPassword()
  .catch((e) => {
    console.error("Error setting admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
