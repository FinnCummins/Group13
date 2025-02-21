"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import SupervisorNavbar from "@/components/SupervisorNavbar";

export default function SupervisorHomePage() {
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

  const updateProjectStatus = async (projectId, currentStatus) => {
    const newStatus = currentStatus === "taken" ? "available" : "taken";
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/projects/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project_status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update project status");
      }
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, project_status: newStatus } : project
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Head>
        <title>Supervisor Dashboard - Final Year Project Finder</title>
        <meta name="description" content="Supervisor dashboard displaying all projects." />
      </Head>

      <SupervisorNavbar />

      <main className="mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center text-[var(--background)]">
              Supervisor Dashboard
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
                  <div
                    key={project.id}
                    className="bg-[var(--background)] p-6 rounded-lg shadow-lg flex justify-between items-center border border-[var(--foreground)]"
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
                      {project.project_status === "taken" ? (
                        <button
                          onClick={() =>
                            updateProjectStatus(project.id, project.project_status)
                          }
                          className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Taken
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            updateProjectStatus(project.id, project.project_status)
                          }
                          className="bg-[var(--foreground)] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Mark as Taken
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
