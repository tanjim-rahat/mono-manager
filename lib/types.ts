export type Project = {
  _id: string;
  title: string;
  description?: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  tags: string[];
  createdAt: string;
  updatedAt: string;
};
