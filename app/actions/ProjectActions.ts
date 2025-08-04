"use server";

import Project from "@/models/Project";
import connectDB from "@/lib/database";
import { revalidatePath } from "next/cache";
import { type ProjectStatus } from "@/lib/types";

export async function createProject(data: {
  title: string;
  description?: string;
  status?: ProjectStatus;
  tags?: string[];
}) {
  try {
    await connectDB();

    const project = new Project({
      title: data.title,
      description: data.description || "",
      status: data.status || "planning",
      tags: data.tags || [],
    });

    const savedProject = await project.save();

    // Revalidate the home page to show the new project
    revalidatePath("/");

    return {
      success: true,
      data: {
        _id: savedProject._id.toString(),
        title: savedProject.title,
        description: savedProject.description,
        status: savedProject.status,
        tags: savedProject.tags,
        createdAt: savedProject.createdAt,
      },
    };
  } catch (error) {
    console.error("Error creating project:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create project",
    };
  }
}

export async function deleteProject(projectId: string) {
  try {
    await connectDB();
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      throw new Error("Project not found");
    }

    revalidatePath("/");
    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
) {
  try {
    await connectDB();

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return {
        success: false,
        error: "Project not found",
      };
    }

    // Revalidate the project page and home page to show updated status
    revalidatePath(`/project/${projectId}`);
    revalidatePath("/");

    return {
      success: true,
      data: {
        _id: updatedProject._id.toString(),
        title: updatedProject.title,
        status: updatedProject.status,
      },
    };
  } catch (error) {
    console.error("Error updating project status:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update project status",
    };
  }
}
