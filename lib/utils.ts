import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type StatusConfig } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Project status configuration
export const statusConfig: StatusConfig = {
  planning: {
    label: "Planning",
    variant: "secondary" as const,
    color: "bg-gray-100 text-gray-800",
  },
  "in-progress": {
    label: "In Progress",
    variant: "default" as const,
    color: "bg-blue-100 text-blue-800",
  },
  review: {
    label: "Review",
    variant: "secondary" as const,
    color: "bg-yellow-100 text-yellow-800",
  },
  completed: {
    label: "Completed",
    variant: "secondary" as const,
    color: "bg-green-100 text-green-800",
  },
  "on-hold": {
    label: "On Hold",
    variant: "destructive" as const,
    color: "bg-red-100 text-red-800",
  },
} as const;
