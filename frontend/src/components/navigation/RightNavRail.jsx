import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PanelRightClose,
  Search,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FEATURES, CATEGORIES, getFeatureByStep } from '../../config/features';

/**
 * RightNavRail — Integrated Right-Side Navigation Rail & Slide-Out Panel.
 * Controls direct navigation to all 18 visual laboratories (01–18).
 */
export default function RightNavRail({
  isOpen,
  onToggle,
  onClose,
  currentStep,
  onSelectStep,
  currentView,
  onSelectView
}) {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const panelRef = useRef(null);
  const searchInputRef = useRef(null);
  const categorySliderRef = useRef(null);
  const categoryRefs = useRef({});
  const activeItemRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const activeFeature = getFeatureByStep(currentStep) || FEATURES[0];

  const checkCategoryScroll = useCallback(() => {
    const el = categorySliderRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const handleScrollCategories = (offset) => {
    if (categorySliderRef.current) {
      categorySliderRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Auto-focus search input when opening panel
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
        checkCategoryScroll();
      }, 120);
      return () => clearTimeout(timer);
    } else {
      setFilterQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen, checkCategoryScroll]);

  // Auto-reveal selected category chip
  useEffect(() => {
    const el = categoryRefs.current[selectedCategory];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    const timer = setTimeout(checkCategoryScroll, 120);
    return () => clearTimeout(timer);
  }, [selectedCategory, checkCategoryScroll]);

  // Scroll active module into view on open
  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      const timer = setTimeout(() => {
        activeItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentStep]);

  // Click outside to close panel
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest('.right-rail-trigger-btn') &&
        !e.target.closest('.navbar-rail-toggle-btn')
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter modules
  const filteredFeatures = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    return FEATURES.filter((feat) => {
      if (selectedCategory !== 'all' && feat.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      return (
        feat.title.toLowerCase().includes(q) ||
        feat.summary.toLowerCase().includes(q) ||
        feat.code.toLowerCase().includes(q) ||
        feat.formula.toLowerCase().includes(q) ||
        feat.categoryLabel.toLowerCase().includes(q) ||
        feat.keywords?.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [filterQuery, selectedCategory]);

  const categoryChips = useMemo(() => [
    { id: 'all', label: 'All', count: FEATURES.length },
    ...CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.shortLabel || cat.label,
      count: FEATURES.filter((f) => f.category === cat.id).length
    }))
  ], []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Soft Backdrop Overlay */}
            <motion.div
              className="right-rail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              aria-hidden="true"
            />

            {/* Right-Side Drawer Panel */}
            <motion.aside
              ref={panelRef}
              className="right-rail-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-label="Mathematical Modules Directory"
              aria-modal="true"
            >
              {/* Header */}
              <div className="right-rail-header">
                <div className="rail-header-text">
                  <div className="rail-header-tagline">
                    <span className="rail-mini-badge">WORKSPACE RAIL</span>
                    <span className="rail-count-badge">{FEATURES.length} Modules</span>
                  </div>
                  <h3 className="rail-title">Visual Laboratories</h3>
                </div>
                <button
                  type="button"
                  className="rail-close-btn"
                  onClick={onClose}
                  title="Close Navigation Rail (Escape)"
                  aria-label="Close navigation rail"
                >
                  <PanelRightClose size={16} />
                </button>
              </div>

              {/* Sliding Category Filter Bar with Left/Right Controls */}
              <div className="rail-categories-slider-wrapper">
                <button
                  type="button"
                  className={`rail-slider-arrow left ${canScrollLeft ? 'active' : 'disabled'}`}
                  onClick={() => handleScrollCategories(-160)}
                  aria-label="Scroll categories left"
                  title="Previous categories"
                  disabled={!canScrollLeft}
                >
                  <ChevronLeft size={13} />
                </button>

                <div
                  ref={categorySliderRef}
                  className="rail-categories-track"
                  role="tablist"
                  aria-label="Module category filter"
                  onScroll={checkCategoryScroll}
                >
                  {categoryChips.map((chip) => {
                    const isActive = selectedCategory === chip.id;
                    return (
                      <button
                        key={chip.id}
                        ref={(el) => (categoryRefs.current[chip.id] = el)}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`rail-cat-chip ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(chip.id)}
                      >
                        <span>{chip.label}</span>
                        <span className="rail-chip-num">{chip.count}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className={`rail-slider-arrow right ${canScrollRight ? 'active' : 'disabled'}`}
                  onClick={() => handleScrollCategories(160)}
                  aria-label="Scroll categories right"
                  title="Next categories"
                  disabled={!canScrollRight}
                >
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Search Inside Rail */}
              <div className="rail-search-box">
                <Search size={14} className="rail-search-icon" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="rail-search-input"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filter 18 experiments..."
                  aria-label="Filter experiments inside rail"
                />
                {filterQuery && (
                  <button
                    type="button"
                    className="rail-search-clear"
                    onClick={() => setFilterQuery('')}
                    aria-label="Clear filter"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Module Items Scrollable List */}
              <div className="rail-modules-scroll" role="menu">
                {filteredFeatures.length === 0 ? (
                  <div className="rail-empty-state">
                    <Sparkles size={20} className="rail-empty-icon" />
                    <p className="rail-empty-title">No modules matched</p>
                    <span className="rail-empty-sub">Try searching for "RGB", "Inverse", or "Ray"</span>
                  </div>
                ) : (
                  filteredFeatures.map((feat) => {
                    const isSelected =
                      currentView === 'module' && currentStep === feat.stepNumber;
                    const Icon = feat.icon;

                    return (
                      <button
                        key={feat.id}
                        ref={isSelected ? activeItemRef : null}
                        type="button"
                        role="menuitem"
                        className={`rail-module-item ${isSelected ? 'active' : ''}`}
                        onClick={() => {
                          onSelectStep(feat.stepNumber);
                          onClose();
                        }}
                        title={`Open Module ${feat.code}: ${feat.title}`}
                      >
                        <div className="rail-item-code-col">
                          <span className="rail-item-code">{feat.code}</span>
                          <div className="rail-item-icon-box">
                            <Icon size={14} />
                          </div>
                        </div>

                        <div className="rail-item-body">
                          <div className="rail-item-topline">
                            <span className="rail-item-title">{feat.title}</span>
                            {isSelected && (
                              <span className="rail-active-pill">ACTIVE</span>
                            )}
                          </div>
                        </div>

                        <ChevronRight size={14} className="rail-item-chevron" />
                      </button>
                    );
                  })
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
  );
}
