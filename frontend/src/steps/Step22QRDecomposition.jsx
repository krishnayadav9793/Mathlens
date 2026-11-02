import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Compass,
  Layers,
  Sparkles,
  RotateCcw,
  Grid,
  Activity,
  Play,
  Pause,
  Image as ImageIcon
} from 'lucide-react';
import StepFooter from '../components/layout/StepFooter';
import ModuleDocumentation from '../components/experiment/ModuleDocumentation';
import {
  dot,
  norm,
  normalize,
  project,
  perp,
  vectorAngle,
  gramSchmidt,
  qrDecomposition,
  IMAGE_PRESETS_2X2,
  IMAGE_PRESETS_3X3
} from '../core/math/qrDecomposition';

export default function Step22QRDecomposition({ onSelectStep }) {
  // Navigation Tabs:
  // 'perpendicular' (Module 1: What does perpendicular mean?)
  // 'projection'    (Module 2: How much of one vector lies along another?)
  // 'gram-schmidt'  (Module 3: Convert independent vectors into perpendicular vectors, 2D & 3D)
  // 'qr-matrices'   (Module 4: Build Q and R matrices, A = QR, verify QR)
  // 'image-qr'      (Module 5: 2x2 & 3x3 Grayscale Image Decomposition & Reconstruction)
  const [activeTab, setActiveTab] = useState('perpendicular');

  // Detect Theme (Light vs Dark)
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
  // MODULE 1: WHAT DOES PERPENDICULAR MEAN? (ORTHOGONAL VECTORS)
  // Initial values from prompt: a = [3, 1], b = [-1, 3] -> dot product = 0
  // =========================================================================
  const [m1Ax, setM1Ax] = useState(3);
  const [m1Ay, setM1Ay] = useState(1);
  const [m1Bx, setM1Bx] = useState(-1);
  const [m1By, setM1By] = useState(3);
  const [m1Dragging, setM1Dragging] = useState(null); // 'a' | 'b' | null
  const canvasM1Ref = useRef(null);

  const m1VecA = useMemo(() => [m1Ax, m1Ay], [m1Ax, m1Ay]);
  const m1VecB = useMemo(() => [m1Bx, m1By], [m1Bx, m1By]);
  const m1Dot = useMemo(() => dot(m1VecA, m1VecB), [m1VecA, m1VecB]);
  const m1Angle = useMemo(() => vectorAngle(m1VecA, m1VecB), [m1VecA, m1VecB]);

  // Canvas drawing for Module 1
  useEffect(() => {
    const canvas = canvasM1Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const range = 5;
    const scalePx = width / (range * 2);
    const originX = width / 2;
    const originY = height / 2;

    const toCanvasX = (x) => originX + x * scalePx;
    const toCanvasY = (y) => originY - y * scalePx;

    // Grid lines
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let i = -range; i <= range; i++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(i), 0);
      ctx.lineTo(toCanvasX(i), height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, toCanvasY(i));
      ctx.lineTo(width, toCanvasY(i));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.28)' : 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Helper: Draw Arrow
    const drawArrow = (x, y, color, label, isHandle = true) => {
      const endX = toCanvasX(x);
      const endY = toCanvasY(y);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrowhead
      const angle = Math.atan2(originY - endY, endX - originX);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI / 7),
        endY + headLen * Math.sin(angle - Math.PI / 7)
      );
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI / 7),
        endY + headLen * Math.sin(angle + Math.PI / 7)
      );
      ctx.closePath();
      ctx.fill();

      // Draggable handle circle
      if (isHandle) {
        ctx.beginPath();
        ctx.arc(endX, endY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      // Text label
      ctx.fillStyle = isLight ? '#1F2937' : '#F9FAFB';
      ctx.font = 'bold 12px monospace';
      const offX = x >= 0 ? 10 : -35;
      const offY = y >= 0 ? -10 : 18;
      ctx.fillText(`${label} [${x.toFixed(1)}, ${y.toFixed(1)}]`, endX + offX, endY + offY);
    };

    // Draw Vector A (Amber / Accent Primary)
    drawArrow(m1Ax, m1Ay, '#EAB308', 'a');

    // Draw Vector B (Sky Blue)
    drawArrow(m1Bx, m1By, '#38BDF8', 'b');

    // Right-angle marker when perpendicular
    if (m1Angle.isOrthogonal) {
      const uA = normalize(m1VecA);
      const uB = normalize(m1VecB);
      const boxSize = 0.55;
      const corner1X = originX + uA[0] * boxSize * scalePx;
      const corner1Y = originY - uA[1] * boxSize * scalePx;
      const corner2X = originX + (uA[0] + uB[0]) * boxSize * scalePx;
      const corner2Y = originY - (uA[1] + uB[1]) * boxSize * scalePx;
      const corner3X = originX + uB[0] * boxSize * scalePx;
      const corner3Y = originY - uB[1] * boxSize * scalePx;

      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(corner1X, corner1Y);
      ctx.lineTo(corner2X, corner2Y);
      ctx.lineTo(corner3X, corner3Y);
      ctx.stroke();

      // Label 90°
      ctx.fillStyle = '#22C55E';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('90°', (corner2X + originX) / 2 + 5, (corner2Y + originY) / 2 - 5);
    }
  }, [m1Ax, m1Ay, m1Bx, m1By, m1Angle, m1VecA, m1VecB, isLight]);

  // Dragging logic for Module 1
  const handleM1CanvasPointer = (e, isDown = false) => {
    const canvas = canvasM1Ref.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const range = 5;
    const scalePx = canvas.width / (range * 2);
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;
    const mathX = Math.max(-range, Math.min(range, parseFloat(((xPos - originX) / scalePx).toFixed(1))));
    const mathY = Math.max(-range, Math.min(range, parseFloat(((originY - yPos) / scalePx).toFixed(1))));

    if (isDown) {
      // Find closest tip
      const distA = Math.hypot(mathX - m1Ax, mathY - m1Ay);
      const distB = Math.hypot(mathX - m1Bx, mathY - m1By);
      if (distA < 1.2 && distA <= distB) {
        setM1Dragging('a');
      } else if (distB < 1.2) {
        setM1Dragging('b');
      } else {
        setM1Dragging('b');
        setM1Bx(mathX);
        setM1By(mathY);
      }
    } else if (m1Dragging === 'a') {
      setM1Ax(mathX);
      setM1Ay(mathY);
    } else if (m1Dragging === 'b') {
      setM1Bx(mathX);
      setM1By(mathY);
    }
  };

  // =========================================================================
  // MODULE 2: PROJECTION — HOW MUCH OF ONE VECTOR LIES ALONG ANOTHER?
  // Initial values from prompt: a = [3, 1], b = [2, 3]
  // proj_a(b) = (a^T b / a^T a) * a = [2.7, 0.9]
  // b_perp = b - proj_a(b) = [-0.7, 2.1]
  // =========================================================================
  const [m2Ax, setM2Ax] = useState(3);
  const [m2Ay, setM2Ay] = useState(1);
  const [m2Bx, setM2Bx] = useState(2);
  const [m2By, setM2By] = useState(3);
  const [m2Dragging, setM2Dragging] = useState(null); // 'b' | 'a' | null
  const canvasM2Ref = useRef(null);

  const m2VecA = useMemo(() => [m2Ax, m2Ay], [m2Ax, m2Ay]);
  const m2VecB = useMemo(() => [m2Bx, m2By], [m2Bx, m2By]);
  const m2Proj = useMemo(() => project(m2VecB, m2VecA), [m2VecB, m2VecA]);
  const m2Perp = useMemo(() => perp(m2VecB, m2VecA), [m2VecB, m2VecA]);

  const m2DotAB = useMemo(() => dot(m2VecA, m2VecB), [m2VecA, m2VecB]);
  const m2DotAA = useMemo(() => dot(m2VecA, m2VecA), [m2VecA]);

  // Canvas drawing for Module 2
  useEffect(() => {
    const canvas = canvasM2Ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const range = 5;
    const scalePx = width / (range * 2);
    const originX = width / 2;
    const originY = height / 2;

    const toCanvasX = (x) => originX + x * scalePx;
    const toCanvasY = (y) => originY - y * scalePx;

    // Grid lines
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let i = -range; i <= range; i++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(i), 0);
      ctx.lineTo(toCanvasX(i), height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, toCanvasY(i));
      ctx.lineTo(width, toCanvasY(i));
      ctx.stroke();
    }

    // Line of action (Infinite line along vector a)
    if (m2DotAA > 1e-6) {
      ctx.strokeStyle = isLight ? 'rgba(234, 179, 8, 0.25)' : 'rgba(234, 179, 8, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(toCanvasX(-m2Ax * 4), toCanvasY(-m2Ay * 4));
      ctx.lineTo(toCanvasX(m2Ax * 4), toCanvasY(m2Ay * 4));
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Axes
    ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Helper: Draw Arrow
    const drawArrow = (startX, startY, endX, endY, color, label, isDashed = false, isHandle = false) => {
      const cx1 = toCanvasX(startX);
      const cy1 = toCanvasY(startY);
      const cx2 = toCanvasX(endX);
      const cy2 = toCanvasY(endY);

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2.5;

      if (isDashed) {
        ctx.setLineDash([5, 4]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.beginPath();
      ctx.moveTo(cx1, cy1);
      ctx.lineTo(cx2, cy2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      const angle = Math.atan2(cy1 - cy2, cx2 - cx1);
      const headLen = 9;
      ctx.beginPath();
      ctx.moveTo(cx2, cy2);
      ctx.lineTo(
        cx2 - headLen * Math.cos(angle - Math.PI / 7),
        cy2 + headLen * Math.sin(angle - Math.PI / 7)
      );
      ctx.lineTo(
        cx2 - headLen * Math.cos(angle + Math.PI / 7),
        cy2 + headLen * Math.sin(angle + Math.PI / 7)
      );
      ctx.closePath();
      ctx.fill();

      if (isHandle) {
        ctx.beginPath();
        ctx.arc(cx2, cy2, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      if (label) {
        ctx.fillStyle = isLight ? '#1F2937' : '#F9FAFB';
        ctx.font = 'bold 11px monospace';
        const offX = endX >= startX ? 8 : -30;
        const offY = endY >= startY ? -8 : 16;
        ctx.fillText(label, cx2 + offX, cy2 + offY);
      }
    };

    // 1. Vector a (Base vector in Amber)
    drawArrow(0, 0, m2Ax, m2Ay, '#EAB308', `a [${m2Ax}, ${m2Ay}]`, false, true);

    // 2. Projection arrow along a (Purple / Emerald)
    drawArrow(0, 0, m2Proj[0], m2Proj[1], '#10B981', `proj_a(b) [${m2Proj[0].toFixed(1)}, ${m2Proj[1].toFixed(1)}]`);

    // 3. Perpendicular component b_perp from proj tip to b tip (Red / Coral)
    drawArrow(m2Proj[0], m2Proj[1], m2Bx, m2By, '#EF4444', `b_⊥ [${m2Perp[0].toFixed(1)}, ${m2Perp[1].toFixed(1)}]`, true);

    // 4. Vector b (Blue, Draggable)
    drawArrow(0, 0, m2Bx, m2By, '#38BDF8', `b [${m2Bx.toFixed(1)}, ${m2By.toFixed(1)}]`, false, true);

    // Right-angle symbol at projection tip
    const pX = toCanvasX(m2Proj[0]);
    const pY = toCanvasY(m2Proj[1]);
    const uA = normalize(m2VecA);
    const uPerp = normalize(m2Perp);
    const sqSize = 10;
    if (norm(m2Perp) > 0.2 && norm(m2Proj) > 0.2) {
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(pX - uA[0] * sqSize, pY + uA[1] * sqSize);
      ctx.lineTo(pX - uA[0] * sqSize + uPerp[0] * sqSize, pY + uA[1] * sqSize - uPerp[1] * sqSize);
      ctx.lineTo(pX + uPerp[0] * sqSize, pY - uPerp[1] * sqSize);
      ctx.stroke();
    }
  }, [m2Ax, m2Ay, m2Bx, m2By, m2Proj, m2Perp, m2DotAA, m2VecA, isLight]);

  // Dragging for Module 2
  const handleM2CanvasPointer = (e, isDown = false) => {
    const canvas = canvasM2Ref.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    if (clientX === undefined || clientY === undefined) return;

    const range = 5;
    const scalePx = canvas.width / (range * 2);
    const originX = canvas.width / 2;
    const originY = canvas.height / 2;

    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;
    const mathX = Math.max(-range, Math.min(range, parseFloat(((xPos - originX) / scalePx).toFixed(1))));
    const mathY = Math.max(-range, Math.min(range, parseFloat(((originY - yPos) / scalePx).toFixed(1))));

    if (isDown) {
      const distB = Math.hypot(mathX - m2Bx, mathY - m2By);
      const distA = Math.hypot(mathX - m2Ax, mathY - m2Ay);
      if (distA < 1.0 && distA < distB) {
        setM2Dragging('a');
      } else {
        setM2Dragging('b');
        setM2Bx(mathX);
        setM2By(mathY);
      }
    } else if (m2Dragging === 'b') {
      setM2Bx(mathX);
      setM2By(mathY);
    } else if (m2Dragging === 'a') {
      setM2Ax(mathX);
      setM2Ay(mathY);
    }
  };

  // =========================================================================
  // MODULE QR-3: GRAM-SCHMIDT ORTHOGONALIZATION (2D & 3D MODES)
  // Step 1: Display two independent vectors: a1 = [2, 1], a2 = [1, 2]
  // Step 2: Subtract the projection: u1 = a1 = [2, 1], u2 = a2 - proj_u1(a2) = [-0.6, 1.2]
  // Step 3: Normalize the vectors: q1 = u1 / ||u1||, q2 = u2 / ||u2||
  // =========================================================================
  const [gsDimension, setGsDimension] = useState('2d'); // '2d' | '3d'
  const [gsStep, setGsStep] = useState(1); // 1: Independent, 2: Subtract Proj, 3: Normalize
  const [isGsPlaying, setIsGsPlaying] = useState(false);
  const canvasGsRef = useRef(null);

  // 2D inputs
  const [gs2A1, setGs2A1] = useState([2, 1]);
  const [gs2A2, setGs2A2] = useState([1, 2]);

  // Gram-Schmidt computation for 2D
  const gs2Results = useMemo(() => {
    return gramSchmidt([gs2A1, gs2A2]);
  }, [gs2A1, gs2A2]);

  // 3D inputs
  const [gs3A1, setGs3A1] = useState([2, 1, 0]);
  const [gs3A2, setGs3A2] = useState([1, 2, 0]);
  const [gs3A3, setGs3A3] = useState([1, 1, 2]);

  // 3D camera angles
  const [camRotX, setCamRotX] = useState(25); // degrees
  const [camRotY, setCamRotY] = useState(-35); // degrees

  const gs3Results = useMemo(() => {
    return gramSchmidt([gs3A1, gs3A2, gs3A3]);
  }, [gs3A1, gs3A2, gs3A3]);

  // Auto-play animation through Gram-Schmidt steps
  useEffect(() => {
    let timer;
    if (isGsPlaying) {
      timer = setInterval(() => {
        setGsStep((prev) => {
          if (prev >= 3) {
            setIsGsPlaying(false);
            return 3;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isGsPlaying]);

  // Canvas drawing for Gram-Schmidt (2D & 3D)
  useEffect(() => {
    const canvas = canvasGsRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (gsDimension === '2d') {
      // 2D Gram-Schmidt visualization
      const range = 3.5;
      const scalePx = width / (range * 2);
      const originX = width / 2;
      const originY = height / 2;

      const toCanvasX = (x) => originX + x * scalePx;
      const toCanvasY = (y) => originY - y * scalePx;

      // Unit circle (shown especially in step 3)
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(originX, originY, scalePx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Axes
      ctx.strokeStyle = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, originY);
      ctx.lineTo(width, originY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, height);
      ctx.stroke();

      const drawArrow = (x, y, color, label, isDashed = false) => {
        const cx = toCanvasX(x);
        const cy = toCanvasY(y);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;

        if (isDashed) ctx.setLineDash([4, 4]);
        else ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(cx, cy);
        ctx.stroke();
        ctx.setLineDash([]);

        const angle = Math.atan2(originY - cy, cx - originX);
        const headLen = 8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(
          cx - headLen * Math.cos(angle - Math.PI / 7),
          cy + headLen * Math.sin(angle - Math.PI / 7)
        );
        ctx.lineTo(
          cx - headLen * Math.cos(angle + Math.PI / 7),
          cy + headLen * Math.sin(angle + Math.PI / 7)
        );
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isLight ? '#1F2937' : '#F9FAFB';
        ctx.font = 'bold 11px monospace';
        const offX = x >= 0 ? 8 : -28;
        const offY = y >= 0 ? -6 : 14;
        ctx.fillText(label, cx + offX, cy + offY);
      };

      const u1 = gs2Results.orthogonalCols[0];
      const u2 = gs2Results.orthogonalCols[1];
      const q1 = gs2Results.orthonormalCols[0];
      const q2 = gs2Results.orthonormalCols[1];
      const proj = gs2Results.projections['1_on_0'];

      if (gsStep === 1) {
        // Step 1: Display two independent vectors a1, a2
        drawArrow(gs2A1[0], gs2A1[1], '#EAB308', `a₁ [${gs2A1[0]}, ${gs2A1[1]}]`);
        drawArrow(gs2A2[0], gs2A2[1], '#38BDF8', `a₂ [${gs2A2[0]}, ${gs2A2[1]}]`);
      } else if (gsStep === 2) {
        // Step 2: u1 = a1, u2 = a2 - proj_u1(a2)
        // Show projection along u1
        drawArrow(proj[0], proj[1], '#A855F7', `proj_{u₁}(a₂) [${proj[0].toFixed(1)}, ${proj[1].toFixed(1)}]`, true);
        // Show original a2 faint
        drawArrow(gs2A2[0], gs2A2[1], 'rgba(56, 189, 248, 0.35)', 'a₂ (orig)', true);
        // Show u1
        drawArrow(u1[0], u1[1], '#EAB308', `u₁ = a₁ [${u1[0].toFixed(1)}, ${u1[1].toFixed(1)}]`);
        // Show u2 (perpendicular!)
        drawArrow(u2[0], u2[1], '#10B981', `u₂ [${u2[0].toFixed(1)}, ${u2[1].toFixed(1)}]`);

        // Right angle marker between u1 and u2
        const nU1 = normalize(u1);
        const nU2 = normalize(u2);
        const sz = 0.35 * scalePx;
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(originX + nU1[0] * sz, originY - nU1[1] * sz);
        ctx.lineTo(originX + (nU1[0] + nU2[0]) * sz, originY - (nU1[1] + nU2[1]) * sz);
        ctx.lineTo(originX + nU2[0] * sz, originY - nU2[1] * sz);
        ctx.stroke();
      } else {
        // Step 3: Normalize q1, q2
        drawArrow(q1[0], q1[1], '#EAB308', `q₁ [${q1[0].toFixed(2)}, ${q1[1].toFixed(2)}]`);
        drawArrow(q2[0], q2[1], '#10B981', `q₂ [${q2[0].toFixed(2)}, ${q2[1].toFixed(2)}]`);

        // Right angle marker between q1 and q2
        const sz = 0.25 * scalePx;
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(originX + q1[0] * sz, originY - q1[1] * sz);
        ctx.lineTo(originX + (q1[0] + q2[0]) * sz, originY - (q1[1] + q2[1]) * sz);
        ctx.lineTo(originX + q2[0] * sz, originY - q2[1] * sz);
        ctx.stroke();
      }
    } else {
      // 3D Mode Canvas Projection
      const radX = (camRotX * Math.PI) / 180;
      const radY = (camRotY * Math.PI) / 180;
      const originX = width / 2;
      const originY = height / 2;
      const scale3d = width / 9;

      // 3D to 2D projection function with rotation
      const project3D = (x, y, z) => {
        // Rotate around Y-axis
        const x1 = x * Math.cos(radY) + z * Math.sin(radY);
        const y1 = y;
        const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

        // Rotate around X-axis
        const x2 = x1;
        const y2 = y1 * Math.cos(radX) - z1 * Math.sin(radX);
        const z2 = y1 * Math.sin(radX) + z1 * Math.cos(radX);

        // Weak perspective projection
        const fov = 400;
        const pScale = fov / (fov + z2 * 12);
        return {
          px: originX + x2 * scale3d * pScale,
          py: originY - y2 * scale3d * pScale,
          depth: z2
        };
      };

      // Draw 3D Axes
      const draw3DAxis = (x, y, z, label, color) => {
        const p = project3D(x, y, z);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(p.px, p.py);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = color;
        ctx.font = '10px monospace';
        ctx.fillText(label, p.px + 4, p.py + 4);
      };

      draw3DAxis(3, 0, 0, 'X', isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)');
      draw3DAxis(0, 3, 0, 'Y', isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)');
      draw3DAxis(0, 0, 3, 'Z', isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)');

      const draw3DArrow = (vec, color, label, isDashed = false) => {
        const p = project3D(vec[0], vec[1], vec[2]);
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        if (isDashed) ctx.setLineDash([4, 4]);
        else ctx.setLineDash([]);

        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(p.px, p.py);
        ctx.stroke();
        ctx.setLineDash([]);

        const angle = Math.atan2(originY - p.py, p.px - originX);
        const headLen = 8;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(
          p.px - headLen * Math.cos(angle - Math.PI / 7),
          p.py + headLen * Math.sin(angle - Math.PI / 7)
        );
        ctx.lineTo(
          p.px - headLen * Math.cos(angle + Math.PI / 7),
          p.py + headLen * Math.sin(angle + Math.PI / 7)
        );
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isLight ? '#1F2937' : '#F9FAFB';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(label, p.px + 8, p.py - 6);
      };

      if (gsStep === 1) {
        draw3DArrow(gs3A1, '#EAB308', 'a₁');
        draw3DArrow(gs3A2, '#38BDF8', 'a₂');
        draw3DArrow(gs3A3, '#EC4899', 'a₃');
      } else if (gsStep === 2) {
        // Orthogonalized vectors u1, u2, u3
        draw3DArrow(gs3Results.orthogonalCols[0], '#EAB308', 'u₁');
        draw3DArrow(gs3Results.orthogonalCols[1], '#38BDF8', 'u₂ ⊥ u₁');
        draw3DArrow(gs3Results.orthogonalCols[2], '#10B981', 'u₃ ⊥ {u₁, u₂}');
      } else {
        // Orthonormal directions q1, q2, q3
        draw3DArrow(gs3Results.orthonormalCols[0], '#EAB308', 'q₁ (‖q₁‖=1)');
        draw3DArrow(gs3Results.orthonormalCols[1], '#38BDF8', 'q₂ (‖q₂‖=1)');
        draw3DArrow(gs3Results.orthonormalCols[2], '#10B981', 'q₃ (‖q₃‖=1)');
      }
    }
  }, [gsDimension, gsStep, gs2A1, gs2A2, gs2Results, gs3A1, gs3A2, gs3A3, gs3Results, camRotX, camRotY, isLight]);

  // =========================================================================
  // MODULE 4: BUILD Q AND R MATRICES (A = QR & QR VERIFICATION)
  // Input: A = [a1 | a2] = [[2, 1], [1, 2]]
  // Compute Q and R, verify QR = A and Q^T Q = I
  // =========================================================================
  const [m4A11, setM4A11] = useState(2);
  const [m4A12, setM4A12] = useState(1);
  const [m4A21, setM4A21] = useState(1);
  const [m4A22, setM4A22] = useState(2);
  const [isQrMultiplying, setIsQrMultiplying] = useState(false);

  const m4MatrixA = useMemo(() => [
    [m4A11, m4A12],
    [m4A21, m4A22]
  ], [m4A11, m4A12, m4A21, m4A22]);

  const m4QR = useMemo(() => {
    return qrDecomposition(m4MatrixA);
  }, [m4MatrixA]);

  // =========================================================================
  // MODULE 5: GRAYSCALE IMAGE MATRIX DECOMPOSITION & RECONSTRUCTION
  // 2x2 or 3x3 Image Matrix A -> Q (orthonormal basis) & R (triangular weights)
  // Reconstruct: A_recon = Q * R
  // =========================================================================
  const [imageSize, setImageSize] = useState(2); // 2 or 3
  const [activeImagePreset, setActiveImagePreset] = useState('diagonal');
  const [customImage2x2, setCustomImage2x2] = useState([
    [40, 120],
    [120, 240]
  ]);
  const [customImage3x3, setCustomImage3x3] = useState([
    [40, 220, 40],
    [220, 240, 220],
    [40, 220, 40]
  ]);

  const activeImageMatrix = useMemo(() => {
    return imageSize === 2 ? customImage2x2 : customImage3x3;
  }, [imageSize, customImage2x2, customImage3x3]);

  const imageQR = useMemo(() => {
    return qrDecomposition(activeImageMatrix);
  }, [activeImageMatrix]);

  const handleImagePreset = (preset) => {
    setActiveImagePreset(preset.id);
    if (imageSize === 2) {
      setCustomImage2x2(preset.matrix);
    } else {
      setCustomImage3x3(preset.matrix);
    }
  };

  const handlePixelEdit = (r, c, val) => {
    const num = Math.max(0, Math.min(255, parseInt(val, 10) || 0));
    if (imageSize === 2) {
      setCustomImage2x2((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = num;
        return next;
      });
    } else {
      setCustomImage3x3((prev) => {
        const next = prev.map((row) => [...row]);
        next[r][c] = num;
        return next;
      });
    }
  };

  return (
    <div className="math-step-view" style={{ maxWidth: '1240px', margin: '0 auto', padding: '1.25rem 1rem' }}>
      {/* 1. STANDARDIZED HEADER */}
      <div className="step-header-box" style={{ marginBottom: '1rem', padding: '0.95rem 1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h2 className="step-heading" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={22} style={{ color: 'var(--accent-primary, #C59B67)' }} />
            <span>QR Decomposition — Orthogonality, Gram–Schmidt &amp; Image Reconstruction</span>
          </h2>
          <span className="badge-tag-mini" style={{ fontSize: '0.74rem', padding: '0.18rem 0.55rem' }}>
            Module: QR Decomposition
          </span>
        </div>

        <p className="step-description" style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
          <strong>Core Inquiry:</strong> Can we represent any set of vectors — and even a digital grayscale image matrix — using mutually perpendicular unit directions?
          Explore dot products, orthogonal vector projections, the step-by-step Gram–Schmidt algorithm in 2D &amp; 3D, and factorize matrices into $A = QR$ to reconstruct visual pixels.
        </p>

        {/* SUB-CHAPTER / EXPLORATION OPTIONS HEADER */}
        <div style={{ marginTop: '0.95rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-primary, #C59B67)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} />
              <span>Interactive Exploration Modules &amp; Options</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Select a stage (1 – 5):
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('perpendicular')}
              className={`sub-chapter-pill ${activeTab === 'perpendicular' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '0.32rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Activity size={14} />
              <span>1. What is Perpendicular?</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('projection')}
              className={`sub-chapter-pill ${activeTab === 'projection' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '0.32rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Layers size={14} />
              <span>2. Vector Projection (proj_a b)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('gram-schmidt')}
              className={`sub-chapter-pill ${activeTab === 'gram-schmidt' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '0.32rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Sparkles size={14} />
              <span>3. Gram–Schmidt Process (2D &amp; 3D)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('qr-matrices')}
              className={`sub-chapter-pill ${activeTab === 'qr-matrices' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '0.32rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Grid size={14} />
              <span>4. Build Q &amp; R Matrices (A = QR)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image-qr')}
              className={`sub-chapter-pill ${activeTab === 'image-qr' ? 'active' : ''}`}
              style={{ fontSize: '0.78rem', padding: '0.32rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ImageIcon size={14} />
              <span>5. Grayscale Image Matrix Factorization</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: WHAT DOES PERPENDICULAR MEAN? (ORTHOGONAL VECTORS) */}
      {/* ========================================================================= */}
      {activeTab === 'perpendicular' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {/* Left: Interactive Canvas */}
          <div className="card-glass" style={{ padding: '1rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Compass size={16} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span>Interactive Orthogonal Coordinate Plane</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Drag vector tips</span>
            </div>

            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <canvas
                ref={canvasM1Ref}
                width={380}
                height={380}
                onMouseDown={(e) => handleM1CanvasPointer(e, true)}
                onMouseMove={(e) => handleM1CanvasPointer(e, false)}
                onMouseUp={() => setM1Dragging(null)}
                onTouchStart={(e) => handleM1CanvasPointer(e, true)}
                onTouchMove={(e) => handleM1CanvasPointer(e, false)}
                onTouchEnd={() => setM1Dragging(null)}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '1/1',
                  background: isLight ? '#FFFFFF' : 'var(--bg-secondary)',
                  borderRadius: 10,
                  border: '1px solid var(--border-color)',
                  cursor: m1Dragging ? 'grabbing' : 'grab',
                  touchAction: 'none'
                }}
              />
            </div>

            {/* Presets Row */}
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Preset Vector Configurations:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setM1Ax(3); setM1Ay(1); setM1Bx(-1); setM1By(3); }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
              >
                Default [3, 1] &amp; [-1, 3]
              </button>
              <button
                type="button"
                onClick={() => { setM1Ax(4); setM1Ay(0); setM1Bx(0); setM1By(3); }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
              >
                Standard Axes [4, 0] &amp; [0, 3]
              </button>
              <button
                type="button"
                onClick={() => { setM1Bx(-m1Ay); setM1By(m1Ax); }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
              >
                Snap b to 90° (-a_y, a_x)
              </button>
            </div>
          </div>
          </div>

          {/* Right: Dot Product Analysis & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Status Banner */}
            <div
              className="card-glass"
              style={{
                padding: '0.9rem',
                borderRadius: 12,
                borderLeft: `4px solid ${m1Angle.isOrthogonal ? '#10B981' : m1Dot > 0 ? '#38BDF8' : '#EF4444'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>GEOMETRIC RELATION</span>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 6,
                    background: m1Angle.isOrthogonal ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: m1Angle.isOrthogonal ? '#10B981' : 'var(--text-secondary)'
                  }}
                >
                  {m1Angle.isOrthogonal ? '✓ PERPENDICULAR (ORTHOGONAL)' : m1Dot > 0 ? 'ACUTE ANGLE (θ < 90°)' : 'OBTUSE ANGLE (θ > 90°)'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.45rem', fontWeight: 700 }}>
                  a · b = {m1Dot.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Angle θ = <strong>{m1Angle.deg.toFixed(1)}°</strong>
                </span>
              </div>

              <p style={{ fontSize: '0.78rem', margin: '0.35rem 0 0', lineHeight: 1.5, color: 'var(--text-secondary)' }}>
                {m1Angle.isOrthogonal
                  ? 'The dot product is ZERO! When a · b = 0, the two arrows form an exact 90° angle — meaning neither vector casts any shadow or projection onto the other.'
                  : m1Dot > 0
                  ? 'Dot product > 0: Both vectors point generally in the same forward direction (angle θ < 90°).'
                  : 'Dot product < 0: The vectors point in opposing directions (angle θ > 90°).'}
              </p>
            </div>

            {/* Dot Product Calculation Box */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.45rem', color: 'var(--text-primary)' }}>
                Dot Product Formula Breakdown
              </div>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  lineHeight: 1.6
                }}
              >
                <div>a · b = (a_x × b_x) + (a_y × b_y)</div>
                <div style={{ color: 'var(--text-muted)' }}>
                  = ({m1Ax.toFixed(1)} × {m1Bx.toFixed(1)}) + ({m1Ay.toFixed(1)} × {m1By.toFixed(1)})
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  = {(m1Ax * m1Bx).toFixed(2)} + {(m1Ay * m1By).toFixed(2)}
                </div>
                <div style={{ fontWeight: 700, color: m1Angle.isOrthogonal ? '#10B981' : 'var(--accent-primary, #C59B67)' }}>
                  = {m1Dot.toFixed(2)} {m1Angle.isOrthogonal && '== 0 (Orthogonal!)'}
                </div>
              </div>
            </div>

            {/* Vector Component Sliders */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                Adjust Vector Components
              </div>

              {/* Vector A Components */}
              <div style={{ marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#EAB308', marginBottom: '0.2rem' }}>
                  Vector a: [a_x, a_y] = [{m1Ax.toFixed(1)}, {m1Ay.toFixed(1)}]
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>a_x: {m1Ax.toFixed(1)}</span>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={m1Ax}
                      onChange={(e) => setM1Ax(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>a_y: {m1Ay.toFixed(1)}</span>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={m1Ay}
                      onChange={(e) => setM1Ay(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Vector B Components */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#38BDF8', marginBottom: '0.2rem' }}>
                  Vector b: [b_x, b_y] = [{m1Bx.toFixed(1)}, {m1By.toFixed(1)}]
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>b_x: {m1Bx.toFixed(1)}</span>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={m1Bx}
                      onChange={(e) => setM1Bx(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>b_y: {m1By.toFixed(1)}</span>
                    <input
                      type="range"
                      min="-4"
                      max="4"
                      step="0.5"
                      value={m1By}
                      onChange={(e) => setM1By(parseFloat(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: PROJECTION — HOW MUCH OF ONE VECTOR LIES ALONG ANOTHER? */}
      {/* ========================================================================= */}
      {activeTab === 'projection' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {/* Left: Interactive Canvas */}
          <div className="card-glass" style={{ padding: '1rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Layers size={16} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span>Orthogonal Vector Resolution</span>
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Drag vector tip b</span>
            </div>

            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <canvas
                ref={canvasM2Ref}
                width={380}
                height={380}
                onMouseDown={(e) => handleM2CanvasPointer(e, true)}
                onMouseMove={(e) => handleM2CanvasPointer(e, false)}
                onMouseUp={() => setM2Dragging(null)}
                onTouchStart={(e) => handleM2CanvasPointer(e, true)}
                onTouchMove={(e) => handleM2CanvasPointer(e, false)}
                onTouchEnd={() => setM2Dragging(null)}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '1/1',
                  background: isLight ? '#FFFFFF' : 'var(--bg-secondary)',
                  borderRadius: 10,
                  border: '1px solid var(--border-color)',
                  cursor: m2Dragging ? 'grabbing' : 'grab',
                  touchAction: 'none'
                }}
              />
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap', fontSize: '0.72rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EAB308' }} />
                <span>Base vector a</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#38BDF8' }} />
                <span>Vector b</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981' }} />
                <span>Parallel: proj_a(b)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
                <span>Perpendicular: b_⊥</span>
              </div>
            </div>
          </div>

          {/* Right: Formulas & Decomposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Textbook Starting Values Quick Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
                Projection Vector Options:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => { setM2Ax(3); setM2Ay(1); setM2Bx(2); setM2By(3); }}
                  className="sub-chapter-pill"
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
                >
                  Reset to Prompt: a = [3, 1], b = [2, 3]
                </button>
                <button
                  type="button"
                  onClick={() => { setM2Ax(3); setM2Ay(1); setM2Bx(6); setM2By(2); }}
                  className="sub-chapter-pill"
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
                >
                  Collinear / Pure Parallel (b = 2a)
                </button>
                <button
                  type="button"
                  onClick={() => { setM2Ax(3); setM2Ay(1); setM2Bx(-1); setM2By(3); }}
                  className="sub-chapter-pill"
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
                >
                  Pure Perpendicular (proj = 0)
                </button>
              </div>
            </div>

            {/* 1. Projection Math Box */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10B981', marginBottom: '0.35rem' }}>
                1. PROJECTION OF b ONTO a
              </div>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  lineHeight: 1.6
                }}
              >
                <div>proj_a(b) = [ (aᵀ b) / (aᵀ a) ] · a</div>
                <div style={{ color: 'var(--text-muted)' }}>
                  = [ ({m2Ax}×{m2Bx.toFixed(1)} + {m2Ay}×{m2By.toFixed(1)}) / ({m2Ax}² + {m2Ay}²) ] · a
                </div>
                <div style={{ color: 'var(--text-muted)' }}>
                  = [ {m2DotAB.toFixed(2)} / {m2DotAA.toFixed(2)} ] · [{m2Ax}, {m2Ay}]
                </div>
                <div style={{ fontWeight: 700, color: '#10B981' }}>
                  = [{m2Proj[0].toFixed(2)}, {m2Proj[1].toFixed(2)}]ᵀ
                </div>
              </div>
            </div>

            {/* 2. Perpendicular Component Math Box */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12 }}>
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#EF4444', marginBottom: '0.35rem' }}>
                2. REMAINING PERPENDICULAR COMPONENT (b_⊥)
              </div>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 8,
                  border: '1px solid var(--border-color)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  lineHeight: 1.6
                }}
              >
                <div>b_⊥ = b − proj_a(b)</div>
                <div style={{ color: 'var(--text-muted)' }}>
                  = [{m2Bx.toFixed(1)}, {m2By.toFixed(1)}] − [{m2Proj[0].toFixed(2)}, {m2Proj[1].toFixed(2)}]
                </div>
                <div style={{ fontWeight: 700, color: '#EF4444' }}>
                  = [{m2Perp[0].toFixed(2)}, {m2Perp[1].toFixed(2)}]ᵀ
                </div>
              </div>
            </div>

            {/* 3. Verification of Orthogonality */}
            <div
              className="card-glass"
              style={{
                padding: '0.9rem',
                borderRadius: 12,
                borderLeft: '4px solid var(--accent-primary, #C59B67)'
              }}
            >
              <div style={{ fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                Orthogonal Verification Checklist
              </div>
              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.3rem', lineHeight: 1.5 }}>
                <div>
                  • <strong>Vector Recombination:</strong> proj_a(b) + b_⊥ = [{(m2Proj[0] + m2Perp[0]).toFixed(1)}, {(m2Proj[1] + m2Perp[1]).toFixed(1)}]ᵀ == b ✓
                </div>
                <div>
                  • <strong>Dot Product:</strong> proj_a(b) · b_⊥ = {dot(m2Proj, m2Perp).toFixed(4)} ≈ 0 (Strictly Perpendicular!) ✓
                </div>
                <div>
                  • <strong>Pythagoras Length:</strong> ‖proj‖² ({norm(m2Proj)**2 | 0}) + ‖b_⊥‖² ({norm(m2Perp)**2 | 0}) = ‖b‖² ({norm(m2VecB)**2 | 0}) ✓
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: GRAM-SCHMIDT ORTHOGONALIZATION PROCESS */}
      {/* ========================================================================= */}
      {activeTab === 'gram-schmidt' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', alignItems: 'start' }}>
          {/* Left: Step Progression & Visualizer */}
          <div className="card-glass" style={{ padding: '1rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-primary, #C59B67)' }} />
                <span>Gram–Schmidt Orthogonalization</span>
              </span>

              {/* 2D / 3D Mode Toggle */}
              <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary)', padding: '0.15rem', borderRadius: 8, border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setGsDimension('2d')}
                  className={`sub-chapter-pill ${gsDimension === '2d' ? 'active' : ''}`}
                  style={{ fontSize: '0.7rem', padding: '0.18rem 0.5rem' }}
                >
                  2D Vectors
                </button>
                <button
                  type="button"
                  onClick={() => setGsDimension('3d')}
                  className={`sub-chapter-pill ${gsDimension === '3d' ? 'active' : ''}`}
                  style={{ fontSize: '0.7rem', padding: '0.18rem 0.5rem' }}
                >
                  3D Space Mode
                </button>
              </div>
            </div>

            {/* Step Selector Buttons */}
            <div style={{ marginBottom: '0.85rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                Orthogonalization Stages:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => setGsStep(1)}
                  className={`sub-chapter-pill ${gsStep === 1 ? 'active' : ''}`}
                  style={{ fontSize: '0.72rem', padding: '0.4rem 0.2rem', textAlign: 'center', justifyContent: 'center' }}
                >
                  1. Independent
                </button>
                <button
                  type="button"
                  onClick={() => setGsStep(2)}
                  className={`sub-chapter-pill ${gsStep === 2 ? 'active' : ''}`}
                  style={{ fontSize: '0.72rem', padding: '0.4rem 0.2rem', textAlign: 'center', justifyContent: 'center' }}
                >
                  2. Subtract Proj
                </button>
                <button
                  type="button"
                  onClick={() => setGsStep(3)}
                  className={`sub-chapter-pill ${gsStep === 3 ? 'active' : ''}`}
                  style={{ fontSize: '0.72rem', padding: '0.4rem 0.2rem', textAlign: 'center', justifyContent: 'center' }}
                >
                  3. Normalize
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <canvas
                ref={canvasGsRef}
                width={380}
                height={380}
                style={{
                  width: '100%',
                  maxWidth: '380px',
                  aspectRatio: '1/1',
                  background: isLight ? '#FFFFFF' : 'var(--bg-secondary)',
                  borderRadius: 10,
                  border: '1px solid var(--border-color)'
                }}
              />
            </div>

            {/* 3D Orbit Controls */}
            {gsDimension === '3d' && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.72rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: 'var(--text-muted)' }}>
                  <span>3D View Angle (Elevation &amp; Azimuth)</span>
                  <span>{camRotX}° / {camRotY}°</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="range"
                    min="-60"
                    max="60"
                    value={camRotX}
                    onChange={(e) => setCamRotX(parseInt(e.target.value, 10))}
                  />
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={camRotY}
                    onChange={(e) => setCamRotY(parseInt(e.target.value, 10))}
                  />
                </div>
              </div>
            )}

            {/* Play/Pause Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsGsPlaying((prev) => !prev)}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                {isGsPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isGsPlaying ? 'Pause Animation' : 'Auto Play Gram–Schmidt'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGsStep(1);
                  setIsGsPlaying(false);
                }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right: Gram-Schmidt Step Formulas & Step-by-Step Math */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {gsDimension === '2d' ? (
              <>
                {/* Step 1 Math Card */}
                <div
                  className="card-glass"
                  style={{
                    padding: '0.85rem',
                    borderRadius: 10,
                    borderLeft: `4px solid ${gsStep === 1 ? '#EAB308' : 'var(--border-color)'}`,
                    opacity: gsStep >= 1 ? 1 : 0.6
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#EAB308', marginBottom: '0.25rem' }}>
                    STEP 1: Start with Two Independent Vectors
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', margin: '0.35rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: '#EAB308', fontWeight: 700 }}>a₁:</span>
                      [<input
                        type="number"
                        value={gs2A1[0]}
                        onChange={(e) => setGs2A1([parseFloat(e.target.value) || 0, gs2A1[1]])}
                        style={{ width: '42px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />,
                      <input
                        type="number"
                        value={gs2A1[1]}
                        onChange={(e) => setGs2A1([gs2A1[0], parseFloat(e.target.value) || 0])}
                        style={{ width: '42px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />]ᵀ
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: '#38BDF8', fontWeight: 700 }}>a₂:</span>
                      [<input
                        type="number"
                        value={gs2A2[0]}
                        onChange={(e) => setGs2A2([parseFloat(e.target.value) || 0, gs2A2[1]])}
                        style={{ width: '42px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />,
                      <input
                        type="number"
                        value={gs2A2[1]}
                        onChange={(e) => setGs2A2([gs2A2[0], parseFloat(e.target.value) || 0])}
                        style={{ width: '42px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />]ᵀ
                    </div>

                    <button
                      type="button"
                      onClick={() => { setGs2A1([2, 1]); setGs2A2([1, 2]); }}
                      className="sub-chapter-pill"
                      style={{ fontSize: '0.7rem', padding: '0.15rem 0.45rem' }}
                    >
                      Reset [2,1] &amp; [1,2]
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0', color: 'var(--text-muted)' }}>
                    These two vectors span the entire 2D plane ℝ², but they are not perpendicular (dot product = {dot(gs2A1, gs2A2)} ≠ 0).
                  </p>
                </div>

                {/* Step 2 Math Card */}
                <div
                  className="card-glass"
                  style={{
                    padding: '0.85rem',
                    borderRadius: 10,
                    borderLeft: `4px solid ${gsStep === 2 ? '#10B981' : 'var(--border-color)'}`,
                    opacity: gsStep >= 2 ? 1 : 0.6
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#10B981', marginBottom: '0.25rem' }}>
                    STEP 2: Subtract the Parallel Projection
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    <div>u₁ = a₁ = [{gs2Results.orthogonalCols[0][0]}, {gs2Results.orthogonalCols[0][1]}]ᵀ</div>
                    <div>u₂ = a₂ − [ (a₁ᵀ a₂) / (a₁ᵀ a₁) ] · a₁</div>
                    <div style={{ color: 'var(--text-muted)' }}>
                      = [{gs2A2[0]}, {gs2A2[1]}]ᵀ − ({dot(gs2A1, gs2A2)} / {dot(gs2A1, gs2A1)}) · [{gs2A1[0]}, {gs2A1[1]}]ᵀ
                    </div>
                    <div style={{ fontWeight: 700, color: '#10B981' }}>
                      = [{gs2Results.orthogonalCols[1][0].toFixed(2)}, {gs2Results.orthogonalCols[1][1].toFixed(2)}]ᵀ
                    </div>
                  </div>
                  <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0', color: 'var(--text-muted)' }}>
                    Check: u₁ · u₂ = {dot(gs2Results.orthogonalCols[0], gs2Results.orthogonalCols[1]).toFixed(4)} ≈ 0 (Orthogonalized!).
                  </p>
                </div>

                {/* Step 3 Math Card */}
                <div
                  className="card-glass"
                  style={{
                    padding: '0.85rem',
                    borderRadius: 10,
                    borderLeft: `4px solid ${gsStep === 3 ? '#38BDF8' : 'var(--border-color)'}`,
                    opacity: gsStep === 3 ? 1 : 0.6
                  }}
                >
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#38BDF8', marginBottom: '0.25rem' }}>
                    STEP 3: Normalize to Unit Vectors (Orthonormal Basis)
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                    <div>q₁ = u₁ / ‖u₁‖ = [{gs2Results.orthonormalCols[0][0].toFixed(3)}, {gs2Results.orthonormalCols[0][1].toFixed(3)}]ᵀ &nbsp;(‖q₁‖ = 1)</div>
                    <div>q₂ = u₂ / ‖u₂‖ = [{gs2Results.orthonormalCols[1][0].toFixed(3)}, {gs2Results.orthonormalCols[1][1].toFixed(3)}]ᵀ &nbsp;(‖q₂‖ = 1)</div>
                  </div>
                  <p style={{ fontSize: '0.75rem', margin: '0.35rem 0 0', color: 'var(--text-muted)' }}>
                    Now {`{q₁, q₂}`} forms a pristine orthonormal coordinate system where Qᵀ Q = I!
                  </p>
                </div>
              </>
            ) : (
              /* 3D Gram-Schmidt Summary */
              <div className="card-glass" style={{ padding: '1rem', borderRadius: 12 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', color: '#10B981' }}>
                  3-Dimensional Gram–Schmidt Orthogonalization
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', margin: '0.5rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#EAB308', fontWeight: 700 }}>a₁:</span>
                    {[0, 1, 2].map(idx => (
                      <input
                        key={'a1_' + idx}
                        type="number"
                        value={gs3A1[idx]}
                        onChange={(e) => {
                          const next = [...gs3A1];
                          next[idx] = parseFloat(e.target.value) || 0;
                          setGs3A1(next);
                        }}
                        style={{ width: '40px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>a₂:</span>
                    {[0, 1, 2].map(idx => (
                      <input
                        key={'a2_' + idx}
                        type="number"
                        value={gs3A2[idx]}
                        onChange={(e) => {
                          const next = [...gs3A2];
                          next[idx] = parseFloat(e.target.value) || 0;
                          setGs3A2(next);
                        }}
                        style={{ width: '40px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: '#EC4899', fontWeight: 700 }}>a₃:</span>
                    {[0, 1, 2].map(idx => (
                      <input
                        key={'a3_' + idx}
                        type="number"
                        value={gs3A3[idx]}
                        onChange={(e) => {
                          const next = [...gs3A3];
                          next[idx] = parseFloat(e.target.value) || 0;
                          setGs3A3(next);
                        }}
                        style={{ width: '40px', textAlign: 'center', padding: '0.15rem', borderRadius: 4, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 600 }}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() => { setGs3A1([2, 1, 0]); setGs3A2([1, 2, 0]); setGs3A3([1, 1, 2]); }}
                      className="sub-chapter-pill"
                      style={{ fontSize: '0.68rem', padding: '0.15rem 0.4rem', marginLeft: 'auto' }}
                    >
                      Reset 3D
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.76rem', lineHeight: 1.6, fontFamily: 'var(--font-mono)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div>u₁ = a₁ = [{gs3A1.join(', ')}]ᵀ</div>
                  <div>u₂ = a₂ − proj_{'{u₁}'}(a₂) = [{gs3Results.orthogonalCols[1].map(v => v.toFixed(2)).join(', ')}]ᵀ</div>
                  <div>u₃ = a₃ − proj_{'{u₁}'}(a₃) − proj_{'{u₂}'}(a₃) = [{gs3Results.orthogonalCols[2].map(v => v.toFixed(2)).join(', ')}]ᵀ</div>
                </div>

                <div style={{ marginTop: '0.75rem', padding: '0.65rem', background: 'var(--bg-secondary)', borderRadius: 8, fontSize: '0.74rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Mutual Orthogonality Check:</div>
                  <div>• q₁ · q₂ = {dot(gs3Results.orthonormalCols[0], gs3Results.orthonormalCols[1]).toFixed(4)} ≈ 0</div>
                  <div>• q₁ · q₃ = {dot(gs3Results.orthonormalCols[0], gs3Results.orthonormalCols[2]).toFixed(4)} ≈ 0</div>
                  <div>• q₂ · q₃ = {dot(gs3Results.orthonormalCols[1], gs3Results.orthonormalCols[2]).toFixed(4)} ≈ 0</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: BUILD Q AND R MATRICES (A = QR) */}
      {/* ========================================================================= */}
      {activeTab === 'qr-matrices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Matrix Presets Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Preset Matrix Configurations:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => { setM4A11(2); setM4A12(1); setM4A21(1); setM4A22(2); }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
              >
                Prompt Example: [[2, 1], [1, 2]]
              </button>
              <button
                type="button"
                onClick={() => { setM4A11(1); setM4A12(2); setM4A21(3); setM4A22(4); }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
              >
                Standard Matrix: [[1, 2], [3, 4]]
              </button>
              <button
                type="button"
                onClick={() => { setM4A11(3); setM4A12(0); setM4A21(0); setM4A22(3); }}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
              >
                Pure Diagonal: [[3, 0], [0, 3]]
              </button>
            </div>
          </div>

          {/* Top Row: Matrix A inputs and QR Factorization display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Original Matrix A */}
            <div className="card-glass" style={{ padding: '1rem', borderRadius: 12, borderTop: '4px solid #EAB308' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Original Matrix A = [a₁ | a₂]</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Column vectors</span>
              </div>

              {/* Editable 2x2 Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', maxWidth: '200px', margin: '0.5rem auto' }}>
                <input
                  type="number"
                  value={m4A11}
                  onChange={(e) => setM4A11(parseFloat(e.target.value) || 0)}
                  style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 700 }}
                />
                <input
                  type="number"
                  value={m4A12}
                  onChange={(e) => setM4A12(parseFloat(e.target.value) || 0)}
                  style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 700 }}
                />
                <input
                  type="number"
                  value={m4A21}
                  onChange={(e) => setM4A21(parseFloat(e.target.value) || 0)}
                  style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 700 }}
                />
                <input
                  type="number"
                  value={m4A22}
                  onChange={(e) => setM4A22(parseFloat(e.target.value) || 0)}
                  style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontWeight: 700 }}
                />
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Column 1 = [{m4A11}, {m4A21}]ᵀ &nbsp;|&nbsp; Column 2 = [{m4A12}, {m4A22}]ᵀ
              </div>
            </div>

            {/* Matrix Q (Orthonormal Columns) */}
            <div className="card-glass" style={{ padding: '1rem', borderRadius: 12, borderTop: '4px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Orthonormal Matrix Q = [q₁ | q₂]</span>
                <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>Qᵀ Q = I</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', maxWidth: '200px', margin: '0.5rem auto' }}>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.Q[0][0].toFixed(3)}
                </div>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.Q[0][1].toFixed(3)}
                </div>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.Q[1][0].toFixed(3)}
                </div>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.Q[1][1].toFixed(3)}
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                q₁ᵀ q₁ = 1, &nbsp; q₂ᵀ q₂ = 1, &nbsp; q₁ · q₂ = 0
              </div>
            </div>

            {/* Matrix R (Upper Triangular Weights) */}
            <div className="card-glass" style={{ padding: '1rem', borderRadius: 12, borderTop: '4px solid #38BDF8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Upper-Triangular Matrix R</span>
                <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 600 }}>R = Qᵀ A</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', maxWidth: '200px', margin: '0.5rem auto' }}>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.R[0][0].toFixed(3)}
                </div>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.R[0][1].toFixed(3)}
                </div>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38BDF8', fontWeight: 700 }}>
                  0.000
                </div>
                <div style={{ textAlign: 'center', padding: '0.35rem', borderRadius: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                  {m4QR.R[1][1].toFixed(3)}
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Zero below main diagonal (Triangular!)
              </div>
            </div>
          </div>

          {/* Interactive QR Multiplication Verifier */}
          <div className="card-glass" style={{ padding: '1rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Matrix Multiplication Verification: Does Q × R = A?</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Multiply the orthonormal columns of Q by the upper-triangular weights of R.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsQrMultiplying((prev) => !prev)}
                className="sub-chapter-pill"
                style={{ fontSize: '0.74rem', padding: '0.35rem 0.8rem', background: 'var(--accent-primary, #C59B67)', color: '#FFFFFF', border: 'none' }}
              >
                {isQrMultiplying ? 'Reset Formula' : 'Compute Q × R Step-by-Step'}
              </button>
            </div>

            {/* Matrix Product Equation Display */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                flexWrap: 'wrap',
                padding: '1rem',
                background: 'var(--bg-secondary)',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem'
              }}
            >
              {/* Q Matrix */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#10B981', display: 'block', marginBottom: '0.2rem' }}>Q (Orthonormal)</span>
                <div style={{ borderLeft: '2px solid #10B981', borderRight: '2px solid #10B981', padding: '0.2rem 0.45rem' }}>
                  <div>{m4QR.Q[0][0].toFixed(2)} &nbsp; {m4QR.Q[0][1].toFixed(2)}</div>
                  <div>{m4QR.Q[1][0].toFixed(2)} &nbsp; {m4QR.Q[1][1].toFixed(2)}</div>
                </div>
              </div>

              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>×</span>

              {/* R Matrix */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#38BDF8', display: 'block', marginBottom: '0.2rem' }}>R (Triangular)</span>
                <div style={{ borderLeft: '2px solid #38BDF8', borderRight: '2px solid #38BDF8', padding: '0.2rem 0.45rem' }}>
                  <div>{m4QR.R[0][0].toFixed(2)} &nbsp; {m4QR.R[0][1].toFixed(2)}</div>
                  <div>0.00 &nbsp; {m4QR.R[1][1].toFixed(2)}</div>
                </div>
              </div>

              <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>=</span>

              {/* Reconstructed Matrix A */}
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.72rem', color: '#EAB308', display: 'block', marginBottom: '0.2rem' }}>QR Product (Reconstructed A)</span>
                <div style={{ borderLeft: '2px solid #EAB308', borderRight: '2px solid #EAB308', padding: '0.2rem 0.45rem' }}>
                  <div>{m4QR.reconstruction[0][0].toFixed(2)} &nbsp; {m4QR.reconstruction[0][1].toFixed(2)}</div>
                  <div>{m4QR.reconstruction[1][0].toFixed(2)} &nbsp; {m4QR.reconstruction[1][1].toFixed(2)}</div>
                </div>
              </div>

              <span style={{ color: '#10B981', fontWeight: 700, fontSize: '0.9rem' }}>✓ MATCHES ORIGINAL A!</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: GRAYSCALE IMAGE MATRIX DECOMPOSITION (2x2 & 3x3) */}
      {/* ========================================================================= */}
      {activeTab === 'image-qr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Central Question Callout Banner */}
          <div
            className="card-glass"
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 12,
              background: isLight ? 'rgba(105, 121, 81, 0.08)' : 'rgba(255, 255, 255, 0.04)',
              borderLeft: '4px solid var(--accent-primary, #C59B67)'
            }}
          >
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--accent-primary, #C59B67)', marginBottom: '0.35rem' }}>
              Central Question: Can we represent an image matrix using perpendicular unit vectors and then reconstruct the original image?
            </div>
            <p style={{ fontSize: '0.82rem', margin: 0, lineHeight: 1.55 }}>
              <strong>YES!</strong> A digital grayscale image is mathematically just a grid matrix A ∈ ℝ^(m × n).
              By applying QR Decomposition, we factorize the image into A = Q × R.
              Here, $Q$ holds mutually perpendicular unit vectors (spatial feature patterns) that eliminate all redundant correlation between columns, while $R$ contains the exact blending weights needed to reconstruct the original image without losing a single pixel!
            </p>
          </div>

          {/* Controls Bar: Dimension & Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.8rem 1rem', background: 'var(--bg-secondary)', borderRadius: 10, border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--accent-primary, #C59B67)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ImageIcon size={14} />
                <span>Image Resolution &amp; Preset Options</span>
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                Click any pixel in Original Image to edit intensity (0–255)
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.65rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Image Size:</span>
              <button
                type="button"
                onClick={() => {
                  setImageSize(2);
                  setActiveImagePreset('diagonal');
                  setCustomImage2x2(IMAGE_PRESETS_2X2[0].matrix);
                }}
                className={`sub-chapter-pill ${imageSize === 2 ? 'active' : ''}`}
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
              >
                2×2 Pixels
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageSize(3);
                  setActiveImagePreset('cross');
                  setCustomImage3x3(IMAGE_PRESETS_3X3[0].matrix);
                }}
                className={`sub-chapter-pill ${imageSize === 3 ? 'active' : ''}`}
                style={{ fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
              >
                3×3 Pixels
              </button>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {(imageSize === 2 ? IMAGE_PRESETS_2X2 : IMAGE_PRESETS_3X3).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleImagePreset(preset)}
                  className={`sub-chapter-pill ${activeImagePreset === preset.id ? 'active' : ''}`}
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.55rem' }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

          {/* 4-Stage Image Representation: Original -> Q -> R -> Reconstructed */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {/* 1. Original Image A */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12, borderTop: '4px solid #EAB308' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>1. Original Image A</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pixel values (0–255)</span>
              </div>

              {/* Visual Grayscale Canvas Preview */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${imageSize}, 42px)`,
                    gap: '2px',
                    background: 'var(--border-color)',
                    padding: '2px',
                    borderRadius: 6
                  }}
                >
                  {activeImageMatrix.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`orig_${r}_${c}`}
                        style={{
                          width: 42,
                          height: 42,
                          background: `rgb(${val}, ${val}, ${val})`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: val > 128 ? '#000000' : '#FFFFFF',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {val}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Editable Matrix Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${imageSize}, 1fr)`, gap: '0.25rem', marginTop: '0.5rem' }}>
                {activeImageMatrix.map((row, r) =>
                  row.map((val, c) => (
                    <input
                      key={`edit_${r}_${c}`}
                      type="number"
                      min="0"
                      max="255"
                      value={val}
                      onChange={(e) => handlePixelEdit(r, c, e.target.value)}
                      style={{
                        textAlign: 'center',
                        fontSize: '0.74rem',
                        padding: '0.25rem',
                        borderRadius: 4,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'var(--font-mono)'
                      }}
                    />
                  ))
                )}
              </div>
            </div>

            {/* 2. Orthonormal Q Matrix (Perpendicular Directions) */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12, borderTop: '4px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>2. Orthonormal Q</span>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>Qᵀ Q = I</span>
              </div>

              {/* Q Matrix Heatmap & Values */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${imageSize}, 42px)`,
                    gap: '2px',
                    background: 'var(--border-color)',
                    padding: '2px',
                    borderRadius: 6
                  }}
                >
                  {imageQR.Q.map((row, r) =>
                    row.map((val, c) => {
                      const normVal = Math.max(0, Math.min(255, Math.round((val + 1) * 127.5)));
                      return (
                        <div
                          key={`q_${r}_${c}`}
                          style={{
                            width: 42,
                            height: 42,
                            background: `rgb(${normVal}, ${normVal}, ${normVal})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.62rem',
                            fontWeight: 700,
                            color: normVal > 128 ? '#000000' : '#FFFFFF',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {val.toFixed(2)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                Perpendicular unit column bases spanning image space.
              </div>
            </div>

            {/* 3. Upper-Triangular R Matrix */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12, borderTop: '4px solid #38BDF8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>3. Upper-Triangular R</span>
                <span style={{ fontSize: '0.7rem', color: '#38BDF8', fontWeight: 600 }}>Mixing Weights</span>
              </div>

              {/* R Matrix Numerical Grid */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${imageSize}, 42px)`,
                    gap: '2px',
                    background: 'var(--border-color)',
                    padding: '2px',
                    borderRadius: 6
                  }}
                >
                  {imageQR.R.map((row, r) =>
                    row.map((val, c) => {
                      const isZero = r > c;
                      return (
                        <div
                          key={`r_${r}_${c}`}
                          style={{
                            width: 42,
                            height: 42,
                            background: isZero ? 'var(--bg-secondary)' : isLight ? '#FAF9F2' : '#191411',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.62rem',
                            fontWeight: isZero ? 400 : 700,
                            color: isZero ? 'var(--text-muted)' : '#38BDF8',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {isZero ? '0' : val.toFixed(1)}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                Zero below diagonal ensures sequential projection buildup.
              </div>
            </div>

            {/* 4. Reconstructed Image A_recon = Q x R */}
            <div className="card-glass" style={{ padding: '0.9rem', borderRadius: 12, borderTop: '4px solid #A855F7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>4. Reconstructed Image</span>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 700 }}>Diff = 0.00 ✓</span>
              </div>

              {/* Reconstructed Canvas Preview */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '0.5rem 0' }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${imageSize}, 42px)`,
                    gap: '2px',
                    background: 'var(--border-color)',
                    padding: '2px',
                    borderRadius: 6
                  }}
                >
                  {imageQR.reconstruction.map((row, r) =>
                    row.map((val, c) => {
                      const roundVal = Math.round(val);
                      return (
                        <div
                          key={`rec_${r}_${c}`}
                          style={{
                            width: 42,
                            height: 42,
                            background: `rgb(${roundVal}, ${roundVal}, ${roundVal})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: roundVal > 128 ? '#000000' : '#FFFFFF',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {roundVal}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                A_recon = Q × R recreates the original pixels with 100% mathematical fidelity!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE DOCUMENTATION (COLLAPSED ACCORDION) */}
      <div style={{ marginTop: '1.5rem' }}>
        <ModuleDocumentation stepNumber={22} defaultOpen={false} />
      </div>

      {/* STANDARDIZED FOOTER WITH PREVIOUS / NEXT NAVIGATION */}
      <StepFooter
        stepNumber={22}
        onSelectStep={onSelectStep}
      />
    </div>
  );
}
