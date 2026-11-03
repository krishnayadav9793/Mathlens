import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  QrCode,
  Grid,
  Activity,
  Layers,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Sliders,
  Maximize2,
  Compass,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Search
} from 'lucide-react';
import StepFooter from '../components/layout/StepFooter';
import ModuleDocumentation from '../components/experiment/ModuleDocumentation';
import {
  SHAPE_PRESETS_5X5,
  isFunctionalModule,
  generateQRMatrix,
  computeMatrixDiffAndNorms,
  checkQRReadability
} from '../core/math/qrMatrixNorms';

export default function Step23QRMatrixNorms({ onSelectStep }) {
  // Navigation Tabs:
  // 1: 'step1-dots'       (Step 1: From Dots to Data - 5x5 interactive grid & binary matrix)
  // 2: 'step2-qr-words'   (Step 2: From Words to QR Matrices - HELLO vs WORLD, zoom 5x5, 10x10, full)
  // 3: 'step3-norms'      (Step 3: Measuring the Difference Using Matrix Norms - D = A - B, L1, L2, Lmax)
  // 4: 'step4-mutate'     (Step 4: Change Message or QR Pattern - Option A word change, Option B flip & decode)
  // 5: 'theory'           (Key Concept, Questions & Comprehensive Theory)
  const [activeTab, setActiveTab] = useState('step1-dots');

  // Theme Detection (Dark vs Light)
  const [theme, setTheme] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.getAttribute('data-theme') || 'dark'
      : 'dark'
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  const isLight = theme === 'light';

  // =========================================================================
  // STEP 1: FROM DOTS TO DATA (5×5 INTERACTIVE GRID & BINARY MATRIX)
  // =========================================================================
  const [grid5x5, setGrid5x5] = useState(SHAPE_PRESETS_5X5.X);
  const [activeShapePreset, setActiveShapePreset] = useState('X');
  const [hoveredCell5x5, setHoveredCell5x5] = useState(null); // { r, c }
  const [isMouseDown5x5, setIsMouseDown5x5] = useState(false);
  const [dragDrawValue5x5, setDragDrawValue5x5] = useState(1);

  const handleToggleCell5x5 = useCallback((r, c) => {
    setGrid5x5(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
    setActiveShapePreset('Custom');
  }, []);

  const handleCellMouseDown5x5 = (r, c) => {
    setIsMouseDown5x5(true);
    const targetVal = grid5x5[r][c] === 1 ? 0 : 1;
    setDragDrawValue5x5(targetVal);
    setGrid5x5(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = targetVal;
      return next;
    });
    setActiveShapePreset('Custom');
  };

  const handleCellMouseEnter5x5 = (r, c) => {
    setHoveredCell5x5({ r, c });
    if (isMouseDown5x5) {
      setGrid5x5(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = dragDrawValue5x5;
        return next;
      });
      setActiveShapePreset('Custom');
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown5x5(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const stats5x5 = useMemo(() => {
    let blackCount = 0;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (grid5x5[r][c] === 1) blackCount++;
      }
    }
    const whiteCount = 25 - blackCount;
    const density = ((blackCount / 25) * 100).toFixed(0);
    return { blackCount, whiteCount, density };
  }, [grid5x5]);

  // =========================================================================
  // STEP 2: FROM WORDS TO QR MATRICES (HELLO vs WORLD)
  // =========================================================================
  const qrHello = useMemo(() => generateQRMatrix('HELLO', { errorCorrectionLevel: 'M', maskPattern: 0 }), []);
  const qrWorld = useMemo(() => generateQRMatrix('WORLD', { errorCorrectionLevel: 'M', maskPattern: 0 }), []);

  const [zoomLevelStep2, setZoomLevelStep2] = useState('5x5');
  const [zoomOffsetStep2, setZoomOffsetStep2] = useState([0, 0]);
  const [selectedModuleStep2, setSelectedModuleStep2] = useState({ r: 0, c: 0 });

  const zoomDimensions = useMemo(() => {
    if (zoomLevelStep2 === '5x5') return 5;
    if (zoomLevelStep2 === '10x10') return 10;
    return 21;
  }, [zoomLevelStep2]);

  const safeOffsetStep2 = useMemo(() => {
    const maxOffset = 21 - zoomDimensions;
    return [
      Math.max(0, Math.min(maxOffset, zoomOffsetStep2[0])),
      Math.max(0, Math.min(maxOffset, zoomOffsetStep2[1]))
    ];
  }, [zoomDimensions, zoomOffsetStep2]);

  const subMatrixA_Step2 = useMemo(() => {
    const [startR, startC] = safeOffsetStep2;
    const sub = [];
    for (let r = 0; r < zoomDimensions; r++) {
      const row = [];
      for (let c = 0; c < zoomDimensions; c++) {
        row.push(qrHello.matrix[startR + r]?.[startC + c] ?? 0);
      }
      sub.push(row);
    }
    return sub;
  }, [qrHello, safeOffsetStep2, zoomDimensions]);

  const subMatrixB_Step2 = useMemo(() => {
    const [startR, startC] = safeOffsetStep2;
    const sub = [];
    for (let r = 0; r < zoomDimensions; r++) {
      const row = [];
      for (let c = 0; c < zoomDimensions; c++) {
        row.push(qrWorld.matrix[startR + r]?.[startC + c] ?? 0);
      }
      sub.push(row);
    }
    return sub;
  }, [qrWorld, safeOffsetStep2, zoomDimensions]);

  const comparisonStep2 = useMemo(() => {
    const r = selectedModuleStep2.r;
    const c = selectedModuleStep2.c;
    const valA = qrHello.matrix[r]?.[c] ?? 0;
    const valB = qrWorld.matrix[r]?.[c] ?? 0;
    const isFunc = isFunctionalModule(r, c, 21);
    const diff = valA - valB;
    return {
      r,
      c,
      valA,
      valB,
      isFunc,
      isMatch: valA === valB,
      diff
    };
  }, [selectedModuleStep2, qrHello, qrWorld]);

  // =========================================================================
  // STEP 3: MEASURING THE DIFFERENCE USING MATRIX NORMS (D = A - B)
  // =========================================================================
  const diffAndNormsStep3 = useMemo(() => {
    return computeMatrixDiffAndNorms(qrHello.matrix, qrWorld.matrix);
  }, [qrHello, qrWorld]);

  const [hoveredDiffCell, setHoveredDiffCell] = useState(null);

  const [expandedQuestionsStep3, setExpandedQuestionsStep3] = useState({
    q1: false,
    q2: false,
    q3: false,
    q4: false
  });

  const toggleQuestionStep3 = (id) => {
    setExpandedQuestionsStep3(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // =========================================================================
  // STEP 4: CHANGE MESSAGE OR QR PATTERN: OBSERVE THE NORMS
  // =========================================================================
  const [step4Option, setStep4Option] = useState('optionA');

  // Option A: Change the Word
  const [wordA, setWordA] = useState('HELLO');
  const [wordB, setWordB] = useState('HELLP');

  const qrA_OptA = useMemo(() => generateQRMatrix(wordA, { errorCorrectionLevel: 'M', maskPattern: 0 }), [wordA]);
  const qrB_OptA = useMemo(() => generateQRMatrix(wordB, { errorCorrectionLevel: 'M', maskPattern: 0 }), [wordB]);

  const diffAndNormsOptA = useMemo(() => {
    return computeMatrixDiffAndNorms(qrA_OptA.matrix, qrB_OptA.matrix);
  }, [qrA_OptA, qrB_OptA]);

  // Option B: Change the QR Squares
  const [baseWordOptB] = useState('HELLO');
  const baseQROptB = useMemo(() => generateQRMatrix(baseWordOptB, { errorCorrectionLevel: 'M', maskPattern: 0 }), [baseWordOptB]);

  const [modifiedMatrixOptB, setModifiedMatrixOptB] = useState(() => {
    return baseQROptB.matrix.map(row => [...row]);
  });

  const [flippedCoords, setFlippedCoords] = useState(new Set());

  useEffect(() => {
    setModifiedMatrixOptB(baseQROptB.matrix.map(row => [...row]));
    setFlippedCoords(new Set());
    setDecodeResult(null);
  }, [baseQROptB]);

  const handleFlipSquareOptB = useCallback((r, c) => {
    setModifiedMatrixOptB(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });

    setFlippedCoords(prev => {
      const next = new Set(prev);
      const key = `${r}_${c}`;
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

    setDecodeResult(null);
  }, []);

  const diffAndNormsOptB = useMemo(() => {
    return computeMatrixDiffAndNorms(baseQROptB.matrix, modifiedMatrixOptB);
  }, [baseQROptB, modifiedMatrixOptB]);

  const [decodeResult, setDecodeResult] = useState(null);
  const [isDecoding, setIsDecoding] = useState(false);

  const handleCheckReadability = () => {
    setIsDecoding(true);
    setTimeout(() => {
      const res = checkQRReadability(modifiedMatrixOptB);
      setDecodeResult(res);
      setIsDecoding(false);
    }, 150);
  };

  const handleResetFlips = () => {
    setModifiedMatrixOptB(baseQROptB.matrix.map(row => [...row]));
    setFlippedCoords(new Set());
    setDecodeResult(null);
  };

  const handleFlipRandomSquares = (count = 1) => {
    setModifiedMatrixOptB(prev => {
      const next = prev.map(row => [...row]);
      const addedKeys = [];
      let attempts = 0;
      let flippedSoFar = 0;

      while (flippedSoFar < count && attempts < 100) {
        attempts++;
        const r = Math.floor(Math.random() * 21);
        const c = Math.floor(Math.random() * 21);
        if (!isFunctionalModule(r, c, 21) || attempts > 50) {
          next[r][c] = next[r][c] === 1 ? 0 : 1;
          addedKeys.push(`${r}_${c}`);
          flippedSoFar++;
        }
      }

      setFlippedCoords(oldSet => {
        const updated = new Set(oldSet);
        addedKeys.forEach(k => {
          if (updated.has(k)) updated.delete(k);
          else updated.add(k);
        });
        return updated;
      });

      return next;
    });
    setDecodeResult(null);
  };

  const [expandedQuestionsStep4, setExpandedQuestionsStep4] = useState({
    q1: false,
    q2: false,
    q3: false
  });

  const toggleQuestionStep4 = (id) => {
    setExpandedQuestionsStep4(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="math-step-view" style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 1rem' }}>
      {/* 1. STANDARDIZED MODULE HEADER */}
      <div className="step-header-box" style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <h2 className="step-heading" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <QrCode size={24} style={{ color: 'var(--accent-primary, #C59B67)' }} />
            <span>How Different Are Two QR Codes? Exploring Matrix Norms</span>
          </h2>
          <span className="badge-tag-mini" style={{ fontSize: '0.74rem', padding: '0.2rem 0.6rem' }}>
            Module 23: QR Code Matrix Norms
          </span>
        </div>

        <p className="step-description" style={{ fontSize: '0.84rem', margin: 0, lineHeight: 1.55 }}>
          <strong>Central Question:</strong> How do we mathematically measure the difference between two QR codes?
          Explore how black and white modules form binary matrices, compute difference matrix D = A - B, calculate entrywise
          matrix norms (L₁, L₂, L_max), and test how Reed-Solomon error correction decouples numerical distance from readable information.
        </p>

        {/* 5 SUB-CHAPTER NAVIGATION PILL TABS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.9rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('step1-dots')}
            className={`sub-chapter-pill ${activeTab === 'step1-dots' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Grid size={14} />
            <span>Step 1: From Dots to Data (5×5)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('step2-qr-words')}
            className={`sub-chapter-pill ${activeTab === 'step2-qr-words' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Layers size={14} />
            <span>Step 2: Words to QR Matrices</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('step3-norms')}
            className={`sub-chapter-pill ${activeTab === 'step3-norms' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Maximize2 size={14} />
            <span>Step 3: Difference &amp; Norms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('step4-mutate')}
            className={`sub-chapter-pill ${activeTab === 'step4-mutate' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Sparkles size={14} />
            <span>Step 4: Mutate &amp; Observe Norms</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theory')}
            className={`sub-chapter-pill ${activeTab === 'theory' ? 'active' : ''}`}
            style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Info size={14} />
            <span>Key Concepts &amp; Theory</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: STEP 1: FROM DOTS TO DATA */}
      {/* ========================================================================= */}
      {activeTab === 'step1-dots' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', alignItems: 'start' }}>
          {/* Left Column: Visual 5x5 Canvas Grid */}
          <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Grid size={18} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>5×5 Interactive Dot Grid</span>
              </div>
              <span className="badge-tag-mini" style={{ fontSize: '0.72rem' }}>Click or Drag to Invert</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.45 }}>
              Have you ever wondered how a collection of black and white squares can store information?
              Each square can be either black (1) or white (0). Draw shapes below or pick presets.
            </p>

            {/* Shape Presets Row */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.1rem' }}>
              {Object.keys(SHAPE_PRESETS_5X5).map(presetKey => (
                <button
                  key={presetKey}
                  type="button"
                  className={`btn-secondary-sm ${activeShapePreset === presetKey ? 'active' : ''}`}
                  onClick={() => {
                    setGrid5x5(SHAPE_PRESETS_5X5[presetKey]);
                    setActiveShapePreset(presetKey);
                  }}
                  style={{
                    fontSize: '0.76rem',
                    padding: '0.25rem 0.6rem',
                    background: activeShapePreset === presetKey ? 'var(--accent-primary, #C59B67)' : undefined,
                    color: activeShapePreset === presetKey ? '#FFFFFF' : undefined
                  }}
                >
                  Shape '{presetKey}'
                </button>
              ))}
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => {
                  setGrid5x5(prev => prev.map(row => row.map(v => (v === 1 ? 0 : 1))));
                  setActiveShapePreset('Inverted');
                }}
                style={{ fontSize: '0.76rem', padding: '0.25rem 0.6rem' }}
                title="Invert all squares"
              >
                Invert All
              </button>
            </div>

            {/* 5x5 Visual Squares */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.8rem 0' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 52px)',
                  gap: '4px',
                  background: isLight ? '#E5E7EB' : 'rgba(255, 255, 255, 0.1)',
                  padding: '6px',
                  borderRadius: 10,
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                  userSelect: 'none',
                  touchAction: 'manipulation'
                }}
              >
                {grid5x5.map((row, r) =>
                  row.map((val, c) => {
                    const isHovered = hoveredCell5x5?.r === r && hoveredCell5x5?.c === c;
                    return (
                      <div
                        key={`cell5x5_${r}_${c}`}
                        onMouseDown={() => handleCellMouseDown5x5(r, c)}
                        onMouseEnter={() => handleCellMouseEnter5x5(r, c)}
                        onMouseLeave={() => setHoveredCell5x5(null)}
                        style={{
                          width: 52,
                          height: 52,
                          background: val === 1 ? (isLight ? '#111827' : '#0B0F17') : '#FFFFFF',
                          border: isHovered
                            ? '2px solid var(--accent-primary, #C59B67)'
                            : '1px solid var(--border-color)',
                          borderRadius: 6,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                          transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                          boxShadow: isHovered ? '0 0 10px rgba(197, 155, 103, 0.5)' : 'none',
                          zIndex: isHovered ? 2 : 1
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: val === 1 ? '#FFFFFF' : '#111827',
                            opacity: isHovered ? 1 : 0.4
                          }}
                        >
                          {val}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Quick Helper */}
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              Tip: Click or drag across the grid to toggle individual squares (Black = 1, White = 0).
            </div>
          </div>

          {/* Right Column: Mathematical Binary Matrix & Bit Statistics */}
          <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>Corresponding Binary Matrix A</span>
              </div>
              <span className="badge-tag-mini" style={{ fontSize: '0.72rem' }}>A ∈ {'{0, 1}'}⁵ˣ⁵</span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', lineHeight: 1.45 }}>
              Each square corresponds to an exact element in the 5×5 matrix. Notice how toggling any square
              instantly mutates the corresponding numerical entry A[i, j].
            </p>

            {/* Matrix Bracket Display */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '1rem 0' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 10,
                  borderLeft: '3px solid var(--accent-primary, #C59B67)',
                  borderRight: '3px solid var(--accent-primary, #C59B67)'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 36px)', gap: '6px' }}>
                  {grid5x5.map((row, r) =>
                    row.map((val, c) => {
                      const isHovered = hoveredCell5x5?.r === r && hoveredCell5x5?.c === c;
                      return (
                        <div
                          key={`mat5x5_${r}_${c}`}
                          onClick={() => handleToggleCell5x5(r, c)}
                          onMouseEnter={() => setHoveredCell5x5({ r, c })}
                          onMouseLeave={() => setHoveredCell5x5(null)}
                          style={{
                            width: 36,
                            height: 36,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.88rem',
                            fontWeight: val === 1 ? 700 : 500,
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: val === 1 ? 'var(--accent-primary, #C59B67)' : 'var(--text-secondary)',
                            background: isHovered
                              ? (isLight ? 'rgba(197, 155, 103, 0.2)' : 'rgba(197, 155, 103, 0.25)')
                              : (val === 1 ? (isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)') : 'transparent'),
                            border: isHovered ? '1px solid var(--accent-primary, #C59B67)' : '1px solid transparent',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          {val}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Metrics HUD Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', marginTop: '1rem' }}>
              <div className="card-glass" style={{ padding: '0.6rem', textAlign: 'center', borderRadius: 8 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Black Squares (1s)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary, #C59B67)' }}>
                  {stats5x5.blackCount} / 25
                </div>
              </div>
              <div className="card-glass" style={{ padding: '0.6rem', textAlign: 'center', borderRadius: 8 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>White Squares (0s)</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stats5x5.whiteCount} / 25
                </div>
              </div>
              <div className="card-glass" style={{ padding: '0.6rem', textAlign: 'center', borderRadius: 8 }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ink Fill Density</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B82F6' }}>
                  {stats5x5.density}%
                </div>
              </div>
            </div>

            {/* Inspection Callout */}
            <div
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: 8,
                background: isLight ? '#F0FDF4' : 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.8rem',
                lineHeight: 1.5
              }}
            >
              <strong>Now, can we use a similar matrix to represent a word or message?</strong>
              <div style={{ marginTop: '0.3rem', color: 'var(--text-secondary)' }}>
                A QR code does exactly this! It uses a structured arrangement of black and white squares to represent encoded information.
              </div>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => setActiveTab('step2-qr-words')}
                style={{
                  marginTop: '0.65rem',
                  fontSize: '0.76rem',
                  padding: '0.3rem 0.75rem',
                  background: 'var(--accent-primary, #C59B67)',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                Proceed to Step 2: From Words to QR Matrices →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STEP 2: FROM WORDS TO QR MATRICES (HELLO vs WORLD) */}
      {/* ========================================================================= */}
      {activeTab === 'step2-qr-words' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Controls Bar for Magnification & Section Inspection */}
          <div className="card-glass" style={{ padding: '0.9rem 1.2rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={18} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Matrix Viewport &amp; Magnification:</span>
              </div>

              {/* Viewport Presets */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={`sub-chapter-pill ${zoomLevelStep2 === '5x5' ? 'active' : ''}`}
                  onClick={() => setZoomLevelStep2('5x5')}
                  style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}
                >
                  Magnified (5×5) Section
                </button>
                <button
                  type="button"
                  className={`sub-chapter-pill ${zoomLevelStep2 === '10x10' ? 'active' : ''}`}
                  onClick={() => setZoomLevelStep2('10x10')}
                  style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}
                >
                  Magnified (10×10) Section
                </button>
                <button
                  type="button"
                  className={`sub-chapter-pill ${zoomLevelStep2 === 'full' ? 'active' : ''}`}
                  onClick={() => setZoomLevelStep2('full')}
                  style={{ fontSize: '0.76rem', padding: '0.25rem 0.65rem' }}
                >
                  Complete (21×21) Matrix
                </button>
              </div>

              {/* Region Presets when zoomed */}
              {zoomLevelStep2 !== 'full' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Focus:</span>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => setZoomOffsetStep2([0, 0])}
                    style={{ fontSize: '0.72rem', padding: '0.18rem 0.5rem' }}
                  >
                    Top-Left Finder (0,0)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => setZoomOffsetStep2([0, 21 - zoomDimensions])}
                    style={{ fontSize: '0.72rem', padding: '0.18rem 0.5rem' }}
                  >
                    Top-Right Finder
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => setZoomOffsetStep2([21 - zoomDimensions, 0])}
                    style={{ fontSize: '0.72rem', padding: '0.18rem 0.5rem' }}
                  >
                    Bottom-Left Finder
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => setZoomOffsetStep2([Math.floor((21 - zoomDimensions) / 2), Math.floor((21 - zoomDimensions) / 2)])}
                    style={{ fontSize: '0.72rem', padding: '0.18rem 0.5rem' }}
                  >
                    Center Data Area
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side QR Codes Comparison Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {/* Word 1: HELLO */}
            <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-primary, #C59B67)' }}>HELLO</span>
                  <span className="badge-tag-mini" style={{ fontSize: '0.72rem' }}>Matrix A (21×21)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Version 1 • Level M • Mask 0</span>
              </div>

              {/* Render Matrix / Grid View */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${zoomDimensions}, ${zoomDimensions === 21 ? '14px' : zoomDimensions === 10 ? '28px' : '48px'})`,
                    gap: zoomDimensions === 21 ? '1px' : '2px',
                    background: isLight ? '#E5E7EB' : 'rgba(255, 255, 255, 0.12)',
                    padding: '4px',
                    borderRadius: 8,
                    overflow: 'auto',
                    maxWidth: '100%'
                  }}
                >
                  {subMatrixA_Step2.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const actualR = safeOffsetStep2[0] + rIdx;
                      const actualC = safeOffsetStep2[1] + cIdx;
                      const isSelected = selectedModuleStep2.r === actualR && selectedModuleStep2.c === actualC;
                      const isFunc = isFunctionalModule(actualR, actualC, 21);

                      return (
                        <div
                          key={`hello_${actualR}_${actualC}`}
                          onClick={() => setSelectedModuleStep2({ r: actualR, c: actualC })}
                          title={`(Row: ${actualR}, Col: ${actualC}) = ${val} ${isFunc ? '[Functional Pattern]' : '[Data Module]'}`}
                          style={{
                            width: zoomDimensions === 21 ? 14 : zoomDimensions === 10 ? 28 : 48,
                            height: zoomDimensions === 21 ? 14 : zoomDimensions === 10 ? 28 : 48,
                            background: val === 1 ? (isLight ? '#111827' : '#0F172A') : '#FFFFFF',
                            borderRadius: zoomDimensions === 21 ? 1 : 4,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected
                              ? '2px solid #EF4444'
                              : isFunc && zoomDimensions !== 21
                              ? '1px dashed rgba(197, 155, 103, 0.6)'
                              : 'none',
                            transform: isSelected ? 'scale(1.15)' : 'none',
                            zIndex: isSelected ? 3 : 1,
                            transition: 'transform 0.1s ease',
                            fontSize: zoomDimensions === 5 ? '0.75rem' : '0.6rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: val === 1 ? '#FFFFFF' : '#111827'
                          }}
                        >
                          {zoomDimensions <= 10 && val}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Showing {zoomDimensions}×{zoomDimensions} section (offset: row {safeOffsetStep2[0]}, col {safeOffsetStep2[1]})
              </div>
            </div>

            {/* Word 2: WORLD */}
            <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#3B82F6' }}>WORLD</span>
                  <span className="badge-tag-mini" style={{ fontSize: '0.72rem' }}>Matrix B (21×21)</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Same QR parameters</span>
              </div>

              {/* Render Matrix / Grid View */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${zoomDimensions}, ${zoomDimensions === 21 ? '14px' : zoomDimensions === 10 ? '28px' : '48px'})`,
                    gap: zoomDimensions === 21 ? '1px' : '2px',
                    background: isLight ? '#E5E7EB' : 'rgba(255, 255, 255, 0.12)',
                    padding: '4px',
                    borderRadius: 8,
                    overflow: 'auto',
                    maxWidth: '100%'
                  }}
                >
                  {subMatrixB_Step2.map((row, rIdx) =>
                    row.map((val, cIdx) => {
                      const actualR = safeOffsetStep2[0] + rIdx;
                      const actualC = safeOffsetStep2[1] + cIdx;
                      const isSelected = selectedModuleStep2.r === actualR && selectedModuleStep2.c === actualC;
                      const isFunc = isFunctionalModule(actualR, actualC, 21);

                      return (
                        <div
                          key={`world_${actualR}_${actualC}`}
                          onClick={() => setSelectedModuleStep2({ r: actualR, c: actualC })}
                          title={`(Row: ${actualR}, Col: ${actualC}) = ${val} ${isFunc ? '[Functional Pattern]' : '[Data Module]'}`}
                          style={{
                            width: zoomDimensions === 21 ? 14 : zoomDimensions === 10 ? 28 : 48,
                            height: zoomDimensions === 21 ? 14 : zoomDimensions === 10 ? 28 : 48,
                            background: val === 1 ? (isLight ? '#111827' : '#0F172A') : '#FFFFFF',
                            borderRadius: zoomDimensions === 21 ? 1 : 4,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: isSelected
                              ? '2px solid #3B82F6'
                              : isFunc && zoomDimensions !== 21
                              ? '1px dashed rgba(197, 155, 103, 0.6)'
                              : 'none',
                            transform: isSelected ? 'scale(1.15)' : 'none',
                            zIndex: isSelected ? 3 : 1,
                            transition: 'transform 0.1s ease',
                            fontSize: zoomDimensions === 5 ? '0.75rem' : '0.6rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: val === 1 ? '#FFFFFF' : '#111827'
                          }}
                        >
                          {zoomDimensions <= 10 && val}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                Click any module in either matrix to inspect matching coordinates!
              </div>
            </div>
          </div>

          {/* Synchronized Module Inspector Card */}
          <div
            className="card-glass"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 12,
              background: isLight ? 'rgba(197, 155, 103, 0.08)' : 'rgba(197, 155, 103, 0.12)',
              border: '1px solid var(--accent-subtle, rgba(197, 155, 103, 0.3))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Inspecting Coordinate:</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  (Row {comparisonStep2.r}, Col {comparisonStep2.c}) •{' '}
                  <span style={{ fontSize: '0.82rem', fontWeight: 500, color: comparisonStep2.isFunc ? 'var(--accent-primary, #C59B67)' : 'var(--text-secondary)' }}>
                    {comparisonStep2.isFunc ? 'Fixed QR Functional Pattern' : 'Message Data Codeword'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Matrix A (HELLO)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary, #C59B67)' }}>
                    {comparisonStep2.valA} ({comparisonStep2.valA === 1 ? 'Black' : 'White'})
                  </div>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)' }}>vs</div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Matrix B (WORLD)</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B82F6' }}>
                    {comparisonStep2.valB} ({comparisonStep2.valB === 1 ? 'Black' : 'White'})
                  </div>
                </div>

                <div
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 8,
                    background: comparisonStep2.isMatch ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${comparisonStep2.isMatch ? '#10B981' : '#EF4444'}`,
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    color: comparisonStep2.isMatch ? '#10B981' : '#EF4444'
                  }}
                >
                  {comparisonStep2.isMatch ? '✓ Matches Exactly (d = 0)' : `✕ Differs (d = ${comparisonStep2.diff > 0 ? '+1' : '-1'})`}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <strong>Question:</strong> Both QR codes consist of black and white squares, but their arrangements differ.
                Can we measure exactly how different they are?
              </div>
              <button
                type="button"
                className="btn-secondary-sm"
                onClick={() => setActiveTab('step3-norms')}
                style={{
                  fontSize: '0.76rem',
                  padding: '0.3rem 0.75rem',
                  background: 'var(--accent-primary, #C59B67)',
                  color: '#FFFFFF',
                  fontWeight: 600
                }}
              >
                Step 3: Measure Difference with Matrix Norms →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STEP 3: MEASURING DIFFERENCE USING MATRIX NORMS */}
      {/* ========================================================================= */}
      {activeTab === 'step3-norms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top KPI Cards: The 3 Matrix Norms */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {/* L1 Norm */}
            <div className="card-glass" style={{ padding: '1.1rem', borderRadius: 12, borderTop: '3px solid #EF4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Entrywise L₁ Norm</span>
                <span className="badge-tag-mini" style={{ fontSize: '0.7rem' }}>Hamming Distance</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
                ‖D‖₁ = {diffAndNormsStep3.l1}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                Formula: ∑ |D_ij|. Exactly counts the <strong>number of differing squares</strong> ({diffAndNormsStep3.l1} out of 441 = {diffAndNormsStep3.diffPercentage.toFixed(1)}%).
              </div>
            </div>

            {/* L2 Frobenius Norm */}
            <div className="card-glass" style={{ padding: '1.1rem', borderRadius: 12, borderTop: '3px solid #3B82F6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Entrywise L₂ (Frobenius)</span>
                <span className="badge-tag-mini" style={{ fontSize: '0.7rem' }}>Root Sum Square</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--font-mono)' }}>
                ‖D‖₂ = {diffAndNormsStep3.l2.toFixed(2)}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                Formula: √(∑ D_ij²) = √‖D‖₁ = √{diffAndNormsStep3.l1}.
                Because (±1)² = 1, Frobenius norm is always √‖D‖₁!
              </div>
            </div>

            {/* Lmax Norm */}
            <div className="card-glass" style={{ padding: '1.1rem', borderRadius: 12, borderTop: '3px solid var(--accent-primary, #C59B67)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Entrywise L_max Norm</span>
                <span className="badge-tag-mini" style={{ fontSize: '0.7rem' }}>Chebyshev Peak</span>
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-primary, #C59B67)', fontFamily: 'var(--font-mono)' }}>
                ‖D‖_max = {diffAndNormsStep3.lMax}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.45 }}>
                Formula: max |D_ij|. Evaluates to <strong>1</strong> whenever at least one square differs, and 0 only if matrices are identical!
              </div>
            </div>
          </div>

          {/* Difference Matrix D = A - B Visualization */}
          <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>Difference Matrix: D = A (HELLO) - B (WORLD)</span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Highlighting positions where entries differ: Red = +1 (1 - 0), Blue = -1 (0 - 1), Dim Grey = 0 (Match).
                </div>
              </div>

              {/* Legend Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: '#EF4444', display: 'inline-block' }} />
                  <span>D_ij = +1 (HELLO has black)</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: '#3B82F6', display: 'inline-block' }} />
                  <span>D_ij = -1 (WORLD has black)</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.74rem' }}>
                  <span style={{ width: 12, height: 12, borderRadius: 2, background: isLight ? '#E5E7EB' : '#334155', display: 'inline-block' }} />
                  <span>D_ij = 0 (Identical)</span>
                </span>
              </div>
            </div>

            {/* Difference Canvas Grid */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0.8rem 0' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(21, minmax(10px, 20px))',
                  gap: '2px',
                  background: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.08)',
                  padding: '6px',
                  borderRadius: 10,
                  maxWidth: '100%',
                  overflow: 'auto'
                }}
              >
                {diffAndNormsStep3.diffMatrix.map((row, r) =>
                  row.map((dVal, c) => {
                    const isHovered = hoveredDiffCell?.r === r && hoveredDiffCell?.c === c;
                    const aVal = qrHello.matrix[r][c];
                    const bVal = qrWorld.matrix[r][c];

                    let cellBg = isLight ? '#F1F5F9' : '#1E293B';
                    if (dVal === 1) cellBg = '#EF4444';
                    else if (dVal === -1) cellBg = '#3B82F6';

                    return (
                      <div
                        key={`diff_${r}_${c}`}
                        onMouseEnter={() => setHoveredDiffCell({ r, c, dVal, aVal, bVal })}
                        onMouseLeave={() => setHoveredDiffCell(null)}
                        style={{
                          aspectRatio: '1/1',
                          background: cellBg,
                          borderRadius: 2,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.55rem',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          color: dVal !== 0 ? '#FFFFFF' : 'transparent',
                          border: isHovered ? '2px solid #FFFFFF' : 'none',
                          transform: isHovered ? 'scale(1.4)' : 'none',
                          zIndex: isHovered ? 5 : 1,
                          transition: 'transform 0.08s ease'
                        }}
                      >
                        {dVal !== 0 && (dVal > 0 ? '+' : '-')}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Hover details pill */}
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              {hoveredDiffCell ? (
                <span>
                  Inspecting (Row {hoveredDiffCell.r}, Col {hoveredDiffCell.c}):{' '}
                  <strong>
                    D = {hoveredDiffCell.aVal} - {hoveredDiffCell.bVal} = {hoveredDiffCell.dVal > 0 ? `+${hoveredDiffCell.dVal}` : hoveredDiffCell.dVal}
                  </strong>{' '}
                  ({hoveredDiffCell.dVal === 0 ? 'Matching square' : 'Differing square'})
                </span>
              ) : (
                <span>Hover over any square in the difference matrix to inspect its calculation D_ij = A_ij - B_ij.</span>
              )}
            </div>
          </div>

          {/* Interactive Questions for Students Card (From PDF Step 3) */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <HelpCircle size={18} style={{ color: 'var(--accent-primary, #C59B67)' }} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Questions for Students (Step 3)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Question 1 */}
              <div
                style={{
                  borderRadius: 8,
                  background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestionStep3('q1')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>1. How many squares differ between the two QR codes?</span>
                  {expandedQuestionsStep3.q1 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedQuestionsStep3.q1 && (
                  <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Exactly <strong>{diffAndNormsStep3.l1} squares</strong> differ out of 441 total modules ({diffAndNormsStep3.diffPercentage.toFixed(1)}%).
                    Notice that the corner finder patterns (three 7×7 boxes) and timing strips have <strong>zero difference</strong> because their positions
                    are universally fixed by the QR standard. All differing squares reside strictly in the message data and Reed-Solomon error correction bytes!
                  </div>
                )}
              </div>

              {/* Question 2 */}
              <div
                style={{
                  borderRadius: 8,
                  background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestionStep3('q2')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>2. Which norm directly counts the number of differing squares?</span>
                  {expandedQuestionsStep3.q2 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedQuestionsStep3.q2 && (
                  <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The <strong>L₁ norm</strong> (‖D‖₁).
                    Because entries are binary (0 or 1), the difference D_ij is +1 or -1 whenever two squares differ, and 0 when they match.
                    Taking absolute values yields |D_ij| = 1 for every mismatch and 0 for matches.
                    Therefore, the sum ‖D‖₁ = ∑ |D_ij| equals the <strong>exact count of differing squares</strong> (also known as the <em>Hamming distance</em>).
                  </div>
                )}
              </div>

              {/* Question 3 */}
              <div
                style={{
                  borderRadius: 8,
                  background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestionStep3('q3')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>3. Why is (L_max = 1) whenever at least one binary square differs?</span>
                  {expandedQuestionsStep3.q3 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedQuestionsStep3.q3 && (
                  <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    The Chebyshev norm is defined as ‖D‖_max = max |D_ij|.
                    Since matrix entries are binary A_ij, B_ij ∈ {'{0, 1}'}, the only possible values of D_ij = A_ij - B_ij are <strong>-1, 0, +1</strong>.
                    The absolute values |D_ij| can therefore only be 0 or 1.
                    If at least one square differs, the maximum absolute entry is immediately 1.
                    Whether 1 square differs or 400 squares differ, ‖D‖_max remains strictly 1! It only equals 0 if both QR codes are 100% identical.
                  </div>
                )}
              </div>

              {/* Question 4 */}
              <div
                style={{
                  borderRadius: 8,
                  background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => toggleQuestionStep3('q4')}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.84rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>4. Does changing only one letter necessarily change only one square in the QR code?</span>
                  {expandedQuestionsStep3.q4 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {expandedQuestionsStep3.q4 && (
                  <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>NO!</strong> Changing even a single letter (such as HELLO → HELLP) modifies the underlying data codewords, alters
                    the Reed-Solomon polynomial parity bytes, and triggers a re-evaluation of the optimal mask pattern (0 to 7) to avoid visual clumping.
                    As a result, a 1-letter change typically flips <strong>80 to 200 modules</strong> across the matrix!
                    You can test this directly in Step 4 Option A below.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STEP 4: CHANGE MESSAGE OR QR PATTERN: OBSERVE THE NORMS */}
      {/* ========================================================================= */}
      {activeTab === 'step4-mutate' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Sub-Option Selector Bar */}
          <div className="card-glass" style={{ padding: '0.9rem 1.25rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Interactive Experiment Mode:</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={`sub-chapter-pill ${step4Option === 'optionA' ? 'active' : ''}`}
                  onClick={() => setStep4Option('optionA')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  Option A: Change the Word
                </button>
                <button
                  type="button"
                  className={`sub-chapter-pill ${step4Option === 'optionB' ? 'active' : ''}`}
                  onClick={() => setStep4Option('optionB')}
                  style={{ fontSize: '0.78rem', padding: '0.35rem 0.75rem' }}
                >
                  Option B: Flip QR Squares &amp; Check Readability
                </button>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* OPTION A: CHANGE THE WORD */}
          {/* --------------------------------------------------------------------- */}
          {step4Option === 'optionA' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Presets & Text Inputs */}
              <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', display: 'block', marginBottom: '0.5rem' }}>
                  Option A: Modify the Input Message
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  Test how subtle vs radical word changes impact the difference matrix and norms:
                </p>

                {/* Preset Buttons from PDF */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => { setWordA('HELLO'); setWordB('HELLP'); }}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    HELLO → HELLP (1 Letter Change)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => { setWordA('HELLO'); setWordB('HELL0'); }}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    HELLO → HELL0 (Letter to Digit)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => { setWordA('HELLO'); setWordB('WORLD'); }}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    HELLO → WORLD (Different Word)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => { setWordA('HELLO'); setWordB('HELLO'); }}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    HELLO → HELLO (Identical = All Norms 0)
                  </button>
                </div>

                {/* Custom Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                      Message A:
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={wordA}
                      onChange={e => setWordA(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                      Message B:
                    </label>
                    <input
                      type="text"
                      maxLength={14}
                      value={wordB}
                      onChange={e => setWordB(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        borderRadius: 6,
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Live Norms Banner for Option A */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div className="card-glass" style={{ padding: '0.85rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Differing Squares (L₁)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#EF4444', fontFamily: 'var(--font-mono)' }}>
                    ‖D‖₁ = {diffAndNormsOptA.l1}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {diffAndNormsOptA.diffPercentage.toFixed(1)}% of matrix altered
                  </div>
                </div>

                <div className="card-glass" style={{ padding: '0.85rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Frobenius Norm (L₂)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--font-mono)' }}>
                    ‖D‖₂ = {diffAndNormsOptA.l2.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    √{diffAndNormsOptA.l1}
                  </div>
                </div>

                <div className="card-glass" style={{ padding: '0.85rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Peak Deviation (L_max)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary, #C59B67)', fontFamily: 'var(--font-mono)' }}>
                    ‖D‖_max = {diffAndNormsOptA.lMax}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {diffAndNormsOptA.lMax === 0 ? 'Exact match' : 'Mismatches exist'}
                  </div>
                </div>
              </div>

              {/* Side-by-Side Visuals + Difference Heatmap */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* QR A */}
                <div className="card-glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    QR for "{wordA}"
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 11px)', gap: '1px', background: isLight ? '#DDD' : '#333', padding: 3, borderRadius: 6 }}>
                      {qrA_OptA.matrix.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`optA_A_${r}_${c}`}
                            style={{
                              width: 11,
                              height: 11,
                              background: val === 1 ? (isLight ? '#111827' : '#0F172A') : '#FFFFFF'
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* QR B */}
                <div className="card-glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    QR for "{wordB}"
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 11px)', gap: '1px', background: isLight ? '#DDD' : '#333', padding: 3, borderRadius: 6 }}>
                      {qrB_OptA.matrix.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`optA_B_${r}_${c}`}
                            style={{
                              width: 11,
                              height: 11,
                              background: val === 1 ? (isLight ? '#111827' : '#0F172A') : '#FFFFFF'
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Difference Matrix D */}
                <div className="card-glass" style={{ padding: '1rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Difference Matrix D = A - B
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 11px)', gap: '1px', background: isLight ? '#DDD' : '#333', padding: 3, borderRadius: 6 }}>
                      {diffAndNormsOptA.diffMatrix.map((row, r) =>
                        row.map((dVal, c) => (
                          <div
                            key={`optA_D_${r}_${c}`}
                            style={{
                              width: 11,
                              height: 11,
                              background: dVal === 1 ? '#EF4444' : dVal === -1 ? '#3B82F6' : (isLight ? '#F1F5F9' : '#1E293B')
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.45rem' }}>
                    {diffAndNormsOptA.l1 === 0 ? 'No differing modules (identical words)' : `${diffAndNormsOptA.l1} modules disagree`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --------------------------------------------------------------------- */}
          {/* OPTION B: CHANGE THE QR SQUARES (FLIPPING & READABILITY CHECK) */}
          {/* --------------------------------------------------------------------- */}
          {step4Option === 'optionB' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Noise & Flip Controls Bar */}
              <div className="card-glass" style={{ padding: '1.2rem', borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.65rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                    Option B: Manually Flip Individual QR Squares &amp; Test Readability
                  </span>
                  <span className="badge-tag-mini" style={{ fontSize: '0.72rem' }}>
                    Reed-Solomon Level M Capacity: ~15% (~66 modules)
                  </span>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
                  Click directly on any module in the right QR code to flip it from black to white or vice-versa.
                  Then click <strong>Check Readability</strong> to see if the QR decoder can still recover the original message!
                </p>

                {/* Quick Simulation Actions */}
                <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => handleFlipRandomSquares(1)}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    + Flip 1 Random Square
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => handleFlipRandomSquares(4)}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    + Flip 4 Squares (Burst Noise)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={() => handleFlipRandomSquares(12)}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem' }}
                  >
                    + Flip 12 Squares (Severe Noise)
                  </button>
                  <button
                    type="button"
                    className="btn-secondary-sm"
                    onClick={handleResetFlips}
                    style={{ fontSize: '0.76rem', padding: '0.28rem 0.65rem', color: '#EF4444' }}
                  >
                    <RotateCcw size={13} style={{ display: 'inline', marginRight: 4 }} />
                    Reset All Flips
                  </button>
                </div>
              </div>

              {/* Live Norms Status for Option B */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div className="card-glass" style={{ padding: '0.85rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Flipped Squares (‖D‖₁)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: diffAndNormsOptB.l1 > 0 ? '#EF4444' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                    k = {diffAndNormsOptB.l1}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    Each flipped square adds exactly +1 to ‖D‖₁
                  </div>
                </div>

                <div className="card-glass" style={{ padding: '0.85rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Frobenius Norm (‖D‖₂)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#3B82F6', fontFamily: 'var(--font-mono)' }}>
                    ‖D‖₂ = {diffAndNormsOptB.l2.toFixed(2)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    √{diffAndNormsOptB.l1}
                  </div>
                </div>

                <div className="card-glass" style={{ padding: '0.85rem', textAlign: 'center', borderRadius: 10 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Chebyshev Peak (‖D‖_max)</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary, #C59B67)', fontFamily: 'var(--font-mono)' }}>
                    ‖D‖_max = {diffAndNormsOptB.lMax}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                    {diffAndNormsOptB.lMax === 0 ? '0 (Unmodified)' : '1 (Modified)'}
                  </div>
                </div>
              </div>

              {/* Side-by-Side: Original Clean vs Interactive Modified QR */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {/* Original Clean QR Code */}
                <div className="card-glass" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>Original QR: "{baseWordOptB}"</span>
                    <span className="badge-tag-mini" style={{ fontSize: '0.7rem' }}>Clean Reference</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(21, 14px)',
                        gap: '1px',
                        background: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
                        padding: '5px',
                        borderRadius: 8
                      }}
                    >
                      {baseQROptB.matrix.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`orig_optB_${r}_${c}`}
                            style={{
                              width: 14,
                              height: 14,
                              background: val === 1 ? (isLight ? '#111827' : '#0F172A') : '#FFFFFF'
                            }}
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Original unaltered matrix A
                  </div>
                </div>

                {/* Modified Interactive QR Code */}
                <div className="card-glass" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: diffAndNormsOptB.l1 > 0 ? '#EF4444' : undefined }}>
                      Modified QR ({diffAndNormsOptB.l1} Flips)
                    </span>
                    <span className="badge-tag-mini" style={{ fontSize: '0.7rem' }}>Click Any Cell to Flip</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem 0' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(21, 14px)',
                        gap: '1px',
                        background: isLight ? '#E2E8F0' : 'rgba(255, 255, 255, 0.1)',
                        padding: '5px',
                        borderRadius: 8
                      }}
                    >
                      {modifiedMatrixOptB.map((row, r) =>
                        row.map((val, c) => {
                          const isFlipped = flippedCoords.has(`${r}_${c}`);
                          return (
                            <div
                              key={`mod_optB_${r}_${c}`}
                              onClick={() => handleFlipSquareOptB(r, c)}
                              title={`Click to flip (r:${r}, c:${c})`}
                              style={{
                                width: 14,
                                height: 14,
                                background: val === 1 ? (isLight ? '#111827' : '#0F172A') : '#FFFFFF',
                                border: isFlipped ? '2px solid #F59E0B' : 'none',
                                boxSizing: 'border-box',
                                cursor: 'pointer',
                                position: 'relative',
                                transform: isFlipped ? 'scale(1.18)' : 'scale(1)',
                                zIndex: isFlipped ? 3 : 1,
                                transition: 'transform 0.1s ease',
                                boxShadow: isFlipped ? '0 0 8px #F59E0B' : 'none'
                              }}
                            >
                              {isFlipped && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    background: '#F59E0B',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)'
                                  }}
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Flipped modules highlighted in glowing amber
                  </div>
                </div>
              </div>

              {/* READABILITY TESTER ACTION & RESULT BANNER */}
              <div
                className="card-glass"
                style={{
                  padding: '1.2rem',
                  borderRadius: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.85rem'
                }}
              >
                <button
                  type="button"
                  onClick={handleCheckReadability}
                  disabled={isDecoding}
                  style={{
                    padding: '0.65rem 1.6rem',
                    borderRadius: 8,
                    background: 'var(--accent-primary, #C59B67)',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(197, 155, 103, 0.35)',
                    transition: 'transform 0.1s ease'
                  }}
                >
                  <RefreshCw size={17} className={isDecoding ? 'animate-spin' : ''} />
                  <span>{isDecoding ? 'Testing Decoder...' : 'Check QR Readability'}</span>
                </button>

                {decodeResult && (
                  <div
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: 10,
                      background: decodeResult.readable
                        ? (isLight ? '#F0FDF4' : 'rgba(16, 185, 129, 0.15)')
                        : (isLight ? '#FEF2F2' : 'rgba(239, 68, 68, 0.15)'),
                      border: `1px solid ${decodeResult.readable ? '#10B981' : '#EF4444'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.85rem'
                    }}
                  >
                    {decodeResult.readable ? (
                      <CheckCircle2 size={24} style={{ color: '#10B981', flexShrink: 0 }} />
                    ) : (
                      <AlertTriangle size={24} style={{ color: '#EF4444', flexShrink: 0 }} />
                    )}
                    <div style={{ fontSize: '0.84rem', lineHeight: 1.5 }}>
                      {decodeResult.readable ? (
                        <>
                          <strong style={{ color: '#10B981', fontSize: '0.92rem' }}>
                            ✓ Decoded Successfully: "{decodeResult.decodedText}"!
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            Even though <strong>{diffAndNormsOptB.l1} modules</strong> were corrupted (matrix norm ‖D‖₁ = {diffAndNormsOptB.l1}),
                            the QR Reed-Solomon error correction algorithm detected and repaired all errors losslessly!
                          </div>
                        </>
                      ) : (
                        <>
                          <strong style={{ color: '#EF4444', fontSize: '0.92rem' }}>
                            ✕ Decoding Failed: QR Code Unreadable!
                          </strong>
                          <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                            The corruptions exceeded the error-correction threshold (or damaged crucial finder/format strips).
                            Reset a few flips to restore readability.
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Questions for Students for Step 4 */}
              <div className="card-glass" style={{ padding: '1.25rem', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
                  <HelpCircle size={18} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Questions for Students (Step 4)</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Question 1 */}
                  <div
                    style={{
                      borderRadius: 8,
                      background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestionStep4('q1')}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>1. How do the norms change as more squares are modified?</span>
                      {expandedQuestionsStep4.q1 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedQuestionsStep4.q1 && (
                      <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        If you flip k modules:
                        <ul style={{ margin: '0.35rem 0', paddingLeft: '1.2rem' }}>
                          <li><strong>‖D‖₁ grows linearly:</strong> Every single flipped square adds exactly +1 to ‖D‖₁, so ‖D‖₁ = k.</li>
                          <li><strong>‖D‖₂ grows as a square root:</strong> ‖D‖₂ = √(∑ D_ij²) = √k.</li>
                          <li><strong>‖D‖_max remains constant:</strong> As long as k ≥ 1, ‖D‖_max stays locked at 1.</li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Question 2 */}
                  <div
                    style={{
                      borderRadius: 8,
                      background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestionStep4('q2')}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>2. Can the QR code remain readable even when its matrix changes?</span>
                      {expandedQuestionsStep4.q2 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedQuestionsStep4.q2 && (
                      <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <strong>YES!</strong> QR codes incorporate Reed-Solomon error correction.
                        In standard Level M encoding, up to approximately <strong>15% of all modules</strong> (roughly 66 modules in a Version 1 QR code)
                        can be completely corrupted, inverted, or obscured by dirt without losing a single character of the decoded message!
                      </div>
                    )}
                  </div>

                  {/* Question 3 */}
                  <div
                    style={{
                      borderRadius: 8,
                      background: isLight ? '#F9FAFB' : 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-color)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleQuestionStep4('q3')}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'transparent',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.84rem',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>3. Does a larger norm always imply a greater loss of encoded information?</span>
                      {expandedQuestionsStep4.q3 ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {expandedQuestionsStep4.q3 && (
                      <div style={{ padding: '0 1rem 0.85rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        <strong>NO!</strong> This is the central insight of the module.
                        You could flip 10 modules in non-critical padding or error correction areas (‖D‖₁ = 10) and lose <strong>0%</strong> of the decoded message.
                        Conversely, corrupting just 3 modules in the critical timing pattern (row 6 / col 6) or format information strip can destroy scanner synchronization and make the entire code unreadable!
                        Matrix norms measure <em>numerical spatial distance</em>, not <em>semantic information loss</em>.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* KEY CONCEPT BANNER (Page 3 of PDF) */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 12,
                  background: isLight
                    ? 'linear-gradient(135deg, rgba(197, 155, 103, 0.15), rgba(197, 155, 103, 0.05))'
                    : 'linear-gradient(135deg, rgba(197, 155, 103, 0.25), rgba(197, 155, 103, 0.08))',
                  border: '1.5px solid var(--accent-primary, #C59B67)',
                  boxShadow: '0 6px 20px rgba(197, 155, 103, 0.18)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.45rem' }}>
                  <Sparkles size={20} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                  <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.02em', color: 'var(--accent-primary, #C59B67)' }}>
                    KEY CONCEPT
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500, color: 'var(--text-primary)' }}>
                  Matrix norms measure <strong>numerical differences</strong> between matrices. However, a change in matrix entries does not necessarily imply a change in the decoded information, because QR codes incorporate <strong>error-correction mechanisms</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: KEY CONCEPTS & THEORY (COMPREHENSIVE DOCUMENTATION) */}
      {/* ========================================================================= */}
      {activeTab === 'theory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Theory Masthead Card */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={20} style={{ color: 'var(--accent-primary, #C59B67)' }} />
              <span>Mathematical Foundations: Binary Matrices, Matrix Norms &amp; Error Correction</span>
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              How do we quantify "distance" between matrices? While real numbers measure physical brightness (0 to 255),
              QR codes operate in discrete Galois fields where modules are binary bits A_ij ∈ {'{0, 1}'}.
              Matrix norms allow us to formalize difference, noise, and data corruption in rigorous geometric terms.
            </p>
          </div>

          {/* Mathematical Norms Comparison Table */}
          <div className="card-glass" style={{ padding: '1.25rem', borderRadius: 12 }}>
            <span style={{ fontWeight: 700, fontSize: '0.92rem', display: 'block', marginBottom: '0.75rem' }}>
              Summary Table: Entrywise Matrix Norms on Binary Discrepancies
            </span>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Matrix Norm</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Mathematical Formula</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Binary QR Behavior</th>
                    <th style={{ padding: '0.5rem 0.75rem' }}>Physical Interpretation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#EF4444' }}>
                      Entrywise L₁
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>
                      ‖D‖₁ = ∑ |D_ij|
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      Directly equals count of flipped squares (k)
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                      Total Hamming distance / Bit error count
                    </td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#3B82F6' }}>
                      Entrywise L₂ (Frobenius)
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>
                      ‖D‖₂ = √(∑ D_ij²)
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      Always exactly √‖D‖₁ = √k
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                      Root-sum-square geometric energy
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: 'var(--accent-primary, #C59B67)' }}>
                      Entrywise L_max
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'var(--font-mono)' }}>
                      ‖D‖_max = max |D_ij|
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem' }}>
                      1 if k ≥ 1, 0 if and only if k = 0
                    </td>
                    <td style={{ padding: '0.65rem 0.75rem', color: 'var(--text-secondary)' }}>
                      Binary indicator of discrepancy existence
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Module Documentation Accordion */}
          <ModuleDocumentation stepNumber={23} defaultOpen={true} />
        </div>
      )}

      {/* STANDARDIZED FOOTER WITH PREVIOUS / NEXT NAVIGATION */}
      <StepFooter
        stepNumber={23}
        onSelectStep={onSelectStep}
      />
    </div>
  );
}
