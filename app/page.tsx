import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "@/components/CreateProjectModal";
import ProjectCard from "@/components/ProjectCard";

interface ProjectType {
  _id: string;
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

async function getProjects(): Promise<ProjectType[]> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/project`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

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
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
