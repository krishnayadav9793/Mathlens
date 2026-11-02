import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Grid,
  Compass,
  Blend,
  Zap,
  Variable,
  Binary,
  Split,
  Maximize2,
  ChevronUp,
  Check,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { FEATURES, getFeatureByStep } from '../../config/features';

export default function FloatingDock({
  currentStep,
  onSelectStep,
  currentView,
  onSelectView
}) {
  const [isOpen, setIsOpen] = useState(() => {
    const saved = localStorage.getItem('mathlens_dock_open');
    if (saved !== null) return saved === 'true';
    return true; // Default to open so user sees it right away
  });

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const dockRef = useRef(null);

  // Save dock open state to localStorage
  const handleToggleOpen = (nextState) => {
    setIsOpen(nextState);
    localStorage.setItem('mathlens_dock_open', String(nextState));
    if (!nextState) setOpenSubmenu(null);
  };

  // Close sub-menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dockRef.current && !dockRef.current.contains(e.target)) {
        setOpenSubmenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut 'N' to toggle dock
  useEffect(() => {
    function handleKeyDown(e) {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'n' || e.key === 'N') {
        handleToggleOpen(!isOpen);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Determine active item based on currentView and currentStep
  const isHome = currentView === 'home';
  const isPixels = currentView === 'module' && currentStep >= 1 && currentStep <= 6;
  const isTransforms = currentView === 'module' && currentStep === 7;
  const isVisualLabs = currentView === 'module' && currentStep >= 8 && currentStep <= 16;
  const isOptics = currentView === 'module' && currentStep === 17;
  const isAdvanced = currentView === 'module' && currentStep === 18;
  const isRank = currentView === 'module' && currentStep === 19;
  const isLinearSystems = currentView === 'module' && currentStep === 20;
  const isNorms = currentView === 'module' && currentStep === 21;
  const isQr = currentView === 'module' && currentStep === 22;

  const activeFeature = getFeatureByStep(currentStep);

  // Items for Pixels (B01 - B06)
  const pixelModules = FEATURES.filter((f) => f.stepNumber >= 1 && f.stepNumber <= 6);
  // Items for Visual Labs (B08 - B16)
  const visualLabModules = FEATURES.filter((f) => f.stepNumber >= 8 && f.stepNumber <= 16);

  const handleNavClick = (key, defaultStep, hasSubmenu) => {
    if (key === 'home') {
      setOpenSubmenu(null);
      onSelectView('home');
      return;
    }

    if (hasSubmenu) {
      if (openSubmenu === key) {
        setOpenSubmenu(null);
      } else {
        setOpenSubmenu(key);
      }
    } else {
      setOpenSubmenu(null);
    }

    if (defaultStep) {
      onSelectStep(defaultStep);
    }
  };

  return (
    <div
      className={`floating-dock-container ${isOpen ? 'dock-open' : 'dock-collapsed'}`}
      ref={dockRef}
      role="navigation"
      aria-label="Quick Dock Navigation"
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* COLLAPSED STATE: Pop-up button anchored at bottom-left */
          <motion.button
            key="dock-popup-trigger-btn"
            type="button"
            className="dock-toggle-popup-btn"
            onClick={() => handleToggleOpen(true)}
            initial={{ x: -24, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -24, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            title="Slide open navigation bar (Press N)"
            aria-label="Open Navigation Bar"
          >
            <PanelLeftOpen size={16} className="dock-icon" />
            <span className="dock-popup-text">Nav</span>
            <span className="dock-popup-badge">
              {isHome ? 'Home' : (activeFeature ? activeFeature.code : '01')}
            </span>
          </motion.button>
        ) : (
          /* EXPANDED STATE: Full bar slid out from left side */
          <motion.div
            key="dock-expanded-bar-wrapper"
            className="dock-wrapper-relative"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            {/* Submenu Popover for Multi-Module Categories */}
            <AnimatePresence>
              {openSubmenu && (
                <motion.div
                  className="dock-subnav-panel"
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                >
                  <div className="dock-subnav-header">
                    <span className="dock-subnav-title">
                      {openSubmenu === 'pixels' ? 'Pixels & RGB Modules' : 'Visual Labs Modules'}
                    </span>
                    <span className="dock-subnav-hint">
                      {openSubmenu === 'pixels' ? 'Steps 01 – 06' : 'Steps 08 – 16'}
                    </span>
                  </div>

                  <div className="dock-subnav-grid">
                    {(openSubmenu === 'pixels' ? pixelModules : visualLabModules).map((feat) => {
                      const isSelected = currentView === 'module' && currentStep === feat.stepNumber;
                      const Icon = feat.icon;
                      return (
                        <button
                          key={feat.id}
                          type="button"
                          className={`dock-subnav-item ${isSelected ? 'active' : ''}`}
                          onClick={() => {
                            onSelectStep(feat.stepNumber);
                            setOpenSubmenu(null);
                          }}
                        >
                          <div className="dock-subnav-icon-wrap">
                            <Icon size={13} />
                          </div>
                          <div className="dock-subnav-text">
                            <span className="dock-subnav-code">{feat.code}</span>
                            <span className="dock-subnav-name">{feat.title}</span>
                          </div>
                          {isSelected && <Check size={13} className="dock-subnav-check" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Dock Glass Bar */}
            <nav className="dock-glass-bar">
              {/* Slide to left / Collapse button */}
              <button
                type="button"
                className="dock-collapse-btn"
                onClick={() => handleToggleOpen(false)}
                title="Slide dock to left button (Press N)"
                aria-label="Slide dock to left"
              >
                <PanelLeftClose size={15} />
              </button>

              <div className="dock-separator" />

              {/* 1. Home */}
              <button
                type="button"
                className={`dock-item ${isHome ? 'active' : ''}`}
                onClick={() => handleNavClick('home', null, false)}
                title="Return to Overview"
                aria-label="Home Overview"
              >
                {isHome && <span className="dock-active-indicator" />}
                <Home size={15} className="dock-icon" />
                <span className="dock-label">Home</span>
              </button>

              <div className="dock-separator" />

              {/* 2. Pixels (B01 - B06) */}
              <button
                type="button"
                className={`dock-item ${isPixels ? 'active' : ''} ${openSubmenu === 'pixels' ? 'open' : ''}`}
                onClick={() => handleNavClick('pixels', isPixels ? null : 1, true)}
                title="Pixels & Foundations (B01 - B06)"
                aria-label="Pixels and Matrix modules"
              >
                {isPixels && <span className="dock-active-indicator" />}
                <Grid size={15} className="dock-icon" />
                <span className="dock-label">Pixels</span>
                <ChevronUp
                  size={11}
                  className={`dock-chevron ${openSubmenu === 'pixels' ? 'rotated' : ''}`}
                />
              </button>

              {/* 3. Transforms (B07) */}
              <button
                type="button"
                className={`dock-item ${isTransforms ? 'active' : ''}`}
                onClick={() => handleNavClick('transforms', 7, false)}
                title="2D Coordinate Geometric Transformations (B07)"
                aria-label="2D Transformations module"
              >
                {isTransforms && <span className="dock-active-indicator" />}
                <Compass size={15} className="dock-icon" />
                <span className="dock-label">Transforms</span>
              </button>

              {/* 4. Visual Labs (B08 - B16) */}
              <button
                type="button"
                className={`dock-item ${isVisualLabs ? 'active' : ''} ${openSubmenu === 'visual-labs' ? 'open' : ''}`}
                onClick={() => handleNavClick('visual-labs', isVisualLabs ? null : 8, true)}
                title="Visual Labs (B08 - B16)"
                aria-label="Visual Labs modules"
              >
                {isVisualLabs && <span className="dock-active-indicator" />}
                <Blend size={15} className="dock-icon" />
                <span className="dock-label">Visual Labs</span>
                <ChevronUp
                  size={11}
                  className={`dock-chevron ${openSubmenu === 'visual-labs' ? 'rotated' : ''}`}
                />
              </button>

              {/* 5. Optics (B17) */}
              <button
                type="button"
                className={`dock-item ${isOptics ? 'active' : ''}`}
                onClick={() => handleNavClick('optics', 17, false)}
                title="Exploring Ray Optics Through Matrices (B17)"
                aria-label="Ray Optics module"
              >
                {isOptics && <span className="dock-active-indicator" />}
                <Zap size={15} className="dock-icon" />
                <span className="dock-label">Optics</span>
              </button>

              {/* 6. Advanced (B18) */}
              <button
                type="button"
                className={`dock-item ${isAdvanced ? 'active' : ''}`}
                onClick={() => handleNavClick('advanced', 18, false)}
                title="Eigenvalues & Eigenvectors (B18)"
                aria-label="Advanced Eigenvalues module"
              >
                {isAdvanced && <span className="dock-active-indicator" />}
                <Variable size={15} className="dock-icon" />
                <span className="dock-label">Advanced</span>
              </button>

              {/* 7. Matrix Rank (B19) */}
              <button
                type="button"
                className={`dock-item ${isRank ? 'active' : ''}`}
                onClick={() => handleNavClick('rank', 19, false)}
                title="Rank of a Matrix — Information Redundancy (B19)"
                aria-label="Matrix Rank module"
              >
                {isRank && <span className="dock-active-indicator" />}
                <Binary size={15} className="dock-icon" />
                <span className="dock-label">Rank</span>
              </button>

              {/* 8. Linear Systems (B20) */}
              <button
                type="button"
                className={`dock-item ${isLinearSystems ? 'active' : ''}`}
                onClick={() => handleNavClick('linear-systems', 20, false)}
                title="System of Linear Equations — Recovering Hidden Images AX = b (B20)"
                aria-label="Linear Systems module"
              >
                {isLinearSystems && <span className="dock-active-indicator" />}
                <Split size={15} className="dock-icon" />
                <span className="dock-label">Systems</span>
              </button>

              {/* 9. Vector Norms (B21) */}
              <button
                type="button"
                className={`dock-item ${isNorms ? 'active' : ''}`}
                onClick={() => handleNavClick('vector-norms', 21, false)}
                title="Vector Norms — What is Length & Measuring Image Distance (B21)"
                aria-label="Vector Norms module"
              >
                {isNorms && <span className="dock-active-indicator" />}
                <Maximize2 size={15} className="dock-icon" />
                <span className="dock-label">Norms</span>
              </button>

              {/* 10. QR Decomposition (B22) */}
              <button
                type="button"
                className={`dock-item ${isQr ? 'active' : ''}`}
                onClick={() => handleNavClick('qr-decomposition', 22, false)}
                title="QR Decomposition — Orthogonality, Gram–Schmidt & Image Reconstruction (B22)"
                aria-label="QR Decomposition module"
              >
                {isQr && <span className="dock-active-indicator" />}
                <Compass size={15} className="dock-icon" />
                <span className="dock-label">QR Decomp</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
