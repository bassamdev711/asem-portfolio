"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Database } from "@/lib/types/database"
import { Button } from "@/components/ui/button"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Loader2,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Eye,
  Inbox,
} from "lucide-react"

type Message = Database["public"]["Tables"]["contact_messages"]["Row"]

type FilterType = "all" | "unread" | "archived"

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>("all")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const supabase = createClient()

  const fetchMessages = useCallback(async () => {
    try {
      let query = supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false })

      if (filter === "unread") {
        query = query.eq("is_read", false).eq("is_archived", false)
      } else if (filter === "archived") {
        query = query.eq("is_archived", true)
      } else {
        query = query.eq("is_archived", false)
      }

      const { data, error } = await query
      if (error) throw error
      setMessages(data || [])
    } catch {
      toast.error("Failed to load messages")
    } finally {
      setIsLoading(false)
    }
  }, [supabase, filter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_archived).length

  const openMessage = async (message: Message) => {
    setSelectedMessage(message)
    setViewDialogOpen(true)

    if (!message.is_read) {
      try {
        const { error } = await supabase
          .from("contact_messages")
          .update({ is_read: true })
          .eq("id", message.id)
        if (error) throw error
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, is_read: true } : m))
        )
      } catch {
        toast.error("Failed to mark as read")
      }
    }
  }

  const toggleReadStatus = async (message: Message) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_read: !message.is_read })
        .eq("id", message.id)
      if (error) throw error
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, is_read: !m.is_read } : m))
      )
      toast.success(message.is_read ? "Marked as unread" : "Marked as read")
    } catch {
      toast.error("Failed to update message")
    }
  }

  const archiveMessage = async (message: Message) => {
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ is_archived: true })
        .eq("id", message.id)
      if (error) throw error
      toast.success("Message archived")
      fetchMessages()
    } catch {
      toast.error("Failed to archive message")
    }
  }

  const openDeleteDialog = (message: Message) => {
    setSelectedMessage(message)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!selectedMessage) return
    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", selectedMessage.id)
      if (error) throw error
      toast.success("Message deleted")
      setDeleteDialogOpen(false)
      fetchMessages()
    } catch {
      toast.error("Failed to delete message")
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Manage contact form submissions.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {(["all", "unread", "archived"] as FilterType[]).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter(f)
              setIsLoading(true)
            }}
          >
            {f === "all" && <Inbox className="mr-2 h-4 w-4" />}
            {f === "unread" && <Mail className="mr-2 h-4 w-4" />}
            {f === "archived" && <Archive className="mr-2 h-4 w-4" />}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Inbox className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-muted-foreground">
              {filter === "all"
                ? "No messages yet."
                : filter === "unread"
                ? "No unread messages."
                : "No archived messages."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12" />
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openMessage(message)}
                  >
                    <TableCell>
                      {message.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Mail className="h-4 w-4 text-primary" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell className="text-muted-foreground">{message.email}</TableCell>
                    <TableCell>{message.subject || "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(message.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={message.is_read ? "outline" : "default"}>
                        {message.is_read ? "Read" : "Unread"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openMessage(message)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleReadStatus(message)}
                        title={message.is_read ? "Mark unread" : "Mark read"}
                      >
                        {message.is_read ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailOpen className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => archiveMessage(message)}
                        title="Archive"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(message)}
                        title="Delete"
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

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject || "No Subject"}</DialogTitle>
            <DialogDescription>
              From {selectedMessage?.name} ({selectedMessage?.email}) on{" "}
              {selectedMessage && formatDate(selectedMessage.created_at)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMessage?.phone && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{selectedMessage.phone}</p>
              </div>
            )}
            {selectedMessage?.company && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company</p>
                <p>{selectedMessage.company}</p>
              </div>
            )}
            {selectedMessage?.service_interest && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service Interest</p>
                <p>{selectedMessage.service_interest}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground">Message</p>
              <div className="mt-2 whitespace-pre-wrap rounded-md border p-4 text-sm">
                {selectedMessage?.message}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (selectedMessage) {
                  window.open(`mailto:${selectedMessage.email}`, "_blank")
                }
              }}
            >
              Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Message</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message from &quot;{selectedMessage?.name}&quot;? This
              action cannot be undone.
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
