'use client';

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from 'react';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button';
import { easing } from '@/lib/motion';

interface FormData {
  name: string;
  email: string;
  organization_type: string;
  subject: string;
  message: string;
}

interface FieldErrors {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  organization_type: '',
  subject: '',
  message: '',
};

const MAX_MESSAGE_LENGTH = 1000;

const ORG_TYPE_OPTIONS = [
  { value: '', label: 'Select an option' },
  { value: 'student', label: 'Student' },
  { value: 'company', label: 'Company / Organization' },
  { value: 'sponsor', label: 'Potential Sponsor' },
  { value: 'other', label: 'Other' },
];

// Floating label input component
function FloatingField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  disabled,
  hasError,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  hasError?: boolean;
  required?: boolean;
}) {
  const isFilled = value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder=" "
        aria-required={required}
        aria-invalid={hasError}
        className={`
          peer w-full border-0 border-b bg-transparent px-0 pb-2 pt-5
          font-body text-[length:var(--text-body)] text-[var(--color-text-primary)]
          outline-none transition-[border-color] duration-250
          placeholder-transparent
          disabled:cursor-not-allowed disabled:opacity-50
          focus-visible:outline-none
          ${hasError
            ? 'border-b-red-500'
            : 'border-b-[var(--color-border)] focus:border-b-[var(--color-gold)]'
          }
        `}
      />
      <label
        htmlFor={name}
        className={`
          pointer-events-none absolute left-0 origin-left
          font-mono text-[length:var(--text-mono)] text-[var(--color-text-muted)]
          transition-all duration-200 ease-out
          ${isFilled
            ? 'top-0 -translate-y-1 scale-85 text-[var(--color-gold)]'
            : 'top-5 translate-y-0 scale-100'
          }
          peer-focus:top-0 peer-focus:-translate-y-1 peer-focus:scale-85 peer-focus:text-[var(--color-gold)]
        `}
      >
        {label}{required && ' *'}
      </label>
    </div>
  );
}

// Floating label select component
function FloatingSelect({
  label,
  name,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
}) {
  const isFilled = value.length > 0;

  return (
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          peer w-full appearance-none border-0 border-b border-b-[var(--color-border)]
          bg-transparent px-0 pb-2 pt-5
          font-body text-[length:var(--text-body)] text-[var(--color-text-primary)]
          outline-none transition-[border-color] duration-250
          disabled:cursor-not-allowed disabled:opacity-50
          focus:border-b-[var(--color-gold)] focus-visible:outline-none
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className={`
          pointer-events-none absolute left-0 origin-left
          font-mono text-[length:var(--text-mono)] text-[var(--color-text-muted)]
          transition-all duration-200 ease-out
          ${isFilled
            ? 'top-0 -translate-y-1 scale-85 text-[var(--color-gold)]'
            : 'top-5 translate-y-0 scale-100'
          }
          peer-focus:top-0 peer-focus:-translate-y-1 peer-focus:scale-85 peer-focus:text-[var(--color-gold)]
        `}
      >
        {label}
      </label>
      {/* Dropdown chevron */}
      <svg
        className="pointer-events-none absolute right-0 top-5 h-4 w-4 text-[var(--color-text-muted)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // Auto-dismiss status after 5s
  useEffect(() => {
    if (!submitStatus) return;
    const timer = setTimeout(() => setSubmitStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [submitStatus]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }

    // Limit message length
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) errors.name = true;
    if (!formData.email.trim()) errors.email = true;
    if (!formData.subject.trim()) errors.subject = true;
    if (!formData.message.trim()) errors.message = true;

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      errors.email = true;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    // Send the form data using EmailJS - NOTE: Limit is 200 emails per month
    emailjs
      .sendForm('service_qwpe0fl', 'template_lt8anmn', formRef.current!, publicKey)
      .then(() => {
        setSubmitStatus('success');
        setFormData(INITIAL_FORM_DATA);
      })
      .catch((error) => {
        console.error('Error sending email:', error.text);
        setSubmitStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const messageFilled = formData.message.length > 0;

  return (
    <div>
      <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <FloatingField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          hasError={fieldErrors.name}
          required
        />

        <FloatingField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          hasError={fieldErrors.email}
          required
        />

        <FloatingSelect
          label="Organization Type"
          name="organization_type"
          value={formData.organization_type}
          options={ORG_TYPE_OPTIONS}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <FloatingField
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          disabled={isSubmitting}
          hasError={fieldErrors.subject}
          required
        />

        {/* Textarea with floating label */}
        <div className="relative">
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder=" "
            aria-required
            aria-invalid={fieldErrors.message}
            rows={5}
            className={`
              peer w-full resize-y border-0 border-b bg-transparent px-0 pb-2 pt-5
              font-body text-[length:var(--text-body)] text-[var(--color-text-primary)]
              outline-none transition-[border-color] duration-250
              placeholder-transparent
              disabled:cursor-not-allowed disabled:opacity-50
              focus-visible:outline-none
              ${fieldErrors.message
                ? 'border-b-red-500'
                : 'border-b-[var(--color-border)] focus:border-b-[var(--color-gold)]'
              }
            `}
            style={{ minHeight: '140px' }}
          />
          <label
            htmlFor="message"
            className={`
              pointer-events-none absolute left-0 origin-left
              font-mono text-[length:var(--text-mono)] text-[var(--color-text-muted)]
              transition-all duration-200 ease-out
              ${messageFilled
                ? 'top-0 -translate-y-1 scale-85 text-[var(--color-gold)]'
                : 'top-5 translate-y-0 scale-100'
              }
              peer-focus:top-0 peer-focus:-translate-y-1 peer-focus:scale-85 peer-focus:text-[var(--color-gold)]
            `}
          >
            Message *
          </label>
          <div className="mt-1 text-right font-mono text-[length:var(--text-mono-sm)] text-[var(--color-text-subtle)]">
            {formData.message.length} / {MAX_MESSAGE_LENGTH}
          </div>
        </div>

        {/* Status banners */}
        <div aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            {submitStatus === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.22, ease: easing.easeOutQuart } }}
                transition={{ duration: 0.3, ease: easing.easeOutQuart }}
                className="mb-4 flex items-center gap-3 border border-[var(--color-border-gold)] bg-[var(--color-gold-dim)] px-4 py-3"
              >
                <svg className="h-5 w-5 flex-shrink-0 text-[var(--color-gold)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-body text-[length:var(--text-body)] text-[var(--color-text-primary)]">
                  Message sent. We&apos;ll be in touch.
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.22, ease: easing.easeOutQuart } }}
                transition={{ duration: 0.3, ease: easing.easeOutQuart }}
                className="mb-4 flex items-center gap-3 border border-red-500/40 bg-red-500/10 px-4 py-3"
              >
                <svg className="h-5 w-5 flex-shrink-0 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-body text-[length:var(--text-body)] text-red-300">
                  Something went wrong. Please try again.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>

      {/* Social row */}
      <div className="mt-[var(--space-8)] border-t border-[var(--color-border)] pt-[var(--space-6)]">
        <div className="flex items-center gap-8">
          <a
            href="https://www.instagram.com/westernsalesclub/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[2.75rem] items-center gap-3 transition-colors"
            aria-label="Visit our Instagram page"
            data-cursor="hover"
          >
            <svg
              className="h-5 w-5 text-[var(--color-text-muted)] transition-colors duration-250 group-hover:text-[var(--color-gold)] group-active:text-[var(--color-gold)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="font-mono text-[length:var(--text-mono)] text-[var(--color-text-muted)] transition-colors duration-250 group-hover:text-[var(--color-gold)] group-active:text-[var(--color-gold)]">
              Instagram
            </span>
          </a>

          <a
            href="https://www.linkedin.com/company/western-sales-club/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[2.75rem] items-center gap-3 transition-colors"
            aria-label="Visit our LinkedIn page"
            data-cursor="hover"
          >
            <svg
              className="h-5 w-5 text-[var(--color-text-muted)] transition-colors duration-250 group-hover:text-[var(--color-gold)] group-active:text-[var(--color-gold)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="font-mono text-[length:var(--text-mono)] text-[var(--color-text-muted)] transition-colors duration-250 group-hover:text-[var(--color-gold)] group-active:text-[var(--color-gold)]">
              LinkedIn
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
