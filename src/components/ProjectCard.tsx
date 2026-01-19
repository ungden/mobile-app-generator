"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, MoreVertical, Trash2, ExternalLink } from "lucide-react";
import { useToast } from "./Toast";

interface Project {
  id: string;
  name: string;
  updated_at: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects?id=${project.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onDelete(project.id);
        showToast("Project deleted", "success");
      } else {
        const data = await response.json();
        showToast(data.error || "Failed to delete project", "error");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      showToast("Failed to delete project", "error");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="group bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-purple-500/50 transition-colors relative">
      <Link href={`/build?project=${project.id}`}>
        {/* Preview thumbnail */}
        <div className="aspect-[4/3] bg-[#1a1a1a] flex items-center justify-center">
          <div className="w-24 h-40 bg-[#222] rounded-xl border border-[#333]" />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold group-hover:text-purple-400 transition-colors">
                {project.name || "Untitled Project"}
              </h3>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3" />
                {new Date(project.updated_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* Actions menu button */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="p-2 bg-black/50 hover:bg-black/70 rounded-lg text-gray-400 hover:text-white transition-colors backdrop-blur-sm"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowMenu(false);
              }}
            />
            <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 overflow-hidden">
              <Link
                href={`/build?project=${project.id}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#222] transition-colors w-full"
                onClick={() => setShowMenu(false)}
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </Link>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#222] transition-colors w-full text-red-400 hover:text-red-300 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
