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
import { updateProjectStatus } from "@/app/actions/ProjectActions";
import { type ProjectStatus } from "@/lib/types";
import { statusConfig, cn } from "@/lib/utils";

interface ProjectStatusSelectProps {
  projectId: string;
  currentStatus: ProjectStatus;
  projectTitle: string;
}

export default function ProjectStatusSelect({
  projectId,
  currentStatus,
  projectTitle,
}: ProjectStatusSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    if (newStatus === currentStatus) return;

    setIsLoading(true);

    try {
      const result = await updateProjectStatus(projectId, newStatus);

      if (result.success) {
        toast.success(
          `Project "${projectTitle}" updated to ${statusConfig[newStatus].label}`,
          {
            description: `Status changed from ${statusConfig[currentStatus].label} to ${statusConfig[newStatus].label}`,
          }
        );
      } else {
        toast.error("Failed to update project status", {
          description: result.error || "An unexpected error occurred",
        });
      }
    } catch (error) {
      toast.error("Failed to update project status", {
        description: "An unexpected error occurred. Please try again.",
      });
      console.error("Error updating project status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Badge
          variant={statusConfig[currentStatus].variant}
          className={cn(
            "cursor-pointer hover:opacity-80 transition-opacity",
            "gap-1 pr-1 text-sm px-3 py-1",
            statusConfig[currentStatus].color
          )}
        >
          {statusConfig[currentStatus].label}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        {Object.entries(statusConfig).map(([status, config]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusChange(status as ProjectStatus)}
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
