"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import ProposalStatusNavbar from "@/components/ProposalStatusNavbar";

export default function ProposalStatus() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const studentId = localStorage.getItem("userId"); 
    if (!studentId) {
      setError("Student ID not found. Please log in.");
      return;
    }

    async function fetchRequests() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
        const response = await fetch(`${apiUrl}/api/student_requests/${studentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }
        const data = await response.json();
        setRequests(data || []);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchRequests();
  }, []);

  const handleDeleteRequest = async (requestId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001';
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

            {requests.length === 0 ? (
              <p className="text-center">No requests found</p>
            ) : (
              <div className="space-y-8">
                {requests.map((request) => (
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
                          request.status.toLowerCase() === "approved"
                            ? "bg-green-500 text-white"
                            : request.status.toLowerCase() === "rejected"
                            ? "bg-red-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {request.status}
                      </span>
                      <button
                        onClick={() => handleDeleteRequest(request.request_id)}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      >
                        Delete Request
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

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}