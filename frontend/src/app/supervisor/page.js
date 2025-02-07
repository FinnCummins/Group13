"use client"; 

import { useState, useEffect } from 'react';
import SupervisorNavbar from '@/components/SupervisorNavbar';

export default function SupervisorHomePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://backend:5001/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchProjects();
  }, []);

  return (
    <>
      <SupervisorNavbar />
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>Supervisor Home</h1>
        <p>Welcome, Supervisor! This is your dashboard.</p>

        {error && (
          <p style={{ color: 'red' }}>
            Error loading projects: {error}
          </p>
        )}

        <h2>List of Projects</h2>
        {projects.length === 0 ? (
          <p>No projects available</p>
        ) : (
          <ul>
            {projects.map(project => (
              <li key={project.id}>
                <strong>{project.name}</strong> — {project.description}
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
