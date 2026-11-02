import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  Check,
  Copy,
  ExternalLink,
  MessageSquare,
  User,
  AtSign,
  HelpCircle,
  Bug,
  GraduationCap,
  Code2,
  Sparkles,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';

/**
 * Dedicated Departmental Email Options (Streamlined)
 */
const CONTACT_EMAIL_OPTIONS = [
  {
    id: 'support',
    title: 'General Support & Inquiries',
    email: 'support@mathlens.org',
    badge: 'Support',
    icon: HelpCircle,
    description: 'Platform walkthroughs, usage questions, and general help.',
    subject: '[MathLens Support] Inquiry'
  },
  {
    id: 'research',
    title: 'Academic & Research',
    email: 'payal@iiitv.ac.in',
    badge: 'Faculty',
    icon: GraduationCap,
    description: 'Under Prof. Payal Wadhwa (IIIT Vadodara) for institutional research.',
    subject: '[MathLens Research] Academic Collaboration'
  },
  {
    id: 'bugs',
    title: 'Technical Bug Reports',
    email: 'bugs@mathlens.org',
    badge: 'Bugs',
    icon: Bug,
    description: 'Report visual rendering bugs, numerical errors, or canvas glitches.',
    subject: '[MathLens Bug] Issue Report'
  },
  {
    id: 'feedback',
    title: 'Curriculum & Pedagogy',
    email: 'feedback@mathlens.org',
    badge: 'Curriculum',
    icon: Sparkles,
    description: 'Suggest new matrix concepts, visual modules, or lesson plans.',
    subject: '[MathLens Feedback] Curriculum Suggestion'
  },
  {
    id: 'team',
    title: 'Development Team',
    email: 'team@mathlens.org',
    badge: 'Devs',
    icon: Code2,
    description: 'Contact Naman Kumar, Mayank Soni, and Krishana Yadav.',
    subject: '[MathLens Dev] Developer Contact'
  }
];

export default function ContactSection({ id = 'contact-us', className = '' }) {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    query: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  // Email copy state
  const [copiedId, setCopiedId] = useState(null);

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Please provide your name.';
    }
    if (!formData.email.trim()) {
      errors.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.query.trim()) {
      errors.query = 'Please enter your query or message.';
    } else if (formData.query.trim().length < 10) {
      errors.query = 'Query should be at least 10 characters long.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedData({ ...formData, timestamp: new Date().toLocaleTimeString() });
    }, 600);
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      email: '',
      category: 'General Inquiry',
      query: ''
    });
    setFormErrors({});
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  const handleOpenGmail = (email, subject = '') => {
    const encodedEmail = encodeURIComponent(email);
    const encodedSubject = encodeURIComponent(subject);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyEmail = async (itemId, email, e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(email);
      setCopiedId(itemId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.warn('Failed to copy email', err);
    }
  };

  return (
    <section className={`contact-section-root ${className}`} id={id} aria-label="Contact Us">
      <div className="contact-section-container">
        {/* Header Block */}
        <div className="contact-header-block">
          <div className="contact-eyebrow">
            <Mail size={14} className="contact-eyebrow-icon" />
            <span>COMMUNICATION &amp; INQUIRIES</span>
          </div>
          <h2 className="contact-headline">Contact Us</h2>
          <p className="contact-subheadline">
            Have questions about MathLens, curriculum integrations, academic research, or technical feedback? Send us a message or reach out directly to the relevant department.
          </p>
        </div>

        {/* Dual Column Layout with Equal Heights */}
        <div className="contact-dual-layout">
          {/* =========================================================================
              LEFT: Contact Inquiry Form
             ========================================================================= */}
          <div className="contact-panel-column">
            <div className="contact-card contact-form-card glass-level-2">
              <div className="contact-card-header">
                <div className="contact-card-icon-box">
                  <MessageSquare size={19} className="contact-accent-icon" />
                </div>
                <div>
                  <h3 className="contact-card-title">Send a Message</h3>
                  <p className="contact-card-desc">
                    Submit your query and our team will get back to you.
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form
                    key="inquiry-form"
                    className="contact-form-body"
                    onSubmit={handleFormSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name */}
                    <div className="contact-form-group">
                      <label htmlFor="contact-form-name" className="contact-label">
                        <User size={13} />
                        <span>Name</span>
                        <span className="contact-required">*</span>
                      </label>
                      <input
                        id="contact-form-name"
                        type="text"
                        className={`contact-input ${formErrors.name ? 'input-error' : ''}`}
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, name: e.target.value }));
                          if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                        }}
                      />
                      {formErrors.name && (
                        <span className="contact-field-error">{formErrors.name}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="contact-form-group">
                      <label htmlFor="contact-form-email" className="contact-label">
                        <AtSign size={13} />
                        <span>Email</span>
                        <span className="contact-required">*</span>
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        className={`contact-input ${formErrors.email ? 'input-error' : ''}`}
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, email: e.target.value }));
                          if (formErrors.email) setFormErrors(prev => ({ ...prev, email: null }));
                        }}
                      />
                      {formErrors.email && (
                        <span className="contact-field-error">{formErrors.email}</span>
                      )}
                    </div>

                    {/* Topic */}
                    <div className="contact-form-group">
                      <label htmlFor="contact-form-topic" className="contact-label">
                        <Sparkles size={13} />
                        <span>Inquiry Topic</span>
                      </label>
                      <select
                        id="contact-form-topic"
                        className="contact-select"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="General Inquiry">General Inquiry / Platform Question</option>
                        <option value="Curriculum Integration">Curriculum & Classroom Integration</option>
                        <option value="Research Collaboration">Academic Research Collaboration</option>
                        <option value="Bug Report">Technical Bug / Numerical Discrepancy</option>
                        <option value="Feature Suggestion">New Matrix Module Suggestion</option>
                      </select>
                    </div>

                    {/* Query */}
                    <div className="contact-form-group">
                      <div className="contact-label-row">
                        <label htmlFor="contact-form-query" className="contact-label">
                          <MessageSquare size={13} />
                          <span>Query</span>
                          <span className="contact-required">*</span>
                        </label>
                        <span className="contact-char-count">{formData.query.length} chars</span>
                      </div>
                      <textarea
                        id="contact-form-query"
                        rows={3}
                        className={`contact-textarea ${formErrors.query ? 'input-error' : ''}`}
                        placeholder="Write your query, feedback, or message here..."
                        value={formData.query}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, query: e.target.value }));
                          if (formErrors.query) setFormErrors(prev => ({ ...prev, query: null }));
                        }}
                      />
                      {formErrors.query && (
                        <span className="contact-field-error">{formErrors.query}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="contact-form-actions">
                      <button
                        type="submit"
                        className="contact-submit-btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="contact-spinner" />
                            <span>Sending Query...</span>
                          </>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Send Query</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="inquiry-success"
                    className="contact-success-card"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="contact-success-icon-wrap">
                      <CheckCircle2 size={36} className="contact-success-icon" />
                    </div>
                    <h4 className="contact-success-title">Query Received!</h4>
                    <p className="contact-success-text">
                      Thank you, <strong>{submittedData?.name}</strong>. Your message regarding <em>{submittedData?.category}</em> has been submitted. A confirmation will be sent to <strong>{submittedData?.email}</strong>.
                    </p>

                    <div className="contact-success-summary glass-level-3">
                      <div className="summary-row">
                        <span className="summary-lbl">Topic:</span>
                        <span className="summary-val">{submittedData?.category}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-lbl">Query:</span>
                        <span className="summary-val summary-msg">&ldquo;{submittedData?.query}&rdquo;</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="contact-action-btn-outline"
                      onClick={handleResetForm}
                    >
                      <RotateCcw size={14} />
                      <span>Send Another Message</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* =========================================================================
              RIGHT: List of Departmental Emails with Compact Streamlined Rows
             ========================================================================= */}
          <div className="contact-panel-column">
            <div className="contact-card contact-email-list-card glass-level-2">
              <div className="contact-card-header">
                <div className="contact-card-icon-box">
                  <Mail size={19} className="contact-accent-icon" />
                </div>
                <div>
                  <h3 className="contact-card-title">Direct Email Channels</h3>
                  <p className="contact-card-desc">
                    Reach out to specific departments directly via Gmail.
                  </p>
                </div>
              </div>

              <div className="contact-emails-stacked-list" role="list" aria-label="Official Department Emails">
                {CONTACT_EMAIL_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  const isCopied = copiedId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="contact-email-item-card glass-level-3"
                    >
                      {/* Left: Icon + Title/Badge + Email/Desc */}
                      <div className="email-item-left-block">
                        <div className="email-item-icon-wrap">
                          <IconComp size={14} />
                        </div>

                        <div className="email-item-info-flow">
                          <div className="email-item-title-row">
                            <span className="email-item-title">{item.title}</span>
                            <span className="email-item-badge">{item.badge}</span>
                          </div>
                          <div className="email-item-details-row">
                            <span className="email-item-address">{item.email}</span>
                            <span className="email-item-separator">•</span>
                            <span className="email-item-desc">{item.description}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Copy & Send with Gmail Buttons */}
                      <div className="email-item-right-actions">
                        <button
                          type="button"
                          className="email-item-copy-btn"
                          onClick={(e) => handleCopyEmail(item.id, item.email, e)}
                          title={`Copy ${item.email}`}
                          aria-label={`Copy ${item.email}`}
                        >
                          {isCopied ? (
                            <>
                              <Check size={11} className="copy-check-icon" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={11} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          className="redirect-gmail-btn-compact"
                          onClick={() => handleOpenGmail(item.email, item.subject)}
                          title={`Open Gmail with To: ${item.email}`}
                          aria-label={`Send email to ${item.email} via Gmail`}
                        >
                          <Mail size={12} />
                          <span>Gmail</span>
                          <ExternalLink size={10} className="gmail-ext-icon" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
