import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  RotateCw,
  ZoomIn,
  Sun,
  Plus,
  Minus,
  RotateCcw,
  Sliders,
  Eye,
  Download,
  FlipHorizontal,
  Scissors,
  CheckCircle2,
  HelpCircle,
  Grid,
  Undo2,
  X,
  FileText,
  ArrowRight
} from 'lucide-react';
import { clampPixel } from '../core/mathEngine';
import StepFooter from '../components/layout/StepFooter';
import ModuleDocumentation from '../components/experiment/ModuleDocumentation';

// Sample Presets for User Image with harmonized natural, studio, and botanical palettes
const SAMPLE_PRESETS = [
  { id: 'flower', name: 'Botanical Bloom', color: '#697951' },
  { id: 'portrait', name: 'Geometric Silhouette', color: '#4A6572' },
  { id: 'city', name: 'Architectural Grid', color: '#5C6B73' },
  { id: 'spiral', name: 'Logarithmic Spiral', color: '#8A9A5B' }
];

// Draw procedural preset graphics onto an offscreen canvas
function drawPresetGraphic(ctx, presetId, size) {
  ctx.clearRect(0, 0, size, size);

  if (presetId === 'flower') {
    // Rich botanical garden with distinct midtones
    const bg = ctx.createRadialGradient(size / 2, size / 2, 5, size / 2, size / 2, size * 0.7);
    bg.addColorStop(0, '#364B30'); // RGB: 54, 75, 48
    bg.addColorStop(1, '#233220'); // RGB: 35, 50, 32
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Subtle botanical leaves
    ctx.fillStyle = '#4F6C43';
    ctx.beginPath();
    ctx.ellipse(size * 0.22, size * 0.78, size * 0.15, size * 0.08, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(size * 0.78, size * 0.78, size * 0.15, size * 0.08, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    const cx = size / 2;
    const cy = size / 2;
    const petals = 6;
    for (let i = 0; i < petals; i++) {
      const a = (i * 2 * Math.PI) / petals;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(a);
      ctx.fillStyle = i % 2 === 0 ? '#C95974' : '#DC758C';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.25, size * 0.12, size * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Warm golden center
    ctx.fillStyle = '#F2C45E';
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.12, 0, Math.PI * 2);
    ctx.fill();
  } else if (presetId === 'portrait') {
    // Slate studio background with clear midtone luminance
    ctx.fillStyle = '#2C3A44';
    ctx.fillRect(0, 0, size, size);

    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#587D94');
    grad.addColorStop(1, '#7CA5BC');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(size / 2, size * 0.42, size * 0.24, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#9EBCCF';
    ctx.beginPath();
    ctx.ellipse(size / 2, size * 0.88, size * 0.38, size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (presetId === 'city') {
    // Architectural graphite background with crisp grid & geometric blocks
    ctx.fillStyle = '#262D35';
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = 'rgba(180, 210, 200, 0.35)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= size; x += size / 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size);
      ctx.stroke();
    }
    for (let y = 0; y <= size; y += size / 8) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }
    // Modern architectural blocks
    ctx.fillStyle = '#738758';
    ctx.fillRect(size * 0.25, size * 0.25, size * 0.5, size * 0.5);
    ctx.fillStyle = '#B88258';
    ctx.fillRect(size * 0.38, size * 0.38, size * 0.24, size * 0.24);
  } else {
    // Forest pine with glowing golden spiral
    ctx.fillStyle = '#213628';
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = '#9CB764';
    ctx.lineWidth = Math.max(2, size / 20);
    ctx.beginPath();
    for (let theta = 0; theta < 6 * Math.PI; theta += 0.1) {
      const r = (theta / (6 * Math.PI)) * (size * 0.45);
      const x = size / 2 + r * Math.cos(theta);
      const y = size / 2 + r * Math.sin(theta);
      if (theta === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}

export default function Step16MyImageMyMatrix({ onSelectStep }) {
  // Resolution choices: 10, 20, 50, 100
  const [resolution, setResolution] = useState(50);

  // Active Image Preset or Custom Upload
  const [activePreset, setActivePreset] = useState('flower');
  const [customImageDataUrl, setCustomImageDataUrl] = useState(null);

  // Second image for addition/subtraction
  const [secondPreset, setSecondPreset] = useState('city');
  const [customSecondImageUrl, setCustomSecondImageUrl] = useState(null);

  // Active operation:
  // 'scalar' | 'addition' | 'subtraction' | 'rotation' | 'scaling' | 'reflection' | 'shearing' | 'inverse'
  const [operation, setOperation] = useState('scalar');

  // Parameters
  const [scalarK, setScalarK] = useState(1.4); // Brightness factor k
  const [addWeight, setAddWeight] = useState(0.5); // α for addition
  const [rotAngle, setRotAngle] = useState(45); // Degrees for rotation
  const [scaleK, setScaleK] = useState(1.5); // Zoom factor k
  const [shearX, setShearX] = useState(0.3); // Shear X
  const [shearY, setShearY] = useState(0.0); // Shear Y
  const [reflectionAxis, setReflectionAxis] = useState('horizontal'); // 'horizontal' | 'vertical'

  // Inverse stage for Scaling / Rotation roundtrip
  // 'none' | 'transformed' | 'inversed'
  const [inverseStage, setInverseStage] = useState('none');

  // ROI (Region of Interest) inspection: e.g. 5x5 or 10x10 at (roiRow, roiCol)
  const [roiSize, setRoiSize] = useState(5);
  const [roiPos, setRoiPos] = useState({ r: 0, c: 0 });
  const [inspectPixel, setInspectPixel] = useState({ r: 25, c: 25 });
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [matrixModalView, setMatrixModalView] = useState('transformed'); // 'transformed' | 'original' | 'difference' | 'side-by-side'
  const [matrixChannel, setMatrixChannel] = useState('gray'); // 'gray' | 'r' | 'g' | 'b'
  const [roiAnchorMode, setRoiAnchorMode] = useState('center'); // 'center' | 'topleft'

  // Dynamic Region of Interest coordinates
  const effectiveRoiR = useMemo(() => {
    if (roiAnchorMode === 'topleft') return 0;
    return Math.max(0, Math.min(resolution - roiSize, inspectPixel.r - Math.floor(roiSize / 2)));
  }, [roiAnchorMode, resolution, roiSize, inspectPixel.r]);

  const effectiveRoiC = useMemo(() => {
    if (roiAnchorMode === 'topleft') return 0;
    return Math.max(0, Math.min(resolution - roiSize, inspectPixel.c - Math.floor(roiSize / 2)));
  }, [roiAnchorMode, resolution, roiSize, inspectPixel.c]);

  // Helper to extract numeric pixel channel value from RGBA typed array
  const getCellValue = useCallback((buffer, r, c, ch) => {
    if (!buffer) return 0;
    const clampedR = Math.min(resolution - 1, Math.max(0, r));
    const clampedC = Math.min(resolution - 1, Math.max(0, c));
    const idx = (clampedR * resolution + clampedC) * 4;
    const red = buffer[idx] ?? 0;
    const grn = buffer[idx + 1] ?? 0;
    const blu = buffer[idx + 2] ?? 0;

    if (ch === 'r') return red;
    if (ch === 'g') return grn;
    if (ch === 'b') return blu;
    // Grayscale luminance (Rec. 601)
    return Math.round(0.299 * red + 0.587 * grn + 0.114 * blu);
  }, [resolution]);

  // Render bracketed matrix grid for given pixel buffer
  const renderMatrixGrid = (bufferOrDiffType, label, isDiff = false) => {
    const isTen = roiSize === 10;
    const cellSize = isTen ? '34px' : '44px';
    const cellFontSize = isTen ? '0.66rem' : '0.78rem';
    const posFontSize = isTen ? '0.50rem' : '0.60rem';

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
        {label && (
          <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent-primary, #697951)', fontFamily: 'var(--font-mono)' }}>
            {label}
          </span>
        )}
        <div className="step16-matrix-bracket-wrap">
          <div className="step16-bracket-l" />
          <div
            style={{
              display: 'grid',
              gap: '4px',
              gridTemplateColumns: `repeat(${roiSize}, ${cellSize})`
            }}
          >
            {Array.from({ length: roiSize }).map((_, r) =>
              Array.from({ length: roiSize }).map((_, c) => {
                const targetR = Math.min(resolution - 1, effectiveRoiR + r);
                const targetC = Math.min(resolution - 1, effectiveRoiC + c);
                let val = 0;
                if (isDiff) {
                  const tV = getCellValue(transPixelData, targetR, targetC, matrixChannel);
                  const oV = getCellValue(origPixelData, targetR, targetC, matrixChannel);
                  val = Math.abs(tV - oV);
                } else {
                  val = getCellValue(bufferOrDiffType, targetR, targetC, matrixChannel);
                }
                const isSelected = targetR === inspectPixel.r && targetC === inspectPixel.c;

                return (
                  <div
                    key={`cell-${r}-${c}`}
                    className="step16-roi-cell"
                    onClick={() => setInspectPixel({ r: targetR, c: targetC })}
                    title={`Coordinate (${targetR}, ${targetC}) - Value: ${val}. Click to inspect.`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      cursor: 'pointer',
                      borderColor: isSelected ? 'var(--accent-primary, #697951)' : undefined,
                      boxShadow: isSelected ? '0 0 0 2px var(--accent-primary, #697951)' : undefined,
                      background: isSelected ? 'var(--accent-subtle, rgba(105, 121, 81, 0.18))' : undefined
                    }}
                  >
                    <span
                      className="step16-roi-val"
                      style={{
                        fontSize: cellFontSize,
                        color: isSelected ? 'var(--accent-primary, #697951)' : undefined
                      }}
                    >
                      {val}
                    </span>
                    <span
                      className="step16-roi-pos"
                      style={{ fontSize: posFontSize }}
                    >
                      {targetR},{targetC}
                    </span>
                  </div>
                );
              })
            )}
          </div>
          <div className="step16-bracket-r" />
        </div>
      </div>
    );
  };

  // Prediction-based learning state
  const [userPrediction, setUserPrediction] = useState('');
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  // Camera capture modal state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // File upload input ref
  const fileInputRef = useRef(null);

  // Canvases
  const origCanvasRef = useRef(null);
  const transCanvasRef = useRef(null);
  const secondCanvasRef = useRef(null);

  // Raw pixel arrays for matrix inspection
  const [origPixelData, setOrigPixelData] = useState(null);
  const [transPixelData, setTransPixelData] = useState(null);

  // Start Camera
  const handleStartCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 400, height: 400 } });
      cameraStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Camera access denied or unavailable. Using sample presets instead.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const handleStopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Snap Photo from Camera
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = 200;
    snapCanvas.height = 200;
    const ctx = snapCanvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, 200, 200);
    setCustomImageDataUrl(snapCanvas.toDataURL('image/png'));
    setActivePreset('custom');
    handleStopCamera();
  };

  // Handle Upload Image 1
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImageDataUrl(event.target.result);
      setActivePreset('custom');
    };
    reader.readAsDataURL(file);
  };

  // Compute Transformation & Draw on Transformed Canvas
  const applyTransformation = useCallback(() => {
    const origCanvas = origCanvasRef.current;
    const transCanvas = transCanvasRef.current;
    if (!origCanvas || !transCanvas) return;

    transCanvas.width = resolution;
    transCanvas.height = resolution;

    const origCtx = origCanvas.getContext('2d', { willReadFrequently: true });
    const transCtx = transCanvas.getContext('2d', { willReadFrequently: true });

    const origImgData = origCtx.getImageData(0, 0, resolution, resolution);
    const transImgData = transCtx.createImageData(resolution, resolution);

    const src = origImgData.data;
    const dst = transImgData.data;

    // Cache original pixel data for matrix views
    setOrigPixelData(new Uint8ClampedArray(src));

    if (operation === 'scalar') {
      // 1. Scalar multiplication: A' = clamp(k * A)
      for (let i = 0; i < src.length; i += 4) {
        dst[i] = clampPixel(src[i] * scalarK);
        dst[i + 1] = clampPixel(src[i + 1] * scalarK);
        dst[i + 2] = clampPixel(src[i + 2] * scalarK);
        dst[i + 3] = src[i + 3] || 255;
      }
      transCtx.putImageData(transImgData, 0, 0);
    } else if (operation === 'addition' || operation === 'subtraction') {
      // 2. Addition (blend) / Subtraction (|A - B|)
      const secondCanvas = secondCanvasRef.current;
      if (!secondCanvas) return;
      const secondCtx = secondCanvas.getContext('2d', { willReadFrequently: true });
      const secondImgData = secondCtx.getImageData(0, 0, resolution, resolution);
      const src2 = secondImgData.data;

      for (let i = 0; i < src.length; i += 4) {
        if (operation === 'addition') {
          dst[i] = clampPixel(addWeight * src[i] + (1 - addWeight) * src2[i]);
          dst[i + 1] = clampPixel(addWeight * src[i + 1] + (1 - addWeight) * src2[i + 1]);
          dst[i + 2] = clampPixel(addWeight * src[i + 2] + (1 - addWeight) * src2[i + 2]);
        } else {
          dst[i] = clampPixel(Math.abs(src[i] - src2[i]));
          dst[i + 1] = clampPixel(Math.abs(src[i + 1] - src2[i + 1]));
          dst[i + 2] = clampPixel(Math.abs(src[i + 2] - src2[i + 2]));
        }
        dst[i + 3] = 255;
      }
      transCtx.putImageData(transImgData, 0, 0);
    } else {
      // 3. Spatial Geometric 2D Coordinate Transformations
      transCtx.save();
      transCtx.clearRect(0, 0, resolution, resolution);

      const cx = resolution / 2;
      const cy = resolution / 2;
      transCtx.translate(cx, cy);

      if (operation === 'rotation') {
        const rad = (rotAngle * Math.PI) / 180;
        transCtx.rotate(rad);
      } else if (operation === 'scaling') {
        const s = inverseStage === 'inversed' ? 1.0 : scaleK;
        transCtx.scale(s, s);
      } else if (operation === 'reflection') {
        if (reflectionAxis === 'horizontal') transCtx.scale(-1, 1);
        else transCtx.scale(1, -1);
      } else if (operation === 'shearing') {
        transCtx.transform(1, shearY, shearX, 1, 0, 0);
      } else if (operation === 'inverse') {
        if (inverseStage === 'transformed') {
          transCtx.scale(scaleK, scaleK);
          transCtx.rotate((rotAngle * Math.PI) / 180);
        } else if (inverseStage === 'inversed') {
          transCtx.scale(scaleK, scaleK);
          transCtx.rotate((rotAngle * Math.PI) / 180);
          transCtx.rotate((-rotAngle * Math.PI) / 180);
          transCtx.scale(1 / scaleK, 1 / scaleK);
        }
      }

      transCtx.translate(-cx, -cy);
      transCtx.drawImage(origCanvas, 0, 0);
      transCtx.restore();
    }

    // Capture transformed pixel buffer for inspector
    const updatedTrans = transCtx.getImageData(0, 0, resolution, resolution);
    setTransPixelData(new Uint8ClampedArray(updatedTrans.data));
  }, [
    resolution,
    operation,
    scalarK,
    addWeight,
    rotAngle,
    scaleK,
    shearX,
    shearY,
    reflectionAxis,
    inverseStage
  ]);

  // Render Base Original Canvas whenever preset/custom/resolution changes
  useEffect(() => {
    const canvas = origCanvasRef.current;
    if (!canvas) return;
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (activePreset === 'custom' && customImageDataUrl) {
      const img = new Image();
      img.onload = () => {
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, resolution, resolution);
        applyTransformation();
      };
      img.src = customImageDataUrl;
    } else {
      drawPresetGraphic(ctx, activePreset, resolution);
      applyTransformation();
    }
  }, [resolution, activePreset, customImageDataUrl, applyTransformation]);

  // Render Second Canvas (always kept ready for matrix addition / subtraction)
  useEffect(() => {
    const canvas = secondCanvasRef.current;
    if (!canvas) return;
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (secondPreset === 'custom' && customSecondImageUrl) {
      const img = new Image();
      img.onload = () => {
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, resolution, resolution);
        applyTransformation();
      };
      img.src = customSecondImageUrl;
    } else {
      drawPresetGraphic(ctx, secondPreset, resolution);
      applyTransformation();
    }
  }, [resolution, secondPreset, customSecondImageUrl, applyTransformation]);

  // Recalculate whenever params change
  useEffect(() => {
    applyTransformation();
  }, [applyTransformation]);

  // Pixel Inspector Info
  const inspectedData = useMemo(() => {
    if (!origPixelData || !transPixelData) return null;
    const { r, c } = inspectPixel;
    if (r >= resolution || c >= resolution) return null;

    const idx = (r * resolution + c) * 4;
    const origR = origPixelData[idx] ?? 0;
    const origG = origPixelData[idx + 1] ?? 0;
    const origB = origPixelData[idx + 2] ?? 0;
    const origGray = Math.round(0.299 * origR + 0.587 * origG + 0.114 * origB);

    const transR = transPixelData[idx] ?? 0;
    const transG = transPixelData[idx + 1] ?? 0;
    const transB = transPixelData[idx + 2] ?? 0;
    const transGray = Math.round(0.299 * transR + 0.587 * transG + 0.114 * transB);

    // Coordinate mapping relative to center
    const x0 = c - resolution / 2;
    const y0 = r - resolution / 2;

    let x1 = x0;
    let y1 = y0;
    let matrix2x2 = [[1, 0], [0, 1]];

    if (operation === 'rotation') {
      const rad = (rotAngle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      matrix2x2 = [[cos.toFixed(2), (-sin).toFixed(2)], [sin.toFixed(2), cos.toFixed(2)]];
      x1 = (cos * x0 - sin * y0).toFixed(1);
      y1 = (sin * x0 + cos * y0).toFixed(1);
    } else if (operation === 'scaling') {
      matrix2x2 = [[scaleK.toFixed(2), 0], [0, scaleK.toFixed(2)]];
      x1 = (x0 * scaleK).toFixed(1);
      y1 = (y0 * scaleK).toFixed(1);
    } else if (operation === 'reflection') {
      if (reflectionAxis === 'horizontal') matrix2x2 = [[-1, 0], [0, 1]];
      else matrix2x2 = [[1, 0], [0, -1]];
      x1 = reflectionAxis === 'horizontal' ? -x0 : x0;
      y1 = reflectionAxis === 'vertical' ? -y0 : y0;
    } else if (operation === 'shearing') {
      matrix2x2 = [[1, shearX.toFixed(2)], [shearY.toFixed(2), 1]];
      x1 = (x0 + shearX * y0).toFixed(1);
      y1 = (shearY * x0 + y0).toFixed(1);
    }

    return {
      r,
      c,
      origR,
      origG,
      origB,
      origGray,
      transR,
      transG,
      transB,
      transGray,
      x0,
      y0,
      x1,
      y1,
      matrix2x2
    };
  }, [inspectPixel, origPixelData, transPixelData, resolution, operation, rotAngle, scaleK, reflectionAxis, shearX, shearY]);

  // Mathematical details of the active operation
  const operationDetails = useMemo(() => {
    switch (operation) {
      case 'scalar':
        return {
          title: 'Scalar Multiplication',
          formulaDisplay: `A' = clamp(${scalarK.toFixed(1)} · A, 0, 255)`,
          type: 'intensity',
          desc: 'Scalar k scales every pixel intensity simultaneously. k > 1 brightens, k < 1 darkens.'
        };
      case 'addition':
        return {
          title: 'Matrix Addition & Blending',
          formulaDisplay: `C = ${addWeight.toFixed(2)}·A + ${(1 - addWeight).toFixed(2)}·B`,
          type: 'intensity',
          desc: 'Element-wise linear convex combination of two image matrices.'
        };
      case 'subtraction':
        return {
          title: 'Matrix Subtraction',
          formulaDisplay: 'D = |A - B| (Absolute Difference)',
          type: 'intensity',
          desc: 'Reveals spatial differences and anomalies between two image matrices.'
        };
      case 'rotation':
        return {
          title: 'Rotation Transformation',
          formulaDisplay: `R(${rotAngle}°) around image center`,
          type: 'spatial',
          desc: 'Orthonormal 2×2 rotation mapping spatial coordinates while preserving lengths and angles.'
        };
      case 'scaling':
        return {
          title: 'Scaling (Zoom)',
          formulaDisplay: `S(${scaleK.toFixed(1)}) = diag(${scaleK.toFixed(1)}, ${scaleK.toFixed(1)})`,
          type: 'spatial',
          desc: 'Stretches or compresses spatial coordinate grid, scaling area by factor k².'
        };
      case 'reflection':
        return {
          title: 'Mirror Reflection',
          formulaDisplay: reflectionAxis === 'horizontal' ? 'Horizontal Flip (x → -x)' : 'Vertical Flip (y → -y)',
          type: 'spatial',
          desc: 'Isometry with determinant -1, inverting orientation across symmetry axis.'
        };
      case 'shearing':
        return {
          title: 'Shear Distortion',
          formulaDisplay: `Shear(sx = ${shearX.toFixed(2)}, sy = ${shearY.toFixed(2)})`,
          type: 'spatial',
          desc: 'Displaces coordinates proportionally to perpendicular distance, creating diagonal tilt.'
        };
      case 'inverse':
        return {
          title: 'Matrix Inverse & Reconstruction',
          formulaDisplay: 'Original → Transformed (T) → Inversed (T⁻¹)',
          type: 'spatial',
          desc: 'Reverses invertible geometric operations; restores original pixel coordinates.'
        };
      default:
        return { title: '', formulaDisplay: '', type: '', desc: '' };
    }
  }, [operation, scalarK, addWeight, rotAngle, scaleK, shearX, shearY, reflectionAxis]);

  // Questions for Prediction-Based Learning
  const predictionQuestions = {
    scalar: [
      'The entire image will scale in brightness and clip toward white (255)',
      'The image will flip upside down',
      'The image will shift towards green hue only'
    ],
    addition: [
      'Both images will linearly blend into a composite exposure',
      'The background will turn pure black',
      'Only high-frequency edges will be preserved'
    ],
    subtraction: [
      'Identical pixel regions will become zero (black); differences will stand out',
      'The image will zoom into the center',
      'Both images will invert into color negatives'
    ],
    rotation: [
      'Pixels will rotate about the center coordinates maintaining circular arcs',
      'Pixels will randomly scramble in place',
      'Overall brightness will increase by 50%'
    ],
    scaling: [
      'The subject will expand outward (zoom in) or shrink inward (zoom out)',
      'Color channels will separate into RGB planes',
      'The image will shear diagonally'
    ],
    reflection: [
      'The image will flip symmetrically across the chosen mirror axis',
      'The image will double in width',
      'Pixels will invert to their negative values'
    ],
    shearing: [
      'Rectangular shapes will tilt into parallelograms along axes',
      'Image area will collapse completely to zero',
      'Colors will invert to grayscale'
    ],
    inverse: [
      'Applying the inverse matrix T⁻¹ will mathematically reconstruct the original image',
      'The image will be permanently lost beyond recovery',
      'All pixels will turn white'
    ]
  };

  // Download Transformed Image as PNG
  const handleDownloadImage = () => {
    const canvas = transCanvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `mathlens-${operation}-res${resolution}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Download HTML Laboratory Experiment Summary Report
  const handleDownloadReport = () => {
    const origCanvas = origCanvasRef.current;
    const transCanvas = transCanvasRef.current;
    if (!origCanvas || !transCanvas) return;

    const origData = origCanvas.toDataURL('image/png');
    const transData = transCanvas.toDataURL('image/png');

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>MathLens Experiment Report - My Image, My Matrix</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #161815; color: #EDEFEA; padding: 2rem; line-height: 1.5; }
    .card { background: #1F231D; border: 1px solid #32382E; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; max-width: 720px; margin-left: auto; margin-right: auto; }
    h1 { color: #8A9A5B; margin-top: 0; font-size: 1.4rem; }
    h2 { color: #D4A359; font-size: 1.15rem; }
    .grid { display: flex; gap: 2rem; align-items: center; justify-content: center; margin: 1.5rem 0; flex-wrap: wrap; }
    .img-box { text-align: center; }
    img { border-radius: 8px; border: 1px solid #454D3F; width: 180px; height: 180px; image-rendering: pixelated; }
    code { background: #141713; padding: 0.2rem 0.5rem; border-radius: 4px; color: #8A9A5B; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <h1>MathLens Laboratory Report</h1>
    <p><strong>Step 16:</strong> My Image, My Matrix • Matrix Operations on Real Images</p>
    <p><strong>Resolution:</strong> ${resolution} × ${resolution} pixels (${resolution * resolution} entries)</p>
    <p><strong>Applied Operation:</strong> ${operationDetails.title} (<code>${operationDetails.formulaDisplay}</code>)</p>
  </div>
  <div class="card">
    <h2>Experimental Transformation</h2>
    <div class="grid">
      <div class="img-box">
        <p><strong>Original Image A</strong></p>
        <img src="${origData}" alt="Original"/>
      </div>
      <div style="font-size: 1.75rem; color: #8A9A5B;">→</div>
      <div class="img-box">
        <p><strong>Transformed Image A′</strong></p>
        <img src="${transData}" alt="Transformed"/>
      </div>
    </div>
    <p><strong>Mathematical Description:</strong> ${operationDetails.desc}</p>
    <p style="font-size: 0.8rem; color: #9AA392; margin-top: 1.5rem;">
      Generated by MathLens Interactive Laboratory on ${new Date().toLocaleDateString()}
    </p>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.download = `mathlens-experiment-report-${operation}.html`;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <motion.div
      className="step-module visual-lens-my-image-module"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Hidden offscreen canvas for secondary blending operand */}
      <canvas ref={secondCanvasRef} width={resolution} height={resolution} style={{ display: 'none' }} />

      {/* STEP HEADER */}
      <div className="step-header-box mb-4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <h2 className="step-heading" style={{ margin: 0 }}>
            My Image, My Matrix
          </h2>
          <span className="badge-tag-mini">
            Digital Images as 2D Arrays &amp; Spatial Tensors
          </span>
        </div>

        <p className="step-description">
          Upload a photograph or snap a picture to explore how real-world images are stored as numerical matrices. Examine resolution and pixelation, and apply scalar multiplication, matrix addition, subtraction, and 2D geometric transformations interactively.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* CARD 1: IMAGE SOURCE & RESOLUTION */}
        <div className="step16-card">
          <div className="step16-card-header">
            <div className="step16-card-title">
              <Upload size={15} style={{ color: 'var(--accent-primary, #697951)' }} />
              <span>1. Image Source &amp; Resolution</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="icon-action-btn"
                style={{ padding: '0.28rem 0.6rem', fontSize: '0.76rem' }}
                title="Upload image from device"
              >
                <Upload size={13} />
                <span>Upload Image</span>
              </button>
              <button
                type="button"
                onClick={handleStartCamera}
                className="icon-action-btn"
                style={{ padding: '0.28rem 0.6rem', fontSize: '0.76rem' }}
                title="Capture live webcam photo"
              >
                <Camera size={13} />
                <span>Use Camera</span>
              </button>
            </div>
          </div>

          <div className="step16-controls-duo">
            {/* Presets */}
            <div className="step16-control-section">
              <span className="step16-section-label">Sample Presets</span>
              <div className="step16-pills-row">
                {SAMPLE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePreset(p.id);
                      setCustomImageDataUrl(null);
                    }}
                    className={`step16-pill-btn ${activePreset === p.id && !customImageDataUrl ? 'active' : ''}`}
                  >
                    {p.name}
                  </button>
                ))}
                {customImageDataUrl && (
                  <span className="step16-pill-btn active">
                    Custom Photo
                  </span>
                )}
              </div>
            </div>

            {/* Resolution */}
            <div className="step16-control-section">
              <span className="step16-section-label">Grid Resolution</span>
              <div className="step16-pills-row">
                {[10, 20, 50, 100].map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`step16-pill-btn ${resolution === res ? 'active' : ''}`}
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {res} × {res}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: MATRIX OPERATION SELECTOR */}
        <div className="step16-card">
          <div className="step16-card-header">
            <div className="step16-card-title">
              <Sliders size={15} style={{ color: 'var(--accent-primary, #697951)' }} />
              <span>2. Select Matrix Operation</span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {operationDetails.type === 'intensity' ? 'Pixel Intensity Arithmetic' : '2D Spatial Coordinate Mapping'}
            </span>
          </div>

          <div className="step16-ops-grid">
            {[
              { id: 'scalar', label: 'Scalar Mult', icon: Sun },
              { id: 'addition', label: 'Addition', icon: Plus },
              { id: 'subtraction', label: 'Subtraction', icon: Minus },
              { id: 'rotation', label: 'Rotation', icon: RotateCw },
              { id: 'scaling', label: 'Scaling', icon: ZoomIn },
              { id: 'reflection', label: 'Reflection', icon: FlipHorizontal },
              { id: 'shearing', label: 'Shearing', icon: Scissors },
              { id: 'inverse', label: 'Matrix Inverse', icon: Undo2 }
            ].map((op) => {
              const Icon = op.icon;
              const isActive = operation === op.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => {
                    setOperation(op.id);
                    setPredictionSubmitted(false);
                    setUserPrediction('');
                  }}
                  className={`step16-op-btn ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} className="step16-op-icon" />
                  <span className="step16-op-label">{op.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CARD 3: PREDICTION-BASED HYPOTHESIS */}
        <div className="step16-prediction-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <HelpCircle size={15} style={{ color: 'var(--accent-primary, #697951)' }} />
            <span style={{ fontSize: '0.80rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Prediction Hypothesis: What do you expect will happen when this transformation matrix is applied?
            </span>
          </div>

          <div className="step16-prediction-options">
            {predictionQuestions[operation]?.map((choice, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUserPrediction(choice);
                  setPredictionSubmitted(true);
                }}
                className={`step16-prediction-btn ${userPrediction === choice ? 'active' : ''}`}
              >
                {choice}
              </button>
            ))}
          </div>

          {predictionSubmitted && (
            <div className="step16-prediction-reveal">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <CheckCircle2 size={15} style={{ color: 'var(--accent-primary, #697951)', flexShrink: 0 }} />
                <span>
                  <strong>Mathematical Principle:</strong> {operationDetails.desc}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary, #697951)' }}>
                {operationDetails.formulaDisplay}
              </span>
            </div>
          )}
        </div>

        {/* 3-PANEL INTERACTIVE WORKBENCH: ORIGINAL -> CONTROLS -> TRANSFORMED */}
        <div className="step16-workbench-grid">
          {/* PANEL 1: ORIGINAL IMAGE */}
          <div className="step16-panel">
            <div className="step16-card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                1. Original Image A
              </span>
              <span className="badge-tag-mini" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                {resolution} × {resolution}
              </span>
            </div>

            <div className="step16-canvas-container">
              <div className="step16-canvas-frame">
                <canvas
                  ref={origCanvasRef}
                  style={{
                    width: '200px',
                    height: '200px',
                    imageRendering: resolution <= 20 ? 'pixelated' : 'auto',
                    cursor: 'crosshair'
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.floor(((e.clientX - rect.left) / rect.width) * resolution);
                    const y = Math.floor(((e.clientY - rect.top) / rect.height) * resolution);
                    setInspectPixel({ r: Math.min(resolution - 1, y), c: Math.min(resolution - 1, x) });
                  }}
                />
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Click any pixel to inspect numerical matrix values.
            </div>

            <button
              type="button"
              onClick={() => {
                setMatrixModalView('original');
                setShowMatrixModal(true);
              }}
              className="icon-action-btn"
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.74rem',
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.4rem'
              }}
              title="Open numerical inspection for Original Matrix A"
            >
              <Grid size={13} />
              <span>View Matrix A (Original)</span>
            </button>
          </div>

          {/* PANEL 2: OPERATION PARAMETERS & CONTROLS */}
          <div className="step16-panel">
            <div className="step16-card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                2. Transformation Controls
              </span>
              <span className="badge-tag-mini" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                Active
              </span>
            </div>

            {/* Formula Banner */}
            <div className="step16-formula-banner">
              {operationDetails.formulaDisplay}
            </div>

            {/* Dynamic Parameter Controls */}
            <div className="step16-params-box">
              {operation === 'scalar' && (
                <div className="step16-slider-row">
                  <div className="step16-slider-header">
                    <span>Scalar Multiplier (k):</span>
                    <span className="step16-slider-val">{scalarK.toFixed(1)}×</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={scalarK}
                    onChange={(e) => setScalarK(parseFloat(e.target.value))}
                    className="step16-range-input"
                    style={{ '--slider-pct': `${Math.max(0, Math.min(100, ((scalarK - 0.1) / (3.0 - 0.1)) * 100))}%` }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    <span>0.1 (Darken)</span>
                    <span>1.0 (Identity)</span>
                    <span>3.0 (Brighten)</span>
                  </div>
                </div>
              )}

              {operation === 'addition' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="step16-slider-row">
                    <div className="step16-slider-header">
                      <span>Blending Weight (α):</span>
                      <span className="step16-slider-val">{(addWeight * 100).toFixed(0)}% A</span>
                    </div>
                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={addWeight}
                      onChange={(e) => setAddWeight(parseFloat(e.target.value))}
                      className="step16-range-input"
                      style={{ '--slider-pct': `${Math.max(0, Math.min(100, addWeight * 100))}%` }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.74rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Target Image B:</span>
                    <select
                      value={secondPreset}
                      onChange={(e) => setSecondPreset(e.target.value)}
                      className="icon-action-btn"
                      style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem' }}
                    >
                      {SAMPLE_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {operation === 'subtraction' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Difference Target Image B (|A - B|):
                  </span>
                  <select
                    value={secondPreset}
                    onChange={(e) => setSecondPreset(e.target.value)}
                    className="icon-action-btn"
                    style={{ padding: '0.3rem 0.55rem', fontSize: '0.76rem', width: '100%' }}
                  >
                    {SAMPLE_PRESETS.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {operation === 'rotation' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div className="step16-slider-header">
                    <span>Rotation Angle (θ):</span>
                    <span className="step16-slider-val">{rotAngle}°</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {[30, 45, 90, 180].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotAngle(deg)}
                        className={`step16-pill-btn ${rotAngle === deg ? 'active' : ''}`}
                        style={{ padding: '0.22rem 0.5rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}
                      >
                        {deg}°
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={rotAngle}
                    onChange={(e) => setRotAngle(parseInt(e.target.value, 10))}
                    className="step16-range-input"
                    style={{ '--slider-pct': `${Math.max(0, Math.min(100, ((rotAngle + 180) / 360) * 100))}%` }}
                  />
                </div>
              )}

              {operation === 'scaling' && (
                <div className="step16-slider-row">
                  <div className="step16-slider-header">
                    <span>Scaling Factor (k):</span>
                    <span className="step16-slider-val">{scaleK.toFixed(1)}×</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="2.5"
                    step="0.1"
                    value={scaleK}
                    onChange={(e) => setScaleK(parseFloat(e.target.value))}
                    className="step16-range-input"
                    style={{ '--slider-pct': `${Math.max(0, Math.min(100, ((scaleK - 0.4) / (2.5 - 0.4)) * 100))}%` }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    <span>0.4× (Zoom Out)</span>
                    <span>1.0× (Normal)</span>
                    <span>2.5× (Zoom In)</span>
                  </div>
                </div>
              )}

              {operation === 'reflection' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Reflection Axis:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => setReflectionAxis('horizontal')}
                      className={`step16-pill-btn ${reflectionAxis === 'horizontal' ? 'active' : ''}`}
                      style={{ justifyContent: 'center' }}
                    >
                      Horizontal (x → -x)
                    </button>
                    <button
                      type="button"
                      onClick={() => setReflectionAxis('vertical')}
                      className={`step16-pill-btn ${reflectionAxis === 'vertical' ? 'active' : ''}`}
                      style={{ justifyContent: 'center' }}
                    >
                      Vertical (y → -y)
                    </button>
                  </div>
                </div>
              )}

              {operation === 'shearing' && (
                <div className="step16-slider-row">
                  <div className="step16-slider-header">
                    <span>Shear Factor (sx):</span>
                    <span className="step16-slider-val">{shearX.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-0.8"
                    max="0.8"
                    step="0.05"
                    value={shearX}
                    onChange={(e) => setShearX(parseFloat(e.target.value))}
                    className="step16-range-input"
                    style={{ '--slider-pct': `${Math.max(0, Math.min(100, ((shearX + 0.8) / 1.6) * 100))}%` }}
                  />
                </div>
              )}

              {operation === 'inverse' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Reconstruction Stages:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => setInverseStage('none')}
                      className={`step16-pill-btn ${inverseStage === 'none' ? 'active' : ''}`}
                      style={{ justifyContent: 'center', fontSize: '0.72rem', padding: '0.3rem 0.2rem' }}
                    >
                      1. Original
                    </button>
                    <button
                      type="button"
                      onClick={() => setInverseStage('transformed')}
                      className={`step16-pill-btn ${inverseStage === 'transformed' ? 'active' : ''}`}
                      style={{ justifyContent: 'center', fontSize: '0.72rem', padding: '0.3rem 0.2rem' }}
                    >
                      2. Forward T
                    </button>
                    <button
                      type="button"
                      onClick={() => setInverseStage('inversed')}
                      className={`step16-pill-btn ${inverseStage === 'inversed' ? 'active' : ''}`}
                      style={{ justifyContent: 'center', fontSize: '0.72rem', padding: '0.3rem 0.2rem' }}
                    >
                      3. Apply T⁻¹
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controls Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => {
                  setScalarK(1.0);
                  setRotAngle(0);
                  setScaleK(1.0);
                  setShearX(0);
                  setShearY(0);
                  setInverseStage('none');
                }}
                className="icon-action-btn"
                style={{ padding: '0.28rem 0.6rem', fontSize: '0.76rem' }}
              >
                <RotateCcw size={13} />
                <span>Reset Values</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMatrixModalView('transformed');
                  setShowMatrixModal(true);
                }}
                className="icon-action-btn"
                style={{
                  padding: '0.28rem 0.65rem',
                  fontSize: '0.76rem',
                  borderColor: 'var(--accent-primary, #697951)',
                  color: 'var(--text-primary)'
                }}
                title="Inspect transformed numerical matrix"
              >
                <Grid size={13} style={{ color: 'var(--accent-primary, #697951)' }} />
                <span>View Numerical Matrix (A′)</span>
              </button>
            </div>
          </div>

          {/* PANEL 3: TRANSFORMED IMAGE */}
          <div className="step16-panel">
            <div className="step16-card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                3. Transformed Image A′
              </span>
              <span className="badge-tag-mini" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                {resolution} × {resolution}
              </span>
            </div>

            <div className="step16-canvas-container">
              <div className="step16-canvas-frame">
                <canvas
                  ref={transCanvasRef}
                  style={{
                    width: '200px',
                    height: '200px',
                    imageRendering: resolution <= 20 ? 'pixelated' : 'auto',
                    display: 'block',
                    cursor: 'crosshair'
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = Math.floor(((e.clientX - rect.left) / rect.width) * resolution);
                    const y = Math.floor(((e.clientY - rect.top) / rect.height) * resolution);
                    setInspectPixel({ r: Math.min(resolution - 1, Math.max(0, y)), c: Math.min(resolution - 1, Math.max(0, x)) });
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', width: '100%' }}>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="icon-action-btn"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.76rem', justifyContent: 'center' }}
                title="Download current transformed frame as PNG image"
              >
                <Download size={13} />
                <span>Save PNG</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadReport}
                className="icon-action-btn"
                style={{ padding: '0.35rem 0.5rem', fontSize: '0.76rem', justifyContent: 'center' }}
                title="Export HTML laboratory report with mathematical equations"
              >
                <FileText size={13} />
                <span>Download Report</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setMatrixModalView('transformed');
                setShowMatrixModal(true);
              }}
              className="icon-action-btn"
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.74rem',
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.4rem',
                borderColor: 'var(--accent-primary, #697951)',
                color: 'var(--accent-primary, #697951)'
              }}
              title="Open numerical inspection for Transformed Matrix A′"
            >
              <Grid size={13} />
              <span>View Matrix A′ (Transformed)</span>
            </button>
          </div>
        </div>

        {/* MATHEMATICAL INSPECTOR HUD */}
        {inspectedData && (
          <div className="step16-inspector-card">
            <div className="step16-card-header">
              <div className="step16-card-title">
                <Eye size={15} style={{ color: 'var(--accent-primary, #697951)' }} />
                <span>Mathematical Inspector</span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                Center Coordinates: ({inspectedData.x0}, {inspectedData.y0})
              </span>
            </div>

            <div className="step16-inspector-grid">
              {/* 1. Selected Location */}
              <div className="step16-inspector-cell">
                <span className="step16-inspector-lbl">Pixel Location</span>
                <span className="step16-inspector-val">({inspectedData.r}, {inspectedData.c})</span>
                <span className="step16-inspector-sub">Origin: ({inspectedData.x0}, {inspectedData.y0})</span>
              </div>

              {/* 2. Original Intensities */}
              <div className="step16-inspector-cell">
                <span className="step16-inspector-lbl">Original Pixel</span>
                <span className="step16-inspector-val">RGB({inspectedData.origR}, {inspectedData.origG}, {inspectedData.origB})</span>
                <span className="step16-inspector-sub">Grayscale: {inspectedData.origGray}</span>
              </div>

              {/* 3. Transformed Intensities */}
              <div className="step16-inspector-cell">
                <span className="step16-inspector-lbl">Transformed Pixel</span>
                <span className="step16-inspector-val">RGB({inspectedData.transR}, {inspectedData.transG}, {inspectedData.transB})</span>
                <span className="step16-inspector-sub">Grayscale: {inspectedData.transGray}</span>
              </div>

              {/* 4. Coordinate / Operation Mapping */}
              <div className="step16-inspector-cell">
                <span className="step16-inspector-lbl">Transformation Rule</span>
                {operationDetails.type === 'spatial' ? (
                  <>
                    <span className="step16-inspector-val">
                      [{inspectedData.x0}, {inspectedData.y0}]ᵀ → [{inspectedData.x1}, {inspectedData.y1}]ᵀ
                    </span>
                    <span className="step16-inspector-sub">
                      2×2: [{inspectedData.matrix2x2[0].join(', ')} ; {inspectedData.matrix2x2[1].join(', ')}]
                    </span>
                  </>
                ) : (
                  <>
                    <span className="step16-inspector-val" style={{ fontSize: '0.76rem' }}>
                      {operationDetails.formulaDisplay}
                    </span>
                    <span className="step16-inspector-sub">Pixel Value Modulation</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: FULL NUMERICAL MATRIX VIEW */}
      <AnimatePresence>
        {showMatrixModal && (
          <div
            className="step16-modal-overlay"
            onClick={() => setShowMatrixModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="step16-modal-dialog"
              style={{
                maxWidth: matrixModalView === 'side-by-side' ? '880px' : '620px',
                transition: 'max-width 0.2s ease'
              }}
            >
              <div className="step16-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Digital Image Numerical Matrix
                    </h3>
                    <span
                      className="badge-tag-mini"
                      style={{
                        fontSize: '0.68rem',
                        padding: '0.12rem 0.45rem',
                        color: 'var(--accent-primary, #697951)',
                        borderColor: 'var(--accent-primary, #697951)'
                      }}
                    >
                      {matrixModalView === 'transformed' ? "Transformed (A′)" :
                       matrixModalView === 'original' ? "Original (A)" :
                       matrixModalView === 'difference' ? "Difference (|A′ - A|)" :
                       "Comparison (A ➔ A′)"}
                    </span>
                  </div>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Inspecting {roiSize} × {roiSize} Region [rows {effectiveRoiR}..{Math.min(resolution - 1, effectiveRoiR + roiSize - 1)}, cols {effectiveRoiC}..{Math.min(resolution - 1, effectiveRoiC + roiSize - 1)}] at resolution {resolution} × {resolution}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowMatrixModal(false)}
                  className="icon-action-btn"
                  style={{ padding: '0.3rem' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Matrix Target Selector */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Matrix View:</span>
                <div className="step16-pills-row" style={{ flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setMatrixModalView('transformed')}
                    className={`step16-pill-btn ${matrixModalView === 'transformed' ? 'active' : ''}`}
                    title="View transformed result matrix reflecting active math operation"
                  >
                    Transformed (A′)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatrixModalView('original')}
                    className={`step16-pill-btn ${matrixModalView === 'original' ? 'active' : ''}`}
                    title="View initial original image matrix"
                  >
                    Original (A)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatrixModalView('difference')}
                    className={`step16-pill-btn ${matrixModalView === 'difference' ? 'active' : ''}`}
                    title="View element-wise absolute difference |A′ - A|"
                  >
                    Difference (|A′ - A|)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMatrixModalView('side-by-side')}
                    className={`step16-pill-btn ${matrixModalView === 'side-by-side' ? 'active' : ''}`}
                    title="Compare Original A and Transformed A′ side-by-side"
                  >
                    Side-by-Side (A ➔ A′)
                  </button>
                </div>
              </div>

              {/* Channel & Region Focus Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', padding: '0.1rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Channel:</span>
                  <div className="step16-pills-row">
                    <button
                      type="button"
                      onClick={() => setMatrixChannel('gray')}
                      className={`step16-pill-btn ${matrixChannel === 'gray' ? 'active' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                    >
                      Grayscale
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixChannel('r')}
                      className={`step16-pill-btn ${matrixChannel === 'r' ? 'active' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: matrixChannel === 'r' ? '#EF4444' : undefined }}
                    >
                      Red (R)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixChannel('g')}
                      className={`step16-pill-btn ${matrixChannel === 'g' ? 'active' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: matrixChannel === 'g' ? '#10B981' : undefined }}
                    >
                      Green (G)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatrixChannel('b')}
                      className={`step16-pill-btn ${matrixChannel === 'b' ? 'active' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem', color: matrixChannel === 'b' ? '#3B82F6' : undefined }}
                    >
                      Blue (B)
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Focus:</span>
                  <div className="step16-pills-row">
                    <button
                      type="button"
                      onClick={() => setRoiAnchorMode('center')}
                      className={`step16-pill-btn ${roiAnchorMode === 'center' ? 'active' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      title={`Center region around selected pixel (${inspectPixel.r}, ${inspectPixel.c})`}
                    >
                      Selected ({inspectPixel.r}, {inspectPixel.c})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoiAnchorMode('topleft')}
                      className={`step16-pill-btn ${roiAnchorMode === 'topleft' ? 'active' : ''}`}
                      style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                      title="Anchor region to top-left corner (0, 0)"
                    >
                      (0, 0)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Interactive Scalar Multiplier slider inside modal when in scalar mode */}
              {operation === 'scalar' && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '0.45rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      Live Scalar Multiplier (k):
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-primary, #697951)' }}>
                      A′ = clamp({scalarK.toFixed(1)} · A, 0, 255)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3.0"
                    step="0.1"
                    value={scalarK}
                    onChange={(e) => setScalarK(parseFloat(e.target.value))}
                    className="step16-range-input"
                    style={{ '--slider-pct': `${Math.max(0, Math.min(100, ((scalarK - 0.1) / (3.0 - 0.1)) * 100))}%` }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    <span>0.1 (Darken)</span>
                    <span>1.0 (Identity)</span>
                    <span>3.0 (Brighten)</span>
                  </div>
                </div>
              )}

              {/* Bracketed Matrix Display */}
              {origPixelData && transPixelData && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0.4rem 0', overflowX: 'auto', width: '100%' }}>
                  {matrixModalView === 'side-by-side' ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', flexWrap: 'nowrap' }}>
                      {renderMatrixGrid(origPixelData, `Original Matrix A (${matrixChannel.toUpperCase()})`)}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', flexShrink: 0, padding: '0 0.2rem' }}>
                        <ArrowRight size={18} style={{ color: 'var(--accent-primary, #697951)' }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', maxWidth: '90px', textAlign: 'center' }}>
                          {operationDetails.title}
                        </span>
                      </div>
                      {renderMatrixGrid(transPixelData, `Transformed Matrix A′ (${matrixChannel.toUpperCase()})`)}
                    </div>
                  ) : matrixModalView === 'original' ? (
                    renderMatrixGrid(origPixelData, `Original Numerical Matrix A [${matrixChannel.toUpperCase()}]`)
                  ) : matrixModalView === 'difference' ? (
                    renderMatrixGrid(null, `Absolute Difference |A′ - A| [${matrixChannel.toUpperCase()}]`, true)
                  ) : (
                    renderMatrixGrid(transPixelData, `Transformed Numerical Matrix A′ [${matrixChannel.toUpperCase()}]`)
                  )}
                </div>
              )}

              {/* Footer controls: Size toggle and Selected pixel legend */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap', paddingTop: '0.35rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', border: '2px solid var(--accent-primary, #697951)', background: 'var(--accent-subtle, rgba(105, 121, 81, 0.2))' }} />
                  <span>Selected pixel ({inspectPixel.r}, {inspectPixel.c}). Click any matrix cell to inspect.</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>Region Size:</span>
                  <div className="step16-pills-row">
                    <button
                      type="button"
                      onClick={() => setRoiSize(5)}
                      className={`step16-pill-btn ${roiSize === 5 ? 'active' : ''}`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      5 × 5
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoiSize(10)}
                      className={`step16-pill-btn ${roiSize === 10 ? 'active' : ''}`}
                      style={{ fontFamily: 'var(--font-mono)' }}
                    >
                      10 × 10
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CAMERA CAPTURE MODAL */}
      <AnimatePresence>
        {isCameraActive && (
          <div
            className="step16-modal-overlay"
            onClick={handleStopCamera}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="step16-modal-dialog"
              style={{ maxWidth: '440px', textAlign: 'center' }}
            >
              <div className="step16-card-header">
                <div className="step16-card-title">
                  <Camera size={15} style={{ color: 'var(--accent-primary, #697951)' }} />
                  <span>Capture Photo for Matrix Lab</span>
                </div>
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="icon-action-btn"
                  style={{ padding: '0.3rem' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="step16-video-wrap">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '240px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="icon-action-btn"
                  style={{
                    padding: '0.45rem 1rem',
                    fontSize: '0.80rem',
                    fontWeight: 700,
                    background: 'var(--accent-primary, #697951)',
                    borderColor: 'var(--accent-primary, #697951)',
                    color: '#FAF9F2'
                  }}
                >
                  <Camera size={15} />
                  <span>Snap Photo</span>
                </button>
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="icon-action-btn"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.80rem' }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STANDARDIZED EDUCATIONAL DOCUMENTATION */}
      <div style={{ marginTop: '1.25rem' }}>
        <ModuleDocumentation stepNumber={16} defaultOpen={false} />
      </div>

      {/* STEP NAVIGATION FOOTER */}
      <StepFooter stepNumber={16} onSelectStep={onSelectStep} />
    </motion.div>
  );
}
