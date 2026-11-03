import React from 'react';
import { Sparkles, Cpu, Code2 } from 'lucide-react';

export default function AboutScreen() {
  return (
    <div className="about-page-container">
      {/* Header */}
      <div className="about-masthead">
        <h1 className="about-title">About MathLens</h1>
        <p className="about-subtitle">
          &ldquo;Don&rsquo;t just calculate mathematics. See it. Manipulate it. Understand it.&rdquo;
        </p>
      </div>

      <div className="about-sections-grid">
        {/* Card 1: Core Mission */}
        <div className="about-card glass-level-2">
          <div className="about-card-icon-box">
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 className="about-card-title">Pedagogical Mission</h2>
          <p className="about-card-text">
            Traditional Linear Algebra courses force students to memorize mechanical array multiplications in an abstract vacuum. MathLens grounds these operations into tangible optical phenomena: brightness scaling is scalar multiplication, image blending is convex matrix addition, motion isolation is matrix subtraction, and optical zoom is linear inverse scaling.
          </p>
        </div>

        {/* Card 2: Engineering Architecture */}
        <div className="about-card glass-level-2">
          <div className="about-card-icon-box">
            <Cpu size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 className="about-card-title">Zero-Lag Canvas Architecture</h2>
          <p className="about-card-text">
            All calculations are powered by pure, framework-agnostic mathematical engines (`src/core/mathEngine.js` and `transformEngine.js`). Crisp pixel rendering runs via hardware-accelerated HTML5 Canvas with sub-pixel alignment, bidirectional hover synchronization, and reactive state management.
          </p>
        </div>

        {/* Card 3: Design Philosophy */}
        <div className="about-card glass-level-2">
          <div className="about-card-icon-box">
            <Code2 size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <h2 className="about-card-title">Precision Mathematical Workspace</h2>
          <p className="about-card-text">
            Engineered with a minimalist editorial design system, high-contrast typography, matte surfaces, keyboard accessibility (⌘K command palette, arrow key navigation), and unified light and dark themes.
          </p>
        </div>
      </div>
    </div>
  );
}
