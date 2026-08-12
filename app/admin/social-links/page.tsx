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
import { Loader2, Plus, Pencil, Trash2, GripVertical, ExternalLink } from "lucide-react"

type SocialLink = Database["public"]["Tables"]["social_links"]["Row"]

const platforms = [
  "LinkedIn",
  "GitHub",
  "Email",
  "WhatsApp",
  "Telegram",
  "Facebook",
  "Instagram",
  "X",
  "YouTube",
  "Other",
]

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL").min(1, "URL is required"),
  username: z.string().optional(),
  display_order: z.number().min(0),
  is_published: z.boolean(),
})

type SocialLinkFormValues = z.infer<typeof socialLinkSchema>

export default function AdminSocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState<SocialLink | null>(null)
  const supabase = createClient()

  const form = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: "",
      url: "",
      username: "",
      display_order: 0,
      is_published: true,
    },
  })

  const fetchSocialLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) throw error
      setSocialLinks(data || [])
    } catch {
      toast.error("Failed to load social links")
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSocialLinks()
  }, [fetchSocialLinks])

  const openAddDialog = () => {
    setSelectedLink(null)
    form.reset({
      platform: "",
      url: "",
      username: "",
      display_order: socialLinks.length,
      is_published: true,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (link: SocialLink) => {
    setSelectedLink(link)
    form.reset({
      platform: link.platform,
      url: link.url,
      username: link.username || "",
      display_order: link.display_order,
      is_published: link.is_published,
    })
    setDialogOpen(true)
  }

  const openDeleteDialog = (link: SocialLink) => {
    setSelectedLink(link)
    setDeleteDialogOpen(true)
  }

  const onSubmit = async (values: SocialLinkFormValues) => {
    setIsSaving(true)
    try {
      const payload = {
        ...values,
        updated_at: new Date().toISOString(),
      }

      if (selectedLink) {
        const { error } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", selectedLink.id)
        if (error) throw error
        toast.success("Social link updated successfully")
      } else {
        const { error } = await supabase.from("social_links").insert(payload)
        if (error) throw error
        toast.success("Social link created successfully")
      }
      setDialogOpen(false)
      fetchSocialLinks()
    } catch {
      toast.error("Failed to save social link")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedLink) return
    try {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", selectedLink.id)
      if (error) throw error
      toast.success("Social link deleted successfully")
      setDeleteDialogOpen(false)
      fetchSocialLinks()
    } catch {
      toast.error("Failed to delete social link")
    }
  }

  const handleReorder = async (link: SocialLink, direction: "up" | "down") => {
    const currentIndex = socialLinks.findIndex((l) => l.id === link.id)
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1

    if (newIndex < 0 || newIndex >= socialLinks.length) return

    const updatedLinks = [...socialLinks]
    const [movedLink] = updatedLinks.splice(currentIndex, 1)
    updatedLinks.splice(newIndex, 0, movedLink)

    const updates = updatedLinks.map((l, i) => ({
      id: l.id,
      display_order: i,
    }))

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from("social_links")
          .update({ display_order: update.display_order, updated_at: new Date().toISOString() })
          .eq("id", update.id)
        if (error) throw error
      }
      fetchSocialLinks()
    } catch {
      toast.error("Failed to reorder")
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
          <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground">Manage your social media profiles.</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Social Link
        </Button>
      </div>

      {socialLinks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">No social links found.</p>
            <Button variant="outline" className="mt-4" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" /> Add your first social link
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Order</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socialLinks.map((link, index) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          disabled={index === 0}
                          onClick={() => handleReorder(link, "up")}
                        >
                          <GripVertical className="h-3 w-3" />
                        </Button>
                        <span className="text-xs text-muted-foreground">{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant="secondary">{link.platform}</Badge>
                    </TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.url.length > 40 ? link.url.slice(0, 40) + "..." : link.url}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    </TableCell>
                    <TableCell>{link.username || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={link.is_published ? "default" : "outline"}>
                        {link.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(link)}>
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedLink ? "Edit Social Link" : "Add Social Link"}
            </DialogTitle>
            <DialogDescription>
              {selectedLink
                ? "Update the social link details."
                : "Add a new social media profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Platform *</Label>
              <Select
                value={form.watch("platform")}
                onValueChange={(value) => form.setValue("platform", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.platform && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.platform.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="url">URL *</Label>
              <Input
                id="url"
                {...form.register("url")}
                placeholder="https://linkedin.com/in/username"
              />
              {form.formState.errors.url && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...form.register("username")}
                placeholder="username"
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
                {selectedLink ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Social Link</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {selectedLink?.platform} link? This action cannot
              be undone.
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
