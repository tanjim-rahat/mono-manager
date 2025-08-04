"use server";

import { revalidatePath } from "next/cache";
import Task from "@/models/Task";
import Project from "@/models/Project";
import connectDB from "@/lib/database";
import { type TaskStatus } from "@/lib/types";

export async function createTask(
  projectId: string,
  title: string,
  description?: string,
  status: TaskStatus = "todo"
) {
  try {
    await connectDB();

    // Create the new task
    const newTask = await Task.create({
      title,
      description,
      status,
      projectId,
    });

    // Add the task to the project's tasks array
    await Project.findByIdAndUpdate(
      projectId,
      { $push: { tasks: newTask._id } },
      { new: true }
    );

    // Revalidate the project page to show the new task
    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      data: {
        _id: newTask._id.toString(),
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
      },
    };
  } catch (error) {
    console.error("Error creating task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create task",
    };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  projectId: string
) {
  try {
    await connectDB();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    // Revalidate the project page to show updated task status
    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      data: {
        _id: updatedTask._id.toString(),
        title: updatedTask.title,
        status: updatedTask.status,
      },
    };
  } catch (error) {
    console.error("Error updating task status:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update task status",
    };
  }
}

export async function deleteTask(taskId: string, projectId: string) {
  try {
    await connectDB();

    // Remove the task from the database
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    // Remove the task from the project's tasks array
    await Project.findByIdAndUpdate(
      projectId,
      { $pull: { tasks: taskId } },
      { new: true }
    );

    // Revalidate the project page to reflect the deletion
    revalidatePath(`/project/${projectId}`);

    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete task",
    };
  }
}
