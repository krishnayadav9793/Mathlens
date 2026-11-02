import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Binary,
  Sun,
  Moon,
  PanelRight,
  Menu,
  X
} from 'lucide-react';
import { getFeatureByStep, FEATURES } from '../../config/features';

/**
 * Navbar — Elegant Single-Row Top Navigation Bar
 * Left: MathLens + LAB badge (no standalone logo icon, no ModulesB17 text)
 * Center: Overview, Curriculum, Workspace, About
 * Right: Track Switcher, Search (⌘K), Theme Toggle, Modules Rail Trigger
 */
export default function Navbar({
  currentView,
  onSelectView,
  currentStep,
  onSelectStep,
  currentLevel = 'basic',
  onSelectLevel,
  onOpenLevelModal,
  theme = 'light',
  onToggleTheme,
  onOpenCommandPalette,
  onToggleRightRail,
  isRightRailOpen
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isAdvanced = currentLevel === 'advanced';
  const activeFeature = getFeatureByStep(currentStep) || FEATURES[0];

  const handleNavClick = (viewAction) => {
    viewAction();
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="top-navbar-root" role="banner">
      <div className="top-navbar-inner">
        {/* 1. LEFT SECTION: Pure Brand Area (Bold MathLens Only, No LAB) */}
        <div className="navbar-left-brand-zone">
          <button
            type="button"
            className="navbar-brand-btn"
            onClick={() => onSelectView('home')}
            aria-label="MathLens Home"
          >
            <span className="navbar-brand-name">MathLens</span>
          </button>
        </div>

        {/* 2. CENTRE SECTION: Main Page Navigation Links */}
        <nav className="navbar-nav-links" aria-label="Primary navigation">
          <button
            type="button"
            className={`navbar-nav-item ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onSelectView('home')}
            aria-current={currentView === 'home' ? 'page' : undefined}
          >
            Overview
          </button>

          <button
            type="button"
            className={`navbar-nav-item ${currentView === 'learn' ? 'active' : ''}`}
            onClick={() => onSelectView('learn')}
            aria-current={currentView === 'learn' ? 'page' : undefined}
          >
            Curriculum
          </button>

          <button
            type="button"
            className={`navbar-nav-item ${currentView === 'module' ? 'active' : ''}`}
            onClick={() => onSelectStep(currentStep || 1)}
            aria-current={currentView === 'module' ? 'page' : undefined}
          >
            Workspace
          </button>

          <button
            type="button"
            className={`navbar-nav-item ${currentView === 'about' ? 'active' : ''}`}
            onClick={() => onSelectView('about')}
            aria-current={currentView === 'about' ? 'page' : undefined}
          >
            About
          </button>

          <button
            type="button"
            className={`navbar-nav-item ${currentView === 'contact' ? 'active' : ''}`}
            onClick={() => onSelectView('contact')}
            aria-current={currentView === 'contact' ? 'page' : undefined}
          >
            Contact
          </button>
        </nav>

        

        {/* 3. RIGHT SECTION: Track Selector, Theme, Right Rail Toggle */}
        <div className="navbar-actions-group">
          {/* Mathematical Track Toggle Button (Hides inactive, toggles on click) */}
          <button
            type="button"
            className="navbar-action-btn navbar-track-toggle-btn"
            onClick={() => onSelectLevel && onSelectLevel(isAdvanced ? 'basic' : 'advanced')}
            title={`Active Track: ${isAdvanced ? 'Advanced' : 'Basic'} — Click to switch to ${isAdvanced ? 'Basic' : 'Advanced'}`}
            aria-label={`Active track: ${isAdvanced ? 'Advanced' : 'Basic'}. Click to switch.`}
          >
            {isAdvanced ? (
              <>
                <Binary size={13} className="navbar-action-icon" aria-hidden="true" />
                <span className="navbar-track-label">Advanced</span>
              </>
            ) : (
              <>
                <GraduationCap size={13} className="navbar-action-icon" aria-hidden="true" />
                <span className="navbar-track-label">Basic</span>
              </>
            )}
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            className="navbar-icon-btn navbar-theme-btn"
            onClick={onToggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme (Press T)`}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
          >
            {theme === 'dark' ? (
              <Sun size={15} aria-hidden="true" />
            ) : (
              <Moon size={15} aria-hidden="true" />
            )}
          </button>

          {/* Right Navigation Rail Toggle Button */}
          {onToggleRightRail && (
            <button
              type="button"
              className={`navbar-action-btn navbar-rail-toggle-btn ${isRightRailOpen ? 'active' : ''}`}
              onClick={onToggleRightRail}
              title="Toggle right-side modules navigation rail (Press N)"
              aria-label="Toggle modules navigation rail"
              aria-expanded={isRightRailOpen}
            >
              <PanelRight size={14} className="navbar-action-icon" aria-hidden="true" />
              <span className="navbar-btn-label">Modules</span>
              <span className="navbar-rail-pill">
                {currentView === 'module' ? activeFeature.code : '18'}
              </span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="navbar-icon-btn navbar-mobile-toggle"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* 4. Responsive Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="navbar-mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="navbar-mobile-inner">
              <button
                type="button"
                className={`navbar-mobile-nav-item ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSelectView('home'))}
              >
                Overview
              </button>
              <button
                type="button"
                className={`navbar-mobile-nav-item ${currentView === 'learn' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSelectView('learn'))}
              >
                Curriculum
              </button>
              <button
                type="button"
                className={`navbar-mobile-nav-item ${currentView === 'module' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSelectStep(currentStep || 1))}
              >
                Workspace ({activeFeature.code})
              </button>
              <button
                type="button"
                className={`navbar-mobile-nav-item ${currentView === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSelectView('about'))}
              >
                About
              </button>
              <button
                type="button"
                className={`navbar-mobile-nav-item ${currentView === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick(() => onSelectView('contact'))}
              >
                Contact
              </button>

              <div className="navbar-mobile-divider" />

              <div className="navbar-mobile-actions">
                <button
                  type="button"
                  className="navbar-mobile-track-toggle-btn"
                  onClick={() => {
                    onSelectLevel && onSelectLevel(isAdvanced ? 'basic' : 'advanced');
                    setIsMobileMenuOpen(false);
                  }}
                  title="Tap to switch track"
                >
                  {isAdvanced ? (
                    <>
                      <Binary size={15} />
                      <span>Track: <strong>Advanced</strong> (Tap to switch to Basic)</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap size={15} />
                      <span>Track: <strong>Basic</strong> (Tap to switch to Advanced)</span>
                    </>
                  )}
                </button>
                {onToggleRightRail && (
                  <button
                    type="button"
                    className="navbar-mobile-modules-btn"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onToggleRightRail();
                    }}
                  >
                    <span>Browse 18 Modules Rail</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
