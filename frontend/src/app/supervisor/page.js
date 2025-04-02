"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import SupervisorNavbar from "@/components/SupervisorNavbar";
import Link from "next/link";

export default function SupervisorHomePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
        const response = await fetch(`${apiUrl}/api/projects`);
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

  const openEditModal = (project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleCardClick = (projectId) => {
    localStorage.setItem("projectId", projectId);
    router.push(`/supervisorProjectID/${projectId}`);
  };

  const handleLinkClick = (projectId) => {
    if (isClient) {
      localStorage.setItem("projectId", projectId);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { project_title, project_description, keywords } = selectedProject;

    try {
      const response = await fetch(
        `http://127.0.0.1:5001/api/projects/${selectedProject.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_title,
            project_description,
            keywords,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update project");
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, ...selectedProject }
            : project
        )
      );

      closeEditModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectClick = useCallback(
    (projectId) => {
      if (isClient) {
        localStorage.setItem("projectId", projectId);
      }
    },
    [isClient]
  );

  if (!isClient) {
    return <div>Loading...</div>;
  }

  const updateProjectStatus = async (projectId, currentStatus) => {
    const newStatus = currentStatus === "taken" ? "available" : "taken";
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
      const response = await fetch(`${apiUrl}/api/projects/${projectId}`, {
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
          project.id === projectId
            ? { ...project, project_status: newStatus }
            : project
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
        <meta
          name="description"
          content="Supervisor dashboard displaying all projects."
        />
      </Head>

      <SupervisorNavbar />

      <main className="mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center">
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
                    {/* Just like the Student page: use <Link> for the main clickable area */}
                    <Link
                      href={`/supervisorProjectID/${project.id}`}
                      passHref
                      onClick={() => handleLinkClick(project.id)}
                    >
                      <div className="cursor-pointer flex-grow">
                        <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">
                          {project.project_title}
                        </h2>
                      </div>
                    </Link>

                    {/* Actions: Edit, Mark as Taken, etc. */}
                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // prevent Link navigation
                          openEditModal(project);
                        }}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Edit
                      </button>

                      {project.project_status === "taken" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent Link navigation
                            updateProjectStatus(
                              project.id,
                              project.project_status
                            );
                          }}
                          className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Taken
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // prevent Link navigation
                            updateProjectStatus(
                              project.id,
                              project.project_status
                            );
                          }}
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
      {isEditModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="projectTitle"
                  className="block text-sm font-bold mb-2"
                >
                  Project Title
                </label>
                <input
                  id="projectTitle"
                  type="text"
                  value={selectedProject.project_title}
                  onChange={(e) =>
                    setSelectedProject((prev) => ({
                      ...prev,
                      project_title: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="projectDescription"
                  className="block text-sm font-bold mb-2"
                >
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  value={selectedProject.project_description}
                  onChange={(e) =>
                    setSelectedProject((prev) => ({
                      ...prev,
                      project_description: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="keywords"
                  className="block text-sm font-bold mb-2"
                >
                  Keywords (comma separated)
                </label>
                <input
                  id="keywords"
                  type="text"
                  value={selectedProject.keywords.join(", ")}
                  onChange={(e) =>
                    setSelectedProject((prev) => ({
                      ...prev,
                      keywords: e.target.value
                        .split(",")
                        .map((keyword) => keyword.trim()),
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Save Changes
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
