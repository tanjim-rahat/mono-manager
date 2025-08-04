export type Project = {
  _id: string;
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  tasks: string[]; // Array of Task IDs
  createdAt: string;
  updatedAt: string;
};

export type Attachment = {
  name: string;
  url: string;
  type: string;
  size?: number;
  uploadedAt: string;
};

export type Task = {
  _id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "review" | "completed" | "cancelled";
  attachments: Attachment[];
  subtasks: string[]; // Array of Task IDs
  parentTask?: string; // Parent Task ID
  projectId?: string; // Project ID
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatus = Project["status"];
export type TaskStatus = Task["status"];

export type StatusConfigItem = {
  label: string;
  variant: "default" | "secondary" | "destructive";
  color: string;
};

export type StatusConfig = Record<ProjectStatus, StatusConfigItem>;
