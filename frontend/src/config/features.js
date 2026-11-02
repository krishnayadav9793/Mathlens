import {
  Eye,
  Grid,
  Sun,
  Box,
  Layers,
  Sliders,
  Compass,
  Blend,
  Scissors,
  Scan,
  Activity,
  Maximize2,
  Undo2,
  ZoomIn,
  BookOpen,
  Info,
  Sparkles,
  Lock,
  FlaskConical,
  Binary,
  Cpu,
  Variable,
  FunctionSquare,
  Network,
  Zap,
  Split
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'pixel-matrix',
    label: 'Pixel & Matrix Foundations',
    shortLabel: 'Pixels',
    description: 'How digital images, pixel brightness, and RGB colors turn into grids of numbers',
    icon: Grid,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'transformations',
    label: 'Geometric Transformations',
    shortLabel: 'Transforms',
    description: 'Moving, rotating, scaling, shearing, and reflecting image coordinates',
    icon: Compass,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'visual-labs',
    label: 'Visual Experiments',
    shortLabel: 'Visual Labs',
    description: 'Practical experiments in image blending, motion detection, inversion, and determinants',
    icon: Blend,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'ray-optics',
    label: 'Ray Optics',
    shortLabel: 'Optics',
    description: 'Tracing light rays, mirror reflections, and angles with matrix math',
    icon: Zap,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'eigen-spaces',
    label: 'Eigenvalues & Special Directions',
    shortLabel: 'Advanced',
    description: 'Finding invariant directions and natural scaling factors in transformations',
    icon: Variable,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'matrix-rank',
    label: 'Rank of a Matrix & Redundancy',
    shortLabel: 'Matrix Rank',
    description: 'How much independent information do images, force vectors, and sensor signals contain?',
    icon: Binary,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'linear-systems',
    label: 'Systems of Linear Equations (AX = b)',
    shortLabel: 'Linear Systems',
    description: 'Recover hidden images by inverting linear combinations, unmixing layers, and exploring matrix singularity',
    icon: Split,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'vector-norms',
    label: 'Vector Norms & Distance Metrics',
    shortLabel: 'Vector Norms',
    description: 'What is the length of a vector? Unit balls (diamond, circle, square), norm axioms, and image change metrics.',
    icon: Maximize2,
    color: 'var(--accent-primary, #C59B67)'
  },
  {
    id: 'qr-decomposition',
    label: 'QR Decomposition & Orthogonality',
    shortLabel: 'QR Decomp',
    description: 'Perpendicular vectors, orthogonal projections, Gram-Schmidt process, and image factorisation A = QR',
    icon: Compass,
    color: 'var(--accent-primary, #C59B67)'
  }
];

export const FEATURES = [
  // Category 1: Pixel & Matrix (Steps 01 - 06)
  {
    id: 'small-grayscale',
    stepNumber: 1,
    code: '01',
    slug: 'small-grayscale',
    title: 'From Pixels to Matrices',
    shortTitle: 'Small Grayscale',
    category: 'pixel-matrix',
    categoryLabel: 'Pixel & Matrix',
    icon: Eye,
    formula: 'I(x, y) ∈ [0, 255] ⊂ ℤ',
    rawFormula: 'I(x, y) \\in [0, 255] \\subset \\mathbb{Z}',
    summary: 'Convert an image into a numerical matrix. Explore how pixel values form a 2D grid and how individual pixels represent image intensity or colour.',
    concepts: ['Numerical Array', 'Pixel Intensity', '0 = Black', '255 = White'],
    keywords: ['grayscale', 'pixels', 'matrix', 'intensity', 'black', 'white', 'array']
  },
  {
    id: 'cell-editing',
    stepNumber: 2,
    code: '02',
    slug: 'cell-editing',
    title: 'Change Individual Matrix Elements',
    shortTitle: 'Cell Editing',
    category: 'pixel-matrix',
    categoryLabel: 'Pixel & Matrix',
    icon: Grid,
    formula: 'A[i, j] ← v,  v ∈ [0, 255]',
    rawFormula: 'A_{i,j} \\leftarrow v, \\quad v \\in [0, 255]',
    summary: 'Edit individual matrix elements and observe how changing a single value affects the matrix and the resulting image.',
    concepts: ['Real-Time Rendering', 'Array Mutation', 'Interactive State'],
    keywords: ['cell editing', 'modify', 'matrix elements', 'interactive', 'input']
  },
  {
    id: 'scalar-brightness',
    stepNumber: 3,
    code: '03',
    slug: 'scalar-brightness',
    title: 'Scalar Multiplication & Brightness',
    shortTitle: 'Scalar Brightness',
    category: 'pixel-matrix',
    categoryLabel: 'Pixel & Matrix',
    icon: Sun,
    formula: 'A\' = clamp(k · A, 0, 255)',
    rawFormula: "A' = \\min(255, \\max(0, k \\cdot A))",
    summary: 'Multiply pixel intensities by a scalar to brighten or darken an image. Explore how scaling affects pixel values and image appearance.',
    concepts: ['Scalar Multiplication', 'Brightness Scaling', 'Threshold Clamping'],
    keywords: ['scalar', 'brightness', 'multiply', 'darken', 'clipping', 'gain']
  },
  {
    id: 'rgb-pixel',
    stepNumber: 4,
    code: '04',
    slug: 'rgb-pixel',
    title: 'Single RGB Pixel as a 3D Vector',
    shortTitle: 'RGB Pixel',
    category: 'pixel-matrix',
    categoryLabel: 'Pixel & Matrix',
    icon: Box,
    formula: 'p = [R, G, B]ᵀ ∈ ℝ³',
    rawFormula: '\\vec{p} = [R, G, B]^T \\in \\mathbb{R}^3',
    summary: 'Represent an RGB pixel as a three-dimensional vector containing red, green, and blue intensity values. Explore how its components determine colour.',
    concepts: ['3D Vector Space', 'Additive Color Mixing', 'RGB Triplet'],
    keywords: ['rgb', 'color pixel', 'vector', 'red', 'green', 'blue', 'additive']
  },
  {
    id: 'rgb-channels',
    stepNumber: 5,
    code: '05',
    slug: 'rgb-channels',
    title: 'RGB Channel Matrices Decomposition',
    shortTitle: 'RGB Channels',
    category: 'pixel-matrix',
    categoryLabel: 'Pixel & Matrix',
    icon: Layers,
    formula: 'I = {M_R, M_G, M_B} ∈ ℝᴴˣᵂˣ³',
    rawFormula: '\\mathcal{I} = (M_R, M_G, M_B) \\in \\mathbb{R}^{H \\times W \\times 3}',
    summary: 'Decompose a colour image into separate red, green, and blue channel matrices. Inspect each channel and understand how they combine to form the original image.',
    concepts: ['3D Tensor Decomposition', 'Color Planes', 'Image Synthesis'],
    keywords: ['channels', 'rgb matrices', 'planes', 'red matrix', 'green matrix', 'blue matrix']
  },
  {
    id: 'rgb-brightness',
    stepNumber: 6,
    code: '06',
    slug: 'rgb-brightness',
    title: 'Multi-Channel Scalar Operations',
    shortTitle: 'RGB Brightness',
    category: 'pixel-matrix',
    categoryLabel: 'Pixel & Matrix',
    icon: Sliders,
    formula: 'R\' = k_R · R,  G\' = k_G · G,  B\' = k_B · B',
    rawFormula: "R' = k_R R, \\quad G' = k_G G, \\quad B' = k_B B",
    summary: 'Apply scalar multiplication to individual RGB channels or all channels together. Observe how different scaling factors affect the resulting image.',
    concepts: ['Multi-channel Scaling', 'Color Saturation', 'Pipeline Processing'],
    keywords: ['rgb brightness', 'multi channel', 'pipeline', 'color scaling']
  },

  // Category 2: Transformations (Step 07)
  {
    id: '2d-transforms',
    stepNumber: 7,
    code: '07',
    slug: '2d-transforms',
    title: '2D Coordinate Geometric Transformations',
    shortTitle: '2D Transformations',
    category: 'transformations',
    categoryLabel: 'Transformations',
    icon: Compass,
    formula: 'X\' = A · X  (A ∈ ℝ²ˣ²)',
    rawFormula: "X' = A \\cdot X, \\quad \\begin{bmatrix} x' \\\\ y' \\end{bmatrix} = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}",
    summary: 'Explore two-dimensional geometric transformations using matrices, including rotation, scaling, reflection, and shearing.',
    concepts: ['Linear Mapping', 'Coordinate Transformation', 'Rotation & Shear'],
    keywords: ['transforms', '2d matrix', 'rotation', 'shear', 'scale', 'reflection', 'geometry']
  },

  // Category 3: Visual Labs (Steps 08 - 16)
  {
    id: 'matrix-blending',
    stepNumber: 8,
    code: '08',
    slug: 'matrix-blending',
    title: 'Matrix Blending',
    shortTitle: 'Matrix Blending',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Blend,
    formula: 'C = α · A + (1 − α) · B',
    rawFormula: 'C = \\alpha A + (1 - \\alpha) B',
    summary: 'Combine two compatible images or matrices using weighted addition. Explore how the blending factor changes the contribution of each input.',
    concepts: ['Element-wise Addition', 'Alpha Blending', 'Double Exposure', 'Convex Combination'],
    keywords: ['matrix blending', 'addition', 'blend', 'alpha', 'superposition', 'combine']
  },
  {
    id: 'background-detection',
    stepNumber: 9,
    code: '09',
    slug: 'background-detection',
    title: 'Background Detection',
    shortTitle: 'Background Detection',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Scissors,
    formula: 'D = |I − B| > θ',
    rawFormula: 'D = |I - B|',
    summary: 'Compare a video frame with a reference background to identify differences and highlight potentially moving objects. Results depend on the background model and threshold used.',
    concepts: ['Matrix Subtraction', 'Motion Detection', 'Foreground Extraction', 'Delta Segmentation'],
    keywords: ['background detection', 'subtraction', 'motion', 'surveillance', 'foreground', 'delta']
  },
  {
    id: 'change-detection',
    stepNumber: 10,
    code: '10',
    slug: 'change-detection',
    title: 'Change Detection',
    shortTitle: 'Change Detection',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Scan,
    formula: 'D = |A_test − A_ref|',
    rawFormula: 'D = |A_{test} - A_{ref}|',
    summary: 'Compare a test image with a reference image to identify differences. Explore how pixel-wise comparison can reveal changes and manufacturing defects.',
    concepts: ['Anomaly Detection', 'Difference Heatmap', 'Industrial Inspection', 'Tolerancing'],
    keywords: ['change detection', 'defect', 'quality control', 'anomaly', 'difference', 'chip']
  },
  {
    id: 'image-inversion',
    stepNumber: 11,
    code: '11',
    slug: 'image-inversion',
    title: 'Image Inversion',
    shortTitle: 'Image Inversion',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Activity,
    formula: 'A\' = 255 − A',
    rawFormula: "A' = 255 - A",
    summary: 'Invert image intensity values to create a negative image. Explore how pixel values transform and how inversion changes visual contrast.',
    concepts: ['Matrix Negation', 'Complement Arithmetic', 'Medical Radiography', 'Inversion Curve'],
    keywords: ['image inversion', 'negative', 'xray', 'complement', 'contrast', 'invert']
  },
  {
    id: 'determinant-lab',
    stepNumber: 12,
    code: '12',
    slug: 'determinant-lab',
    title: 'Determinant Lab',
    shortTitle: 'Determinant Lab',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Maximize2,
    formula: 'det(A) = ad − bc',
    rawFormula: '\\det(A) = ad - bc',
    summary: 'Explore the determinant of a 2 × 2 matrix and its geometric meaning. Understand how the determinant relates to area scaling, orientation, and invertibility.',
    concepts: ['Area Scaling Factor', 'Orientation Flipping', 'Singularity & Degeneracy', 'Volume Factor'],
    keywords: ['determinant lab', 'area scaling', 'singularity', 'collapse', 'orientation', 'det']
  },
  {
    id: 'matrix-inverse',
    stepNumber: 13,
    code: '13',
    slug: 'matrix-inverse',
    title: 'Matrix Inverse',
    shortTitle: 'Matrix Inverse',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Undo2,
    formula: 'A⁻¹ · A = I,  X = A⁻¹ · X\'',
    rawFormula: 'X = A^{-1} X\', \\quad A \\cdot A^{-1} = I',
    summary: 'Explore how an invertible matrix reverses a linear transformation. Understand why singular matrices do not have an inverse and how invertibility affects reconstruction.',
    concepts: ['Inverse Matrix', 'Identity Preservation', 'Non-Invertibility Condition', 'Linear Reconstruction'],
    keywords: ['matrix inverse', 'undo', 'identity matrix', 'reconstruction', 'invertible', 'solve']
  },
  {
    id: 'zoom-scaling',
    stepNumber: 14,
    code: '14',
    slug: 'zoom-scaling',
    title: 'Zoom & Scaling',
    shortTitle: 'Zoom & Scaling',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: ZoomIn,
    formula: 'S = diag(k, k),  X\' = S · X',
    rawFormula: 'S = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}, \\quad S^{-1} = \\begin{bmatrix} 1/k & 0 \\\\ 0 & 1/k \\end{bmatrix}',
    summary: 'Resize an image using scaling factors. Explore how interpolation, resolution, and sampling affect image quality when enlarging or reducing an image.',
    concepts: ['Scaling Matrix', 'Inverse Zoom', 'Sampling & Interpolation', 'Area Scaling k²'],
    keywords: ['zoom scaling', 'scale', 'resolution', 'pixelation', 'interpolation', 'magnification']
  },
  {
    id: 'matrix-multiplication-shadows',
    stepNumber: 15,
    code: '15',
    slug: 'matrix-multiplication-shadows',
    title: 'Matrix Multiplication & Shadows',
    shortTitle: 'Matrix Mult & Shadows',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Grid,
    formula: 'C = A · B,  c_ij = ∑ a_ik · b_kj',
    rawFormula: 'C = A \\cdot B, \\quad B = A \\odot S \\implies A = B \\oslash S',
    summary: 'Understand matrix multiplication through image composition and related visual examples. Explore row-by-column multiplication and how the operation affects the resulting data.',
    concepts: ['Row-Column Dot Product', 'Non-Commutativity (AB ≠ BA)', 'Display Normalization', 'Hadamard Shadow Matrix S', 'Division Recovery (B ⊘ S)', 'RGB Flower Photograph'],
    keywords: ['matrix multiplication', 'multiply images', 'shadow', 'hadamard', 'flower shadow', 'non-commutative', 'identity matrix', 'remove shadow']
  },
  {
    id: 'my-image-my-matrix',
    stepNumber: 16,
    code: '16',
    slug: 'my-image-my-matrix',
    title: 'My Image, My Matrix',
    shortTitle: 'My Image Matrix',
    category: 'visual-labs',
    categoryLabel: 'Visual Labs',
    icon: Sparkles,
    formula: 'A\' = f(A),  dim(A) = H × W',
    rawFormula: "A' = f(A) \\quad \\text{or} \\quad X' = T \\cdot X",
    summary: 'Upload an image or use your camera to explore its underlying pixel matrix. Inspect colour channels and experiment with supported matrix operations on your own image.',
    concepts: ['User Image / Camera Capture', 'Multi-Resolution Pixelation', 'ROI Pixel Inspector', 'Intensity vs Spatial Transforms', 'Prediction Hypotheses', 'Geometric Inverse Roundtrip', 'Report Export'],
    keywords: ['my image my matrix', 'upload image', 'camera', 'resolution', 'matrix operations', 'pixel inspector', 'predict', 'report download', 'zoom inverse', 'geometric transforms']
  },

  // Category 4: Ray Optics (Step 17)
  {
    id: 'ray-optics',
    stepNumber: 17,
    code: '17',
    slug: 'ray-optics',
    title: 'Exploring Ray Optics Through Matrices',
    shortTitle: 'Ray Optics',
    category: 'ray-optics',
    categoryLabel: 'Ray Optics',
    icon: Zap,
    formula: 'r\' = R · r,  R_x · R_y = −I',
    rawFormula: "d' = R \\cdot d, \\quad R_x = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}",
    summary: 'Explore ray-optics transformations using matrices. Represent optical rays with suitable vectors and investigate how supported optical transformations change their direction and position.',
    concepts: ['Direction Vectors [dx, dy]', 'Plane Mirror Reflection Matrix', 'Law of Reflection (θ_i = θ_r)', 'Involution (R² = I)', 'Rotation Matrix R(θ)', 'Two Successive Reflections (Retroreflector)', 'Commutativity & Matrix Product RxRy = -I'],
    keywords: ['ray optics', 'light rays', 'reflection', 'plane mirror', 'vector', 'rotation matrix', 'corner reflector', 'retroreflector', 'successive reflections', 'matrix multiplication']
  },

  // Category 5: Eigenvalues (Step 18)
  {
    id: 'eigenvalues-eigenvectors',
    stepNumber: 18,
    code: '18',
    slug: 'eigenvalues-eigenvectors',
    title: 'Eigenvalues & Eigenvectors — Finding Special Directions',
    shortTitle: 'Eigenvectors & Values',
    category: 'eigen-spaces',
    categoryLabel: 'Advanced: Eigenvalues',
    icon: Variable,
    formula: 'A · v = λ · v,  det(A − λI) = 0',
    rawFormula: 'A X = \\lambda X, \\quad A = \\begin{bmatrix} \\lambda_x & 0 \\\\ 0 & \\lambda_y \\end{bmatrix}',
    summary: 'Explore eigenvalues and eigenvectors to identify special directions that remain unchanged in direction under a linear transformation. Investigate how eigenvalues describe scaling along those directions.',
    concepts: [
      'Eigenvector Definition (AX = λX)',
      'Special Directions X₁=[1, 0]ᵀ & X₂=[0, 1]ᵀ',
      'Eigenvalues as Scaling Factors',
      'Dynamic Eigenvalue Matrix [λx 0; 0 λy]',
      'Flower Photograph Stretch [2 0; 0 1]',
      'Horizontal Reflection Matrix [-1 0; 0 1]',
      'Line Direction vs Arrow Orientation (Negative λ)'
    ],
    keywords: ['eigenvalues', 'eigenvectors', 'special directions', 'stretch', 'flower image', 'reflection', 'negative eigenvalue', 'subspace', 'collinear']
  },

  // Category 6: Matrix Rank (Step 19)
  {
    id: 'matrix-rank-information',
    stepNumber: 19,
    code: '19',
    slug: 'matrix-rank-information',
    title: 'Rank of a Matrix — Information Redundancy in Images & Physics',
    shortTitle: 'Matrix Rank & Redundancy',
    category: 'matrix-rank',
    categoryLabel: 'Intermediate: Matrix Rank',
    icon: Binary,
    formula: 'rank(M) = dim(col(M)),  C = 2A + B ⟹ rank = 2',
    rawFormula: '\\text{rank}(M) = \\dim(\\text{col}(M)), \\quad C = 2A + B \\implies \\text{rank}([A \\mid B \\mid C]) = \\text{rank}([A \\mid B])',
    summary: 'Discover how much independent information images, force vectors, and multi-sensor signals contain. Explore 2×2 grayscale image redundancy, missing image reconstruction via linear combinations, lighting variations via SVD, 2D force vectors, and experimental sensor signal processing.',
    concepts: [
      'Matrix Rank as Independent Information',
      'Image Redundancy (B = 2A, C = 3A)',
      'Image Collection Matrix M (4×3)',
      'Linear Combinations (C = 2A + B) Preserve Rank',
      'Exact vs Approximate Dependence in Photographs',
      'SVD Singular Value Spectrum (σ₁, σ₂, σ₃)',
      'Multiple Forces & Independent Directions in ℝ²',
      'Multi-Sensor Signal Processing & Sensor Redundancy'
    ],
    keywords: ['matrix rank', 'linear independence', 'redundant images', 'image collection matrix', 'reconstruct missing image', 'linear combination', 'SVD', 'forces', 'collinear', 'sensors', 'signal processing', 'redundancy', 'gaussian elimination']
  },

  // Category 7: Linear Systems (Step 20)
  {
    id: 'linear-systems-unmixing',
    stepNumber: 20,
    code: '20',
    slug: 'linear-systems-unmixing',
    title: 'System of Linear Equations — Recovering Hidden Images (AX = b)',
    shortTitle: 'Hidden Images (AX = b)',
    category: 'linear-systems',
    categoryLabel: 'Core: Linear Systems',
    icon: Split,
    formula: 'AX = B ⟹ X = A⁻¹ B,  B₁ = 0.8X₁ + 0.2X₂',
    rawFormula: 'A X = B \\implies X = A^{-1} B, \\quad \\begin{bmatrix} B_1 \\\\ B_2 \\end{bmatrix} = \\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix} \\begin{bmatrix} X_1 \\\\ X_2 \\end{bmatrix}',
    summary: 'A digital image can be created by combining multiple image layers. If we know how these layers were mixed, can we recover the original images by solving a system of linear equations? Explore forward mixing, matrix inversion X = A⁻¹B, negative coefficient ghost cancellation, and singularity/rank collapse when det(A) = 0.',
    concepts: [
      'Layer Mixing (B₁ = 0.8X₁ + 0.2X₂, B₂ = 0.3X₁ + 0.7X₂)',
      'Matrix Formulation AX = B',
      'Matrix Inversion (X = A⁻¹ B)',
      'Inverse Formula X₁ = 1.4B₁ − 0.4B₂, X₂ = −0.6B₁ + 1.6B₂',
      'Negative Weight Pixel Cancellation',
      'Singular Matrix & Rank Collapse (det(A) = 0)',
      'Identical Blends (B₁ = B₂ = 0.5X₁ + 0.5X₂)',
      'Dual-Energy X-Ray Bone & Soft Tissue Separation',
      'Spectrophotometry Dye Unmixing & CMYK Printing'
    ],
    keywords: ['linear systems', 'AX = b', 'image recovery', 'unmixing', 'layers', 'matrix inversion', 'determinant', 'singular matrix', 'rank collapse', 'circle triangle', 'bone tissue', 'spectrophotometry']
  },

  // Category 8: Vector Norms & Distance Metrics (Step 21)
  {
    id: 'vector-norms-image-distance',
    stepNumber: 21,
    code: '21',
    slug: 'vector-norms-image-distance',
    title: 'Vector Norms — What is Vector Length & Measuring Image Distance',
    shortTitle: 'Vector Norms & Distances',
    category: 'vector-norms',
    categoryLabel: 'Foundations: Vector Norms',
    icon: Maximize2,
    formula: '‖v‖₁ = |x| + |y|,  ‖v‖₂ = √(x² + y²),  ‖v‖_∞ = max(|x|, |y|)',
    rawFormula: '\\|v\\|_1 = |x| + |y|, \\quad \\|v\\|_2 = \\sqrt{x^2 + y^2}, \\quad \\|v\\|_\\infty = \\max(|x|, |y|)',
    summary: 'What does "length" mean for a vector? Explore Euclidean distance, 3 fundamental norm axioms, unit balls (diamond L₁, circle L₂, square L_∞), and discover how different norms distinguish between concentrated and distributed image defects.',
    concepts: [
      'Euclidean Length ||v||₂ = √(x² + y²)',
      'Vector Dragging & Real-Time Metric Coordinates',
      'The 3 Norm Axioms (Positive Definiteness, Homogeneity, Triangle Inequality)',
      'Candidate Norm Counterexamples & Axiom Failures',
      'Unit Balls in ℝ²: Diamond (L₁), Circle (L₂), Square (L_∞)',
      'Geometric Boundary Derivations (|x| + |y| = 1, x² + y² = 1, max(|x|, |y|) = 1)',
      'Image Distance Metrics: 3×3 Pixel Difference Matrix',
      'One Large Error (Dead Pixel) vs Four Small Errors (Blur)',
      'Why L₁ = 80 Can Represent Completely Different Visual Changes'
    ],
    keywords: [
      'vector norms',
      'vector length',
      'euclidean distance',
      'manhattan norm',
      'chebyshev norm',
      'l1 norm',
      'l2 norm',
      'linf norm',
      'unit ball',
      'unit circle',
      'diamond unit ball',
      'square unit ball',
      'triangle inequality',
      'positive definiteness',
      'homogeneity',
      'image difference',
      'pixel error',
      'concentrated vs distributed'
    ]
  },
  // Category 9: QR Decomposition & Orthogonality (Step 22)
  {
    id: 'qr-decomposition-gram-schmidt',
    stepNumber: 22,
    code: '22',
    slug: 'qr-decomposition-gram-schmidt',
    title: 'QR Decomposition — Gram–Schmidt Orthogonalization & Image Reconstruction',
    shortTitle: 'QR Decomposition',
    category: 'qr-decomposition',
    categoryLabel: 'Advanced: Orthogonal Spaces',
    icon: Compass,
    formula: 'A = QR,  Q^T Q = I,  u_k = a_k - \\sum \\text{proj}_{u_j}(a_k)',
    rawFormula: 'A = Q R, \\quad Q^T Q = I, \\quad u_k = a_k - \\sum_{j=1}^{k-1} \\frac{u_j^T a_k}{u_j^T u_j} u_j',
    summary: 'Can we represent an image matrix using perpendicular unit vectors? Explore orthogonal vectors (a · b = 0), vector projections, 2D & 3D Gram-Schmidt process, and factorize image matrices A = QR to reconstruct grayscale pixels.',
    concepts: [
      'Perpendicular Vectors & Dot Product (a · b = 0)',
      'Vector Projection & Perpendicular Complement (b = proj_a b + b_⊥)',
      'Gram–Schmidt Orthogonalization (2D & 3D Interactive Animation)',
      'Normalization to Orthonormal Columns (q_i = u_i / ||u_i||)',
      'Building Q and R Matrices (A = QR)',
      'Orthonormal Matrix Property (Q^T Q = I)',
      'Matrix Multiplication Verification (QR = A)',
      '2×2 & 3×3 Grayscale Image Representation & Reconstruction'
    ],
    keywords: [
      'qr decomposition',
      'gram schmidt',
      'orthogonal vectors',
      'perpendicular',
      'dot product',
      'projection',
      'orthonormal basis',
      'matrix factorization',
      'q matrix',
      'r matrix',
      'image reconstruction',
      'grayscale image matrix'
    ]
  }
];

export const TOTAL_ACTIVE_LABS = FEATURES.length;

export const COMING_SOON_TOPICS = [
    {
    id: 'svd',
    title: 'Singular Value Decomposition (SVD)',
    formula: 'A = U \\Sigma V^T',
    category: 'Low-Rank Approximations',
    description: 'Decompose any image matrix into orthogonal basis vectors for optimal lossy compression.',
    icon: Layers
  },
  {
    id: 'pca',
    title: 'Principal Component Analysis (PCA)',
    formula: '\\text{Cov}(X) = \\frac{1}{N} X^T X',
    category: 'Dimensionality Reduction',
    description: 'Project high-dimensional image manifolds (Eigenfaces) onto dominant variance axes.',
    icon: Sparkles
  },
  {
    id: 'solver',
    title: 'Linear Algebra Solver',
    formula: 'A\\vec{x} = \\vec{b} \\implies \\vec{x} = A^{-1}\\vec{b}',
    category: 'Systems of Equations',
    description: 'Interactive Gaussian elimination and row-reduction visualizer step-by-step.',
    icon: Binary
  },
  {
    id: 'fourier',
    title: '2D Discrete Fourier Transform',
    formula: 'F(u, v) = \\sum_{x} \\sum_{y} f(x, y) e^{-i 2\\pi (ux/M + vy/N)}',
    category: 'Frequency Domain Analysis',
    description: 'Decompose images into spatial sinusoids to filter high-frequency noise and edges.',
    icon: Activity
  },
  {
    id: 'optimization',
    title: 'Matrix Optimization & Gradients',
    formula: '\\nabla f(W) = \\frac{\\partial \\mathcal{L}}{\\partial W}',
    category: 'Calculus on Manifolds',
    description: 'Visualize gradient descent across high-dimensional matrix loss landscapes.',
    icon: FunctionSquare
  },
  {
    id: 'probability',
    title: 'Probability & Covariance Visualizer',
    formula: '\\Sigma = E[(\\vec{X} - \\vec{\\mu})(\\vec{X} - \\vec{\\mu})^T]',
    category: 'Multivariate Statistics',
    description: 'Interactive covariance ellipses and multidimensional Gaussian distributions.',
    icon: Cpu
  },
  {
    id: 'neural',
    title: 'AI Math Tutor & Neural Tensors',
    formula: 'Y = \\text{ReLU}(W X + B)',
    category: 'Deep Learning Tensors',
    description: 'Step inside neural network weight matrices with real-time interactive attention maps.',
    icon: Network
  }
];

export const STATIC_PAGES = [
  { id: 'home', label: 'Home', icon: Sparkles, path: '/' },
  { id: 'learn', label: 'Learn', icon: BookOpen, path: '/learn' },
  { id: 'about', label: 'About', icon: Info, path: '/about' }
];

export function getFeatureById(id) {
  return FEATURES.find(f => f.id === id || f.slug === id) || FEATURES[0];
}

export function getFeatureByStep(stepNum) {
  return FEATURES.find(f => f.stepNumber === stepNum) || FEATURES[0];
}
