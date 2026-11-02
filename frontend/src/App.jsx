import React, { useState, useEffect, useCallback } from 'react';
import Footer from './components/common/Footer';
import Navbar from './components/layout/Navbar';
import LevelSelectorModal from './components/common/LevelSelectorModal';
import FeatureSheet from './components/navigation/FeatureSheet';
import CommandPalette from './components/navigation/CommandPalette';
import MathBackground from './components/background/MathBackground';
import FetchSimulationLoader from './components/common/FetchSimulationLoader';

import HeroSection from './components/home/HeroSection';
import CurriculumScreen from './screens/CurriculumScreen';
import AboutScreen from './screens/AboutScreen';
import ContactScreen from './screens/ContactScreen';
import RightNavRail from './components/navigation/RightNavRail';
import BackButton from './components/common/BackButton';

import Step1Grayscale from './steps/Step1Grayscale';
import Step2CellEditing from './steps/Step2CellEditing';
import Step3ScalarBrightness from './steps/Step3ScalarBrightness';
import Step4SingleRGBPixel from './steps/Step4SingleRGBPixel';
import Step5RGBMatrices from './steps/Step5RGBMatrices';
import Step6RGBScalarMult from './steps/Step6RGBScalarMult';
import Step7ImageTransforms from './steps/Step7ImageTransforms';
import Step8MatrixAddition from './steps/Step8MatrixAddition';
import Step9MatrixSubtraction from './steps/Step9MatrixSubtraction';
import Step10FindWhatChanged from './steps/Step10FindWhatChanged';
import Step11ImageInversionXRay from './steps/Step11ImageInversionXRay';
import Step12DeterminantVisualizer from './steps/Step12DeterminantVisualizer';
import Step13MatrixInverse from './steps/Step13MatrixInverse';
import Step14MatrixInverseZoom from './steps/Step14MatrixInverseZoom';
import Step15MatrixMultiplicationShadows from './steps/Step15MatrixMultiplicationShadows';
import Step16MyImageMyMatrix from './steps/Step16MyImageMyMatrix';
import Step17RayOptics from './steps/Step17RayOptics';
import Step18Eigenvalues from './steps/Step18Eigenvalues';
import Step19MatrixRank from './steps/Step19MatrixRank';
import Step20LinearSystems from './steps/Step20LinearSystems';
import Step21VectorNorms from './steps/Step21VectorNorms';
import Step22QRDecomposition from './steps/Step22QRDecomposition';

import { Analytics } from "@vercel/analytics/react"
import { getFeatureByStep, FEATURES } from './config/features';
import './index.css';
import './App.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2.5rem 1.5rem', maxWidth: '640px', margin: '3rem auto', textAlign: 'center', background: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color, #e5e7eb)', borderRadius: '14px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}>
          <h3 style={{ color: '#EF4444', marginBottom: '0.6rem', fontSize: '1.1rem', fontWeight: 700 }}>Something went wrong rendering this module</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
            {this.state.error?.message || 'An unexpected runtime error occurred.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{ padding: '0.55rem 1.25rem', borderRadius: '8px', background: 'var(--accent-primary, #C59B67)', color: '#ffffff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentLevel, setCurrentLevel] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('mathlens_level')) || 'basic';
  });

  const handleSelectLevel = useCallback((lvl) => {
    setCurrentLevel(lvl);
    localStorage.setItem('mathlens_level', lvl);
    window.dispatchEvent(new CustomEvent('mathlens_level_change', { detail: lvl }));
  }, []);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRightRailOpen, setIsRightRailOpen] = useState(false);

  // View state: 'home' | 'module' | 'learn' | 'about'
  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam && ['home', 'module', 'learn', 'about', 'contact'].includes(viewParam)) {
      return viewParam;
    }
    if (params.get('step')) return 'module';
    return 'home';
  });

  // Current interactive step (1 to FEATURES.length)
  const [currentStep, setCurrentStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    if (stepParam) {
      const parsed = parseInt(stepParam, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= FEATURES.length) return parsed;
    }
    const saved = localStorage.getItem('mathlens_step');
    return saved ? parseInt(saved, 10) : 1;
  });

  // In-app navigation history stack for consistent Back button behaviour
  const [navHistory, setNavHistory] = useState(() => [
    { view: currentView, step: currentStep }
  ]);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const themeParam = params.get('theme');
    if (themeParam === 'light' || themeParam === 'dark') return themeParam;
    return localStorage.getItem('mathlens_theme') || 'light';
  });

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('mathlens_theme', nextTheme);
  }, [theme]);

  const handleSelectStep = useCallback((step) => {
    const parsedStep = typeof step === 'number' ? step : parseInt(step, 10);
    const validStep = !isNaN(parsedStep) ? parsedStep : 1;
    setCurrentStep(validStep);
    setCurrentView('module');
    setNavHistory(prev => [...prev, { view: 'module', step: validStep }]);
    localStorage.setItem('mathlens_step', String(validStep));
    const url = new URL(window.location.href);
    url.searchParams.set('step', validStep);
    url.searchParams.delete('view');
    window.history.replaceState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectView = useCallback((view) => {
    setCurrentView(view);
    setNavHistory(prev => [...prev, { view, step: currentStep }]);
    const url = new URL(window.location.href);
    if (view === 'module') {
      url.searchParams.set('step', currentStep);
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', view);
      url.searchParams.delete('step');
    }
    window.history.replaceState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Reversible Back Navigation Handler with Sensible Fallbacks
  const handleBack = useCallback(() => {
    if (navHistory.length > 1) {
      const nextStack = [...navHistory];
      nextStack.pop(); // Remove current view
      const prevEntry = nextStack[nextStack.length - 1];
      setNavHistory(nextStack);
      if (prevEntry.view === 'module') {
        const targetStep = prevEntry.step || 1;
        setCurrentStep(targetStep);
        setCurrentView('module');
        const url = new URL(window.location.href);
        url.searchParams.set('step', targetStep);
        url.searchParams.delete('view');
        window.history.replaceState({}, '', url.toString());
      } else {
        const targetView = prevEntry.view || 'home';
        setCurrentView(targetView);
        const url = new URL(window.location.href);
        url.searchParams.set('view', targetView);
        url.searchParams.delete('step');
        window.history.replaceState({}, '', url.toString());
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Sensible Fallback when opened directly via URL or refreshed
      handleSelectView('home');
    }
  }, [navHistory, handleSelectView]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Global Slider Sync: Ensure all range sliders dynamically track their fill percentage smoothly
  useEffect(() => {
    const updateRange = (input) => {
      if (!input || input.type !== 'range') return;
      const min = parseFloat(input.min) !== undefined && !isNaN(parseFloat(input.min)) ? parseFloat(input.min) : 0;
      const max = parseFloat(input.max) !== undefined && !isNaN(parseFloat(input.max)) ? parseFloat(input.max) : 100;
      const val = parseFloat(input.value) !== undefined && !isNaN(parseFloat(input.value)) ? parseFloat(input.value) : 0;
      const pct = max > min ? Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100)) : 0;
      input.style.setProperty('--slider-pct', `${pct}%`);
    };

    const handleInput = (e) => {
      if (e.target && e.target.type === 'range') {
        updateRange(e.target);
      }
    };

    document.addEventListener('input', handleInput, { passive: true });
    document.addEventListener('change', handleInput, { passive: true });

    const updateAllRanges = () => {
      document.querySelectorAll('input[type="range"]').forEach(updateRange);
    };
    updateAllRanges();

    const observer = new MutationObserver(() => {
      updateAllRanges();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('input', handleInput);
      document.removeEventListener('change', handleInput);
      observer.disconnect();
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      // ⌘K or Ctrl+K -> Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
        return;
      }

      // T / t -> Toggle Theme
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // N / n -> Toggle Right-Side Modules Rail
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsRightRailOpen(prev => !prev);
        return;
      }

      // Left / Right arrows for step navigation in module view
      if (currentView === 'module') {
        if (e.key === 'ArrowLeft' && currentStep > 1) {
          e.preventDefault();
          handleSelectStep(currentStep - 1);
        } else if (e.key === 'ArrowRight' && currentStep < FEATURES.length) {
          e.preventDefault();
          handleSelectStep(currentStep + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, currentStep, handleSelectStep, toggleTheme]);

  const renderModuleStepContent = () => {
    switch (Number(currentStep)) {
      case 1:
        return <Step1Grayscale onSelectStep={handleSelectStep} />;
      case 2:
        return <Step2CellEditing onSelectStep={handleSelectStep} />;
      case 3:
        return <Step3ScalarBrightness onSelectStep={handleSelectStep} />;
      case 4:
        return <Step4SingleRGBPixel onSelectStep={handleSelectStep} />;
      case 5:
        return <Step5RGBMatrices onSelectStep={handleSelectStep} />;
      case 6:
        return <Step6RGBScalarMult onSelectStep={handleSelectStep} />;
      case 7:
        return <Step7ImageTransforms onSelectStep={handleSelectStep} />;
      case 8:
        return <Step8MatrixAddition onSelectStep={handleSelectStep} />;
      case 9:
        return <Step9MatrixSubtraction onSelectStep={handleSelectStep} />;
      case 10:
        return <Step10FindWhatChanged onSelectStep={handleSelectStep} />;
      case 11:
        return <Step11ImageInversionXRay onSelectStep={handleSelectStep} />;
      case 12:
        return <Step12DeterminantVisualizer onSelectStep={handleSelectStep} />;
      case 13:
        return <Step13MatrixInverse onSelectStep={handleSelectStep} />;
      case 14:
        return <Step14MatrixInverseZoom onSelectStep={handleSelectStep} />;
      case 15:
        return <Step15MatrixMultiplicationShadows onSelectStep={handleSelectStep} />;
      case 16:
        return <Step16MyImageMyMatrix onSelectStep={handleSelectStep} />;
      case 17:
        return <Step17RayOptics onSelectStep={handleSelectStep} />;
      case 18:
        return <Step18Eigenvalues onSelectStep={handleSelectStep} />;
      case 19:
        return <Step19MatrixRank onSelectStep={handleSelectStep} />;
      case 20:
        return <Step20LinearSystems onSelectStep={handleSelectStep} />;
      case 21:
        return <Step21VectorNorms onSelectStep={handleSelectStep} />;
      case 22:
        return <Step22QRDecomposition onSelectStep={handleSelectStep} />;
      default:
        return <Step1Grayscale onSelectStep={handleSelectStep} />;
    }
  };

  const renderMainContent = () => {
    if (currentView === 'home') {
      return (
        <HeroSection
          onStartExploring={() => handleSelectStep(1)}
          onSelectStep={handleSelectStep}
          onSelectView={handleSelectView}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />
      );
    }
    if (currentView === 'learn') {
      return <CurriculumScreen onSelectStep={handleSelectStep} />;
    }
    if (currentView === 'about') {
      return <AboutScreen />;
    }
    if (currentView === 'contact') {
      return <ContactScreen />;
    }
    return renderModuleStepContent();
  };

  const activeFeature = getFeatureByStep(currentStep) || FEATURES[0];

  return (
    <div className="app-shell-root">
      {/* 0. Fast & Simple Optical Loader */}

      <FetchSimulationLoader
        isOpen={isLoading}
        onComplete={() => setIsLoading(false)}
      />

      {/* 1. Global Layered Atmospheric Background */}
      <MathBackground />

      {/* 2. Main Application Body */}
      <div className="app-main-viewport">
        <Navbar
          currentView={currentView}
          onSelectView={handleSelectView}
          currentStep={currentStep}
          onSelectStep={handleSelectStep}
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
          onOpenLevelModal={() => setIsLevelModalOpen(true)}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleRightRail={() => setIsRightRailOpen(prev => !prev)}
          isRightRailOpen={isRightRailOpen}
        />

        <main className="main-content-area" id="main-content">
          {/* Consistent Back Button across all non-overview pages */}
          {currentView !== 'home' && (
            <BackButton
              onBack={handleBack}
              contextText={
                currentView === 'module'
                  ? `Workspace • Module ${activeFeature.code}: ${activeFeature.title}`
                  : currentView === 'learn'
                    ? 'Curriculum & Pathways'
                    : currentView === 'contact'
                      ? 'Contact Us & Direct Email Dispatch'
                      : 'About Platform Architecture'
              }
            />
          )}

          <ErrorBoundary>
            {renderMainContent()}
          </ErrorBoundary>
        </main>

        <Footer
          onSelectStep={handleSelectStep}
          onSelectView={handleSelectView}
        />
      </div>

      {/* 3. Integrated Right-Side Navigation Rail & Expandable Panel */}
      <RightNavRail
        isOpen={isRightRailOpen}
        onToggle={() => setIsRightRailOpen(prev => !prev)}
        onClose={() => setIsRightRailOpen(false)}
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        currentView={currentView}
        onSelectView={handleSelectView}
      />



      {/* 4. Mobile Slide-Up Feature Sheet */}
      <FeatureSheet
        isOpen={isMobileSheetOpen}
        onClose={() => setIsMobileSheetOpen(false)}
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        onSelectView={handleSelectView}
      />

      {/* 5. Global ⌘K Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectFeature={(feat) => handleSelectStep(feat.stepNumber)}
      />

      {/* 6. Level Selector Modal (Basic vs Advanced Math) */}
      <LevelSelectorModal
        isOpen={isLevelModalOpen}
        currentLevel={currentLevel}
        onSelectLevel={handleSelectLevel}
        onClose={() => setIsLevelModalOpen(false)}
      />

      {/* <DeveloperCreditsModal
        isOpen={isCreditsOpen}
        onClose={() => setIsCreditsOpen(false)}
      /> */}
      <Analytics />
    </div>
  );
}
