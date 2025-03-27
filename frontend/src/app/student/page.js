"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import StudentNavbar from "@/components/StudentNavbar";
import ChatBox from "@/components/ChatBox";
import Link from "next/link";

export default function StudentHomePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    setIsClient(true);
    const storedStudentId = localStorage.getItem("userId"); 
    setStudentId(storedStudentId);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const handleProjectClick = useCallback((projectId) => {
    if (isClient) {
      localStorage.setItem('projectId', projectId);
    }
  }, [isClient]);

  const handleRequestProject = async (projectId) => {
    if (!studentId) {
      alert("Student ID not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/requests/${studentId}/${projectId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      alert(data.message); // Show success message
    } catch (err) {
      alert("An error occurred while requesting the project.");
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

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
                  <div key={project.id}>
                    <Link href={`/projectID/${project.id}`}>
                      <div
                        onClick={() => handleProjectClick(project.id)}
                        className="bg-[var(--background)] p-6 rounded-lg shadow-lg flex flex-col justify-between items-start border border-[var(--foreground)]"
                      >
                        <div>
                          <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">
                            {project.project_title}
                          </h2>
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
                    <button
                      onClick={() => handleRequestProject(project.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Request Project
                    </button>
                  </div>
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
