import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/database";
import Project from "@/models/Project";

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
