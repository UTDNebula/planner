// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { PrismaClient } from '@prisma/client';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import EmailProvider from 'next-auth/providers/email';

import { env } from '@/env/server.mjs';
import { prisma } from '@server/db/client';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore ignore-next-line
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID || '',
      clientSecret: env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        // profile type can be found here: https://next-auth.js.org/providers/discord
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID || '',
      clientSecret: env.DISCORD_CLIENT_SECRET || '',
      profile(profile) {
        // profile type can be found here: https://next-auth.js.org/providers/discord
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
        };
      },
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID || '',
      clientSecret: env.FACEBOOK_CLIENT_SECRET || '',
      profile(profile) {
        // profile type can be found here: https://next-auth.js.org/providers/discord
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
    EmailProvider({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
    }),
    // ...add more providers here
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    newUser: '/app/onboarding', // TODO: Redirect to signup page
  },
};
export default NextAuth(authOptions);
