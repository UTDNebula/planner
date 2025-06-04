import { PrismaClient } from '../../../prisma/generated/platform';
import { env } from '../../env/server.mjs';

declare global {
  // eslint-disable-next-line no-var
  var platformPrisma: PrismaClient | undefined;
}
export const platformPrisma =
  global.platformPrisma ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.platformPrisma = platformPrisma;
}
