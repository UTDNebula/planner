import { PrismaClient } from '@prisma/client';

import { seedTemplates } from './seedTemplates';

const prisma = new PrismaClient();

seedTemplates(prisma)
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
