import Project from "@/models/Project";
import { type Project as ProjectData } from "@/lib/types";

async function getProjectData(id: string): Promise<ProjectData> {
  try {
    const project = await Project.findById(id).lean();
    if (!project) {
      throw new Error("Project not found");
    }
    return project as unknown as ProjectData;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch project data"
    );
  }
}

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params;
  const project = await getProjectData(id);
  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
    </div>
  );
}
