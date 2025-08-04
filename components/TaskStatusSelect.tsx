"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { updateTaskStatus } from "@/app/actions/taskActions";
import { type TaskStatus } from "@/lib/types";
import { taskStatusConfig, cn } from "@/lib/utils";

interface TaskStatusSelectProps {
  taskId: string;
  currentStatus: TaskStatus;
  projectId: string;
  taskTitle: string;
}

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
          `Task "${taskTitle}" updated to ${taskStatusConfig[newStatus].label}`,
          {
            description: `Status changed from ${taskStatusConfig[currentStatus].label} to ${taskStatusConfig[newStatus].label}`,
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Badge
          variant={taskStatusConfig[currentStatus].variant}
          className={cn(
            "cursor-pointer hover:opacity-80 transition-opacity",
            "gap-1 pr-1",
            taskStatusConfig[currentStatus].color
          )}
        >
          {taskStatusConfig[currentStatus].label}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {Object.entries(taskStatusConfig).map(([status, config]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as TaskStatus)}
            disabled={isLoading || status === currentStatus}
            className="cursor-pointer"
          >
            <Badge
              variant={config.variant}
              className={cn("pointer-events-none text-xs", config.color)}
            >
              {config.label}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
