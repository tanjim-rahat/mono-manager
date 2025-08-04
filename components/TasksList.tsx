import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo } from "lucide-react";
import CreateTaskModal from "@/components/CreateTaskModal";
import Task from "@/components/Task";
import { type Task as TaskType } from "@/lib/types";

interface TasksSectionProps {
  tasks: TaskType[];
  projectId: string;
  projectTitle: string;
}

export default function TasksList({
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
              <Task key={task._id} task={task} projectId={projectId} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
