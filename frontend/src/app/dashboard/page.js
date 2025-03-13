"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import DashboardNavbar from "@/components/DashboardNavbar";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  return (
    <div>
      <Head>
        <title>Final Project Dashboard- Final Year Project Finder</title>
        <meta name="description" content="Manage your Final Year Project" />
      </Head>

      <DashboardNavbar />

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}