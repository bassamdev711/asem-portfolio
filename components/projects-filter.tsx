"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  Star,
  ExternalLink,
  Github,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  main_image: string;
  technologies: string[];
  category: string;
  status: string;
  duration: string;
  github_url: string;
  live_url: string;
  is_featured: boolean;
};

interface ProjectsFilterProps {
  projects: Project[];
}

const statuses = ["All", "Completed", "In Progress", "Planning"];
const categories = [
  "All",
  "Web Development",
  "Mobile App",
  "Full-Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "Design",
];

export function ProjectsFilter({ projects }: ProjectsFilterProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((p) => p.technologies?.forEach((t) => techSet.add(t)));
    return Array.from(techSet).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        search === "" ||
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.short_description?.toLowerCase().includes(search.toLowerCase()) ||
        project.technologies?.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" ||
        project.status?.toLowerCase() === selectedStatus.toLowerCase();

      const matchesTech =
        !selectedTech ||
        project.technologies?.includes(selectedTech);

      return matchesSearch && matchesCategory && matchesStatus && matchesTech;
    });
  }, [projects, search, selectedCategory, selectedStatus, selectedTech]);

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
      case "in progress":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "planning":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            className="h-9 w-9"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="rounded-full"
            >
              {status}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {allTechnologies.map((tech) => (
            <Badge
              key={tech}
              variant={selectedTech === tech ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-colors",
                selectedTech === tech
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => setSelectedTech(selectedTech === tech ? null : tech)}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCategory}-${selectedStatus}-${selectedTech}-${search}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            viewMode === "grid"
              ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          )}
        >
          {filteredProjects.map((project, index) =>
            viewMode === "grid" ? (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {project.main_image ? (
                      <img
                        src={project.main_image}
                        alt={project.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {project.is_featured && (
                        <Badge className="bg-yellow-500/90 text-white border-0">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Featured
                        </Badge>
                      )}
                      <Badge className={cn("border", statusColor(project.status))}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {project.short_description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.technologies?.slice(0, 5).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {(project.technologies?.length ?? 0) > 5 && (
                        <Badge variant="secondary" className="text-xs">
                          +{project.technologies!.length - 5}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link href={`/projects/${project.slug}`}>
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                      {project.github_url && (
                        <Button asChild variant="outline" size="icon" className="h-9 w-9">
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.live_url && (
                        <Button asChild variant="outline" size="icon" className="h-9 w-9">
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="group hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4 flex gap-4">
                    <div className="relative w-48 h-32 shrink-0 rounded-lg overflow-hidden bg-muted">
                      {project.main_image ? (
                        <img
                          src={project.main_image}
                          alt={project.name}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                          {project.name}
                        </h3>
                        {project.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 shrink-0" />
                        )}
                        <Badge
                          className={cn(
                            "text-xs border shrink-0",
                            statusColor(project.status)
                          )}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {project.short_description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.technologies?.slice(0, 6).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button asChild size="sm">
                          <Link href={`/projects/${project.slug}`}>
                            View Details
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                        {project.github_url && (
                          <Button asChild variant="ghost" size="sm">
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {project.live_url && (
                          <Button asChild variant="ghost" size="sm">
                            <a
                              href={project.live_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            No projects found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedStatus("All");
              setSelectedTech(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
