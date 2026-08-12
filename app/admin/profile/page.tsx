"use client"

import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ImageUpload } from "@/components/admin/image-upload"
import { toast } from "sonner"
import { Loader2, Save, Upload } from "lucide-react"
import type { Database } from "@/lib/types/database"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCv, setIsUploadingCv] = useState(false)
  const cvInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const [form, setForm] = useState({
    full_name: "",
    professional_title: "",
    headline: "",
    about: "",
    location: "",
    email: "",
    phone: "",
    profile_image: "",
    cv_file_url: "",
  })

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .single()

        if (error && error.code !== "PGRST116") throw error

        if (data) {
          setProfile(data)
          setForm({
            full_name: data.full_name || "",
            professional_title: data.professional_title || "",
            headline: data.headline || "",
            about: data.about || "",
            location: data.location || "",
            email: data.email || "",
            phone: data.phone || "",
            profile_image: data.profile_image || "",
            cv_file_url: data.cv_file_url || "",
          })
        }
      } catch (error) {
        console.error(error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file")
      return
    }

    setIsUploadingCv(true)
    try {
      const fileName = `cv/${Date.now()}.pdf`

      const { error } = await supabase.storage
        .from("cv-files")
        .upload(fileName, file, { upsert: true })

      if (error) throw error

      const {
        data: { publicUrl },
      } = supabase.storage.from("cv-files").getPublicUrl(fileName)

      setForm((prev) => ({ ...prev, cv_file_url: publicUrl }))
      toast.success("CV uploaded successfully")
    } catch {
      toast.error("Failed to upload CV")
    } finally {
      setIsUploadingCv(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const payload = {
        ...form,
        updated_at: new Date().toISOString(),
      }

      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update(payload)
          .eq("id", user.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("profiles").insert({
          id: user.id,
          ...payload,
        })

        if (error) throw error
      }

      toast.success("Profile saved successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to save profile")
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
              <CardDescription>Your profile photo</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                bucket="profile-images"
                path="profile"
                currentImage={form.profile_image}
                onUpload={(url) =>
                  setForm((prev) => ({ ...prev, profile_image: url }))
                }
              />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="professional_title">Professional Title</Label>
                  <Input
                    id="professional_title"
                    name="professional_title"
                    value={form.professional_title}
                    onChange={handleChange}
                    placeholder="Senior Software Engineer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  placeholder="Building exceptional digital experiences"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  name="about"
                  value={form.about}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows={5}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resume / CV</CardTitle>
            <CardDescription>Upload your CV in PDF format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf"
                onChange={handleCvUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => cvInputRef.current?.click()}
                disabled={isUploadingCv}
              >
                {isUploadingCv ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload CV
              </Button>
              {form.cv_file_url && (
                <a
                  href={form.cv_file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-brand-500 hover:underline"
                >
                  View current CV
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
