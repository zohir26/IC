import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// The file should be named route.js and located in app/api/auth/[...nextauth]/

// export const metadata = {
//   title: 'Admin | Login',
// };

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        email: { label: "Email", type: "email" },
        image: { label: "Photo", type: "text" }, // Correctly define the 'image' field
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        
        // This is a placeholder for your actual user validation logic.
        // In a real application, you would look up the user in your database.
        const user = {
          id: "1",
          name: credentials.username, // Use the provided username
          email: credentials.email,
          image: credentials.image // Pass along the image
        };

        // Example validation logic
        if (
          credentials.username === "tanvir" &&
          credentials.password === "123456" &&
          credentials.email === "tanvir@gmail.com"
        ) {
          return user;
        } else {
          // If you return null, an error will be displayed to the user.
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Ensure this path points to your custom sign-in page component.
  },
  session: {
    strategy: "jwt",
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };