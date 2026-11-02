/**
 * QR Decomposition & Gram-Schmidt Orthogonalization Utilities
 * Supports:
 * - 2D & 3D Vector Orthogonality, Dot Products, and Angles
 * - Vector Projections: proj_a(b) and orthogonal complement b_perp
 * - Gram-Schmidt Orthogonalization process (step-by-step)
 * - QR Matrix Factorization: A = Q * R, Q^T * Q = I, R upper-triangular
 * - Grayscale Image Matrix Decomposition & Reconstruction
 */

/**
 * Computes dot product of two vectors of identical length.
 * @param {number[]} u 
 * @param {number[]} v 
 * @returns {number}
 */
export function dot(u, v) {
  let sum = 0;
  for (let i = 0; i < u.length; i++) {
    sum += u[i] * v[i];
  }
  return sum;
}

/**
 * Computes Euclidean norm (L2 norm) of a vector.
 * @param {number[]} v 
 * @returns {number}
 */
export function norm(v) {
  return Math.sqrt(dot(v, v));
}

/**
 * Normalizes a vector to unit length (L2 norm = 1).
 * Returns zero vector if norm is near zero.
 * @param {number[]} v 
 * @param {number} tol 
 * @returns {number[]}
 */
export function normalize(v, tol = 1e-9) {
  const n = norm(v);
  if (n < tol) return v.map(() => 0);
  return v.map(x => x / n);
}

/**
 * Multiplies a vector by a scalar.
 * @param {number[]} v 
 * @param {number} s 
 * @returns {number[]}
 */
export function scale(v, s) {
  return v.map(x => x * s);
}

/**
 * Vector addition: u + v
 * @param {number[]} u 
 * @param {number[]} v 
 * @returns {number[]}
 */
export function add(u, v) {
  return u.map((x, i) => x + v[i]);
}

/**
 * Vector subtraction: u - v
 * @param {number[]} u 
 * @param {number[]} v 
 * @returns {number[]}
 */
export function subtract(u, v) {
  return u.map((x, i) => x - v[i]);
}

/**
 * Computes orthogonal projection of vector b onto vector a:
 * proj_a(b) = ( (a^T * b) / (a^T * a) ) * a
 * @param {number[]} b 
 * @param {number[]} a 
 * @param {number} tol 
 * @returns {number[]}
 */
export function project(b, a, tol = 1e-9) {
  const denom = dot(a, a);
  if (denom < tol) return a.map(() => 0);
  const coeff = dot(a, b) / denom;
  return scale(a, coeff);
}

/**
 * Computes perpendicular component of b with respect to a:
 * b_perp = b - proj_a(b)
 * @param {number[]} b 
 * @param {number[]} a 
 * @returns {number[]}
 */
export function perp(b, a) {
  const p = project(b, a);
  return subtract(b, p);
}

/**
 * Computes angle between two vectors in radians and degrees.
 * @param {number[]} u 
 * @param {number[]} v 
 * @returns {{ rad: number, deg: number, cos: number, isOrthogonal: boolean }}
 */
export function vectorAngle(u, v) {
  const nu = norm(u);
  const nv = norm(v);
  if (nu < 1e-9 || nv < 1e-9) {
    return { rad: 0, deg: 0, cos: 1, isOrthogonal: false };
  }
  const d = dot(u, v);
  let cosVal = d / (nu * nv);
  cosVal = Math.max(-1, Math.min(1, cosVal));
  const rad = Math.acos(cosVal);
  const deg = (rad * 180) / Math.PI;
  const isOrthogonal = Math.abs(d) < 1e-4 || Math.abs(deg - 90) < 0.15;
  return { rad, deg, cos: cosVal, isOrthogonal };
}

/**
 * Performs Gram-Schmidt orthogonalization on an array of column vectors.
 * Returns detailed intermediate steps suitable for step-by-step animation.
 * @param {number[][]} cols - Array of column vectors [a1, a2, ...]
 * @returns {{
 *   originalCols: number[][],
 *   orthogonalCols: number[][],
 *   orthonormalCols: number[][],
 *   projections: { [key: string]: number[] },
 *   norms: number[]
 * }}
 */
export function gramSchmidt(cols) {
  const n = cols.length;
  const uCols = [];
  const qCols = [];
  const projections = {};
  const norms = [];

  for (let i = 0; i < n; i++) {
    const a_i = cols[i];
    let u_i = [...a_i];

    for (let j = 0; j < i; j++) {
      const u_j = uCols[j];
      const p = project(a_i, u_j);
      projections[`${i}_on_${j}`] = p;
      u_i = subtract(u_i, p);
    }

    uCols.push(u_i);
    const uNorm = norm(u_i);
    norms.push(uNorm);
    qCols.push(normalize(u_i));
  }

  return {
    originalCols: cols,
    orthogonalCols: uCols,
    orthonormalCols: qCols,
    projections,
    norms
  };
}

/**
 * Computes QR Decomposition of a square or rectangular matrix A (given as row-major 2D array).
 * A = Q * R, where Q has orthonormal columns and R is upper-triangular.
 * @param {number[][]} A - m x n matrix (rows x cols)
 * @returns {{
 *   Q: number[][],
 *   R: number[][],
 *   reconstruction: number[][],
 *   maxDiff: number,
 *   isOrthonormal: boolean
 * }}
 */
export function qrDecomposition(A) {
  const m = A.length;
  const n = A[0].length;

  // Extract columns of A
  const cols = [];
  for (let c = 0; c < n; c++) {
    const col = [];
    for (let r = 0; r < m; r++) {
      col.push(A[r][c]);
    }
    cols.push(col);
  }

  // Gram-Schmidt on columns
  const { orthonormalCols } = gramSchmidt(cols);

  // Construct Q (m x n) from orthonormal columns
  const Q = Array.from({ length: m }, () => Array(n).fill(0));
  for (let c = 0; c < n; c++) {
    for (let r = 0; r < m; r++) {
      Q[r][c] = orthonormalCols[c][r];
    }
  }

  // Construct R (n x n): R_ij = q_i^T * a_j for i <= j, 0 for i > j
  const R = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      R[i][j] = dot(orthonormalCols[i], cols[j]);
    }
  }

  // Multiply Q * R to reconstruct A
  const reconstruction = Array.from({ length: m }, () => Array(n).fill(0));
  let maxDiff = 0;
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      let sum = 0;
      for (let k = 0; k < n; k++) {
        sum += Q[r][k] * R[k][c];
      }
      reconstruction[r][c] = sum;
      maxDiff = Math.max(maxDiff, Math.abs(sum - A[r][c]));
    }
  }

  // Check Q^T * Q = I
  let isOrthonormal = true;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let qDot = 0;
      for (let k = 0; k < m; k++) {
        qDot += Q[k][i] * Q[k][j];
      }
      const expected = i === j ? 1 : 0;
      if (Math.abs(qDot - expected) > 1e-4) {
        isOrthonormal = false;
      }
    }
  }

  return { Q, R, reconstruction, maxDiff, isOrthonormal };
}

/**
 * Multiply matrix A (m x k) and matrix B (k x n)
 * @param {number[][]} A 
 * @param {number[][]} B 
 * @returns {number[][]}
 */
export function matrixMultiply(A, B) {
  const m = A.length;
  const kLen = A[0].length;
  const n = B[0].length;
  const C = Array.from({ length: m }, () => Array(n).fill(0));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      let sum = 0;
      for (let k = 0; k < kLen; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

/**
 * Presets for 2x2 and 3x3 grayscale image experiments
 */
export const IMAGE_PRESETS_2X2 = [
  {
    id: 'diagonal',
    label: 'Diagonal Ramp',
    description: 'Smooth diagonal gradient from dark to bright',
    matrix: [
      [40, 120],
      [120, 240]
    ]
  },
  {
    id: 'edge',
    label: 'Vertical Edge',
    description: 'Sharp vertical contrast step boundary',
    matrix: [
      [30, 220],
      [30, 220]
    ]
  },
  {
    id: 'checker',
    label: 'Checkerboard',
    description: 'Alternating high and low frequency contrast',
    matrix: [
      [220, 40],
      [40, 220]
    ]
  },
  {
    id: 'soft',
    label: 'Soft Gradient',
    description: 'Balanced subtle intensity variation',
    matrix: [
      [80, 140],
      [110, 180]
    ]
  }
];

export const IMAGE_PRESETS_3X3 = [
  {
    id: 'cross',
    label: 'Center Cross',
    description: 'Bright central cross with dark corners',
    matrix: [
      [40, 220, 40],
      [220, 240, 220],
      [40, 220, 40]
    ]
  },
  {
    id: 'ramp',
    label: '3x3 Diagonal Ramp',
    description: 'Linear 2D illumination ramp',
    matrix: [
      [30, 80, 130],
      [80, 150, 200],
      [130, 200, 250]
    ]
  },
  {
    id: 'spot',
    label: 'Spotlight Focus',
    description: 'High intensity center point decaying outwards',
    matrix: [
      [50, 90, 50],
      [90, 240, 90],
      [50, 90, 50]
    ]
  },
  {
    id: 'horizontal',
    label: 'Horizontal Bands',
    description: 'Layered horizontal stripes with high contrast',
    matrix: [
      [230, 230, 230],
      [40, 40, 40],
      [180, 180, 180]
    ]
  }
];
