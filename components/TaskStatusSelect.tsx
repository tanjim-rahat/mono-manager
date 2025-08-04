"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateTaskStatus } from "@/app/actions/taskActions";
import { type TaskStatus } from "@/lib/types";

interface TaskStatusSelectProps {
  taskId: string;
  currentStatus: TaskStatus;
  projectId: string;
  taskTitle: string;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  review: "Review",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function TaskStatusSelect({
  taskId,
  currentStatus,
  projectId,
  taskTitle,
}: TaskStatusSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === currentStatus) return;

    setIsLoading(true);

    try {
      const result = await updateTaskStatus(taskId, newStatus, projectId);

      if (result.success) {
        toast.success(
          `Task "${taskTitle}" updated to ${statusLabels[newStatus]}`,
          {
            description: `Status changed from ${statusLabels[currentStatus]} to ${statusLabels[newStatus]}`,
          }
        );
      } else {
        toast.error("Failed to update task status", {
          description: result.error || "An unexpected error occurred",
        });
      }
    } catch (error) {
      toast.error("Failed to update task status", {
        description: "An unexpected error occurred. Please try again.",
      });
      console.error("Error updating task status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-[130px] h-7 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo">To Do</SelectItem>
        <SelectItem value="in-progress">In Progress</SelectItem>
        <SelectItem value="review">Review</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );
}
