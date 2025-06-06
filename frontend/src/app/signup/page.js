"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import LoginNavbar from "@/components/LoginNavbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [isClient, setIsClient] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState([]);
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

  const handlePreferenceChange = (event) => {
    const value = event.target.value;
    setPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((pref) => pref !== value)
        : [...prev, value]
    );
  };
  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const handleSignup = async (endpoint) => {
    setTouched({
      email: true,
      password: true,
    });
    setError("");
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          interests: preferences,
        }),
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("Response is not JSON:", text);
        setError("An error occurred. Please try again.");
        return;
      }

      console.log("Response:", data);

      if (response.ok) {
        localStorage.setItem(
          "userType",
          endpoint.includes("students") ? "student" : "supervisor"
        );

        if (endpoint.includes("students")) {
          localStorage.setItem("studentId", data.id);
        } else {
          localStorage.setItem("supervisorId", data.id);
        }
        if (endpoint.includes("students")) {
          router.push("/student");
        } else if (endpoint.includes("supervisors")) {
          router.push("/supervisor");
        }
      } else {
        setError(data.error || "Sign up failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Head>
        <title>Sign Up - Final Year Project Finder</title>
        <meta
          name="description"
          content="Create an account to manage your projects."
        />
      </Head>

      <LoginNavbar></LoginNavbar>

      <main className="mt-20 text-center px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <h1 className="text-6xl font-bold mb-4">Sign Up</h1>
          <p className="text-lg mb-8">
            Create an account to manage your projects.
          </p>
          {error && <p className="text-red-500">{error}</p>}
          <form
            className="max-w-md mx-auto bg-white p-8 rounded shadow-md"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="firstName"
                type="firstName"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="lastName"
                type="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${
                  touched.email && (!email || !isEmailValid())
                    ? "border-red-500"
                    : ""
                }`}
                id="email"
                type="email"
                placeholder="janed@tcd.ie"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                required
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
                Password<span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline
                ${touched.password && !password ? "border-red-500" : ""}`}
                id="password"
                type="password"
                placeholder="******************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                onBlur={() => handleBlur("password")}
              />
              {!password && touched.password && (
                <p className="text-red-500 text-xs italic">
                  Please enter a valid password
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="preferences"
              >
                Preferences
              </label>
              <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <label className="block">
                  <input
                    type="checkbox"
                    value="machine-learning"
                    checked={preferences.includes("machine-learning")}
                    onChange={handlePreferenceChange}
                  />
                  Machine Learning
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    value="ai"
                    checked={preferences.includes("ai")}
                    onChange={handlePreferenceChange}
                  />
                  AI
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    value="networks"
                    checked={preferences.includes("networks")}
                    onChange={handlePreferenceChange}
                  />
                  Networks
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    value="vision"
                    checked={preferences.includes("vision")}
                    onChange={handlePreferenceChange}
                  />
                  Vision
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    value="teaching-and-learning"
                    checked={preferences.includes("teaching-and-learning")}
                    onChange={handlePreferenceChange}
                  />
                  Teaching and Learning
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    value="graphics"
                    checked={preferences.includes("graphics")}
                    onChange={handlePreferenceChange}
                  />
                  Graphics
                </label>
                {/* Add more options as needed */}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => handleSignup("/api/students")}
              >
                Sign Up as Student
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                onClick={() => handleSignup("/api/supervisors")}
              >
                Sign Up as Staff
              </button>
            </div>
          </form>
          <p className="mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-black hover:text-gray-700">
              Log in!
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
