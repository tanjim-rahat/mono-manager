"use server";

import Project from "@/models/Project";
import connectDB from "@/lib/database";
import { revalidatePath } from "next/cache";

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
