import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
        image: { label: "Photo", type: "text" },
      },
      async authorize(credentials) {
        console.log('NextAuth: Attempting to authorize:', credentials);
        
        if (!credentials) {
          console.log('NextAuth: No credentials provided');
          return null;
        }

        // Validate credentials
        if (
          credentials.username === "tanvir" &&
          credentials.password === "123456" &&
          credentials.email === "tanvir@gmail.com"
        ) {
          console.log('NextAuth: Credentials valid, creating user session');
          const user = {
            id: "1",
            name: credentials.username,
            email: credentials.email,
            image: credentials.image || '/default-avatar.png'
          };
          return user;
        } else {
          console.log('NextAuth: Invalid credentials');
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Make sure this matches your signin page path
    error: "/signin?error=true", // Redirect errors to signin page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };