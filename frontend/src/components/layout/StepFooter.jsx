import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TOTAL_VISIBLE_LABS } from '../../config/features';

export default function StepFooter({ stepNumber, onSelectStep }) {
  const currentNumStr = stepNumber < 10 ? `0${stepNumber}` : `${stepNumber}`;
  const totalSteps = TOTAL_VISIBLE_LABS;
  const totalNumStr = totalSteps < 10 ? `0${totalSteps}` : `${totalSteps}`;

  return (
    <footer className="step-navigation-footer glass-level-2" style={{ marginTop: '2.5rem' }}>
      <button
        className="step-footer-nav-btn prev"
        onClick={() => onSelectStep && onSelectStep(stepNumber - 1)}
        disabled={stepNumber <= 1}
        type="button"
      >
        <ChevronLeft size={16} />
        <span>Previous Experiment</span>
      </button>

      <div className="step-footer-middle-indicator">
        <span className="indicator-curr">{currentNumStr}</span>
        <span className="indicator-sep">/</span>
        <span className="indicator-tot">{totalNumStr}</span>
      </div>

      <button
        className="step-footer-nav-btn next"
        onClick={() => onSelectStep && onSelectStep(stepNumber + 1)}
        disabled={stepNumber >= totalSteps}
        type="button"
      >
        <span>Next Experiment</span>
        <ChevronRight size={16} />
      </button>
    </footer>
  );
}
