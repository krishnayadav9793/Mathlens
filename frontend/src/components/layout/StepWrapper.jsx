import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { getFeatureByStep, FEATURES, TOTAL_VISIBLE_LABS } from '../../config/features';
import { MODULE_DOCUMENTATION } from '../../data/moduleDocumentation';
import ModuleDocumentation from '../experiment/ModuleDocumentation';

export default function StepWrapper({
  stepNumber,
  title,
  subtitle,
  formula,
  basicHint,
  advancedFormula,
  currentLevel = 'basic',
  controls,
  children,
  onPrev,
  onNext
}) {
  const [level, setLevel] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('mathlens_level')) || currentLevel || 'basic';
  });

  useEffect(() => {
    setLevel((typeof window !== 'undefined' && localStorage.getItem('mathlens_level')) || currentLevel || 'basic');
    const handleLevelChange = (e) => {
      if (e.detail) setLevel(e.detail);
    };
    window.addEventListener('mathlens_level_change', handleLevelChange);
    return () => window.removeEventListener('mathlens_level_change', handleLevelChange);
  }, [currentLevel]);

  const feature = getFeatureByStep(stepNumber);
  const doc = MODULE_DOCUMENTATION[stepNumber];

  const currentNumStr = stepNumber < 10 ? `0${stepNumber}` : `${stepNumber}`;
  const totalSteps = TOTAL_VISIBLE_LABS;
  const totalNumStr = totalSteps < 10 ? `0${totalSteps}` : `${totalSteps}`;

  const cleanTitle = title || doc?.title || feature?.title;
  const cleanSubtitle = subtitle || doc?.oneLiner || feature?.summary;
  const activeFormula = formula || doc?.formulaDisplay || feature?.formula;
  const activeAdvFormula = advancedFormula || doc?.formula;

  return (
    <div className="step-wrapper-container">
      {/* 1. Compact Header Card (No badges, no action buttons, minimal vertical height) */}
      <header className="step-header-card glass-level-2">
        <div className="step-header-inner">
          <div className="step-header-text">
            <h1 className="step-main-title">{cleanTitle}</h1>
            <p className="step-main-description">{cleanSubtitle}</p>
          </div>
        </div>
      </header>

      {/* 2. Compact Control Bar (if provided) */}
      {controls && (
        <section className="step-controls-bar glass-level-2" aria-label="Module Controls">
          {controls}
        </section>
      )}

      {/* 3. Central Interactive Stage */}
      <main className="step-stage-workspace" aria-label="Interactive Canvas and Matrix Workspace">
        {children}
      </main>

      {/* 4. Dedicated Educational Documentation Section */}
      <ModuleDocumentation stepNumber={stepNumber} />

      {/* 5. Pedagogical Stepper Footer */}
      <footer className="step-navigation-footer glass-level-2" aria-label="Module Stepper Navigation">
        <button
          className="step-footer-nav-btn prev"
          onClick={onPrev}
          disabled={stepNumber <= 1}
          type="button"
        >
          <ChevronLeft size={15} />
          <span>Previous Experiment</span>
        </button>

        <div className="step-footer-middle-indicator">
          <span className="indicator-curr">{currentNumStr}</span>
          <span className="indicator-sep">/</span>
          <span className="indicator-tot">{totalNumStr}</span>
        </div>

        <button
          className="step-footer-nav-btn next"
          onClick={onNext}
          disabled={stepNumber >= totalSteps}
          type="button"
        >
          <span>Next Experiment</span>
          <ChevronRight size={15} />
        </button>
      </footer>
    </div>
  );
}
