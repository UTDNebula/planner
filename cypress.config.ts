import { defineConfig } from 'cypress';
import dotenv from 'dotenv';

import { prisma } from 'cypress/support/constants';
import { seedTemplates } from 'prisma/seedTemplates';
import { seedTestUser } from 'prisma/seedTestUser';

// Env variables specified in .test.env will override those specified in .env
// eg. If DATABASE_URL is defined in both, the one in .test.env will be used
dotenv.config({ path: '.env.test', override: true });

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  env: {
    SESSION_COOKIE_NAME: 'next-auth.session-token',
  },
  e2e: {
    viewportHeight: 1080,
    viewportWidth: 1920,
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on) {
      on('after:run', async () => {
        await prisma.$disconnect();
      });

      on('task', {
        'seed:db': async () => {
          return Promise.all([seedTemplates(prisma), seedTestUser(prisma)]).then(() => null);
        },
        'teardown:db': async () => {
          // This does not delete templates, templates are unchanging at the moment
          // Deleting user causes all other models to cascade
          // This could change in the future
          return prisma.user.deleteMany().then(() => null);
        },
        'reset:db': async () => {
          // See above comments for more info
          await prisma.user.deleteMany();
          await prisma.session.deleteMany();
          await seedTemplates(prisma);
          return seedTestUser(prisma);
        },
        log: (msg: string) => {
          console.log(`---${msg}`);
          return null;
        },
      });
    },
  },
});
