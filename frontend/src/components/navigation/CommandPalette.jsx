import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, ArrowRight, CornerDownLeft, X, Command } from 'lucide-react';
import { FEATURES, CATEGORIES, VISIBLE_FEATURES } from '../../config/features';

export default function CommandPalette({ isOpen, onClose, onSelectFeature, onTriggerSimulationLoader }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  const filteredFeatures = React.useMemo(() => {
    if (!query.trim()) return VISIBLE_FEATURES;
    const q = query.toLowerCase().trim();
    return VISIBLE_FEATURES.filter(f => 
      f.title.toLowerCase().includes(q) ||
      f.shortTitle.toLowerCase().includes(q) ||
      f.categoryLabel.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.keywords.some(k => k.toLowerCase().includes(q))
    );
  }, [query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredFeatures.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredFeatures.length) % Math.max(1, filteredFeatures.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredFeatures[selectedIndex]) {
        onSelectFeature(filteredFeatures[selectedIndex]);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="cmd-palette-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="cmd-palette-dialog glass-level-4"
            initial={{ scale: 0.96, opacity: 0, y: -15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input Bar */}
            <div className="cmd-palette-input-wrap">
              <Search size={18} className="cmd-search-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search experiments, operations, or concepts"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="cmd-search-input"
              />
              {query && (
                <button className="cmd-clear-btn" onClick={() => setQuery('')}>
                  <X size={14} />
                </button>
              )}
              <div className="cmd-shortcut-tag">
                <kbd>ESC</kbd>
              </div>
            </div>

            {/* Results List */}
            <div className="cmd-results-list">
              {filteredFeatures.length === 0 ? (
                <div className="cmd-empty-state">
                  <Sparkles size={24} className="cmd-empty-icon" />
                  <p className="cmd-empty-text">No experiments found for "{query}"</p>
                  <span className="cmd-empty-sub">Try searching for "eigenvalue", "rgb", "matrix subtraction", or "inversion"</span>
                </div>
              ) : (
                filteredFeatures.map((feat, idx) => {
                  const isSelected = idx === selectedIndex;
                  const Icon = feat.icon;
                  return (
                    <div
                      key={feat.id}
                      className={`cmd-result-item ${isSelected ? 'selected' : ''}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        onSelectFeature(feat);
                        onClose();
                      }}
                    >
                      <div className="cmd-item-icon-box">
                        <Icon size={16} />
                      </div>
                      <div className="cmd-item-meta">
                        <div className="cmd-item-topline">
                          <span className="cmd-item-step">Step {feat.stepNumber}</span>
                          <span className="cmd-item-title">{feat.title}</span>
                          <span className="cmd-item-category">{feat.categoryLabel}</span>
                        </div>
                        <p className="cmd-item-desc">{feat.summary}</p>
                      </div>
                      <div className="cmd-item-action">
                        {isSelected && <CornerDownLeft size={14} className="cmd-enter-icon" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="cmd-palette-footer">
              <div className="cmd-footer-hints">
                <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                <span><kbd>↵</kbd> Select</span>
                {onTriggerSimulationLoader && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onTriggerSimulationLoader();
                    }}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0 }}
                  >
                    <span>⚡ <kbd>Simulate Fetch</kbd></span>
                  </button>
                )}
                <span><kbd>ESC</kbd> Close</span>
              </div>
              <div className="cmd-footer-badge">
                <span>MathLens Search Engine</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
