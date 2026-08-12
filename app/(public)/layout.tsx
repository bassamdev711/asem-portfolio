import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const [profileRes, socialLinksRes] = await Promise.all([
    supabase.from("profiles").select("*").single(),
    supabase.from("social_links").select("*").eq("is_published", true).order("display_order"),
  ]);

  const profile = profileRes.data;
  const socialLinks = socialLinksRes.data ?? [];

  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer profile={profile} socialLinks={socialLinks} />
    </div>
  );
}
