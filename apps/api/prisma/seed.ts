import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed PayScale (immutable)
  const scales = [
    { level: 1, annualAmountBHD: '44245.750' },
    { level: 2, annualAmountBHD: '48670.320' },
    { level: 3, annualAmountBHD: '53537.350' },
    { level: 4, annualAmountBHD: '58891.090' },
    { level: 5, annualAmountBHD: '64780.200' },
    { level: 6, annualAmountBHD: '71258.220' },
    { level: 7, annualAmountBHD: '80946.950' },
    { level: 8, annualAmountBHD: '96336.340' },
  ];
  for (const s of scales) {
    await prisma.payScale.upsert({
      where: { level: s.level },
      update: {},
      create: s,
    });
  }
  // Default admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      role: 'Admin',
      passwordHash: '$argon2id$v=19$m=19456,t=2,p=1$7b3JcWw4N1hC1o4X3gq3xQ$N2P7H8QfX1m6mdB4zWZ4gQ', // placeholder
    },
  });
  console.log('Seeded pay scales and default admin.');
}

main().finally(() => prisma.$disconnect());
