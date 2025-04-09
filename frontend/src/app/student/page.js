"use client";

import { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import StudentNavbar from "@/components/StudentNavbar";
import ChatBox from "@/components/ChatBox";
import Link from "next/link";

export default function StudentHomePage() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [studentId, setStudentId] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setIsClient(true);
    const storedStudentId = localStorage.getItem("studentId");

    if (storedStudentId) {
      setStudentId(storedStudentId);
    } else {
      setError("Student ID not found. Please log in.");
    }
  }, []);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
        const response = await fetch(`${apiUrl}/api/projects`);
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
          project.supervisor_name?.toLowerCase().includes(query) ||
          project.project_description?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.project_title.localeCompare(b.project_title)
          : b.project_title.localeCompare(a.project_title);
      } else if (sortBy === "supervisor") {
        return sortDirection === "asc"
          ? (a.supervisor_name || "").localeCompare(b.supervisor_name || "")
          : (b.supervisor_name || "").localeCompare(a.supervisor_name || "");
      }
      return 0;
    });

    setFilteredProjects(result);
  }, [projects, statusFilter, searchQuery, sortBy, sortDirection]);

  const openRequestModal = (project) => {
    setSelectedProject(project);
    setIsRequestModalOpen(true);
  };

  const closeRequestModal = () => {
    setIsRequestModalOpen(false);
    setSelectedProject(null);
    setMessage(""); // Clear the message input
  };

  const handleProjectClick = useCallback(
    (projectId) => {
      if (isClient) {
        localStorage.setItem("projectId", projectId);
      }
    },
    [isClient]
  );

  const handleCardClick = (projectId) => {
    localStorage.setItem("projectId", projectId); // Store projectId in localStorage
    router.push(`/projectID/${projectId}`); // Navigate to the dynamic project page
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!studentId) {
      alert("Student ID not found. Please log in.");
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(
        `${apiUrl}/api/requests/${studentId}/${selectedProject.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_request_text:
              message || "the student has not added a message", // Include the optional message
          }),
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
        <meta
          name="description"
          content="Student dashboard displaying all projects."
        />
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
                    placeholder="Search by project title, supervisor, or description..."
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
                  <option value="supervisor">Supervisor</option>
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
                      href={`/projectID/${project.id}`}
                      passHref
                      onClick={() => handleProjectClick(project.id)}
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
                          e.stopPropagation(); // Prevent card click
                          openRequestModal(project);
                        }}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Request Project
                      </button>
                      <span
                        className={`px-3 py-1 rounded font-bold ${
                          project.project_status.toLowerCase() === "taken"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {project.project_status.toLowerCase() === "taken"
                          ? "Taken"
                          : "Available"}
                      </span>
                    </div>
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
                  className="bg-blue-500 text-white py-2 px-4 rounded"
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
