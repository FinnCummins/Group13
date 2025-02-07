'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import LoginNavbar from '@/components/LoginNavbar';
import Link from 'next/link';

export default function Login() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; 
  }

  return (
    <div>
      <Head>
        <title>Login - Final Year Project Finder</title>
        <meta name="description" content="Login to access your account and manage your projects." />
      </Head>

      <LoginNavbar></LoginNavbar>
      
      <main className="mt-20 text-center px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <h1 className="text-6xl font-bold mb-4">Login</h1>
          <p className="text-lg mb-8">
            Please enter your credentials to log in.
          </p>
          <form className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
            <div className="mb-4">
              <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                Username
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="Username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Log In
              </button>
            </div>
          </form>
          <p className="mt-4">
            Don't have an account? <Link href="/signup" className="text-black hover:text-gray-700">Sign up!</Link>
          </p>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p> 2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}