import React, { useState } from "react";
import emailjs from '@emailjs/browser';
import './ContactForm.css';

function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        organization_type: "",
        subject: "",
        message: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
    const [fieldErrors, setFieldErrors] = useState({});

    const MAX_MESSAGE_LENGTH = 1000;

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: false }));
        }

        // Limit message length
        if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = {};

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 4000);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        const form = e.target;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        // Send the form data using EmailJS - NOTE: Limit is 200 emails per month
        emailjs.sendForm('service_qwpe0fl', 'template_lt8anmn', form, publicKey)
            .then((result) => {
                console.log('Email sent successfully:', result.text);
                setSubmitStatus('success');
                setFormData({
                    name: "",
                    email: "",
                    organization_type: "",
                    subject: "",
                    message: ""
                });
                setTimeout(() => setSubmitStatus(null), 5000);
            })
            .catch((error) => {
                console.error('Error sending email:', error.text);
                setSubmitStatus('error');
                setTimeout(() => setSubmitStatus(null), 5000);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <div className="contact-form-container">
            {/* Social Media Section */}
            <div className="contact-social-section">
                <h2 className="contact-social-title">Connect With Us</h2>
                <p className="contact-social-description">
                    Follow us on social media to stay updated with our latest events, opportunities, and community highlights.
                </p>

                <div className="contact-social-links">
                    <a
                        href="https://www.linkedin.com/company/western-sales-club/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-social-link linkedin"
                        aria-label="Visit our LinkedIn page"
                    >
                        <div className="social-icon-wrapper">
                            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </div>
                        <div className="social-link-content">
                            <span className="social-link-label">LinkedIn</span>
                            <span className="social-link-handle">Western Sales Club</span>
                        </div>
                    </a>

                    <a
                        href="https://www.instagram.com/westernsalesclub/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="contact-social-link instagram"
                        aria-label="Visit our Instagram page"
                    >
                        <div className="social-icon-wrapper">
                            <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </div>
                        <div className="social-link-content">
                            <span className="social-link-label">Instagram</span>
                            <span className="social-link-handle">@westernsalesclub</span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Contact Form Section */}
            <div className="contact-form-section">
                <h2 className="contact-form-title">Send Us a Message</h2>

                {submitStatus === 'success' && (
                    <div className="status-message success-message">
                        <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Message sent successfully! We'll get back to you soon.</p>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="status-message error-message">
                        <svg className="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>Please fill in all required fields correctly.</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="contact-page-form">
                    <div className="form-field">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name*"
                            value={formData.name}
                            onChange={handleChange}
                            className={`contact-page-input ${fieldErrors.name ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-field">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            value={formData.email}
                            onChange={handleChange}
                            className={`contact-page-input ${fieldErrors.email ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-field">
                        <input
                            type="text"
                            name="organization_type"
                            placeholder="Organization Type (optional)"
                            value={formData.organization_type}
                            onChange={handleChange}
                            className="contact-page-input"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-field">
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject*"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`contact-page-input ${fieldErrors.subject ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="form-field">
                        <textarea
                            name="message"
                            placeholder="Your Message*"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            className={`contact-page-textarea ${fieldErrors.message ? 'error' : ''}`}
                            disabled={isSubmitting}
                        />
                        <div className="character-counter">
                            {formData.message.length} / {MAX_MESSAGE_LENGTH}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={`contact-page-submit ${isSubmitting ? 'submitting' : ''}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="spinner"></span>
                                Sending...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ContactForm;
