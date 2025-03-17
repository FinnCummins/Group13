"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import ProposalStatusNavbar from "@/components/ProposalStatusNavbar";

export default function ProposalStatus() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  return (
    <div>
      <Head>
        <title>Proposal Status- Final Year Project Finder</title>
        <meta name="description" content="Status of all student proposals" />
      </Head>

      <ProposalStatusNavbar />

      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}