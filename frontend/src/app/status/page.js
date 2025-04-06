"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import ProposalStatusNavbar from "@/components/ProposalStatusNavbar";

export default function ProposalStatus() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    setIsClient(true);
    const studentId = localStorage.getItem("studentId");
    const userType = localStorage.getItem("userType");

    if (!studentId) {
      setError("Student ID not found. Please log in.");
      return;
    }

    async function fetchRequests() {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
        const response = await fetch(
          `${apiUrl}/api/student_requests/${studentId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data || []);
        setFilteredRequests(data || []);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchRequests();
  }, []);

  const handleChooseFinalProject = async (request) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(`${apiUrl}/api/final_project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: localStorage.getItem("studentId"),
          project_id: request.project.id,
          supervisor_id: request.supervisor.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      alert(data.message);

      setRequests((prevRequests) =>
        prevRequests.map((r) =>
          r.request_id === request.request_id
            ? { ...r, status: "Finalized" }
            : r
        )
      );
    } catch (err) {
      alert(err.message || "An error occurred while choosing the final project.");
    }
  };

  useEffect(() => {
    let result = [...requests];

    if (statusFilter !== "all") {
      result = result.filter(
        (request) => request.status.toLowerCase() === statusFilter
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (request) =>
          request.project?.project_title?.toLowerCase().includes(query) ||
          request.supervisor_response_text?.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.project.project_title.localeCompare(b.project.project_title)
          : b.project.project_title.localeCompare(a.project.project_title);
      } else if (sortBy === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      return 0;
    });

    setFilteredRequests(result);
  }, [requests, statusFilter, searchQuery, sortBy, sortDirection]);

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(`${apiUrl}/api/requests/${requestId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      alert(data.message); // Show success message

      // Remove the deleted request from the UI
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.request_id !== requestId)
      );
    } catch (err) {
      alert(err.message || "An error occurred while deleting the request.");
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Proposal Status - Final Year Project Finder</title>
        <meta name="description" content="Status of all student proposals" />
      </Head>

      <ProposalStatusNavbar />

      <main className="mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center">
              Proposal Status
            </h1>

            {error && (
              <p className="text-red-500 mb-4 text-center">
                Error loading requests: {error}
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
                  <option value="all">All Requests</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by project title or supervisor message..."
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

            {filteredRequests.length === 0 ? (
              <p className="text-center">No requests found</p>
            ) : (
              <div className="space-y-8">
                {filteredRequests.map((request) => (
                  <div
                    key={request.request_id}
                    className="bg-[var(--background)] p-6 rounded-lg shadow-lg flex justify-between items-center border border-[var(--foreground)]"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2 text-[var(--text)]">
                        {request.project.project_title}
                      </h2>
                      <div className="flex items-center space-x-2 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded font-bold ${
                            request.status.toLowerCase() === "accepted"
                              ? "bg-green-500 text-white"
                              : request.status.toLowerCase() === "rejected"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-white"
                          }`}
                        >
                          {request.status}
                        </span>
                        {request.status.toLowerCase() === "accepted" && (
                          <button
                            onClick={() => handleChooseFinalProject(request)}
                            className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            Choose as Final Project
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteRequest(request.request_id)
                          }
                          className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Delete Request
                        </button>
                      </div>
                    </div>
                    {request.supervisor_response_text && (
                      <p className="mt-4 text-[var(--text)]">
                        <strong>Supervisor's Message:</strong>{" "}
                        {request.supervisor_response_text}
                      </p>
                    )}
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
