"use client";

export default function AddProjectPage() {
  const createProject = async () => {
    const projectData = {
      project_title: "My New Project",
      project_description: "Description for my new project",
      supervisor_id: 1,
      keywords: ["example", "api"],
    };

    try {
      const response = await fetch("http://backend:5001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to create project");
      }
      
      console.log("Project created successfully:", result);
      
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return <button onClick={createProject}>Create Project</button>;
}
