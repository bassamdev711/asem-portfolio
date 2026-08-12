import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderX } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <section className="py-32 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
            <FolderX className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Project Not Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Button asChild>
          <Link href="/projects">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Link>
        </Button>
      </div>
    </section>
  );
}
