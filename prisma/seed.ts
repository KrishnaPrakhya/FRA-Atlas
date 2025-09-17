import { PrismaClient, UserRole, ClaimStatus, ClaimType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fra-atlas.gov' },
    update: {},
    create: {
      email: 'admin@fra-atlas.gov',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  // Create forest officer
  const officerPassword = await bcrypt.hash('officer123', 10);
  const officer = await prisma.user.upsert({
    where: { email: 'officer@fra-atlas.gov' },
    update: {},
    create: {
      email: 'officer@fra-atlas.gov',
      name: 'Forest Officer',
      password: officerPassword,
      role: UserRole.OFFICIAL,
    },
  });

  // Create claimant
  const claimantPassword = await bcrypt.hash('claimant123', 10);
  const claimant = await prisma.user.upsert({
    where: { email: 'claimant@example.com' },
    update: {},
    create: {
      email: 'claimant@example.com',
      name: 'Sample Claimant',
      password: claimantPassword,
      role: UserRole.CLAIMANT,
    },
  });

  // Create sample claims
  const statuses = [ClaimStatus.SUBMITTED, ClaimStatus.UNDER_REVIEW, ClaimStatus.APPROVED, ClaimStatus.REJECTED];
  const districts = ['Wayanad', 'Idukki', 'Palakkad', 'Thrissur', 'Kannur'];
  const states = ['Kerala', 'Tamil Nadu', 'Karnataka'];
  const claimTypes = [ClaimType.INDIVIDUAL, ClaimType.COMMUNITY];

  for (let i = 1; i <= 10; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const claimType = claimTypes[Math.floor(Math.random() * claimTypes.length)];

    await prisma.forestRightsClaim.create({
      data: {
        claimNumber: `FRA-${2023}-${i.toString().padStart(4, '0')}`,
        claimantName: `Claimant ${i}`,
        villageName: `Village ${i}`,
        district,
        state,
        forestAreaHectares: Math.random() * 10 + 1,
        claimType,
        status,
        userId: claimant.id,
      },
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });