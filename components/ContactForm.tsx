// app/components/ContactForm.tsx
"use client";

import { useState } from "react";
import styles from "./ContactForm.module.css";
import ChatBot from "@/components/ChatBot";

interface FormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  message: string;
}

interface ApiError {
  error: string;
  details?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    status: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result: { success?: boolean } & ApiError = await res.json();

      if (res.ok && result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          status: "",
          message: "",
        });
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Network error – check your connection."
          : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.contact_successCard}>
        <div className={styles.contact_checkIcon}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className={styles.contact_successTitle}>Thank You!</h2>
        <p className={styles.contact_successText}>
          Your message has been sent. We’ll reply within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className={styles.contact_successBtn}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.contact_container}>
        <div className={styles.contact_wrapper}>
          <header className={styles.contact_header}>
            <h1 className={styles.contact_title}>Get in Touch</h1>
            <p className={styles.contact_subtitle}>
              Fill out the form and we’ll get back to you as soon as possible.
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className={styles.contact_form}
            noValidate
          >
            <div className={styles.contact_field}>
              <label htmlFor="name" className={styles.contact_label}>
                Full Name <span className={styles.contact_required}>*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={styles.contact_input}
                placeholder="Parth Patel"
              />
            </div>

            <div className={styles.contact_field}>
              <label htmlFor="email" className={styles.contact_label}>
                Email Address <span className={styles.contact_required}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={styles.contact_input}
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.contact_field}>
              <label htmlFor="phone" className={styles.contact_label}>
                Phone Number{" "}
                <span className={styles.contact_optional}>(optional)</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={styles.contact_input}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className={styles.contact_field}>
              <label htmlFor="status" className={styles.contact_label}>
                Immigration Status{" "}
                <span className={styles.contact_optional}>(optional)</span>
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.contact_select}
              >
                <option value="">Select an option</option>
                <option value="Student">Student</option>
                <option value="Worker">Worker</option>
                <option value="Visitor">Visitor</option>
                <option value="Permanent Resident">Permanent Resident</option>
                <option value="Citizen">Citizen</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={styles.contact_field}>
              <label htmlFor="message" className={styles.contact_label}>
                Your Message <span className={styles.contact_required}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className={styles.contact_textarea}
                placeholder="Tell us how we can help…"
              />
            </div>

            {error && <div className={styles.contact_error}>{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={styles.contact_submitBtn}
            >
              {loading ? (
                <>
                  <svg className={styles.contact_spinner} viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className={styles.contact_spinnerTrack}
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                      className={styles.contact_spinnerHead}
                    />
                  </svg>
                  Sending…
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

          <p className={styles.contact_footer}>
            Prefer email?{" "}
            <a
              href="mailto:immigrationdatacanada@gmail.com"
              className={styles.contact_footerLink}
            >
              immigrationdatacanada@gmail.com
            </a>
          </p>
        </div>
      </div>
      <ChatBot />
    </>
  );
}
