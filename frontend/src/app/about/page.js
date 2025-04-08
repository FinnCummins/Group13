"use client";

import AboutNavbar from "@/components/AboutNavbar";

export default function AboutHomePage() {
  return (
    <div>
      <AboutNavbar />

      <main className="mt-20 px-4 max-w-4xl mx-auto">
        <section className="bg-[var(--foreground)] text-[var(--background)] pt-16 pb-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">About Us</h1>
          <p className="text-center text-lg">
            Welcome to <strong>Final Year Project Finder</strong> – Your Gateway
            to a Perfect Project!
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Our Mission
          </h2>
          <p className="leading-relaxed">
            We are dedicated to empowering final year computer science students
            by facilitating informed decisions about their capstone projects.
            Our platform doesn't just connect students to a vast array of
            project options; it tailors recommendations to match their personal
            interests and academic goals.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Our Team
          </h2>
          <p className="mb-4 leading-relaxed">
            The <strong>Final Year Project Finder</strong> team is comprised of
            passionate developers dedicated to enhancing student outcomes:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-100 p-6 rounded-lg text-center shadow-md">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">F</span>
              </div>
              <h3 className="text-xl font-bold">Finn</h3>
              <p>Project Manager</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center shadow-md">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">N&M</span>
              </div>
              <h3 className="text-xl font-bold">Nehal & Mark</h3>
              <p>Frontend Developers</p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center shadow-md">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">H&D</span>
              </div>
              <h3 className="text-xl font-bold">Hazel & Dishant</h3>
              <p>Backend Developers</p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            Our Journey
          </h2>
          <p className="leading-relaxed">
            The Final Year Project Finder was conceived from a simple yet
            profound observation: many students struggle to find projects that
            truly resonate with their personal and professional ambitions. Our
            platform has since empowered students to find their ideal projects,
            significantly enhancing their academic engagement.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 border-b border-[var(--foreground)] pb-2">
            View the Project on GitHub
          </h2>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <p className="mb-4 leading-relaxed">
              The source code, documentation, and additional resources for the
              Final Year Project Finder are available on our GitHub repository.
              Explore the codebase at:
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
              <a
                href="https://github.com/FinnCummins/Group13"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-gray-900 transition"
              >
                <span className="mr-2">🐙</span> GitHub
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>© 2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
