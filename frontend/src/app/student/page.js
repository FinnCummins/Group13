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
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); 
  const [selectedProject, setSelectedProject] = useState(null); 
  const [message, setMessage] = useState(""); 

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

  const openRequestModal = (project) => {
    setSelectedProject(project);
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setSelectedProject(null);
    setMessage(""); // Clear the message input
  };

  const handleProjectClick = useCallback((projectId) => {
    if (isClient) {
      localStorage.setItem('projectId', projectId);
    }
  }, [isClient]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      alert("Student ID not found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/requests/${studentId}/${selectedProject.id}`,
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
      closeRequestModal();
    } catch (err) {
      alert(err.message || "An error occurred while requesting the project.");
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
                      onClick={() => openRequestModal(project)}
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

      {isRequestModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Request Project</h2>
            <form onSubmit={handleRequestSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-bold mb-2"
                >
                  Optional Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message for the supervisor..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
