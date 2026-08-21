"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service_interest: z.string().optional(),
  website: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactProps { profile?: any }

export function ContactSection({ profile }: ContactProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    if (data.website) return;
    setIsSubmitting(true);
    try {
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        data.phone ? `Phone: ${data.phone}` : "",
        data.company ? `Company: ${data.company}` : "",
        data.service_interest ? `Service: ${data.service_interest}` : "",
        "",
        data.message,
      ].filter(Boolean).join("\\n");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
      setIsSuccess(true);
      toast.success("Your email client is ready to send the message.");
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const email = profile?.email || "hello@asem.dev";
  const phone = profile?.phone || "+1 (555) 000-0000";
  const location = profile?.location || "Available Worldwide";

  return (
    <section id="contact" className="section-shell bg-muted/25">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">Let&apos;s connect</span>
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-description">Have a project in mind or want to collaborate? Feel free to reach out.</p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="surface flex flex-col justify-between p-7 lg:p-8">
            <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Start a conversation</p><h3 className="mt-4 text-2xl font-bold tracking-tight">Let&apos;s build something valuable.</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">Share a few details about your idea, and I&apos;ll get back to you as soon as possible.</p></div>
            <div className="mt-10 space-y-5">
              <a href={`mailto:${email}`} className="group flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Mail className="h-5 w-5" /></span><span><span className="block text-xs text-muted-foreground">Email</span><span className="text-sm font-medium break-all">{email}</span></span></a>
              <a href={`tel:${phone}`} className="group flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Phone className="h-5 w-5" /></span><span><span className="block text-xs text-muted-foreground">Phone</span><span className="text-sm font-medium">{phone}</span></span></a>
              <div className="flex items-center gap-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><MapPin className="h-5 w-5" /></span><span><span className="block text-xs text-muted-foreground">Location</span><span className="text-sm font-medium">{location}</span></span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.12 }}>
            {isSuccess ? <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="surface flex h-full min-h-[420px] flex-col items-center justify-center p-10 text-center"><CheckCircle className="h-14 w-14 text-emerald-500" /><h3 className="mt-5 text-2xl font-bold">Message Sent!</h3><p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">Thank you for reaching out. I&apos;ll get back to you as soon as possible.</p></motion.div> : <form onSubmit={handleSubmit(onSubmit)} className="surface space-y-5 p-6 lg:p-8">
              <div className="hidden"><input {...register("website")} tabIndex={-1} autoComplete="off" /></div>
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" {...register("name")} placeholder="Your name" />{errors.name && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.name.message}</p>}</div><div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" {...register("email")} placeholder="your@email.com" />{errors.email && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.email.message}</p>}</div></div>
              <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" {...register("phone")} placeholder="+1 (555) 000-0000" /></div><div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" {...register("company")} placeholder="Company name" /></div></div>
              <div className="space-y-2"><Label htmlFor="service_interest">Service Interest</Label><Input id="service_interest" {...register("service_interest")} placeholder="e.g., Web Development" /></div>
              <div className="space-y-2"><Label htmlFor="subject">Subject *</Label><Input id="subject" {...register("subject")} placeholder="How can I help?" />{errors.subject && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.subject.message}</p>}</div>
              <div className="space-y-2"><Label htmlFor="message">Message *</Label><Textarea id="message" {...register("message")} rows={5} placeholder="Tell me about your project..." />{errors.message && <p className="flex items-center gap-1 text-xs text-destructive"><AlertCircle className="h-3 w-3" />{errors.message.message}</p>}</div>
              <Button type="submit" disabled={isSubmitting} className="h-11 w-full gap-2 rounded-xl">{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" />Sending...</> : <><Send className="h-4 w-4" />Send Message</>}</Button>
            </form>}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
