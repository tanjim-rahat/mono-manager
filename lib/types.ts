export type Project = {
  _id: string;
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatus = Project["status"];

export type StatusConfigItem = {
  label: string;
  variant: "default" | "secondary" | "destructive";
  color: string;
};

export type StatusConfig = Record<ProjectStatus, StatusConfigItem>;
