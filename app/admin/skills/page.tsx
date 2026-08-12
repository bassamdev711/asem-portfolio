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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react"

type Skill = Database["public"]["Tables"]["skills"]["Row"]

const categories = [
  "Networking",
  "IT Support",
  "Mobile Development",
  "Programming",
  "Databases",
  "Cloud",
  "Cybersecurity",
  "Tools",
  "Other",
]

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  proficiency: z.number().min(0).max(100),
  years_experience: z.number().min(0).max(50),
  display_order: z.number().min(0),
  is_published: z.boolean(),
})

type SkillFormValues = z.infer<typeof skillSchema>

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [sortField, setSortField] = useState<keyof Skill>("display_order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const supabase = createClient()

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      icon: "",
      proficiency: 50,
      years_experience: 0,
      display_order: 0,
      is_published: true,
    },
  })

  const fetchSkills = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) throw error
      setSkills(data || [])
    } catch {
      toast.error("Failed to load skills")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sortField, sortDirection])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  const handleSort = (field: keyof Skill) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openAddDialog = () => {
    setSelectedSkill(null)
    form.reset({
      name: "",
      category: "",
      description: "",
      icon: "",
      proficiency: 50,
      years_experience: 0,
      display_order: skills.length,
      is_published: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (skill: Skill) => {
    setSelectedSkill(skill)
    form.reset({
      name: skill.name,
      category: skill.category,
      description: skill.description || "",
      icon: skill.icon || "",
      proficiency: skill.proficiency,
      years_experience: skill.years_experience,
      display_order: skill.display_order,
      is_published: skill.is_published,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill)
    setDeleteDialogOpen(true)
  }

  const onSubmit = async (values: SkillFormValues) => {
    setIsSaving(true)
    try {
      if (selectedSkill) {
        const { error } = await supabase
          .from("skills")
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq("id", selectedSkill.id)
        if (error) throw error
        toast.success("Skill updated successfully")
      } else {
        const { error } = await supabase.from("skills").insert(values)
        if (error) throw error
        toast.success("Skill created successfully")
      }
      setDialogOpen(false)
      fetchSkills()
    } catch {
      toast.error("Failed to save skill")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSkill) return
    try {
      const { error } = await supabase
        .from("skills")
        .delete()
        .eq("id", selectedSkill.id)
      if (error) throw error
      toast.success("Skill deleted successfully")
      setDeleteDialogOpen(false)
      fetchSkills()
    } catch {
      toast.error("Failed to delete skill")
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
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Skill
        </Button>
      </div>

      {skills.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No skills found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first skill
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
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("category")}
                  >
                    Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort("years_experience")}
                  >
                    Years {sortField === "years_experience" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{skill.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {skill.proficiency}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{skill.years_experience}</TableCell>
                    <TableCell>
                      <Badge variant={skill.is_published ? "default" : "outline"}>
                        {skill.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(skill)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(skill)}
                      >
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
            <DialogTitle>{selectedSkill ? "Edit Skill" : "Add Skill"}</DialogTitle>
            <DialogDescription>
              {selectedSkill ? "Update the skill details." : "Add a new skill to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...form.register("name")} placeholder="e.g. React" />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Brief description of the skill"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Lucide icon name)</Label>
              <Input
                id="icon"
                {...form.register("icon")}
                placeholder="e.g. Code, Smartphone, Database"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Proficiency: {form.watch("proficiency")}%</Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  {...form.register("proficiency", { valueAsNumber: true })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input
                  id="years_experience"
                  type="number"
                  min={0}
                  max={50}
                  {...form.register("years_experience", { valueAsNumber: true })}
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
                {selectedSkill ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedSkill?.name}&quot;? This action cannot be
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
