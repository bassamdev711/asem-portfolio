import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { staticProfile, staticSocialLinks } from "@/lib/static-data";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main className="pt-16">{children}</main>
      <Footer profile={staticProfile} socialLinks={staticSocialLinks} />
    </div>
  );
}
