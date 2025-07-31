"use client";
import { signIn, getSession } from "next-auth/react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting signin with:', { username, email, password: '***' });

      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
        email,
        image: photo || "/default-user.png",
      });

      console.log('SignIn result:', result);

      if (result?.ok) {
        // Get the session to verify admin status
        const session = await getSession();
        console.log('Session after signin:', session);

        const isAdmin = session?.user?.email === "tanvir@gmail.com";
        console.log('Is admin:', isAdmin);

        Swal.fire({
          title: `Welcome, ${username}!`,
          imageUrl: photo || "/default-user.png",
          imageWidth: 80,
          imageHeight: 80,
          imageAlt: "User Photo",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        setTimeout(() => {
          if (isAdmin) {
            console.log('Redirecting to dashboard');
            router.push("/dashboard");
          } else {
            console.log('Redirecting to homepage');
            router.push("/");
          }
        }, 1500);
      } else {
        console.error('SignIn failed:', result?.error);
        Swal.fire({
          title: "Login Failed",
          text: result?.error || "Invalid credentials. Please check your username, email, and password.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error('SignIn error:', error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleSignIn}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-6">Sign In</h2>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <input
            type="url"
            value={photo}
            onChange={(e) => setPhoto(e.target.value)}
            placeholder="Photo URL (optional)"
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </div>

        {/* Admin Credentials Helper */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Admin Access:</strong><br />
            Username: tanvir<br />
            Email: tanvir@gmail.com<br />
            Password: 123456
          </p>
        </div>
      </form>
    </div>
  );
}