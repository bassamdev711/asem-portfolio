import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none gradient-text select-none">
            404
          </h1>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to a
            different location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </a>
          <a href="/projects" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            View Projects
          </a>
        </div>
      </div>
    </section>
  );
}
