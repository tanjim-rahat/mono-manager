import Project from "@/models/Project";
import { type Project as ProjectData } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import connectDB from "@/lib/database";
import { statusConfig } from "@/lib/utils";

// Interface for raw Mongoose lean result
interface RawProject {
  _id: string;
  title: string;
  description?: string;
  status: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

async function getProjectData(id: string): Promise<ProjectData> {
  try {
    await connectDB();
    const project = await Project.findById(id).lean();
    if (!project) {
      throw new Error("Project not found");
    }

    // Transform the lean result to match our ProjectData type
    const rawProject = project as unknown as RawProject;
    return {
      _id: String(rawProject._id),
      title: rawProject.title,
      description: rawProject.description,
      status: rawProject.status as ProjectData["status"],
      tags: rawProject.tags,
      createdAt: rawProject.createdAt.toISOString(),
      updatedAt: rawProject.updatedAt.toISOString(),
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch project data"
    );
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const project = await getProjectData(id);
  const statusInfo = statusConfig[project.status];
  const createdTimeAgo = formatDistanceToNow(new Date(project.createdAt), {
    addSuffix: true,
  });
  const updatedTimeAgo = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="container mx-auto p-6 lg:py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

      {/* Project Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl font-bold mb-2">
                {project.title}
              </CardTitle>
              {project.description && (
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              )}
            </div>
            <Badge className={`${statusInfo.color} text-sm px-3 py-1`}>
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tags Section */}
          {project.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Tag className="h-4 w-4" />
                Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Timestamps Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created {createdTimeAgo}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Updated {updatedTimeAgo}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
