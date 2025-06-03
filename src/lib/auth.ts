/* eslint-disable no-param-reassign */
import { compare } from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../../database/drizzle';
import { users } from '../../database/schema';

type UserType = {
  id: string;
  login: string;
  email: string;
  role: string;
};

declare module 'next-auth' {
  /* eslint-disable-next-line */
  interface Session extends UserType {}
  /* eslint-disable-next-line */
  interface User extends UserType {}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(or(eq(users.email, credentials.identifier.toString()), eq(users.login, credentials.identifier.toString())))
          .limit(1);

        if (user.length === 0) return null;

        const isPasswordValid = await compare(credentials.password.toString(), user[0].password!);
        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          login: user[0].login.toString(),
          email: user[0].email.toString(),
          role: user[0].role.toString(),
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.login = user.login;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.login = token.login as string;
      session.user.email = token.email as string;
      session.user.role = token.role as string;

      return session;
    },
  },
});
