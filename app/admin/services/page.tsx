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
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react"

type Service = Database["public"]["Tables"]["services"]["Row"]

const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  icon: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  features: z.string().optional(),
  starting_price: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  display_order: z.number().min(0),
  is_published: z.boolean(),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [sortField, setSortField] = useState<keyof Service>("display_order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const supabase = createClient()

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      icon: "",
      short_description: "",
      description: "",
      features: "",
      starting_price: "",
      cta_text: "",
      cta_link: "",
      display_order: 0,
      is_published: true,
    },
  })

  const fetchServices = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) throw error
      setServices(data || [])
    } catch {
      toast.error("Failed to load services")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sortField, sortDirection])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleSort = (field: keyof Service) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openAddDialog = () => {
    setSelectedService(null)
    form.reset({
      title: "",
      icon: "",
      short_description: "",
      description: "",
      features: "",
      starting_price: "",
      cta_text: "",
      cta_link: "",
      display_order: services.length,
      is_published: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setSelectedService(service)
    form.reset({
      title: service.title,
      icon: service.icon || "",
      short_description: service.short_description || "",
      description: service.description || "",
      features: service.features || "",
      starting_price: service.starting_price || "",
      cta_text: service.cta_text || "",
      cta_link: service.cta_link || "",
      display_order: service.display_order,
      is_published: service.is_published,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service)
    setDeleteDialogOpen(true)
  }

  const onSubmit = async (values: ServiceFormValues) => {
    setIsSaving(true)
    try {
      const payload = {
        ...values,
        updated_at: new Date().toISOString(),
      }

      if (selectedService) {
        const { error } = await supabase
          .from("services")
          .update(payload)
          .eq("id", selectedService.id)
        if (error) throw error
        toast.success("Service updated successfully")
      } else {
        const { error } = await supabase.from("services").insert(payload)
        if (error) throw error
        toast.success("Service created successfully")
      }
      setDialogOpen(false)
      fetchServices()
    } catch {
      toast.error("Failed to save service")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedService) return
    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", selectedService.id)
      if (error) throw error
      toast.success("Service deleted successfully")
      setDeleteDialogOpen(false)
      fetchServices()
    } catch {
      toast.error("Failed to delete service")
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
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">Manage the services you offer.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {services.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No services found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first service
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
                    onClick={() => handleSort("title")}
                  >
                    Title {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {service.icon || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant={service.is_published ? "default" : "outline"}>
                        {service.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(service)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(service)}
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
            <DialogTitle>
              {selectedService ? "Edit Service" : "Add Service"}
            </DialogTitle>
            <DialogDescription>
              {selectedService
                ? "Update the service details."
                : "Add a new service to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Web Development"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                <Input
                  id="icon"
                  {...form.register("icon")}
                  placeholder="e.g. Globe, Code, Shield"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                {...form.register("short_description")}
                placeholder="Brief one-liner about the service"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Detailed description of the service"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <Textarea
                id="features"
                {...form.register("features")}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                rows={5}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starting_price">Starting Price</Label>
                <Input
                  id="starting_price"
                  {...form.register("starting_price")}
                  placeholder="$500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cta_text">CTA Text</Label>
                <Input
                  id="cta_text"
                  {...form.register("cta_text")}
                  placeholder="Get Started"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cta_link">CTA Link</Label>
              <Input
                id="cta_link"
                {...form.register("cta_link")}
                placeholder="/contact"
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
                {selectedService ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedService?.title}&quot;? This action cannot be
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
