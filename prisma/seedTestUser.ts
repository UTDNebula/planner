import { Prisma, PrismaClient, Session } from '@prisma/client';

const TEST_SESSION_TOKEN = 'test-session-token';

export const seedTestUser = async (prisma: PrismaClient) => {
  // Create user
  const user = await prisma.user.create({
    data: {
      email: 'test@user.com',
    },
  });

  // Create account
  const account = await prisma.account.create({
    data: {
      type: 'test',
      provider: 'test',
      providerAccountId: 'test123',
      userId: user.id,
    },
  });

  // Generate infinite session
  const infiniteSession = await generateInfiniteSessionToken(prisma, user.id);

  return { user, account, infiniteSession };
};

const generateInfiniteSessionToken = async (
  prisma: PrismaClient,
  userId: string,
): Promise<Prisma.Prisma__SessionClient<Session, never>> => {
  const expirationDate = new Date();
  expirationDate.setFullYear(new Date().getFullYear() + 1000);

  return prisma.session.upsert({
    where: {
      sessionToken: TEST_SESSION_TOKEN,
      userId,
    },
    update: { expires: expirationDate },
    create: {
      expires: expirationDate,
      sessionToken: TEST_SESSION_TOKEN,
      userId,
    },
  });
};
