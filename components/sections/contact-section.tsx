"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { getHeroAboutFromDb, HeroAboutData } from "@/lib/supabase-db";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface ContactSectionProps {
  initialHeroData?: HeroAboutData | null;
}

export function ContactSection({ initialHeroData = null }: ContactSectionProps = {}) {
  const [heroData, setHeroData] = useState<HeroAboutData | null>(initialHeroData);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });

  useEffect(() => {
    if (initialHeroData) {
      setHeroData(initialHeroData);
    }
  }, [initialHeroData]);

  useEffect(() => {
    if (initialHeroData) return;
    let active = true;
    getHeroAboutFromDb().then((data) => {
      if (active) setHeroData(data);
    });
    return () => {
      active = false;
    };
  }, [initialHeroData]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Please enter a subject.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Please enter your message.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatusMessage({
          type: "success",
          text: result.message || "Thank you! Your message has been sent successfully.",
        });
        setFormData({ name: "", email: "", subject: "", message: "", website: "" });
        setErrors({});
      } else {
        setStatusMessage({
          type: "error",
          text: result.error || "Failed to send message. Please try again.",
        });
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="pt-16 sm:pt-20 md:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
      aria-label="Contact Section"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-10 sm:space-y-16"
        suppressHydrationWarning
      >
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20 inline-block uppercase">
            Contact
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Get in Touch
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Have a project in mind, a question, or want to collaborate? Send me a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 sm:p-8 rounded-3xl bg-card border border-border shadow-md space-y-6 sm:space-y-8">
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                  Contact Information
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Reach out using the form or direct contact details below.
                </p>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {heroData?.contactEmail && (
                  <a
                    href={`mailto:${heroData.contactEmail}`}
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-muted/50 hover:bg-primary/10 border border-border/80 hover:border-primary/40 transition-all duration-200 group min-w-0"
                  >
                    <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </p>
                      <p className="text-xs sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors break-all sm:break-normal truncate">
                        {heroData.contactEmail}
                      </p>
                    </div>
                  </a>
                )}

                {heroData?.contactPhone && (
                  <a
                    href={`tel:${heroData.contactPhone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-muted/50 hover:bg-primary/10 border border-border/80 hover:border-primary/40 transition-all duration-200 group min-w-0"
                  >
                    <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Phone
                      </p>
                      <p className="text-xs sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {heroData.contactPhone}
                      </p>
                    </div>
                  </a>
                )}

                {heroData?.location && (
                  <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-muted/50 border border-border/80 min-w-0">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-accent/10 text-accent shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Location
                      </p>
                      <p className="text-xs sm:text-base font-semibold text-foreground truncate">
                        {heroData.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {heroData?.responseTimeText && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-xs text-primary font-medium leading-relaxed">
                    {heroData.responseTimeText}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-5 sm:p-8 md:p-10 rounded-3xl bg-card border border-border shadow-md space-y-5 sm:space-y-6">
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Fill in your details below and I will get back to you promptly.
                </p>
              </div>

              <AnimatePresence>
                {statusMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    suppressHydrationWarning
                    className={`p-4 rounded-2xl flex items-start gap-3 border ${
                      statusMessage.type === "success"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {statusMessage.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-xs sm:text-sm font-medium">{statusMessage.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                        errors.name
                          ? "border-rose-500 focus:ring-rose-500/40"
                          : "border-border focus:border-primary focus:ring-primary/40"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-500 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                    >
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                        errors.email
                          ? "border-rose-500 focus:ring-rose-500/40"
                          : "border-border focus:border-primary focus:ring-primary/40"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 font-medium">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground focus:outline-none focus:ring-2 transition-all min-h-[44px] ${
                      errors.subject
                        ? "border-rose-500 focus:ring-rose-500/40"
                        : "border-border focus:border-primary focus:ring-primary/40"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-xs text-rose-500 font-medium">{errors.subject}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="message"
                    className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-foreground focus:outline-none focus:ring-2 transition-all resize-none ${
                      errors.message
                        ? "border-rose-500 focus:ring-rose-500/40"
                        : "border-border focus:border-primary focus:ring-primary/40"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500 font-medium">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 group min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export { ContactSection as Contact };
