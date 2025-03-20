"use client";

import { useEffect, useState } from 'react';
import Head from 'next/head';
import StudentNavbar from '@/components/StudentNavbar';
import ChatBox from '@/components/ChatBox';

export default function ProjectDetails() {
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const projectId = localStorage.getItem('projectId');
    if (projectId) {
      async function fetchProject() {
        try {
          const response = await fetch(`http://127.0.0.1:5001/api/projects/${projectId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          const data = await response.json();
          setProject(data);
        } catch (err) {
          setError(err.message);
        }
      }
      fetchProject();
    }
  }, []);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Head>
        <title>{project.project_title} - Project Details</title>
        <meta name="description" content={`Details of the project ${project.project_title}`} />
      </Head>

      <StudentNavbar />

      <main className="mt-20 px-4">
        <section className="bg-[var(--foreground)] text-[var(--background)] py-16">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-4 text-center text-[var(--background)]">
              {project.project_title}
            </h1>

            {error && (
              <p className="text-red-500 mb-4 text-center">
                Error loading project: {error}
              </p>
            )}

            <div className="bg-[var(--background)] p-6 rounded-lg shadow-lg flex flex-col justify-between items-start border border-[var(--foreground)]">
              <div>
                <p className="text-[var(--text)] mb-4">
                  {project.project_description}
                </p>
                {project.keywords && project.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-[var(--foreground)]/20 text-[var(--foreground)] text-sm font-medium px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded font-bold ${
                    project.project_status.toLowerCase() === 'taken'
                      ? 'bg-red-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {project.project_status.toLowerCase() === 'taken' ? 'Taken' : 'Available'}
                </span>
              </div>
            </div>
          </div>
          <ChatBox />
        </section>
      </main>

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}