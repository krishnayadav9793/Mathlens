import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Check, Lock, ChevronRight } from 'lucide-react';
import { CATEGORIES, FEATURES, VISIBLE_CATEGORIES, VISIBLE_FEATURES, TOTAL_VISIBLE_LABS } from '../../config/features';

export default function FeatureSheet({
  isOpen,
  onClose,
  currentStep,
  onSelectStep,
  onSelectView
}) {
  const [search, setSearch] = useState('');

  const filteredFeatures = VISIBLE_FEATURES.filter(f => 
    !search.trim() ||
    f.title.toLowerCase().includes(search.toLowerCase()) ||
    f.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
    f.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="mobile-sheet-overlay" onClick={onClose}>
          <motion.div
            className="mobile-sheet-drawer glass-level-4"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="mobile-sheet-handle-bar">
              <div className="mobile-sheet-drag-pill" />
            </div>

            {/* Header */}
            <div className="mobile-sheet-header">
              <div>
                <h3 className="mobile-sheet-title">All Mathematics Modules</h3>
                <p className="mobile-sheet-sub">{TOTAL_VISIBLE_LABS} interactive visual laboratories</p>
              </div>
              <button className="mobile-sheet-close-btn" onClick={onClose} aria-label="Close sheet">
                <X size={18} />
              </button>
            </div>

            {/* Filter Search */}
            <div className="mobile-sheet-search-wrap">
              <Search size={16} className="mobile-sheet-search-icon" />
              <input
                type="text"
                placeholder="Search modules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mobile-sheet-search-input"
              />
            </div>

            {/* Categories & Steps List */}
            <div className="mobile-sheet-scroll custom-scrollbar">
              {VISIBLE_CATEGORIES.map(cat => {
                const catFeatures = filteredFeatures.filter(f => f.category === cat.id);
                if (catFeatures.length === 0) return null;
                const CatIcon = cat.icon;

                return (
                  <div key={cat.id} className="mobile-sheet-category-block">
                    <div className="mobile-sheet-cat-heading">
                      <CatIcon size={14} style={{ color: cat.color }} />
                      <span>{cat.label}</span>
                    </div>

                    <div className="mobile-sheet-items-grid">
                      {catFeatures.map(feat => {
                        const isSelected = currentStep === feat.stepNumber;
                        return (
                          <button
                            key={feat.id}
                            className={`mobile-sheet-item ${isSelected ? 'active' : ''}`}
                            onClick={() => {
                              onSelectStep(feat.stepNumber);
                              onSelectView('module');
                              onClose();
                            }}
                          >
                            <div className="mobile-sheet-item-left">
                              <span className="mobile-sheet-step-num">{feat.stepNumber < 10 ? `0${feat.stepNumber}` : feat.stepNumber}</span>
                              <div className="mobile-sheet-item-text">
                                <span className="mobile-sheet-item-title">{feat.shortTitle}</span>
                                <span className="mobile-sheet-item-desc">{feat.summary}</span>
                              </div>
                            </div>
                            {isSelected && <Check size={16} className="mobile-sheet-check text-cyan-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
