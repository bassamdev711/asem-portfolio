import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(1, "Message is required").max(5000),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_interest: z.string().optional(),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { honeypot, ...data } = result.data;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createServiceSupabaseClient();

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      phone: data.phone || "",
      company: data.company || "",
      service_interest: data.service_interest || "",
    });

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to save message" },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: process.env.CONTACT_EMAIL!,
        subject: `New Contact: ${data.subject}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
          ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ""}
          ${data.service_interest ? `<p><strong>Service Interest:</strong> ${data.service_interest}</p>` : ""}
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${data.message.replace(/\n/g, "<br />")}</p>
        `,
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
