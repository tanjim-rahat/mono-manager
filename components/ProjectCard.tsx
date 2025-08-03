import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Tag } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  project: Project;
}

const statusConfig = {
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
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusInfo = statusConfig[project.status];
  const formattedDate = new Date(project.createdAt).toLocaleDateString();

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-1">
            {project.title}
          </CardTitle>
          <Badge
            variant={statusInfo.variant}
            className={`${statusInfo.color} text-xs`}
          >
            {statusInfo.label}
          </Badge>
        </div>
        {project.description && (
          <CardDescription className="line-clamp-2 text-sm">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-3">
          {project.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {project.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
          <Calendar className="h-3 w-3" />
          <span>Created {formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
}
