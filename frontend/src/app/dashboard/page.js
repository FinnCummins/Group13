"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function FinalProjectDashboard() {
  const [finalProject, setFinalProject] = useState(null);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const studentId = localStorage.getItem("studentId"); 
    if (!studentId) {
      setError("Student ID not found. Please log in.");
      return;
    }

    async function fetchFinalProject() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
        const response = await fetch(`${apiUrl}/api/final_project?student_id=${studentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch final project details");
        }
        const data = await response.json();
        if (data.length > 0) {
          setFinalProject(data[0]); 
        } else {
          setError("No final project assigned.");
        }
      } catch (err) {
        setError(err.message);
      }
    }

    fetchFinalProject();
  }, []);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>Final Project Dashboard - Final Year Project Finder</title>
        <meta name="description" content="View your final project details" />
      </Head>

      <DashboardNavbar />

      <main className="mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center">
              Final Project Dashboard
            </h1>

            {error && (
              <p className="text-red-500 mb-4 text-center">
                {error}
              </p>
            )}

            {finalProject ? (
              <div className="bg-[var(--background)] p-6 rounded-lg shadow-lg border border-[var(--foreground)]">
                <h2 className="text-3xl font-bold mb-4 text-[var(--text)]">
                  {finalProject.project.project_title}
                </h2>
                <p className="text-[var(--text)] mb-4">
                  <strong>Description:</strong> {finalProject.project.project_description}
                </p>
                <p className="text-[var(--text)] mb-4">
                  <strong>Supervisor:</strong> {finalProject.supervisor.first_name} {finalProject.supervisor.last_name} ({finalProject.supervisor.email})
                </p>
                <p className="text-[var(--text)] mb-4">
                  <strong>Status:</strong> {finalProject.project.project_status}
                </p>
                <p className="text-[var(--text)]">
                  <strong>Locked At:</strong> {new Date(finalProject.locked_at).toLocaleString()}
                </p>
              </div>
            ) : (
              !error && <p className="text-center">Loading final project details...</p>
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