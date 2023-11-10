import { Account, Prisma, PrismaClient, Profile, Session, User } from '@prisma/client';

const TEST_SESSION_TOKEN = 'test-session-token';

export interface SeededUserData {
  user: User;
  profile: Profile;
  account: Account;
  session: Session;
}

export const seedTestUser = async (prisma: PrismaClient): Promise<SeededUserData> => {
  const uuid = '00000000-0000-0000-0000-000000000000';
  // Create user
  const user = await prisma.user.upsert({
    where: {
      email: 'test@user.com',
    },
    update: {
      id: uuid,
    },
    create: {
      id: uuid,
      email: 'test@user.com',
      onboardingComplete: true,
      seenHomeOnboardingModal: true,
      seenPlanOnboardingModal: true,
    },
  });

  // Create profile
  const [profile, account, session] = await Promise.all([
    // Create profile
    prisma.profile.upsert({
      where: {
        userId: user.id,
      },
      update: {
        id: uuid,
      },
      create: {
        id: uuid,
        name: 'Test User',
        startYear: 2021,
        startSemester: 's',
        endYear: 2026,
        endSemester: 'f',
        userId: user.id,
      },
    }),
    // Create account
    prisma.account.upsert({
      where: {
        id: uuid,
      },
      update: {},
      create: {
        id: uuid,
        type: 'test_bypass',
        provider: 'test_bypass',
        providerAccountId: 'test123_bypass',
        userId: user.id,
      },
    }),
    // Generate infinite session
    generateInfiniteSessionToken(prisma, user.id),
  ]);

  return { user, profile, account, session };
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
