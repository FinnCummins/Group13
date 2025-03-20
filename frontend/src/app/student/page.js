"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import StudentNavbar from "@/components/StudentNavbar";
import ChatBox from "@/components/ChatBox";
import Link from "next/link";

export default function StudentHomePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("http://127.0.0.1:5001/api/projects");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data || []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    localStorage.setItem('projectId', projectId);
  };

  return (
    <div>
      <Head>
        <title>Student Dashboard - Final Year Project Finder</title>
        <meta name="description" content="Student dashboard displaying all projects." />
      </Head>

      <StudentNavbar />

      <main className="mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center text-[var(--background)]">
              Student Dashboard
            </h1>

            {error && (
              <p className="text-red-500 mb-4 text-center">
                Error loading projects: {error}
              </p>
            )}

            {projects.length === 0 ? (
              <p className="text-center">No projects available</p>
            ) : (
              <div className="space-y-8">
                {projects.map((project) => (
                  <Link href={`/projectID/${project.id}`} key={project.id}>
                    <div
                      onClick={() => handleProjectClick(project.id)}
                      className="bg-[var(--background)] p-6 rounded-lg shadow-lg flex flex-col justify-between items-start border border-[var(--foreground)]"
                    >
                      <div>
                        <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">
                          {project.project_title}
                        </h2>
                        <p className="text-[var(--text)] mb-4">
                          {project.project_description}
                        </p>
                        {project.keywords && project.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="bg-[var(--foreground)]/20 text-[var(--foreground)] text-sm font-medium px-3 py-1 rounded-full"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded font-bold ${
                            project.project_status.toLowerCase() === "taken"
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {project.project_status.toLowerCase() === "taken" ? "Taken" : "Available"}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <ChatBox />
        </section>
        
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
