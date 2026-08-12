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
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2, Plus, Pencil, Trash2, GripVertical, ExternalLink } from "lucide-react"

type Certification = Database["public"]["Tables"]["certifications"]["Row"]

const certSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuing_organization: z.string().min(1, "Organization is required"),
  issue_date: z.string().optional(),
  expiration_date: z.string().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().optional(),
  certificate_image: z.string().optional(),
  description: z.string().optional(),
  skills: z.string().optional(),
  display_order: z.number().min(0),
  is_published: z.boolean(),
})

type CertFormValues = z.infer<typeof certSchema>

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null)
  const [sortField, setSortField] = useState<keyof Certification>("display_order")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const supabase = createClient()

  const form = useForm<CertFormValues>({
    resolver: zodResolver(certSchema),
    defaultValues: {
      name: "",
      issuing_organization: "",
      issue_date: "",
      expiration_date: "",
      credential_id: "",
      credential_url: "",
      certificate_image: "",
      description: "",
      skills: "",
      display_order: 0,
      is_published: true,
    },
  })

  const fetchCertifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order(sortField, { ascending: sortDirection === "asc" })

      if (error) throw error
      setCertifications(data || [])
    } catch {
      toast.error("Failed to load certifications")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, sortField, sortDirection])

  useEffect(() => {
    fetchCertifications()
  }, [fetchCertifications])

  const handleSort = (field: keyof Certification) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const openAddDialog = () => {
    setSelectedCert(null)
    form.reset({
      name: "",
      issuing_organization: "",
      issue_date: "",
      expiration_date: "",
      credential_id: "",
      credential_url: "",
      certificate_image: "",
      description: "",
      skills: "",
      display_order: certifications.length,
      is_published: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (cert: Certification) => {
    setSelectedCert(cert)
    form.reset({
      name: cert.name,
      issuing_organization: cert.issuing_organization,
      issue_date: cert.issue_date || "",
      expiration_date: cert.expiration_date || "",
      credential_id: cert.credential_id || "",
      credential_url: cert.credential_url || "",
      certificate_image: cert.certificate_image || "",
      description: cert.description || "",
      skills: Array.isArray(cert.skills) ? cert.skills.join(", ") : "",
      display_order: cert.display_order,
      is_published: cert.is_published,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (cert: Certification) => {
    setSelectedCert(cert)
    setDeleteDialogOpen(true)
  }

  const onSubmit = async (values: CertFormValues) => {
    setIsSaving(true)
    try {
      const skillsArray = values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : []

      const payload = {
        ...values,
        skills: skillsArray,
        issue_date: values.issue_date || null,
        expiration_date: values.expiration_date || null,
        updated_at: new Date().toISOString(),
      }

      if (selectedCert) {
        const { error } = await supabase
          .from("certifications")
          .update(payload)
          .eq("id", selectedCert.id)
        if (error) throw error
        toast.success("Certification updated successfully")
      } else {
        const { error } = await supabase.from("certifications").insert(payload)
        if (error) throw error
        toast.success("Certification created successfully")
      }
      setDialogOpen(false)
      fetchCertifications()
    } catch {
      toast.error("Failed to save certification")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCert) return
    try {
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", selectedCert.id)
      if (error) throw error
      toast.success("Certification deleted successfully")
      setDeleteDialogOpen(false)
      fetchCertifications()
    } catch {
      toast.error("Failed to delete certification")
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
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground">Manage your certifications and credentials.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No certifications found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first certification
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
                    onClick={() => handleSort("issuing_organization")}
                  >
                    Organization{" "}
                    {sortField === "issuing_organization" && (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {cert.name}
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{cert.issuing_organization}</TableCell>
                    <TableCell>{formatDate(cert.issue_date)}</TableCell>
                    <TableCell>{formatDate(cert.expiration_date)}</TableCell>
                    <TableCell>
                      <Badge variant={cert.is_published ? "default" : "outline"}>
                        {cert.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(cert)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(cert)}>
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
              {selectedCert ? "Edit Certification" : "Add Certification"}
            </DialogTitle>
            <DialogDescription>
              {selectedCert
                ? "Update the certification details."
                : "Add a new certification to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="AWS Solutions Architect"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuing_organization">Organization *</Label>
                <Input
                  id="issuing_organization"
                  {...form.register("issuing_organization")}
                  placeholder="Amazon Web Services"
                />
                {form.formState.errors.issuing_organization && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.issuing_organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input id="issue_date" type="date" {...form.register("issue_date")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input id="expiration_date" type="date" {...form.register("expiration_date")} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="credential_id">Credential ID</Label>
                <Input
                  id="credential_id"
                  {...form.register("credential_id")}
                  placeholder="ABC123XYZ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credential_url">Credential URL</Label>
                <Input
                  id="credential_url"
                  {...form.register("credential_url")}
                  placeholder="https://verify.example.com/..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Certificate Image</Label>
              <ImageUpload
                bucket="certification-images"
                path="certs"
                currentImage={form.watch("certificate_image")}
                onUpload={(url) => form.setValue("certificate_image", url)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Description of the certification"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                {...form.register("skills")}
                placeholder="Cloud Architecture, AWS, Networking"
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
                {selectedCert ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Certification</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedCert?.name}&quot;? This action cannot be
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
