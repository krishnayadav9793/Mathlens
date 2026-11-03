import React from 'react';
// No unused icons

export default function Footer({ onSelectStep, onSelectView }) {
  return (
    <footer className="mathlens-footer" aria-label="Site footer">
      <div className="footer-inner-container">
        {/* Top Row: Brand & Philosophy */}
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <span className="footer-title">MathLens</span>
            </div>
            <p className="footer-motto">
              &ldquo;Don&rsquo;t just calculate mathematics. See it. Manipulate it. Understand it.&rdquo;
            </p>
            <div className="footer-inst-tag">
              <span>IIIT Vadodara • Academic Research &amp; Education</span>
            </div>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Foundations</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => { onSelectStep(1); onSelectView('module'); }}>Grayscale Matrix</button></li>
              <li><button onClick={() => { onSelectStep(3); onSelectView('module'); }}>Scalar Brightness</button></li>
              <li><button onClick={() => { onSelectStep(4); onSelectView('module'); }}>RGB Vector</button></li>
              <li><button onClick={() => { onSelectStep(5); onSelectView('module'); }}>Channel Matrices</button></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Advanced Labs</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => { onSelectStep(7); onSelectView('module'); }}>2D Transforms</button></li>
              <li><button onClick={() => { onSelectStep(8); onSelectView('module'); }}>Addition & Blending</button></li>
              <li><button onClick={() => { onSelectStep(12); onSelectView('module'); }}>Determinant Visualizer</button></li>
              <li><button onClick={() => { onSelectStep(14); onSelectView('module'); }}>Matrix Inverse Zoom</button></li>
              <li><button onClick={() => { onSelectStep(17); onSelectView('module'); }}>Ray Optics</button></li>
              <li><button onClick={() => { onSelectStep(18); onSelectView('module'); }}>Eigenvalues &amp; Eigenvectors</button></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-heading">Platform</h4>
            <ul className="footer-links-list">
              <li><button onClick={() => onSelectView('home')}>Overview</button></li>
              <li><button onClick={() => onSelectView('learn')}>Curriculum</button></li>
              <li><button onClick={() => onSelectView('about')}>Architecture</button></li>
              <li><button onClick={() => onSelectView('contact')}>Contact Us</button></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider-line" />

        {/* Bottom Row */}
        <div className="footer-bottom-row">
          <div className="footer-copy">
            © {new Date().getFullYear()} MathLens • Open-Source Interactive Mathematics Laboratory
          </div>
          <div className="footer-shortcuts-hint">
            <span>Shortcuts:</span>
            <kbd>←</kbd> <kbd>→</kbd> Steps • <kbd>T</kbd> Theme • <kbd>N</kbd> Modules
          </div>

          <div className="footer-column">
            <h4>Development &amp; Supervision</h4>
            <div className="footer-team-info">
              <p className="footer-supervisor-line">
                <span className="footer-label">Supervisor:</span> <strong>Prof. Payal Wadhwa</strong>
              </p>
              <p className="footer-devs-line">
                <span className="footer-label">Developers:</span> Naman Kumar, Mayank Soni, Krishana Yadav
              </p>
              <p className="footer-inst-line">
                Indian Institute of Information Technology Vadodara
              </p>
              {/* {onOpenCredits && (
                <button onClick={onOpenCredits} className="footer-credits-link">
                  <GraduationCap size={14} />
                  <span>View Developer Details</span>
                </button>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
