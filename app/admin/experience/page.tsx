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
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react"

type Experience = Database["public"]["Tables"]["experiences"]["Row"]

const employmentTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Volunteer",
]

const experienceSchema = z.object({
  job_title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  employment_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean(),
  description: z.string().optional(),
  responsibilities: z.string().optional(),
  technologies: z.string().optional(),
  company_logo: z.string().optional(),
  company_website: z.string().optional(),
  display_order: z.number().min(0),
  is_published: z.boolean(),
})

type ExperienceFormValues = z.infer<typeof experienceSchema>

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [sortField, setSortField] = useState<keyof Experience>("display_order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const supabase = createClient()

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      job_title: "",
      company: "",
      location: "",
      employment_type: "Full-time",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      responsibilities: "",
      technologies: "",
      company_logo: "",
      company_website: "",
      display_order: 0,
      is_published: true,
    },
  })

  const fetchExperiences = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) throw error
      setExperiences(data || [])
    } catch {
      toast.error("Failed to load experiences")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sortField, sortDirection])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  const handleSort = (field: keyof Experience) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openAddDialog = () => {
    setSelectedExperience(null)
    form.reset({
      job_title: "",
      company: "",
      location: "",
      employment_type: "Full-time",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
      responsibilities: "",
      technologies: "",
      company_logo: "",
      company_website: "",
      display_order: experiences.length,
      is_published: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (exp: Experience) => {
    setSelectedExperience(exp)
    form.reset({
      job_title: exp.job_title,
      company: exp.company,
      location: exp.location || "",
      employment_type: exp.employment_type || "Full-time",
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      description: exp.description || "",
      responsibilities: exp.responsibilities || "",
      technologies: Array.isArray(exp.technologies) ? exp.technologies.join(", ") : "",
      company_logo: exp.company_logo || "",
      company_website: exp.company_website || "",
      display_order: exp.display_order,
      is_published: exp.is_published,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (exp: Experience) => {
    setSelectedExperience(exp)
    setDeleteDialogOpen(true)
  }

  const onSubmit = async (values: ExperienceFormValues) => {
    setIsSaving(true)
    try {
      const technologiesArray = values.technologies
        ? values.technologies.split(",").map((t) => t.trim()).filter(Boolean)
        : []

      const payload = {
        ...values,
        technologies: technologiesArray,
        start_date: values.start_date || null,
        end_date: values.is_current ? null : (values.end_date || null),
        updated_at: new Date().toISOString(),
      }

      if (selectedExperience) {
        const { error } = await supabase
          .from("experiences")
          .update(payload)
          .eq("id", selectedExperience.id)
        if (error) throw error
        toast.success("Experience updated successfully")
      } else {
        const { error } = await supabase.from("experiences").insert(payload)
        if (error) throw error
        toast.success("Experience created successfully")
      }
      setDialogOpen(false)
      fetchExperiences()
    } catch {
      toast.error("Failed to save experience")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedExperience) return
    try {
      const { error } = await supabase
        .from("experiences")
        .delete()
        .eq("id", selectedExperience.id)
      if (error) throw error
      toast.success("Experience deleted successfully")
      setDeleteDialogOpen(false)
      fetchExperiences()
    } catch {
      toast.error("Failed to delete experience")
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return "—"
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
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
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground">Manage your work experience.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No experiences found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first experience
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
                    onClick={() => handleSort("job_title")}
                  >
                    Job Title {sortField === "job_title" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("company")}
                  >
                    Company {sortField === "company" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {experiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{exp.job_title}</TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{exp.employment_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(exp.start_date)} —{" "}
                      {exp.is_current ? "Present" : formatDate(exp.end_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={exp.is_published ? "default" : "outline"}>
                        {exp.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(exp)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(exp)}>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedExperience ? "Edit Experience" : "Add Experience"}
            </DialogTitle>
            <DialogDescription>
              {selectedExperience
                ? "Update the experience details."
                : "Add a new work experience."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title *</Label>
                <Input id="job_title" {...form.register("job_title")} placeholder="Software Engineer" />
                {form.formState.errors.job_title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.job_title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" {...form.register("company")} placeholder="Acme Inc." />
                {form.formState.errors.company && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...form.register("location")} placeholder="San Francisco, CA" />
              </div>
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select
                  value={form.watch("employment_type")}
                  onValueChange={(value) => form.setValue("employment_type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {employmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input id="start_date" type="date" {...form.register("start_date")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...form.register("end_date")}
                  disabled={form.watch("is_current")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={form.watch("is_current")}
                onCheckedChange={(checked: boolean) => {
                  form.setValue("is_current", checked)
                  if (checked) form.setValue("end_date", "")
                }}
              />
              <Label>Currently working here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Brief description of your role"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                {...form.register("responsibilities")}
                placeholder="Key responsibilities (one per line)"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technologies">Technologies (comma-separated)</Label>
              <Input
                id="technologies"
                {...form.register("technologies")}
                placeholder="React, TypeScript, Node.js"
              />
            </div>

            <div className="space-y-2">
              <Label>Company Logo</Label>
              <ImageUpload
                bucket="company-logos"
                path="logos"
                currentImage={form.watch("company_logo")}
                onUpload={(url) => form.setValue("company_logo", url)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_website">Company Website</Label>
              <Input
                id="company_website"
                {...form.register("company_website")}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
                {selectedExperience ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this experience? This action cannot be undone.
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
