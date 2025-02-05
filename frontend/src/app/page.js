'use client';
import Head from 'next/head';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Final Year Project Finder</title>
        <meta
          name="description"
          content="Helping final year CS students find and research engaging capstone projects."
        />
      </Head>

      <Navbar />

      {/* Main*/}
      <main className="mt-20 text-center px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <h1 className="text-6xl font-bold mb-4">Welcome to Final Year Project Finder</h1>
          <p className="text-lg mb-8">
            Find, research, and select the perfect final year project that aligns with your interests.
            Our built-in chatbot helps you discover projects.
          </p>
        </section>


      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p> 2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
