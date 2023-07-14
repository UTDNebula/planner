import { Account, Prisma, PrismaClient, Profile, Session, User } from '@prisma/client';

const TEST_SESSION_TOKEN = 'test-session-token';

export interface SeededUserData {
  user: User;
  profile: Profile;
  account: Account;
  session: Session;
}

export const seedTestUser = async (prisma: PrismaClient): Promise<SeededUserData> => {
  // Create user
  const user = await prisma.user.create({
    data: {
      email: 'test@user.com',
      onboardingComplete: true,
      seenHomeOnboardingModal: true,
      seenPlanOnboardingModal: true,
    },
  });

  // Create profile
  const [profile, account, session] = await Promise.all([
    // Create profile
    prisma.profile.create({
      data: {
        name: 'Test User',
        startSemester: { semester: 'f', year: 2021 },
        endSemester: { semester: 's', year: 2026 },
        userId: user.id,
      },
    }),
    // Create account
    prisma.account.create({
      data: {
        type: 'test',
        provider: 'test',
        providerAccountId: 'test123',
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
