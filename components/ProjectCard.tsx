"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { type Project } from "@/lib/types";
import { statusConfig } from "@/lib/utils";
import ProjectVerticalMore from "@/components/ProjectVerticalMore";

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
  onDelete?: (
    project: Project
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusInfo = statusConfig[project.status];
  const timeAgo = formatDistanceToNow(new Date(project.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-2">
              <Link
                href={`/project/${project._id}`}
                className="hover:underline"
              >
                {project.title}
              </Link>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <Badge
              variant={statusInfo.variant}
              className={`${statusInfo.color} text-xs`}
            >
              {statusInfo.label}
            </Badge>
            <ProjectVerticalMore project={project} />
          </div>
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
          <span>Created {timeAgo}</span>
        </div>
      </CardContent>
    </Card>
  );
}
