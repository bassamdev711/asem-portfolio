import Link from "next/link"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FolderKanban,
  Code2,
  Briefcase,
  Award,
  Wrench,
  MessageSquare,
  GraduationCap,
  Plus,
  ArrowRight,
  Eye,
  Mail,
} from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient()

  const [
    { count: projectsCount },
    { count: skillsCount },
    { count: experiencesCount },
    { count: certificationsCount },
    { count: servicesCount },
    { count: messagesCount },
    { count: unreadMessagesCount },
    { count: educationCount },
    { data: recentProjects },
    { data: recentMessages },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("experiences").select("*", { count: "exact", head: true }),
    supabase.from("certifications").select("*", { count: "exact", head: true }),
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false),
    supabase.from("education").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("id, name, slug, status, is_published, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_messages")
      .select("id, name, email, subject, is_read, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      title: "Projects",
      value: projectsCount ?? 0,
      icon: FolderKanban,
      href: "/admin/projects",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Skills",
      value: skillsCount ?? 0,
      icon: Code2,
      href: "/admin/skills",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Experience",
      value: experiencesCount ?? 0,
      icon: Briefcase,
      href: "/admin/experience",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Certifications",
      value: certificationsCount ?? 0,
      icon: Award,
      href: "/admin/certifications",
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Services",
      value: servicesCount ?? 0,
      icon: Wrench,
      href: "/admin/services",
      color: "from-rose-500 to-rose-600",
    },
    {
      title: "Messages",
      value: messagesCount ?? 0,
      unread: unreadMessagesCount ?? 0,
      icon: MessageSquare,
      href: "/admin/messages",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      title: "Education",
      value: educationCount ?? 0,
      icon: GraduationCap,
      href: "/admin/education",
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your portfolio.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/projects">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity group-hover:opacity-[0.03]`}
                />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      {"unread" in stat && typeof stat.unread === 'number' && stat.unread > 0 && (
                        <Badge variant="destructive" className="mt-1 text-xs">
                          {typeof stat.unread === 'number' ? stat.unread : 0} unread
                        </Badge>
                      )}
                    </div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Projects</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/projects">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentProjects && recentProjects.length > 0 ? (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <FolderKanban className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(project.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={project.is_published ? "default" : "secondary"}>
                        {project.is_published ? "Published" : "Draft"}
                      </Badge>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No projects yet. Create your first one!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Messages</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/messages">
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentMessages && recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{message.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {message.subject || message.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!message.is_read && (
                        <Badge variant="destructive" className="text-xs">
                          New
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No messages yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
