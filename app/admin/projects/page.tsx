"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Database } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ImageUpload } from "@/components/admin/image-upload"
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Star,
  Copy,
  ExternalLink,
} from "lucide-react"

type Project = Database["public"]["Tables"]["projects"]["Row"]

const projectCategories = [
  "Web Development",
  "Mobile Development",
  "IT Support",
  "Networking",
  "DevOps",
  "Cybersecurity",
  "Other",
]

const projectStatuses = ["Completed", "In Progress", "Archived"]

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  main_image: z.string().optional(),
  technologies: z.string().optional(),
  category: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  duration: z.string().optional(),
  status: z.string().optional(),
  github_url: z.string().optional(),
  live_url: z.string().optional(),
  demo_url: z.string().optional(),
  documentation_url: z.string().optional(),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  key_features: z.string().optional(),
  my_role: z.string().optional(),
  results: z.string().optional(),
  lessons_learned: z.string().optional(),
  is_featured: z.boolean(),
  display_order: z.number().min(0),
  is_published: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectSchema>

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sortField, setSortField] = useState<keyof Project>("display_order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const supabase = createClient()

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      slug: "",
      short_description: "",
      description: "",
      main_image: "",
      technologies: "",
      category: "",
      start_date: "",
      end_date: "",
      duration: "",
      status: "Completed",
      github_url: "",
      live_url: "",
      demo_url: "",
      documentation_url: "",
      challenges: "",
      solutions: "",
      key_features: "",
      my_role: "",
      results: "",
      lessons_learned: "",
      is_featured: false,
      display_order: 0,
      is_published: true,
      meta_title: "",
      meta_description: "",
    },
  })

  const watchName = form.watch("name")

  useEffect(() => {
    if (!selectedProject && watchName) {
      form.setValue("slug", generateSlug(watchName))
    }
  }, [watchName, selectedProject, form])

  const fetchProjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) throw error
      setProjects(data || [])
    } catch {
      toast.error("Failed to load projects")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sortField, sortDirection])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleSort = (field: keyof Project) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openAddDialog = () => {
    setSelectedProject(null)
    form.reset({
      name: "",
      slug: "",
      short_description: "",
      description: "",
      main_image: "",
      technologies: "",
      category: "",
      start_date: "",
      end_date: "",
      duration: "",
      status: "Completed",
      github_url: "",
      live_url: "",
      demo_url: "",
      documentation_url: "",
      challenges: "",
      solutions: "",
      key_features: "",
      my_role: "",
      results: "",
      lessons_learned: "",
      is_featured: false,
      display_order: projects.length,
      is_published: true,
      meta_title: "",
      meta_description: "",
    })
    setDialogOpen(true)
  }

  const openEditDialog = (project: Project) => {
    setSelectedProject(project)
    form.reset({
      name: project.name,
      slug: project.slug,
      short_description: project.short_description || "",
      description: project.description || "",
      main_image: project.main_image || "",
      technologies: Array.isArray(project.technologies) ? project.technologies.join(", ") : "",
      category: project.category || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      duration: project.duration || "",
      status: project.status || "Completed",
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      demo_url: project.demo_url || "",
      documentation_url: project.documentation_url || "",
      challenges: project.challenges || "",
      solutions: project.solutions || "",
      key_features: project.key_features || "",
      my_role: project.my_role || "",
      results: project.results || "",
      lessons_learned: project.lessons_learned || "",
      is_featured: project.is_featured,
      display_order: project.display_order,
      is_published: project.is_published,
      meta_title: project.meta_title || "",
      meta_description: project.meta_description || "",
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project)
    setDeleteDialogOpen(true)
  }

  const handleDuplicate = async (project: Project) => {
    try {
      const { id, created_at, updated_at, ...rest } = project
      const duplicateData = {
        ...rest,
        name: `${project.name} (Copy)`,
        slug: `${project.slug}-copy`,
        is_published: false,
      }
      const { error } = await supabase.from("projects").insert(duplicateData)
      if (error) throw error
      toast.success("Project duplicated successfully")
      fetchProjects()
    } catch {
      toast.error("Failed to duplicate project")
    }
  }

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSaving(true)
    try {
      const technologiesArray = values.technologies
        ? values.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : []

      const payload = {
        ...values,
        technologies: technologiesArray,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
        updated_at: new Date().toISOString(),
      }

      if (selectedProject) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", selectedProject.id)
        if (error) throw error
        toast.success("Project updated successfully")
      } else {
        const { error } = await supabase.from("projects").insert(payload)
        if (error) throw error
        toast.success("Project created successfully")
      }
      setDialogOpen(false)
      fetchProjects()
    } catch {
      toast.error("Failed to save project")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedProject) return
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", selectedProject.id)
      if (error) throw error
      toast.success("Project deleted successfully")
      setDeleteDialogOpen(false)
      fetchProjects()
    } catch {
      toast.error("Failed to delete project")
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "In Progress":
        return "secondary"
      case "Archived":
        return "outline"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No projects found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8" />
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("name")}
                  >
                    Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12">Featured</TableHead>
                  <TableHead>Publish</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {project.name}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.category || "Uncategorized"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {project.is_featured && (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.is_published ? "default" : "outline"}>
                        {project.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDuplicate(project)}
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(project)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProject ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <DialogDescription>
              {selectedProject ? "Update the project details." : "Add a new project to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...form.register("name")} placeholder="Portfolio Website" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input id="slug" {...form.register("slug")} placeholder="portfolio-website" />
                {form.formState.errors.slug && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                {...form.register("short_description")}
                placeholder="A brief one-liner about the project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Detailed description of the project"
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Main Image</Label>
              <ImageUpload
                bucket="project-images"
                path="projects"
                currentImage={form.watch("main_image")}
                onUpload={(url) => form.setValue("main_image", url)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                {...form.register("technologies")}
                placeholder="Next.js, TypeScript, Tailwind CSS"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value) => form.setValue("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {projectStatuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  {...form.register("duration")}
                  placeholder="3 months"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...form.register("start_date")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input id="end_date" type="date" {...form.register("end_date")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub URL</Label>
                <Input
                  id="github_url"
                  {...form.register("github_url")}
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="live_url">Live URL</Label>
                <Input
                  id="live_url"
                  {...form.register("live_url")}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demo_url">Demo URL</Label>
                <Input
                  id="demo_url"
                  {...form.register("demo_url")}
                  placeholder="https://demo.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentation_url">Documentation URL</Label>
                <Input
                  id="documentation_url"
                  {...form.register("documentation_url")}
                  placeholder="https://docs.example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="my_role">My Role</Label>
              <Textarea
                id="my_role"
                {...form.register("my_role")}
                placeholder="Describe your role in the project"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="key_features">Key Features</Label>
              <Textarea
                id="key_features"
                {...form.register("key_features")}
                placeholder="List the key features (one per line)"
                rows={3}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges</Label>
                <Textarea
                  id="challenges"
                  {...form.register("challenges")}
                  placeholder="Challenges faced during development"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solutions">Solutions</Label>
                <Textarea
                  id="solutions"
                  {...form.register("solutions")}
                  placeholder="How challenges were overcome"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="results">Results</Label>
                <Textarea
                  id="results"
                  {...form.register("results")}
                  placeholder="Project outcomes and impact"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lessons_learned">Lessons Learned</Label>
                <Textarea
                  id="lessons_learned"
                  {...form.register("lessons_learned")}
                  placeholder="Key takeaways from the project"
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_title">Meta Title (SEO)</Label>
              <Input
                id="meta_title"
                {...form.register("meta_title")}
                placeholder="Page title for search engines"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta_description">Meta Description (SEO)</Label>
              <Textarea
                id="meta_description"
                {...form.register("meta_description")}
                placeholder="Page description for search engines"
                rows={2}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  min={0}
                  {...form.register("display_order", { valueAsNumber: true })}
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={form.watch("is_featured")}
                  onCheckedChange={(checked: boolean) => form.setValue("is_featured", checked)}
                />
                <Label>Featured</Label>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={form.watch("is_published")}
                  onCheckedChange={(checked: boolean) => form.setValue("is_published", checked)}
                />
                <Label>Published</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedProject ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedProject?.name}&quot;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
