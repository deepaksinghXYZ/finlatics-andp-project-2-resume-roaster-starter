import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // 1. Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  
  // 2. Secret used to encrypt cookies and verify user sessions
  secret: process.env.NEXTAUTH_SECRET,

  // 3. Optional: Customize actions during specific life cycle hooks
  callbacks: {
    async session({ session, token }) {
      // Expose the unique user ID from the JWT token directly to the frontend session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);