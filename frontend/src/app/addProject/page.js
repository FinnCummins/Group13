"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import AddProjectNavbar from "@/components/AddProjectNavbar";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const [isClient, setIsClient] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const keywordsArray = keywords
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0);

    const projectData = {
      project_title: projectTitle,
      project_description: projectDescription,
      supervisor_id: 1, 
      keywords: keywordsArray,
    };

    try {
      const response = await fetch("http://127.0.0.1:5001/api/projects", {
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
          >
            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="projectTitle"
              >
                Project Title
              </label>
              <input
                id="projectTitle"
                type="text"
                placeholder="Enter project title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-left text-gray-700 text-sm font-bold mb-2"
                htmlFor="projectDescription"
              >
                Project Description
              </label>
              <textarea
                id="projectDescription"
                placeholder="Enter project description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              ></textarea>
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
