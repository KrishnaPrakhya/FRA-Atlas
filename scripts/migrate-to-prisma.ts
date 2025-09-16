import { prisma } from "../lib/prisma"

async function main() {
  console.log("Starting Prisma migration...")

  // Create sample users
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@fra.gov.in" },
    update: {},
    create: {
      email: "admin@fra.gov.in",
      password: "hashed_password_here", // In real app, hash this
      name: "System Administrator",
      role: "ADMIN",
    },
  })

  const officialUser = await prisma.user.upsert({
    where: { email: "official@fra.gov.in" },
    update: {},
    create: {
      email: "official@fra.gov.in",
      password: "hashed_password_here",
      name: "Forest Official",
      role: "OFFICIAL",
    },
  })

  // Create sample claims
  const sampleClaim = await prisma.forestRightsClaim.create({
    data: {
      claimNumber: "FRA-2024-001",
      claimantName: "Ramesh Kumar",
      villageName: "Jharia",
      district: "Dhanbad",
      state: "Jharkhand",
      forestAreaHectares: 2.5,
      claimType: "INDIVIDUAL",
      status: "UNDER_REVIEW",
      userId: adminUser.id,
    },
  })

  console.log("Prisma migration completed successfully!")
  console.log({ adminUser, officialUser, sampleClaim })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
