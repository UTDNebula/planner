import { PrismaClient } from '@prisma/client';

import { env } from '../../env/server.mjs';

// NOTE: Prisma doesn't have a nice way of using multiple databases in the same project
// see https://github.com/prisma/prisma/issues/2443#issuecomment-630679118 to understand the workaround we're using here

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}
