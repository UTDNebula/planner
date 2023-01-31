import { PrismaClient as PrismaClient1 } from '../../../prisma/generated/planner';
import { PrismaClient as PrismaClient2 } from '../../../prisma/generated/platform';

import { env } from '../../env/server.mjs';

// NOTE: Prisma doesn't have a nice way of using multiple databases in the same project
// see https://github.com/prisma/prisma/issues/2443#issuecomment-630679118 to understand the workaround we're using here

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient1 | undefined;
  // eslint-disable-next-line no-var
  var platformPrisma: PrismaClient2 | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient1({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}


export const platformPrisma = global.platformPrisma || new PrismaClient2({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (env.NODE_ENV !== 'production') {
  global.platformPrisma = platformPrisma;
}