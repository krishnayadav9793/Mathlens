import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES, FEATURES, VISIBLE_CATEGORIES, VISIBLE_FEATURES, TOTAL_VISIBLE_LABS } from '../config/features';

export default function CurriculumScreen({ onSelectStep }) {
  return (
    <div className="curriculum-page-container">
      {/* Refined Editorial Masthead */}
      <header className="curriculum-masthead">
        <h1 className="curriculum-title">Learning Path</h1>
        <p className="curriculum-subtitle">
          A structured visual journey through linear algebra — transforming numbers into pixels, geometric spaces, and optical reflections.
        </p>

        {/* Delicate Metric / Scope Strip */}
        <div className="curriculum-stats-strip">
          <div className="curriculum-stat-item">
            <span className="stat-number">{TOTAL_VISIBLE_LABS}</span>
            <span className="stat-label">Interactive Experiments</span>
          </div>
          <span className="curriculum-stat-divider" aria-hidden="true" />
          <div className="curriculum-stat-item">
            <span className="stat-number">{VISIBLE_CATEGORIES.length}</span>
            <span className="stat-label">Thematic Chapters</span>
          </div>
          <span className="curriculum-stat-divider" aria-hidden="true" />
          <div className="curriculum-stat-item">
            <span className="stat-number">Real-Time</span>
            <span className="stat-label">Matrix Computations</span>
          </div>
        </div>
      </header>

      {/* Chapters / Sections List */}
      <div className="curriculum-chapters-list">
        {VISIBLE_CATEGORIES.map((cat, idx) => {
          const catFeatures = VISIBLE_FEATURES.filter((f) => f.category === cat.id);

          return (
            <section key={cat.id} className="curriculum-chapter-section">
              {/* Airy, Elegant Section Header with integrated rule */}
              <div className="chapter-header-row">
                <div className="chapter-header-left">
                  <span className="chapter-index-pill">0{idx + 1}</span>
                  <div className="chapter-header-info">
                    <div className="chapter-title-group">
                      <h2 className="chapter-headline">{cat.label}</h2>
                      <span className="chapter-count-pill">{catFeatures.length} Experiments</span>
                    </div>
                    <p className="chapter-desc">{cat.description}</p>
                  </div>
                </div>
              </div>

              {/* Responsive Cards Grid */}
              <div className="chapter-steps-grid">
                {catFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <motion.div
                      key={feat.id}
                      className="chapter-step-item"
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => onSelectStep(feat.stepNumber)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectStep(feat.stepNumber);
                        }
                      }}
                      aria-label={`Open experiment ${feat.code}: ${feat.title}`}
                    >
                      <div className="step-item-header">
                        <div className="step-item-tag">
                          <span className="step-icon-bubble">
                            <Icon size={14} />
                          </span>
                          <span className="step-item-number">EXP {feat.code}</span>
                        </div>
                        <span className="step-item-arrow-wrap">
                          <ArrowUpRight size={14} className="step-item-arrow" />
                        </span>
                      </div>

                      <div className="step-item-body">
                        <h3 className="step-item-title">{feat.title}</h3>
                        {feat.summary && (
                          <p className="step-item-summary">{feat.summary}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
