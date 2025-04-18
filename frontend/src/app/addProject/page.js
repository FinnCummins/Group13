"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AddProjectNavbar from "@/components/AddProjectNavbar";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const [isClient, setIsClient] = useState(false);
  const [supervisorId, setSupervisorId] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [touched, setTouched] = useState({
    projectTitle: false,
    projectDescription: false,
  });

  useEffect(() => {
    setIsClient(true);

    // Get the supervisor ID from localStorage using the correct key
    const storedSupervisorId = localStorage.getItem("supervisorId");
    const userType = localStorage.getItem("userType");

    if (!storedSupervisorId) {
      setError("Supervisor ID not found. Please log in.");
      return;
    }

    setSupervisorId(storedSupervisorId);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    setTouched({
      projectTitle: true,
      projectDescription: true,
    });
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!projectTitle || !projectDescription) {
      setError("Please fill in all required fields");
      return;
    }

    const keywordsArray = keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    const projectData = {
      project_title: projectTitle,
      project_description: projectDescription,
      supervisor_id: supervisorId,
      keywords: keywordsArray,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001";
      const response = await fetch(`${apiUrl}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      setSuccess("Project created successfully!");
      setTimeout(() => {
        router.push("/supervisor");
      }, 1500);

      setProjectTitle("");
      setProjectDescription("");
      setKeywords("");
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <Head>
        <title>Add Project - Final Year Project Finder</title>
        <meta name="description" content="Add a new project" />
      </Head>

      <AddProjectNavbar />

      <main className="mt-20 text-center px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <h1 className="text-6xl font-bold mb-4">Add Project</h1>
          <p className="text-lg mb-8">
            Fill in the details below to add a new project.
          </p>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <form
            className="max-w-md mx-auto bg-white p-8 rounded shadow-md"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="projectTitle"
              >
                Project Title<span className="text-red-500">*</span>
              </label>
              <input
                id="projectTitle"
                type="text"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                onBlur={() => handleBlur("projectTitle")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                  ${
                    touched.projectTitle && !projectTitle
                      ? "border-red-500"
                      : ""
                  }`}
                required
              />
              {touched.projectTitle && !projectTitle && (
                <p className="text-red-500 text-xs italic mt-1">
                  Project title is required
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="projectDescription"
              >
                Project Description<span className="text-red-500">*</span>
              </label>
              <textarea
                id="projectDescription"
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                onBlur={() => handleBlur("projectDescription")}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                  ${
                    touched.projectDescription && !projectDescription
                      ? "border-red-500"
                      : ""
                  }`}
                required
              ></textarea>
              {touched.projectDescription && !projectDescription && (
                <p className="text-red-500 text-xs italic mt-1">
                  Project description is required
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="keywords"
              >
                Keywords (comma separated)
              </label>
              <input
                id="keywords"
                type="text"
                placeholder="e.g. React, Next.js, API"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Create Project
              </button>
            </div>
          </form>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
