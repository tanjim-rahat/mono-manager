import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectCard from "@/components/ProjectCard";
import { revalidatePath } from "next/cache";
import connectDB from "@/lib/database";
import Project from "@/models/Project";

interface ProjectType {
  _id: string;
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

async function deleteProject(projectId: string) {
  "use server";

  try {
    await connectDB();
    const deletedProject = await Project.findByIdAndDelete(projectId);

    if (!deletedProject) {
      throw new Error("Project not found");
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}

async function getProjects(): Promise<ProjectType[]> {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 }).lean();
    return projects.map((project) => ({
      _id: String(project._id),
      title: project.title as string,
      description: project.description as string | undefined,
      status: project.status as ProjectType["status"],
      tags: project.tags as string[],
      createdAt: (project.createdAt as Date).toISOString(),
      updatedAt: (project.updatedAt as Date).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  const handleDelete = async (project: ProjectType) => {
    "use server";
    return await deleteProject(project._id);
  };

  return (
    <div className="container mx-auto p-6 lg:py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-lg">Mono Manager</h1>

        <CreateProjectModal>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </CreateProjectModal>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex flex-col items-center gap-3">
            <FolderPlus className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">
              Ready to build something amazing?
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project: ProjectType) => (
            <ProjectCard
              key={project._id}
              project={project}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
