import { CheckCircle2, Circle, AlertCircle, Pause } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import TaskStatusSelect from "@/components/TaskStatusSelect";
import { type Task } from "@/lib/types";

interface SubtasksListProps {
  subtasks: Task[];
  parentTaskId: string;
}

export default function SubtasksList({ subtasks }: SubtasksListProps) {
  if (!subtasks || subtasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {subtasks.map((subtask) => (
        <div
          key={subtask._id}
          className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex-shrink-0 mt-1">
            {subtask.status === "completed" ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : subtask.status === "in-progress" ? (
              <AlertCircle className="h-4 w-4 text-blue-600" />
            ) : subtask.status === "review" ? (
              <Pause className="h-4 w-4 text-orange-600" />
            ) : (
              <Circle className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/task/${subtask._id}`} className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate hover:text-primary cursor-pointer transition-colors">
                  {subtask.title}
                </h4>
              </Link>
              <TaskStatusSelect
                taskId={subtask._id}
                currentStatus={subtask.status}
                projectId={subtask.projectId || ""}
                taskTitle={subtask.title}
              />
            </div>
            {subtask.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {subtask.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>
                Created{" "}
                {formatDistanceToNow(new Date(subtask.createdAt), {
                  addSuffix: true,
                })}
              </span>
              {subtask.attachments.length > 0 && (
                <span>
                  {subtask.attachments.length} attachment
                  {subtask.attachments.length > 1 ? "s" : ""}
                </span>
              )}
              {subtask.subtasks.length > 0 && (
                <span>
                  {subtask.subtasks.length} subtask
                  {subtask.subtasks.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
