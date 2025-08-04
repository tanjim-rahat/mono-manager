import ProjectVerticalMore from "@/components/ProjectVerticalMore";
import ProjectStatusSelect from "@/components/ProjectStatusSelect";
import TasksList from "@/components/TasksList";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import connectDB from "@/lib/database";
import { type ProjectWithTasks } from "@/lib/types";
import Project, { type IProject } from "@/models/Project";
import Task, { type IAttachment, type ITask } from "@/models/Task";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getProjectData(id: string): Promise<ProjectWithTasks | null> {
  try {
    await connectDB();
    const project = (await Project.findById(
      id
    ).lean()) as unknown as IProject & {
      tasks: ITask[];
    };

    const tasks = (await Task.find({
      projectId: id,
    }).lean()) as unknown as ITask[];

    project.tasks = tasks;

    if (!project) {
      return null;
    }

    console.log(project.tasks);

    return {
      _id: String(project._id),
      title: project.title as string,
      description: project.description as string | undefined,
      status: project.status as ProjectWithTasks["status"],
      tags: project.tags as string[],
      tasks:
        project.tasks?.map((task: ITask) => ({
          _id: String(task._id),
          title: task.title,
          description: task.description,
          status: task.status,
          attachments:
            task.attachments?.map((att: IAttachment) => ({
              name: att.name,
              url: att.url,
              type: att.type,
              size: att.size,
              uploadedAt: att.uploadedAt.toISOString(),
            })) || [],
          subtasks:
            task.subtasks?.map((subtaskId: ITask["_id"]) =>
              String(subtaskId)
            ) || [],
          parentTask: task.parentTask ? String(task.parentTask) : undefined,
          projectId: task.projectId ? String(task.projectId) : undefined,
          createdAt: task.createdAt.toISOString(),
          updatedAt: task.updatedAt.toISOString(),
        })) || [],
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
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

  if (project == null) {
    return redirect("/");
  }

  const createdTimeAgo = formatDistanceToNow(new Date(project.createdAt), {
    addSuffix: true,
  });
  const updatedTimeAgo = formatDistanceToNow(new Date(project.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="container mx-auto p-6 lg:py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
      </div>

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
            <ProjectStatusSelect
              projectId={project._id}
              currentStatus={project.status}
              projectTitle={project.title}
            />

            <ProjectVerticalMore project={project} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
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

      {/* Tasks Section */}
      <TasksList
        tasks={project.tasks}
        projectId={project._id}
        projectTitle={project.title}
      />
    </div>
  );
}
