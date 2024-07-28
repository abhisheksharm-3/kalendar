// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.sub!,
        accessToken: token.accessToken,
      };
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token!;
      }
      return token;
    },
  },
});
