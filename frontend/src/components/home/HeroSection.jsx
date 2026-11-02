import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { FEATURES, CATEGORIES } from '../../config/features';

export default function HeroSection({
  onStartExploring,
  onSelectStep,
  onSelectView,
  onOpenCommandPalette
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const scrollContainerRef = useRef(null);
  const categoryRefs = useRef({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const handleScrollBy = (offset) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  // Automatically reveal the selected category chip
  useEffect(() => {
    const el = categoryRefs.current[selectedCategory];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Check scroll after layout adjusts
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [selectedCategory, checkScroll]);

  // Filter features based on search query and active category chip
  const filteredFeatures = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return FEATURES.filter((feat) => {
      // Category filter
      if (selectedCategory !== 'all' && feat.category !== selectedCategory) {
        return false;
      }

      // Query filter
      if (!query) return true;

      const titleMatch = feat.title.toLowerCase().includes(query);
      const summaryMatch = feat.summary.toLowerCase().includes(query);
      const codeMatch = feat.code.toLowerCase().includes(query);
      const formulaMatch = feat.formula.toLowerCase().includes(query);
      const categoryMatch = feat.categoryLabel?.toLowerCase().includes(query);
      const keywordMatch = feat.keywords?.some((k) => k.toLowerCase().includes(query));

      return titleMatch || summaryMatch || codeMatch || formulaMatch || categoryMatch || keywordMatch;
    });
  }, [searchQuery, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredFeatures.length > 0) {
      onSelectStep(filteredFeatures[0].stepNumber);
    } else {
      onSelectStep(1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  const categoryChips = useMemo(() => [
    { id: 'all', label: 'All', count: FEATURES.length },
    ...CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.shortLabel || cat.label,
      count: FEATURES.filter((f) => f.category === cat.id).length
    }))
  ], []);

  return (
    <div className="hero-page-wrapper">
      {/* 1. Masthead Section (Clean editorial headline & subheading) */}
      <section className="hero-masthead-section">
        <motion.div
          className="hero-masthead-inner"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow Label */}
          <div className="hero-eyebrow">
            <span>INTERACTIVE MATHEMATICS &amp; LINEAR ALGEBRA LAB</span>
          </div>

          {/* Headline */}
          <h1 className="hero-headline">
            See the <span className="hero-headline-accent">mathematics</span> you can actually understand.
          </h1>

          {/* Subheading */}
          <p className="hero-subheading">
            Bridge the gap between abstract matrix equations and tangible digital pixels through {FEATURES.length} real-time visual laboratories. Discover intensity tensors, 2D coordinate mappings, eigenspaces, and matrix rank redundancy.
          </p>
        </motion.div>
      </section>

      {/* 2. All Experiments Section: Unified Container (Search -> Category Tabs -> Compact Grid) */}
      <section className="hero-modules-directory" id="all-experiments">
        <div className="all-experiments-container">
          {/* 1. Search Bar */}
          <div className="hero-search-capsule-wrapper">
            <form className="hero-search-capsule" onSubmit={handleSearchSubmit}>
              <div className="search-capsule-left">
                <Search size={18} className="search-capsule-icon" aria-hidden="true" />
                <input
                  id="hero-search-input"
                  type="text"
                  className="search-capsule-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search experiments by name, operation, or concept..."
                  aria-label="Search experiments by name, operation, or concept"
                  autoComplete="off"
                  spellCheck="false"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    title="Clear search query"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="search-capsule-action-btn"
                title={
                  filteredFeatures.length > 0
                    ? `Open ${filteredFeatures[0].title}`
                    : 'Explore First Module'
                }
              >
                <span>Explore Lab</span>
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

          {/* 2. Responsive Category Filter Tabs */}
          <div className="hero-category-slider-wrapper">
            <button
              type="button"
              className={`category-slider-arrow left ${canScrollLeft ? 'active' : 'disabled'}`}
              onClick={() => handleScrollBy(-200)}
              aria-label="Scroll categories left"
              title="Previous categories"
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={16} />
            </button>

            <div
              ref={scrollContainerRef}
              className="hero-category-slider-track"
              role="tablist"
              aria-label="Experiment Category Filters"
              onScroll={checkScroll}
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
                    className={`hero-tag-pill ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(chip.id)}
                  >
                    <span>{chip.label}</span>
                    <span className="hero-pill-badge">{chip.count}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={`category-slider-arrow right ${canScrollRight ? 'active' : 'disabled'}`}
              onClick={() => handleScrollBy(200)}
              aria-label="Scroll categories right"
              title="Next categories"
              disabled={!canScrollRight}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* 3. Compact Elegant Grid of Experiment Cards */}
          {filteredFeatures.length > 0 ? (
            <div className="directory-cards-grid">
              {filteredFeatures.map((feat) => (
                <motion.button
                  key={feat.id}
                  className="directory-item-card"
                  onClick={() => onSelectStep(feat.stepNumber)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  type="button"
                  tabIndex={0}
                  aria-label={`${feat.title} (Module ${feat.stepNumber})`}
                >
                  <div className="dir-item-left">
                    <span className="dir-item-num">{String(feat.stepNumber).padStart(2, '0')}</span>
                    <span className="dir-item-title">{feat.title}</span>
                  </div>
                  <div className="dir-item-arrow-wrap">
                    <ArrowUpRight size={13} className="dir-item-arrow" />
                  </div>
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="experiments-empty-state">
              <div className="empty-state-icon">
                <Search size={26} />
              </div>
              <h4 className="empty-state-title">No experiments matched your search</h4>
              <p className="empty-state-desc">
                No results found for &ldquo;<strong>{searchQuery}</strong>&rdquo;
                {selectedCategory !== 'all' ? ` in category "${selectedCategory}"` : ''}.
              </p>
              <button
                type="button"
                className="empty-state-clear-btn"
                onClick={handleClearSearch}
              >
                Clear filters and view all {FEATURES.length} experiments
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Structured Learning Pathways (Curriculum Overview) */}
      <section className="hero-curriculum-overview">
        <div className="section-header-block">
          <span className="section-pre-tag">Core Curriculum</span>
          <h2 className="section-headline">Five Foundations of Visual Linear Algebra</h2>
          <p className="section-description">
            Structured learning tracks engineered to build intuitive and rigorous understanding of digital matrices.
          </p>
        </div>

        <div className="hero-pathways-grid">
          {CATEGORIES.map((cat, idx) => {
            const catFeatures = FEATURES.filter((f) => f.category === cat.id);
            const CatIcon = cat.icon;
            const firstStep = catFeatures[0]?.stepNumber || 1;

            return (
              <motion.div
                key={cat.id}
                className="pathway-card"
                whileHover={{ y: -3 }}
                onClick={() => onSelectStep(firstStep)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectStep(firstStep);
                  }
                }}
              >
                <div className="pathway-card-top">
                  <div className="pathway-icon-box">
                    <CatIcon size={18} />
                  </div>
                  <span className="pathway-step-count">Track 0{idx + 1}</span>
                </div>

                <h3 className="pathway-title">{cat.label}</h3>
                <p className="pathway-desc">{cat.description}</p>

                <div className="pathway-footer">
                  <span>{catFeatures.length} Modules</span>
                  <ArrowRight size={14} className="pathway-arrow" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
