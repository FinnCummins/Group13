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
        <section className="bg-[var(--foreground)] text-[var(--background)] pt-16 pb-8">
          <h1 className="text-6xl font-bold mb-4">Welcome to Final Year Project Finder</h1>
          <p className="text-lg">
            Explore projects that align with your interests!
          </p>
        </section>

        <section
  className="w-full h-[400px] bg-cover bg-center"
  style={{
    backgroundImage: "url('/trinity_background.jpg')", // Correct path to the image
  }}
>
  <div className="h-full flex items-center justify-center">
    <h2 className="text-4xl font-bold text-white">
      Find the project that suits you best !
    </h2>
  </div>
</section>


      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p> 2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
