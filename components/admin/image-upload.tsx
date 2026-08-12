"use client"

import { useCallback, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, X, Loader2, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  bucket: string
  path?: string
  onUpload: (url: string) => void
  currentImage?: string
}

export function ImageUpload({
  bucket,
  path = "",
  onUpload,
  currentImage,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB")
        return
      }

      setIsUploading(true)
      try {
        const fileExt = file.name.split(".").pop()
        const fileName = `${path ? path + "/" : ""}${Date.now()}.${fileExt}`

        const { error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file, { upsert: true })

        if (error) throw error

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(fileName)

        setPreview(publicUrl)
        onUpload(publicUrl)
        toast.success("Image uploaded successfully")
      } catch (error) {
        toast.error("Failed to upload image")
        console.error(error)
      } finally {
        setIsUploading(false)
      }
    },
    [bucket, path, onUpload, supabase]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) uploadFile(file)
    },
    [uploadFile]
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    onUpload("")
    if (inputRef.current) inputRef.current.value = ""
  }, [onUpload])

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      {preview ? (
        <Card className="relative overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full object-cover"
          />
          <div className="absolute right-2 top-2">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          className={cn(
            "flex h-48 cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-colors",
            isDragging
              ? "border-brand-500 bg-brand-500/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Click or drag to upload
              </p>
              <p className="text-xs text-muted-foreground/70">
                PNG, JPG up to 5MB
              </p>
            </>
          )}
        </Card>
      )}

      {!preview && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Choose Image
        </Button>
      )}
    </div>
  )
}
