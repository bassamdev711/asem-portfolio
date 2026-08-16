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
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/components/admin/image-upload"
import { Loader2, Save } from "lucide-react"

type SeoSetting = Database["public"]["Tables"]["seo_settings"]["Row"]

const pages = ["home", "about", "projects", "contact"]

const seoSchema = z.object({
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image: z.string().optional(),
  keywords: z.string().optional(),
  canonical_url: z.string().optional(),
  is_indexable: z.boolean(),
})

type SeoFormValues = z.infer<typeof seoSchema>

export default function AdminSeoPage() {
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const supabase = createClient()

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      meta_title: "",
      meta_description: "",
      og_image: "",
      keywords: "",
      canonical_url: "",
      is_indexable: true,
    },
  })

  const fetchSeoSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .order("page_slug", { ascending: true })

      if (error) throw error

      const existingPages = (data || []).map((s) => s.page_slug)
      const missingPages = pages.filter((p) => !existingPages.includes(p))

      if (missingPages.length > 0) {
        const inserts = missingPages.map((page) => ({
          page_slug: page,
          meta_title: "",
          meta_description: "",
          og_image: "",
          keywords: "",
          canonical_url: "",
          is_indexable: true,
        }))

        const { error: insertError } = await supabase.from("seo_settings").insert(inserts)
        if (insertError) throw insertError

        const { data: allData, error: refetchError } = await supabase
          .from("seo_settings")
          .select("*")
          .order("page_slug", { ascending: true })

        if (refetchError) throw refetchError
        setSeoSettings(allData || [])
      } else {
        setSeoSettings(data || [])
      }
    } catch {
      toast.error("Failed to load SEO settings")
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSeoSettings()
  }, [fetchSeoSettings])

  useEffect(() => {
    const currentSetting = seoSettings.find((s) => s.page_slug === activeTab)
    if (currentSetting) {
      form.reset({
        meta_title: currentSetting.meta_title || "",
        meta_description: currentSetting.meta_description || "",
        og_image: currentSetting.og_image || "",
        keywords: currentSetting.keywords || "",
        canonical_url: currentSetting.canonical_url || "",
        is_indexable: currentSetting.is_indexable,
      })
    }
  }, [activeTab, seoSettings, form])

  const onSubmit = async (values: SeoFormValues) => {
    setIsSaving(true)
    try {
      const existingSetting = seoSettings.find((s) => s.page_slug === activeTab)

      const payload = {
        ...values,
        updated_at: new Date().toISOString(),
      }

      if (existingSetting) {
        const { error } = await supabase
          .from("seo_settings")
          .update(payload)
          .eq("id", existingSetting.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from("seo_settings")
          .insert({ page_slug: activeTab, ...payload })
        if (error) throw error
      }

      toast.success("SEO settings saved successfully")
      fetchSeoSettings()
    } catch {
      toast.error("Failed to save SEO settings")
    } finally {
      setIsSaving(false)
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
        <p className="text-muted-foreground">Manage search engine optimization for each page.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          {pages.map((page) => (
            <TabsTrigger key={page} value={page} className="capitalize">
              {page}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((page) => (
          <TabsContent key={page} value={page}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">{page} Page SEO</CardTitle>
                  <CardDescription>
                    Configure meta tags and settings for the {page} page.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meta_title">Meta Title</Label>
                    <Input
                      id="meta_title"
                      {...form.register("meta_title")}
                      placeholder="Page title for search engines (50-60 chars recommended)"
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.watch("meta_title")?.length || 0}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meta_description">Meta Description</Label>
                    <Textarea
                      id="meta_description"
                      {...form.register("meta_description")}
                      placeholder="Page description for search engines (150-160 chars recommended)"
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {form.watch("meta_description")?.length || 0}/160 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>OG Image (Open Graph)</Label>
                    <ImageUpload
                      bucket="site-assets"
                      path={page}
                      currentImage={form.watch("og_image")}
                      onUpload={(url) => form.setValue("og_image", url)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      {...form.register("keywords")}
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="canonical_url">Canonical URL</Label>
                    <Input
                      id="canonical_url"
                      {...form.register("canonical_url")}
                      placeholder="https://example.com/page"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={form.watch("is_indexable")}
                      onCheckedChange={(checked: boolean) => form.setValue("is_indexable", checked)}
                    />
                    <Label>Allow search engines to index this page</Label>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save SEO Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
