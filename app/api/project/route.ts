import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Project from "@/models/Project";

// GET handler - Get all projects
export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Fetch all projects, sorted by creation date (newest first)
    const projects = await Project.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: projects,
        count: projects.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 }
    );
  }
}

// POST handler - Create a new project
export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { title, description, status, tags } = body;

    // Basic validation
    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 }
      );
    }

    // Create new project
    const project = new Project({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "planning",
      tags: tags || [],
    });

    // Save to database
    const savedProject = await project.save();

    return NextResponse.json(
      {
        success: true,
        data: savedProject,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a specific project
export async function DELETE(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Get project ID from URL search params
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    // Validate project ID
    if (!projectId) {
      return NextResponse.json(
        {
          success: false,
          error: "Project ID is required",
        },
        { status: 400 }
      );
    }

    // Find and delete the project
    const deletedProject = await Project.findByIdAndDelete(projectId);

    // Check if project was found and deleted
    if (!deletedProject) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: deletedProject,
        message: "Project deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);

    // Handle invalid ObjectId error
    if (error instanceof Error && error.name === "CastError") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid project ID format",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
      },
      { status: 500 }
    );
  }
}
