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
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Plus, Pencil, Trash2, GripVertical, ExternalLink } from "lucide-react"

type Education = Database["public"]["Tables"]["education"]["Row"]

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  location: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  description: z.string().optional(),
  gpa: z.string().optional(),
  website: z.string().optional(),
  display_order: z.number().min(0),
  is_published: z.boolean(),
})

type EducationFormValues = z.infer<typeof educationSchema>

export default function AdminEducationPage() {
  const [education, setEducation] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null)
  const [sortField, setSortField] = useState<keyof Education>("display_order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const supabase = createClient()

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      location: "",
      start_date: "",
      end_date: "",
      description: "",
      gpa: "",
      website: "",
      display_order: 0,
      is_published: true,
    },
  })

  const fetchEducation = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) throw error
      setEducation(data || [])
    } catch {
      toast.error("Failed to load education")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sortField, sortDirection])

  useEffect(() => {
    fetchEducation()
  }, [fetchEducation])

  const handleSort = (field: keyof Education) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openAddDialog = () => {
    setSelectedEducation(null)
    form.reset({
      degree: "",
      institution: "",
      location: "",
      start_date: "",
      end_date: "",
      description: "",
      gpa: "",
      website: "",
      display_order: education.length,
      is_published: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (edu: Education) => {
    setSelectedEducation(edu)
    form.reset({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location || "",
      start_date: edu.start_date || "",
      end_date: edu.end_date || "",
      description: edu.description || "",
      gpa: edu.gpa || "",
      website: edu.website || "",
      display_order: edu.display_order,
      is_published: edu.is_published,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (edu: Education) => {
    setSelectedEducation(edu)
    setDeleteDialogOpen(true)
  }

  const onSubmit = async (values: EducationFormValues) => {
    setIsSaving(true)
    try {
      const payload = {
        ...values,
        start_date: values.start_date || null,
        end_date: values.end_date || null,
        updated_at: new Date().toISOString(),
      }

      if (selectedEducation) {
        const { error } = await supabase
          .from("education")
          .update(payload)
          .eq("id", selectedEducation.id)
        if (error) throw error
        toast.success("Education updated successfully")
      } else {
        const { error } = await supabase.from("education").insert(payload)
        if (error) throw error
        toast.success("Education created successfully")
      }
      setDialogOpen(false)
      fetchEducation()
    } catch {
      toast.error("Failed to save education")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedEducation) return
    try {
      const { error } = await supabase
        .from("education")
        .delete()
        .eq("id", selectedEducation.id)
      if (error) throw error
      toast.success("Education deleted successfully")
      setDeleteDialogOpen(false)
      fetchEducation()
    } catch {
      toast.error("Failed to delete education")
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
          <h1 className="text-3xl font-bold tracking-tight">Education</h1>
          <p className="text-muted-foreground">Manage your educational background.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No education entries found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first education entry
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
                    onClick={() => handleSort("degree")}
                  >
                    Degree {sortField === "degree" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("institution")}
                  >
                    Institution{" "}
                    {sortField === "institution" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {education.map((edu) => (
                  <TableRow key={edu.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{edu.degree}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {edu.institution}
                        {edu.website && (
                          <a
                            href={edu.website}
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
                      {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={edu.is_published ? "default" : "outline"}>
                        {edu.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(edu)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(edu)}>
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
              {selectedEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              {selectedEducation
                ? "Update the education details."
                : "Add a new education entry."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  {...form.register("degree")}
                  placeholder="B.S. Computer Science"
                />
                {form.formState.errors.degree && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.degree.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution *</Label>
                <Input
                  id="institution"
                  {...form.register("institution")}
                  placeholder="University of Technology"
                />
                {form.formState.errors.institution && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.institution.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...form.register("location")}
                placeholder="City, Country"
              />
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your studies, achievements, and activities"
                rows={4}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gpa">GPA</Label>
                <Input id="gpa" {...form.register("gpa")} placeholder="3.8/4.0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  {...form.register("website")}
                  placeholder="https://university.edu"
                />
              </div>
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
                {selectedEducation ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Education</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this education entry? This action cannot be undone.
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
