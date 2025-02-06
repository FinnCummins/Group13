"use client";

import SupervisorNavbar from '@/components/SupervisorNavbar';

export default function SupervisorHomePage() {
  return (
    <>
      <SupervisorNavbar />

      {/* Page Content */}
      <main style={{ padding: '120px 1rem 1rem' }}>
        <h1>Supervisor Home</h1>
        <p>Welcome, Supervisor! This is your dashboard.</p>
        <p>List of projects displayed here</p>
      </main>
    </>
  );
}
