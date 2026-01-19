"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import ProjectCard from "./ProjectCard";

interface Project {
  id: string;
  name: string;
  updated_at: string;
}

interface ProjectsGridProps {
  initialProjects: Project[];
}

export default function ProjectsGrid({ initialProjects }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Plus className="w-8 h-8 text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
        <p className="text-gray-400 mb-6">Create your first app to get started</p>
        <Link
          href="/build"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
      ))}
    </div>
  );
}
