"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import SupervisorNavbar from "@/components/SupervisorNavbar";
import Link from "next/link";

export default function SupervisorHomePage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const supervisorId = localStorage.getItem("supervisorId");
        if (!supervisorId) {
          setError("No supervisor ID found in localStorage.");
          return;
        }
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
        const response = await fetch(
          `${apiUrl}/api/projects?supervisor_ids=${supervisorId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data || []);
        setFilteredProjects(data || []);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchProjects();
  }, []);

  useEffect(() => {
    let result = [...projects];

    if (statusFilter !== "all") {
      result = result.filter(
        (project) => project.project_status.toLowerCase() === statusFilter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.project_title.toLowerCase().includes(query) ||
          (project.project_description &&
            project.project_description.toLowerCase().includes(query)) ||
          (project.keywords &&
            project.keywords.some((keyword) =>
              keyword.toLowerCase().includes(query)
            ))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.project_title.localeCompare(b.project_title)
          : b.project_title.localeCompare(a.project_title);
      } else if (sortBy === "status") {
        return sortDirection === "asc"
          ? a.project_status.localeCompare(b.project_status)
          : b.project_status.localeCompare(a.project_status);
      }
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, statusFilter, searchQuery, sortBy, sortDirection]);

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

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { project_title, project_description, keywords } = selectedProject;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(
        `${apiUrl}/api/projects/${selectedProject.id}`,
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
    const newStatus =
      currentStatus.toLowerCase() === "taken" ? "available" : "taken";
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
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
            <div className="bg-[var(--background)] p-4 rounded-lg shadow-lg mb-6 flex flex-wrap gap-4 items-center">
              <div className="flex items-center">
                <span className="text-[var(--foreground)] mr-2">🔍</span>
                <select
                  className="p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Projects</option>
                  <option value="available">Available</option>
                  <option value="taken">Taken</option>
                </select>
              </div>

              <div className="flex items-center flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by title, description or keywords..."
                    className="w-full p-2 pl-10 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    🔎
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[var(--text)]">Sort by:</span>
                <select
                  className="p-2 border rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-[var(--foreground)]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="title">Project Title</option>
                  <option value="status">Status</option>
                </select>

                <button
                  onClick={toggleSortDirection}
                  className="p-2 border rounded-md bg-white text-black focus:outline-none hover:bg-gray-100"
                >
                  {sortDirection === "desc" ? "↓" : "↑"}
                </button>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <p className="text-center">No projects available</p>
            ) : (
              <div className="space-y-8">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[var(--background)] p-6 rounded-lg shadow-lg flex justify-between items-center border border-[var(--foreground)]"
                  >
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

                    <div className="flex items-center space-x-2 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(project);
                        }}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Edit
                      </button>

                      {project.project_status.toLowerCase() === "taken" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateProjectStatus(
                              project.id,
                              project.project_status
                            );
                          }}
                          className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Mark as Available
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
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
