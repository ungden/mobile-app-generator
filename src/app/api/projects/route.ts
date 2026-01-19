import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// GET all projects for current user
export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ projects: data });
}

// POST create new project
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description, code, files, dependencies, version } = await request.json();

  // Support both old single-file (code) and new multi-file (files) format
  if (!code && !files) {
    return NextResponse.json({ error: "Code or files is required" }, { status: 400 });
  }

  const projectData: any = {
    user_id: user.id,
    name: name || "Untitled Project",
    description,
    version: version || 1,
  };

  // If files provided (multi-file project), store as JSON
  if (files) {
    projectData.files = files;
    projectData.dependencies = dependencies || {};
    // Also store App.js in code for backward compatibility
    projectData.code = files["App.js"]?.contents || "";
  } else {
    // Single file project (legacy)
    projectData.code = code;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(projectData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

// PUT update project
export async function PUT(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, name, description, code, files, dependencies, version } = await request.json();

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (version !== undefined) updateData.version = version;

  // Handle multi-file projects
  if (files) {
    updateData.files = files;
    updateData.dependencies = dependencies || {};
    // Also update code for backward compatibility
    updateData.code = files["App.js"]?.contents || "";
  } else if (code !== undefined) {
    // Single file update (legacy)
    updateData.code = code;
  }

  const { data, error } = await supabase
    .from("projects")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ project: data });
}

// DELETE project
export async function DELETE(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
