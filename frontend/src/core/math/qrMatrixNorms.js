import QRCode from 'qrcode';
import jsQR from 'jsqr';

// 5x5 Binary Shapes for Step 1
export const SHAPE_PRESETS_5X5 = {
  X: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1]
  ],
  O: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
  ],
  L: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
  ],
  Plus: [
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0]
  ],
  Checker: [
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1]
  ],
  Corner: [
    [1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ],
  Clear: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
};

/**
 * Checks whether a module in a 21x21 (Version 1) QR code belongs to fixed functional patterns
 * (Finder patterns, separators, timing patterns, dark module) vs data payload.
 */
export function isFunctionalModule(row, col, size = 21) {
  // Top-left finder + separator (0 to 8 x 0 to 8)
  if (row <= 8 && col <= 8) return true;
  // Top-right finder + separator (0 to 8 x 12 to 20)
  if (row <= 8 && col >= size - 8) return true;
  // Bottom-left finder + separator (12 to 20 x 0 to 8)
  if (row >= size - 8 && col <= 8) return true;
  // Timing patterns
  if (row === 6 || col === 6) return true;
  // Dark module for Version 1
  if (row === 13 && col === 8) return true;
  return false;
}

/**
 * Generates a standard Version 1 (21x21) QR code matrix for a text string.
 * Returns 2D binary matrix (1 = black, 0 = white).
 */
export function generateQRMatrix(text = 'HELLO', options = {}) {
  const {
    errorCorrectionLevel = 'M',
    maskPattern = 0
  } = options;

  const cleanText = (text && text.trim().length > 0) ? text.trim().toUpperCase() : 'HELLO';

  try {
    const qr = QRCode.create(cleanText, {
      version: 1,
      errorCorrectionLevel,
      maskPattern
    });

    const size = qr.modules.size;
    const matrix = [];
    for (let r = 0; r < size; r++) {
      const row = [];
      for (let c = 0; c < size; c++) {
        row.push(qr.modules.get(r, c) ? 1 : 0);
      }
      matrix.push(row);
    }

    return {
      success: true,
      size,
      matrix,
      text: cleanText,
      errorCorrectionLevel,
      maskPattern,
      version: 1
    };
  } catch (err) {
    console.error('Failed to generate QR Matrix:', err);
    // Fallback: 21x21 empty matrix
    const size = 21;
    const matrix = Array.from({ length: size }, () => Array(size).fill(0));
    return {
      success: false,
      size,
      matrix,
      text: cleanText,
      errorCorrectionLevel,
      maskPattern,
      version: 1,
      error: err.message
    };
  }
}

/**
 * Computes difference matrix D = A - B and entrywise matrix norms L1, L2, Lmax.
 */
export function computeMatrixDiffAndNorms(matrixA, matrixB) {
  if (!matrixA || !matrixB || matrixA.length !== matrixB.length) {
    return {
      diffMatrix: [],
      differingCount: 0,
      totalCount: 0,
      diffPercentage: 0,
      l1: 0,
      l2: 0,
      lMax: 0,
      diffCoords: []
    };
  }

  const rows = matrixA.length;
  const cols = matrixA[0].length;
  const diffMatrix = [];
  const diffCoords = [];
  let sumAbs = 0;
  let sumSq = 0;
  let maxAbs = 0;

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const a = matrixA[r][c] || 0;
      const b = matrixB[r][c] || 0;
      const d = a - b; // in {-1, 0, 1}
      row.push(d);

      const absD = Math.abs(d);
      if (absD !== 0) {
        sumAbs += absD;
        sumSq += d * d;
        if (absD > maxAbs) maxAbs = absD;
        diffCoords.push({ row: r, col: c, a, b, diff: d });
      }
    }
    diffMatrix.push(row);
  }

  const totalCount = rows * cols;
  const differingCount = sumAbs;
  const diffPercentage = totalCount > 0 ? (differingCount / totalCount) * 100 : 0;
  const l1 = sumAbs;
  const l2 = Math.sqrt(sumSq);
  const lMax = maxAbs;

  return {
    diffMatrix,
    differingCount,
    totalCount,
    diffPercentage,
    l1,
    l2,
    lMax,
    diffCoords
  };
}

/**
 * Tests readability / decodability of a QR matrix using jsQR.
 * Renders the binary matrix onto a synthetic RGBA image buffer with a standard quiet zone (4 modules).
 */
export function checkQRReadability(matrix) {
  if (!matrix || matrix.length === 0) {
    return { readable: false, decodedText: null, error: 'Empty matrix' };
  }

  try {
    const size = matrix.length;
    const scale = 8;
    const quiet = 4; // Standard 4-module quiet zone
    const totalModules = size + quiet * 2;
    const width = totalModules * scale;
    const height = width;
    const imgData = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const mx = Math.floor(x / scale) - quiet;
        const my = Math.floor(y / scale) - quiet;
        const isDark = (mx >= 0 && mx < size && my >= 0 && my < size) ? matrix[my][mx] === 1 : false;
        const color = isDark ? 0 : 255;
        const idx = (y * width + x) * 4;
        imgData[idx] = color;     // R
        imgData[idx + 1] = color; // G
        imgData[idx + 2] = color; // B
        imgData[idx + 3] = 255;   // A
      }
    }

    const code = jsQR(imgData, width, height, { inversionAttempts: 'dontInvert' });

    if (code && code.data) {
      return {
        readable: true,
        decodedText: code.data,
        error: null
      };
    } else {
      return {
        readable: false,
        decodedText: null,
        error: 'Could not decode QR data (corrupted or unreadable)'
      };
    }
  } catch (err) {
    return {
      readable: false,
      decodedText: null,
      error: err.message
    };
  }
}
