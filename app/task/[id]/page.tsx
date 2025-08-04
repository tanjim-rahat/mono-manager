import Task, { type ITask, type IAttachment } from "@/models/Task";
import Project from "@/models/Project";
import { type Task as TaskType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Pause,
  Paperclip,
  ListTodo,
  User,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import connectDB from "@/lib/database";
import TaskStatusSelect from "@/components/TaskStatusSelect";
import SubtasksList from "@/components/SubtasksList";
import { redirect } from "next/navigation";

async function getTaskData(
  id: string
): Promise<{
  task: TaskType;
  projectTitle: string;
  subtasks: TaskType[];
} | null> {
  try {
    await connectDB();
    const task = (await Task.findById(id).lean()) as unknown as ITask;

    if (!task) {
      return null;
    }

    // Get project title
    const project = (await Project.findById(task.projectId)
      .select("title")
      .lean()) as unknown as { title: string };
    const projectTitle = project?.title || "Unknown Project";

    // Get subtasks if they exist
    const subtasks =
      task.subtasks?.length > 0
        ? ((await Task.find({
            _id: { $in: task.subtasks },
          }).lean()) as unknown as ITask[])
        : [];

    const subtasksData: TaskType[] = subtasks.map((subtask) => ({
      _id: String(subtask._id),
      title: subtask.title,
      description: subtask.description,
      status: subtask.status as TaskType["status"],
      attachments:
        subtask.attachments?.map((att: IAttachment) => ({
          name: att.name,
          url: att.url,
          type: att.type,
          size: att.size,
          uploadedAt: att.uploadedAt.toISOString(),
        })) || [],
      subtasks: subtask.subtasks?.map((subtaskId) => String(subtaskId)) || [],
      parentTask: subtask.parentTask ? String(subtask.parentTask) : undefined,
      projectId: subtask.projectId ? String(subtask.projectId) : "",
      createdAt: subtask.createdAt.toISOString(),
      updatedAt: subtask.updatedAt.toISOString(),
    }));

    return {
      task: {
        _id: String(task._id),
        title: task.title,
        description: task.description,
        status: task.status as TaskType["status"],
        attachments:
          task.attachments?.map((att: IAttachment) => ({
            name: att.name,
            url: att.url,
            type: att.type,
            size: att.size,
            uploadedAt: att.uploadedAt.toISOString(),
          })) || [],
        subtasks: task.subtasks?.map((subtaskId) => String(subtaskId)) || [],
        parentTask: task.parentTask ? String(task.parentTask) : undefined,
        projectId: task.projectId ? String(task.projectId) : "",
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString(),
      },
      projectTitle,
      subtasks: subtasksData,
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch task data"
    );
  }
}

function getStatusIcon(status: TaskType["status"]) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    case "in-progress":
      return <AlertCircle className="h-5 w-5 text-blue-600" />;
    case "review":
      return <Pause className="h-5 w-5 text-orange-600" />;
    case "cancelled":
      return <Circle className="h-5 w-5 text-red-600" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
}

export default async function TaskPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getTaskData(id);

  if (data == null) {
    return redirect("/");
  }

  const { task, projectTitle, subtasks } = data;
  const createdTimeAgo = formatDistanceToNow(new Date(task.createdAt), {
    addSuffix: true,
  });
  const updatedTimeAgo = formatDistanceToNow(new Date(task.updatedAt), {
    addSuffix: true,
  });

  return (
    <div className="container mx-auto p-6 lg:py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/project/${task.projectId}`}>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {projectTitle}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl font-bold mb-2">
                  {task.title}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <User className="h-4 w-4" />
                  <span>Task in {projectTitle}</span>
                </div>
                {task.description && (
                  <CardDescription className="text-base mt-2">
                    {task.description}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TaskStatusSelect
                taskId={task._id}
                currentStatus={task.status}
                projectId={task.projectId || ""}
                taskTitle={task.title}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status and Metadata */}
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

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Paperclip className="h-4 w-4" />
                Attachments ({task.attachments.length})
              </div>
              <div className="space-y-2">
                {task.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{attachment.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {attachment.type}
                          {attachment.size &&
                            ` • ${Math.round(attachment.size / 1024)}KB`}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {subtasks.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ListTodo className="h-4 w-4" />
                Subtasks ({subtasks.length})
              </div>
              <SubtasksList subtasks={subtasks} parentTaskId={task._id} />
            </div>
          )}

          {/* Parent Task */}
          {task.parentTask && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ArrowLeft className="h-4 w-4" />
                Parent Task
              </div>
              <div className="text-sm text-muted-foreground">
                <p>This is a subtask of another task.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
