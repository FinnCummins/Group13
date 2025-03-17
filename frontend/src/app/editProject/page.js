"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import EditProjectNavbar from "@/components/EditProjectNavbar";
import { useRouter } from "next/navigation";

export default function EditProjectPage() {
  const [isClient, setIsClient] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Edit Project - Final Year Project Finder</title>
        <meta name="description" content="Edit your projects" />
      </Head>

      <EditProjectNavbar />
      <footer className="text-center py-6 border-t border-[var(--foreground)]">
        <p>2025 Final Year Project Finder</p>
      </footer>
    </div>
  );
}
