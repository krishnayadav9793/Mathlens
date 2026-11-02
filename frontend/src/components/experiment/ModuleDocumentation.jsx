import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import katex from 'katex';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calculator,
  Compass,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Layers,
  HelpCircle
} from 'lucide-react';
import { MODULE_DOCUMENTATION } from '../../data/moduleDocumentation';

export function formatMathText(str) {
  if (!str) return '';
  return str
    .replace(/\\rightarrow/g, '→')
    .replace(/\\Rightarrow/g, '⟹')
    .replace(/\\mid/g, '|')
    .replace(/\\sigma/g, 'σ')
    .replace(/\\%/g, '%')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
    .replace(/\\mathbb\{Z\}/g, 'ℤ')
    .replace(/\\mathbb\{R\}\^?\+?/g, 'ℝ')
    .replace(/\\mathbb\{R\}/g, 'ℝ')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\mathcal\{I\}/g, 'I')
    .replace(/\\mathcal\{M\}/g, 'M')
    .replace(/\\sum/g, '∑')
    .replace(/\\in/g, '∈')
    .replace(/\\subset/g, '⊂')
    .replace(/\\to/g, '→')
    .replace(/\\leftarrow/g, '←')
    .replace(/\\implies/g, '⟹')
    .replace(/\\cdot/g, '·')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\leq/g, '≤')
    .replace(/\\geq/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\dots/g, '…')
    .replace(/\\quad/g, '   ')
    .replace(/\\qquad/g, '     ')
    .replace(/\\vec\{([^}]+)\}/g, '$1⃗')
    .replace(/\\hat\{([^}]+)\}/g, '$1̂')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\det/g, 'det')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\alpha/g, 'α')
    .replace(/\\beta/g, 'β')
    .replace(/\\theta/g, 'θ')
    .replace(/\\odot/g, '⊙')
    .replace(/\\oslash/g, '⊘')
    .replace(/\\approx/g, '≈')
    .replace(/\\deg/g, '°')
    .replace(/\\begin\{bmatrix\}/g, '[')
    .replace(/\\end\{bmatrix\}/g, ']')
    .replace(/\\begin\{pmatrix\}/g, '(')
    .replace(/\\end\{pmatrix\}/g, ')')
    .replace(/\\left\[/g, '[')
    .replace(/\\right\]/g, ']')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\\\\/g, '\n')
    .replace(/&/g, '  ')
    .replace(/\\;/g, ' ')
    .replace(/\\,/g, ' ');
}

export function MathView({ math, displayMode = false, className = '' }) {
  if (!math) return null;
  try {
    const html = katex.renderToString(math, {
      throwOnError: false,
      displayMode,
      strict: false,
      trust: true
    });
    return (
      <span
        className={`math-rendered ${displayMode ? 'math-display' : 'math-inline'} ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  } catch {
    return <code className={`math-fallback ${className}`}>{formatMathText(math)}</code>;
  }
}

export function renderFormattedContent(text) {
  if (!text) return null;
  if (typeof text !== 'string') return text;
  
  if (!text.includes('$')) {
    const cleaned = text
      .replace(/\\le\b/g, '≤')
      .replace(/\\ge\b/g, '≥')
      .replace(/\\approx\b/g, '≈')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\times\b/g, '×')
      .replace(/\\theta\b/g, 'θ')
      .replace(/\\Delta\b/g, 'Δ')
      .replace(/\\perp\b/g, '⟂')
      .replace(/b_⊥/g, 'b⟂')
      .replace(/\\implies\b/g, '⟹');
    return cleaned;
  }

  const parts = text.split(/\$([^$]+)\$/g);
  return parts.map((part, idx) => {
    if (idx % 2 === 1) {
      return (
        <span key={idx} className="inline-math-wrap" style={{ display: 'inline', padding: '0 0.12rem' }}>
          <MathView math={part} displayMode={false} />
        </span>
      );
    }
    return part
      .replace(/\\le\b/g, '≤')
      .replace(/\\ge\b/g, '≥')
      .replace(/b_⊥/g, 'b⟂');
  });
}

export default function ModuleDocumentation({ stepNumber = 1, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState('concept'); // 'concept' | 'math' | 'applications'
  const [copiedFormula, setCopiedFormula] = useState(false);

  const doc = MODULE_DOCUMENTATION[stepNumber] || MODULE_DOCUMENTATION[1] || {};
  const subsections = doc.subsections || [];
  const howItWorks = doc.howItWorks || [];
  const symbols = doc.symbols || [];
  const additionalFormulas = doc.additionalFormulas || [];
  const observations = doc.observations || [];
  const guidedInquiry = doc.guidedInquiry || [];
  const applications = doc.applications || [];
  const keyTakeaways = doc.keyTakeaways || [];

  const handleCopyFormula = () => {
    if (!doc.formula) return;
    navigator.clipboard.writeText(doc.formula);
    setCopiedFormula(true);
    setTimeout(() => setCopiedFormula(false), 2000);
  };

  return (
    <section className="module-docs-section glass-level-2" aria-label="Module Educational Documentation">
      {/* 1. Header Ribbon & Toggle */}
      <div className="module-docs-header">
        <div className="module-docs-header-left">
          <div className="module-docs-icon-bubble">
            <BookOpen size={18} />
          </div>
          <div>
            <div className="module-docs-eyebrow">
              <span className="docs-code-pill">Module {doc.code}</span>
              <span className="docs-cat-label">{doc.category}</span>
            </div>
            <h2 className="module-docs-title">Learn This Concept: {doc.title}</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="docs-toggle-btn"
          aria-expanded={isOpen}
        >
          <span>{isOpen ? 'Collapse Documentation' : 'Expand Documentation'}</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* 2. Expandable Body */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="docs-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="module-docs-body"
          >
            {/* Segmented Tab Navigation */}
            <div className="module-docs-tabs-bar" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'concept'}
                onClick={() => setActiveTab('concept')}
                className={`docs-tab-btn ${activeTab === 'concept' ? 'active' : ''}`}
              >
                <Compass size={15} />
                <span>Concept &amp; Theory</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'math'}
                onClick={() => setActiveTab('math')}
                className={`docs-tab-btn ${activeTab === 'math' ? 'active' : ''}`}
              >
                <Calculator size={15} />
                <span>Formulas &amp; Worked Example</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'applications'}
                onClick={() => setActiveTab('applications')}
                className={`docs-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              >
                <Layers size={15} />
                <span>Observations &amp; Applications</span>
              </button>
            </div>

            {/* TAB 1: CONCEPT & THEORY */}
            {activeTab === 'concept' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="docs-tab-pane"
              >
                <div className="docs-two-col-grid">
                  {/* Left: What Is This? */}
                  <div className="docs-subcard">
                    <div className="docs-subcard-header">
                      <HelpCircle size={16} className="docs-subcard-icon" />
                      <h3 className="docs-subcard-title">What Is This?</h3>
                    </div>
                    <p className="docs-prose">{renderFormattedContent(doc.whatIsThis)}</p>
                  </div>

                  {/* Right: Why Do We Need It? */}
                  <div className="docs-subcard">
                    <div className="docs-subcard-header">
                      <Sparkles size={16} className="docs-subcard-icon" />
                      <h3 className="docs-subcard-title">Why Do We Need It?</h3>
                    </div>
                    <p className="docs-prose">{renderFormattedContent(doc.whyNeedIt)}</p>
                  </div>
                </div>

                {/* Core Working Principles & Mathematical Subsections */}
                {doc.subsections && doc.subsections.length > 0 && (
                  <div className="docs-subsections-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <h3 className="docs-steps-heading" style={{ margin: '0.2rem 0 0 0' }}>
                      Core Working Principles &amp; Mathematical Concepts
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: subsections.length > 1 ? 'repeat(auto-fit, minmax(340px, 1fr))' : '1fr', gap: '0.85rem' }}>
                      {subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="docs-subcard">
                          <div className="docs-subcard-header">
                            <Compass size={15} className="docs-subcard-icon" />
                            <h4 className="docs-subcard-title">{sub.title}</h4>
                          </div>
                          <p className="docs-prose" style={{ whiteSpace: 'pre-line' }}>{renderFormattedContent(sub.content)}</p>
                          {sub.formula && (
                            <div
                              className="docs-card-formula-box"
                              style={{
                                marginTop: '0.65rem',
                                padding: '0.45rem 0.65rem',
                                background: 'rgba(0, 0, 0, 0.25)',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                overflowX: 'auto',
                                maxWidth: '100%',
                                fontSize: '0.84rem',
                                scrollbarWidth: 'thin',
                                textAlign: 'center'
                              }}
                            >
                              <MathView math={sub.formula} displayMode={true} />
                            </div>
                          )}
                          {sub.points && sub.points.length > 0 && (
                            <ul style={{ margin: '0.55rem 0 0 0', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {sub.points.map((pt, pIdx) => (
                                <li key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                  <span style={{ color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.74rem', marginTop: '0.1rem' }}>•</span>
                                  <span>{renderFormattedContent(pt)}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Width: How Does It Work? */}
                <div className="docs-steps-card">
                  <h3 className="docs-steps-heading">How Does It Work?</h3>
                  <div className="docs-steps-grid">
                    {howItWorks.map((st) => (
                      <div key={st.step} className="docs-step-card">
                        <div className="docs-step-badge">0{st.step}</div>
                        <h4 className="docs-step-title">{renderFormattedContent(st.title)}</h4>
                        <p className="docs-step-text">{renderFormattedContent(st.description)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: FORMULAS & WORKED EXAMPLE */}
            {activeTab === 'math' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="docs-tab-pane"
              >
                {/* Formal Formula Banner */}
                <div className="docs-formula-banner">
                  <div className="formula-banner-top">
                    <span className="formula-banner-label">Mathematical Formulation</span>
                    <button
                      type="button"
                      onClick={handleCopyFormula}
                      className="docs-copy-formula-btn"
                      title="Copy LaTeX formula to clipboard"
                    >
                      {copiedFormula ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copiedFormula ? 'Copied LaTeX' : 'Copy LaTeX'}</span>
                    </button>
                  </div>
                  <div className="formula-banner-code-box">
                    <MathView math={doc.formula || doc.formulaDisplay} displayMode={true} />
                  </div>
                </div>

                {/* Symbol Definitions Glossary Table */}
                <div className="docs-symbols-table-wrap">
                  <h3 className="docs-subcard-title" style={{ marginBottom: '0.75rem' }}>
                    Symbol Definitions &amp; Variables
                  </h3>
                  <div className="docs-table-responsive">
                    <table className="docs-symbols-table">
                      <thead>
                        <tr>
                          <th>Symbol</th>
                          <th>Variable Name</th>
                          <th>Mathematical Definition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {symbols.map((sym, idx) => (
                          <tr key={idx}>
                            <td className="symbol-cell">
                              <MathView math={sym.symbol} displayMode={false} />
                            </td>
                            <td className="name-cell">{sym.name}</td>
                            <td className="meaning-cell">{renderFormattedContent(sym.meaning)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Additional Formulas & Identities */}
                {doc.additionalFormulas && doc.additionalFormulas.length > 0 && (
                  <div className="docs-subcard">
                    <div className="docs-subcard-header">
                      <Calculator size={16} className="docs-subcard-icon" />
                      <h3 className="docs-subcard-title">Key Associated Formulas &amp; Identities</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: doc.additionalFormulas.length > 1 ? 'repeat(auto-fit, minmax(260px, 1fr))' : '1fr', gap: '0.65rem', marginTop: '0.5rem' }}>
                      {additionalFormulas.map((fItem, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.55rem 0.75rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{fItem.label}</span>
                          <div style={{ marginTop: '0.2rem' }}>
                            <MathView math={fItem.formula} displayMode={false} />
                          </div>
                          {fItem.desc && (
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>{fItem.desc}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Worked Numerical Example Card */}
                {doc.workedExample && (
                  <div className="docs-worked-example-card">
                    <div className="worked-example-header">
                      <Calculator size={16} className="docs-subcard-icon" />
                      <h3 className="docs-subcard-title">Worked Numerical Example</h3>
                    </div>

                    <div className="worked-example-content">
                      <p className="worked-example-intro">{doc.workedExample.input}</p>

                      {doc.workedExample.matrixDisplay && (
                        <div className="worked-example-matrix-box">
                          <div className="matrix-bracket-left" />
                          <div className="matrix-cells-table">
                            {doc.workedExample.matrixDisplay.map((row, rIdx) => (
                              <div key={rIdx} className="matrix-cells-row">
                                {row.map((cell, cIdx) => (
                                  <span key={cIdx} className="matrix-number-cell">
                                    {String(cell)}
                                  </span>
                                ))}
                              </div>
                            ))}
                          </div>
                          <div className="matrix-bracket-right" />
                        </div>
                      )}

                      <div className="worked-example-calc-block">
                        <span className="calc-block-label">Step-by-Step Arithmetic:</span>
                        <pre className="calc-block-text">{doc.workedExample.calculation}</pre>
                      </div>

                      <div className="worked-example-output-block">
                        <span className="output-block-label">Resulting Visual Output:</span>
                        <p className="output-block-text">{doc.workedExample.output}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: OBSERVATIONS & APPLICATIONS */}
            {activeTab === 'applications' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="docs-tab-pane"
              >
                {/* What Should I Observe? */}
                <div className="docs-observations-card">
                  <div className="docs-subcard-header">
                    <Eye size={16} className="docs-subcard-icon" />
                    <h3 className="docs-subcard-title">What Should I Observe in This Lab?</h3>
                  </div>
                  <ul className="docs-bullets-list">
                    {observations.map((obs, idx) => (
                      <li key={idx} className="docs-bullet-item">
                        <CheckCircle2 size={15} className="bullet-check-icon" />
                        <span>{renderFormattedContent(obs)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Guided Inquiry & Mathematical Insights */}
                {guidedInquiry.length > 0 && (
                  <div className="docs-observations-card">
                    <div className="docs-subcard-header">
                      <HelpCircle size={16} className="docs-subcard-icon" />
                      <h3 className="docs-subcard-title">Guided Inquiry &amp; Mathematical Insights</h3>
                    </div>
                    <div className="step15-inquiry-grid" style={{ marginTop: '0.65rem' }}>
                      {guidedInquiry.map((inq, iIdx) => (
                        <div key={iIdx} className="step15-inquiry-item">
                          <span className="step15-inquiry-q">{inq.question}</span>
                          <span className="step15-inquiry-a">{inq.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real-World Applications Grid */}
                <div className="docs-applications-card">
                  <h3 className="docs-subcard-title" style={{ marginBottom: '0.85rem' }}>
                    Practical Engineering Applications
                  </h3>
                  <div className="docs-applications-grid">
                    {applications.map((app, idx) => (
                      <div key={idx} className="docs-app-item">
                        <div className="app-item-number">0{idx + 1}</div>
                        <h4 className="app-item-name">{app.name}</h4>
                        <p className="app-item-desc">{app.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Takeaways */}
                <div className="docs-takeaways-card">
                  <h3 className="docs-subcard-title" style={{ marginBottom: '0.75rem' }}>
                    Key Takeaways
                  </h3>
                  <div className="takeaways-list">
                    {keyTakeaways.map((takeaway, idx) => (
                      <div key={idx} className="takeaway-item">
                        <span className="takeaway-bullet-num">{idx + 1}.</span>
                        <p className="takeaway-text">{renderFormattedContent(takeaway)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
