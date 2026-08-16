"use client";

import { useState, useCallback } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import { CVPDFDocument } from "./cv-pdf";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, Printer, Eye, Loader2 } from "lucide-react";

interface CVActionsProps {
  profile: any;
  skills: any[];
  experiences: any[];
  education: any[];
  certifications: any[];
  featuredProjects: any[];
  socialLinks: any[];
}

export function CVActions({
  profile,
  skills,
  experiences,
  education,
  certifications,
  featuredProjects,
  socialLinks,
}: CVActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <CVPDFDocument
          profile={profile}
          skills={skills}
          experiences={experiences}
          education={education}
          certifications={certifications}
          featuredProjects={featuredProjects}
          socialLinks={socialLinks}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Asem_Al-Manari_CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [profile, skills, experiences, education, certifications, featuredProjects, socialLinks]);

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview CV
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle>CV Preview</DialogTitle>
          </DialogHeader>
          <div className="h-[70vh]">
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              <CVPDFDocument
                profile={profile}
                skills={skills}
                experiences={experiences}
                education={education}
                certifications={certifications}
                featuredProjects={featuredProjects}
                socialLinks={socialLinks}
              />
            </PDFViewer>
          </div>
        </DialogContent>
      </Dialog>

      <Button variant="outline" onClick={() => window.print()}>
        <Printer className="h-4 w-4 mr-2" />
        Print
      </Button>

      <Button variant="outline" onClick={handleDownloadPDF} disabled={isDownloading}>
        {isDownloading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        Download PDF
      </Button>
    </div>
  );
}
