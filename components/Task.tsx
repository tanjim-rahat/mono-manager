import { CheckCircle2, Circle, AlertCircle, Pause } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import TaskStatusSelect from "@/components/TaskStatusSelect";
import { type Task as TaskType } from "@/lib/types";

interface TaskProps {
  task: TaskType;
  projectId: string;
}

export default function Task({ task, projectId }: TaskProps) {
  return (
    <div
      key={task._id}
      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
    >
      <div className="flex-shrink-0 mt-1">
        {task.status === "completed" ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : task.status === "in-progress" ? (
          <AlertCircle className="h-4 w-4 text-blue-600" />
        ) : task.status === "review" ? (
          <Pause className="h-4 w-4 text-orange-600" />
        ) : (
          <Circle className="h-4 w-4 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <Link href={`/task/${task._id}`} className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate hover:text-primary cursor-pointer transition-colors">
              {task.title}
            </h4>
          </Link>
          <TaskStatusSelect
            taskId={task._id}
            currentStatus={task.status}
            projectId={projectId}
            taskTitle={task.title}
          />
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>
            Created{" "}
            {formatDistanceToNow(new Date(task.createdAt), {
              addSuffix: true,
            })}
          </span>
          {task.attachments.length > 0 && (
            <span>
              {task.attachments.length} attachment
              {task.attachments.length > 1 ? "s" : ""}
            </span>
          )}
          {task.subtasks.length > 0 && (
            <span>
              {task.subtasks.length} subtask
              {task.subtasks.length > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
