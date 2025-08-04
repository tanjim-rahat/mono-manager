"use client";

import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Pause,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import TaskStatusSelect from "@/components/TaskStatusSelect";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { type Task as TaskType } from "@/lib/types";
import { deleteTask } from "@/app/actions/taskActions";
import { useState } from "react";
import { toast } from "sonner";

interface TaskProps {
  task: TaskType;
  projectId: string;
}

export default function Task({ task, projectId }: TaskProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleDelete = async () => {
    setShowDeleteDialog(false);

    toast.promise(deleteTask(task._id, projectId), {
      loading: "Deleting task...",
      success: (data) => {
        if (data.success) {
          return "Task deleted successfully";
        } else {
          throw new Error(data.error || "Failed to delete task");
        }
      },
      error: (error) => error.message || "Failed to delete task",
    });
  };
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
          <div className="flex items-center gap-2">
            <TaskStatusSelect
              taskId={task._id}
              currentStatus={task.status}
              projectId={projectId}
              taskTitle={task.title}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{task.title}&rdquo;? All
              subtasks will also be deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
