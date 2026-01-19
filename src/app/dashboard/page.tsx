import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import ProjectsGrid from "@/components/ProjectsGrid";
import DashboardStats from "@/components/DashboardStats";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const handleSignOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="border-b border-[#222]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Logo size="md" />
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/build"
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Project
              </Link>

              <div className="flex items-center gap-3">
                <img
                  src={user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <form action={handleSignOut}>
                  <button
                    type="submit"
                    className="text-gray-400 hover:text-white transition-colors p-2"
                    title="Sign out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-400">{user.email}</p>
        </div>

        {/* Stats Cards */}
        <DashboardStats
          projectCount={projects?.length || 0}
          userEmail={user.email || ""}
        />

        {/* Projects Section */}
        <h2 className="text-xl font-semibold mb-4">Your Projects</h2>
        <ProjectsGrid initialProjects={projects || []} />
      </main>
    </div>
  );
}
