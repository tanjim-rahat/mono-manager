"use client";

import { Plus, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateProjectModal from "@/components/CreateProjectModal";

export default function Home() {
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

      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-3">
          <FolderPlus className="h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg text-muted-foreground">
            Ready to build something amazing?
          </p>
        </div>
      </div>
    </div>
  );
}
