import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  Pause,
  ListTodo,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import TaskStatusSelect from "@/components/TaskStatusSelect";
import CreateTaskModal from "@/components/CreateTaskModal";
import { type Task } from "@/lib/types";

interface TasksSectionProps {
  tasks: Task[];
  projectId: string;
  projectTitle: string;
}

export default function TasksSection({
  tasks,
  projectId,
  projectTitle,
}: TasksSectionProps) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            <CardTitle className="text-xl">Tasks ({tasks.length})</CardTitle>
          </div>
          <CreateTaskModal projectId={projectId} projectTitle={projectTitle} />
        </div>
      </CardHeader>
      <CardContent>
        {!tasks || tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No tasks yet</p>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
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
                    <h4 className="font-medium text-sm truncate">
                      {task.title}
                    </h4>
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
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
