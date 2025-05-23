"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import ManageCandidatesNavbar from "@/components/ManageCandidatesNavbar";

export default function SupervisorRequestsPage() {
  const [projectRequests, setProjectRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseStatus, setResponseStatus] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const fetchProjectRequests = async () => {
      try {
        const storedSupervisorId = localStorage.getItem("supervisorId");
        const userType = localStorage.getItem("userType");

        if (!storedSupervisorId) {
          setError("Supervisor ID not found. Please log in.");
          return;
        }

        const supervisorId = storedSupervisorId;
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
        const response = await fetch(
          `${apiUrl}/api/supervisor_requests/${supervisorId}`
          // `${apiUrl}/api/supervisor_requests/3`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch project requests");
        }

        const requestsData = await response.json();

        // Fetch additional project details if needed
        const requestsWithDetails = await Promise.all(
          requestsData.map(async (req) => {
            // Fetch more detailed project info if needed
            const projRes = await fetch(
              `${apiUrl}/api/projects/${req.project.id}`
            );
            const projectDetails = await projRes.json();

            // Use the combined data from both APIs
            return {
              id: req.request_id,
              project_id: req.project.id,
              status: req.status,
              student_id: req.student.id,
              request_date: req.request_date || new Date().toISOString(),
              project_title: req.project.project_title,
              // Use detailed project info for these fields
              project_description:
                projectDetails.project_description || "No description provided",
              keywords: projectDetails.keywords || [],
              student_name:
                `${req.student.first_name} ${req.student.last_name}`.trim(),
              student_email: req.student.email,
              student_message: req.student_request_text || "",
              supervisor_message: req.supervisor_response_text || "",
            };
          })
        );

        setProjectRequests(requestsWithDetails);
        setFilteredRequests(requestsWithDetails);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching requests:", err);
      }
    };

    fetchProjectRequests();
  }, []);

  useEffect(() => {
    let result = [...projectRequests];

    if (statusFilter !== "all") {
      result = result.filter(
        (request) => request.status.toLowerCase() === statusFilter
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((request) => {
        const studentName = request.student_name?.toLowerCase() || "";
        const projectTitle = request.project_title?.toLowerCase() || "";
        return studentName.includes(query) || projectTitle.includes(query);
      });
    }
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.request_date);
        const dateB = new Date(b.request_date);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "id") {
        return sortDirection === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.project_title.localeCompare(b.project_title)
          : b.project_title.localeCompare(a.project_title);
      }
      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.student_name.localeCompare(b.student_name)
          : b.student_name.localeCompare(a.student_name);
      }
      return 0;
    });

    setFilteredRequests(result);
  }, [projectRequests, statusFilter, searchQuery, sortBy, sortDirection]);

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(`${apiUrl}/api/requests/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          supervisor_response_text: responseMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update request status to ${newStatus}`);
      }

      setProjectRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? {
                ...request,
                status: newStatus,
                supervisor_message: responseMessage,
              }
            : request
        )
      );
      setShowResponseModal(false);
      setResponseMessage("");
      setResponseStatus("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const openDetailsModal = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };
  const openResponseModal = (request, status) => {
    setSelectedRequest(request);
    setResponseStatus(status);
    setShowResponseModal(true);
  };

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Project Requests - Capstone Supervisor Dashboard</title>
        <meta name="description" content="Manage student project requests" />
      </Head>

      <ManageCandidatesNavbar />

      <main className="flex-grow mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center text-[var(--background)]">
              Manage Candidates
            </h1>

            {error && (
              <p className="text-red-500 mb-4 text-center bg-white p-2 rounded">
                Error: {error}
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
                  <option value="all">All Statuses</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              <div className="flex items-center flex-1">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by student name or project title..."
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
                  <option value="date">Date (Newest)</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="title">Project Title (A-Z)</option>
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
              <div className="bg-[var(--background)] p-6 rounded-lg shadow-lg text-center text-[var(--text)]">
                <p>No project requests found matching your criteria</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-[var(--background)] p-6 rounded-lg shadow-lg border border-[var(--foreground)]/20"
                  >
                    <div className="flex justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-[50%]">
                        <div className="flex items-center mb-2">
                          <h2 className="text-2xl font-bold text-[var(--text)] mr-3">
                            {request.project_title}
                          </h2>
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusClass(
                              request.status
                            )}`}
                          >
                            {request.status}
                          </span>
                        </div>

                        <p className="text-[var(--text)] mb-2">
                          <strong>Student:</strong> {request.student_name}
                        </p>

                        <p className="text-sm text-[var(--text)]/70">
                          Requested on:{" "}
                          {new Date(request.request_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 justify-start">
                        <button
                          onClick={() => openDetailsModal(request)}
                          className="bg-gray-100 hover:bg-gray-200 text-[var(--text)] font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full text-center"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      {showResponseModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">
                {responseStatus === "accepted" ? "Accept" : "Reject"} Project
                Request
              </h3>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label
                htmlFor="responseMessage"
                className="block text-sm font-bold mb-2"
              >
                Optional Message
              </label>
              <textarea
                id="responseMessage"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder={
                  responseStatus === "accepted"
                    ? "Add a message for the student..."
                    : "Add a message for the student..."
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResponseModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateRequestStatus(selectedRequest.id, responseStatus)
                }
                className={`${
                  responseStatus === "accepted" ? "bg-green-500" : "bg-red-500"
                } text-white px-4 py-2 rounded`}
              >
                {responseStatus === "accepted" ? "Accept" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">Project Request Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusClass(
                  selectedRequest.status
                )}`}
              >
                {selectedRequest.status}
              </span>
            </div>

            {selectedRequest.status === "pending" && (
              <div className="flex justify-end gap-3 mb-6">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    openResponseModal(selectedRequest, "accepted");
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    openResponseModal(selectedRequest, "rejected");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Student Information
                </h4>
                <p className="mb-2">
                  <strong>Name:</strong> {selectedRequest.student_name}
                </p>
                <p className="mb-2">
                  <strong>ID:</strong> {selectedRequest.student_id}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong>{" "}
                  {selectedRequest.student_email || "Not provided"}
                </p>
                <p>
                  <strong>Requested on:</strong>{" "}
                  {new Date(selectedRequest.request_date).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-2">
                  Project Information
                </h4>
                <p className="mb-2">
                  <strong>Title:</strong> {selectedRequest.project_title}
                </p>
                {selectedRequest.keywords &&
                  selectedRequest.keywords.length > 0 && (
                    <div className="mb-2">
                      <strong>Keywords:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedRequest.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="bg-[var(--foreground)]/20 text-[var(--foreground)] text-sm font-medium px-3 py-1 rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-2">
                Project Description
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">
                  {selectedRequest.project_description}
                </p>
              </div>
            </div>

            {selectedRequest.student_message && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Student Message</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-line">
                    {selectedRequest.student_message}
                  </p>
                </div>
              </div>
            )}

            {selectedRequest.supervisor_message && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Your Response</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="whitespace-pre-line">
                    {selectedRequest.supervisor_message}
                  </p>
                </div>
              </div>
            )}

            {selectedRequest.status !== "pending" &&
              !selectedRequest.supervisor_message && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">
                    Add Response Message
                  </h4>
                  <div className="flex gap-2">
                    <textarea
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      placeholder="Add a message to the student..."
                      className="flex-1 p-2 border rounded-md min-h-24"
                    />
                    <button
                      onClick={() =>
                        updateRequestStatus(
                          selectedRequest.id,
                          selectedRequest.status
                        )
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded self-end"
                    >
                      Send
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
