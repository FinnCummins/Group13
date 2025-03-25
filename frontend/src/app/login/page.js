"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import LoginNavbar from "@/components/LoginNavbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isClient, setIsClient] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleLogin = async (url) => {
    setError("");
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userId", data.id);
        if (url.includes("students")) {
          router.push("/student");
        } else if (url.includes("supervisors")) {
          router.push("/supervisor");
        }
      } else {
        if (data.error === "Invalid email") {
          setError("The email address is not registered");
        } else if (data.error === "Invalid password") {
          setError("Incorrect password. Please try again.");
        } else {
          setError(data.error || "Login failed");
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };
  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  return (
    <div>
      <Head>
        <title>Login - Final Year Project Finder</title>
        <meta
          name="description"
          content="Login to access your account and manage your projects."
        />
      </Head>

      <LoginNavbar></LoginNavbar>

      <main className="mt-20 text-center px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <h1 className="text-6xl font-bold mb-4">Login</h1>
          <p className="text-lg mb-8">
            Please enter your credentials to log in.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <form
            className="max-w-md mx-auto bg-white p-8 rounded shadow-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="janedoe@tcd.ie"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
              />
              {touched.email && !email && (
                <p className="text-red-500 text-xs italic mt-1">
                  Email is required
                </p>
              )}
              {touched.email && email && !isEmailValid() && (
                <p className="text-red-500 text-xs italic mt-1">
                  Please enter a valid email address
                </p>
              )}
            </div>
            <div className="mb-6">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
              />
              {touched.password && !password && (
                <p className="text-red-500 text-xs italic">
                  Password is required
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() =>
                  handleLogin("http://127.0.0.1:5001/api/students/login")
                }
              >
                Log In as Student
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() =>
                  handleLogin("http://127.0.0.1:5001/api/supervisors/login")
                }
              >
                Log In as Supervisor
              </button>
            </div>
          </form>
          <p className="mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-black hover:text-gray-700">
              Sign up!
            </Link>
          </p>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p> 2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
