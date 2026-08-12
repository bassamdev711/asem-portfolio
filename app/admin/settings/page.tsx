"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Database } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"

type SiteSetting = Database["public"]["Tables"]["site_settings"]["Row"]

const defaultSettings = [
  { key: "site_name", label: "Site Name", type: "text", placeholder: "My Portfolio" },
  { key: "site_description", label: "Site Description", type: "textarea", placeholder: "A brief description of your site" },
  { key: "footer_text", label: "Footer Text", type: "text", placeholder: "© 2024 All rights reserved" },
  { key: "copyright", label: "Copyright", type: "text", placeholder: "© 2024 Your Name" },
  { key: "primary_email", label: "Primary Email", type: "email", placeholder: "you@example.com" },
  { key: "contact_email", label: "Contact Email", type: "email", placeholder: "contact@example.com" },
]

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([])
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  const fetchSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")

      if (error) throw error

      setSettings(data || [])

      const values: Record<string, string> = {}
      for (const setting of defaultSettings) {
        const existing = data?.find((s) => s.key === setting.key)
        values[setting.key] = existing?.value || ""
      }
      setFormValues(values)

      const existingKeys = data?.map((s) => s.key) || []
      const missingKeys = defaultSettings
        .filter((s) => !existingKeys.includes(s.key))
        .map((s) => ({
          key: s.key,
          value: "",
          type: s.type,
        }))

      if (missingKeys.length > 0) {
        const { error: insertError } = await supabase
          .from("site_settings")
          .insert(missingKeys)
        if (insertError) throw insertError

        const { data: allData, error: refetchError } = await supabase
          .from("site_settings")
          .select("*")
        if (refetchError) throw refetchError
        setSettings(allData || [])
      }
    } catch {
      toast.error("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      for (const setting of defaultSettings) {
        const existing = settings.find((s) => s.key === setting.key)
        const value = formValues[setting.key] || ""

        if (existing) {
          const { error } = await supabase
            .from("site_settings")
            .update({ value, updated_at: new Date().toISOString() })
            .eq("id", existing.id)
          if (error) throw error
        } else {
          const { error } = await supabase
            .from("site_settings")
            .insert({ key: setting.key, value, type: setting.type })
          if (error) throw error
        }
      }

      toast.success("Settings saved successfully")
      fetchSettings()
    } catch {
      toast.error("Failed to save settings")
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
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground">Manage your site-wide configuration.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure basic site information and contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {defaultSettings.map((setting) => (
              <div key={setting.key} className="space-y-2">
                <Label htmlFor={setting.key}>{setting.label}</Label>
                {setting.type === "textarea" ? (
                  <Textarea
                    id={setting.key}
                    value={formValues[setting.key] || ""}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    placeholder={setting.placeholder}
                    rows={3}
                  />
                ) : (
                  <Input
                    id={setting.key}
                    type={setting.type}
                    value={formValues[setting.key] || ""}
                    onChange={(e) => handleChange(setting.key, e.target.value)}
                    placeholder={setting.placeholder}
                  />
                )}
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
