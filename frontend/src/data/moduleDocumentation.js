/**
 * MathLens — Comprehensive Module Documentation Data (Modules 01 - 18)
 * 
 * Provides mathematically accurate, beginner-accessible structured documentation
 * for every interactive module in MathLens:
 *  - Concept (What Is This?)
 *  - Why We Need It
 *  - How It Works (Numbered steps)
 *  - Formula & Symbol Definitions
 *  - Worked Numerical Example
 *  - What to Observe
 *  - Real-World Applications
 *  - Key Takeaways
 */

export const MODULE_DOCUMENTATION = {
  1: {
    stepNumber: 1,
    code: '01',
    title: 'From Pixels to Matrices',
    category: 'Pixel & Matrix',
    oneLiner: 'Every digital image is stored as a 2D numerical matrix of pixel light intensities.',
    formula: 'I(x, y) \\in [0, 255] \\subset \\mathbb{Z}',
    formulaDisplay: 'I(x, y) ∈ [0, 255] ⊂ ℤ',
    whatIsThis:
      'Digital images are not continuous paintings; they are discrete 2D rectangular grids of numbers called matrices. In an 8-bit grayscale image, each matrix entry corresponds to a single picture element (pixel). Its integer value represents how much light is emitted or reflected at that exact spatial location.',
    whyNeedIt:
      'Computers and graphic processors cannot manipulate visual feelings or optical waves directly—they only understand numbers. Converting an image into a numerical matrix enables computers to store, analyze, compress, and alter visual information using linear algebra.',
    howItWorks: [
      {
        step: 1,
        title: 'Spatial Discretization',
        description: 'A physical scene is divided into a grid of tiny square picture elements (H rows by W columns).'
      },
      {
        step: 2,
        title: 'Intensity Quantization',
        description: 'The light intensity captured at each grid cell is converted into an 8-bit integer between 0 and 255.'
      },
      {
        step: 3,
        title: 'Matrix Storage',
        description: 'The numbers are stored in row-major order as a 2D array matrix A of size H × W.'
      },
      {
        step: 4,
        title: 'Display Reconstruction',
        description: 'Your screen reads matrix A and illuminates display sub-pixels proportionately to each numerical value.'
      }
    ],
    symbols: [
      { symbol: 'I(x, y)', name: 'Pixel Intensity', meaning: 'The brightness value at column x and row y.' },
      { symbol: '[0, 255]', name: 'Dynamic Range', meaning: 'Standard 8-bit unsigned integer depth (2⁸ = 256 discrete levels).' },
      { symbol: '0', name: 'Black Bound', meaning: 'Total absence of emitted light (pure black).' },
      { symbol: '255', name: 'White Bound', meaning: 'Maximum sensor saturation / full brightness (pure white).' },
      { symbol: 'ℤ', name: 'Integers', meaning: 'The mathematical set of discrete whole numbers.' }
    ],
    workedExample: {
      title: '2×2 Grayscale Image Matrix',
      input: 'A miniature 2×2 grayscale matrix A with four distinct tone values:',
      matrixDisplay: [
        [0, 85],
        [170, 255]
      ],
      calculation:
        'A[0,0] = 0 (Pure Black, 0% light)\nA[0,1] = 85 (Dark Charcoal, 33% light)\nA[1,0] = 170 (Medium Gray, 67% light)\nA[1,1] = 255 (Pure White, 100% light)',
      output: 'The monitor displays four square pixels transitioning smoothly from pitch black to brilliant white.'
    },
    observations: [
      'Hover over any number in the matrix to see the corresponding pixel light up on the digital canvas.',
      'Notice that 0 corresponds to pitch black, 255 corresponds to pure white, and intermediate values form smooth gray steps.',
      'A digital image is strictly a rectangular array of integers.'
    ],
    applications: [
      { name: 'Digital Camera Sensors (CMOS/CCD)', desc: 'Photodiodes collect photons and convert them into 2D voltage matrices.' },
      { name: 'Medical Radiography (DICOM)', desc: 'X-ray and CT scanners record tissue density matrices for diagnostic viewing.' },
      { name: 'Computer Vision & Deep Learning', desc: 'Convolutional neural networks consume images directly as 2D/3D numerical tensors.' }
    ],
    keyTakeaways: [
      'An image is mathematically identical to a 2D numerical matrix.',
      'In standard 8-bit images, intensity ranges from 0 (off / black) to 255 (maximum / white).',
      'All image processing operations (filters, edits, recognition) are linear algebraic computations on matrix elements.'
    ]
  },

  2: {
    stepNumber: 2,
    code: '02',
    title: 'Change Individual Matrix Elements',
    category: 'Pixel & Matrix',
    oneLiner: 'Directly modify matrix values to observe instant real-time changes in the image.',
    formula: 'A[i, j] \\leftarrow v, \\quad v \\in [0, 255]',
    formulaDisplay: 'A[i, j] ← v,  v ∈ [0, 255]',
    whatIsThis:
      'Matrix cell editing demonstrates that an image is mutable computational state. By modifying a single element A[i, j] at row i and column j, the pixel at that exact coordinate immediately updates its brightness on the screen.',
    whyNeedIt:
      'Understanding cell mutation is essential for pixel-level editing, targeted retouching, artifact removal, watermarking, and understanding how memory buffers work in graphics hardware.',
    howItWorks: [
      {
        step: 1,
        title: 'Coordinate Selection',
        description: 'Select row index i and column index j within the bounds 0 ≤ i < H and 0 ≤ j < W.'
      },
      {
        step: 2,
        title: 'Value Validation',
        description: 'Verify that the new value v satisfies the 8-bit constraint: 0 ≤ v ≤ 255.'
      },
      {
        step: 3,
        title: 'Memory Mutation',
        description: 'Update the memory address for matrix element A[i, j] to hold the new integer v.'
      },
      {
        step: 4,
        title: 'Canvas Re-render',
        description: 'The graphics pipeline reads the updated buffer and re-draws the corresponding pixel.'
      }
    ],
    symbols: [
      { symbol: 'A[i, j]', name: 'Matrix Element', meaning: 'Entry at row i and column j in matrix A.' },
      { symbol: '←', name: 'Assignment', meaning: 'Replaces the existing memory value with a new scalar value.' },
      { symbol: 'v', name: 'New Intensity', meaning: 'The new integer brightness level written to the cell.' }
    ],
    workedExample: {
      title: 'Changing the Center Pixel',
      input: 'A 3×3 matrix initialized completely to 0 (all black):',
      matrixDisplay: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      calculation: 'Assign center coordinate A[1, 1] ← 255:\nResulting matrix has A[1, 1] = 255 while all other entries remain 0.',
      output: 'A single brilliant white pixel appears in the dead center of a pitch black canvas.'
    },
    observations: [
      'Type or click any cell to edit its value and watch the canvas respond instantaneously without lag.',
      'Values below 0 or above 255 are automatically clamped to maintain valid 8-bit pixel levels.',
      'Local edits only affect their respective coordinates—surrounding matrix entries stay untouched.'
    ],
    applications: [
      { name: 'Dead Pixel Correction', desc: 'Camera firmware replaces defective sensor pixels by interpolating neighbouring cell values.' },
      { name: 'Pixel Art & Digital Illustration', desc: 'Sprite editors and raster illustration tools mutate individual pixel coordinates.' },
      { name: 'Steganography & Watermarking', desc: 'Encoding secret binary data into the least significant bits of selected image matrix cells.' }
    ],
    keyTakeaways: [
      'Digital images are mutable 2D memory arrays.',
      'Changing one matrix number alters only one pixel on the screen.',
      'Any complex visual filter is simply a series of coordinated matrix element updates.'
    ]
  },

  3: {
    stepNumber: 3,
    code: '03',
    title: 'Scalar Multiplication & Brightness',
    category: 'Pixel & Matrix',
    oneLiner: 'Multiply every matrix element by a single scalar factor to brighten or darken the image.',
    formula: 'A\' = \\text{clamp}(k \\cdot A, 0, 255) = \\min(255, \\max(0, k \\cdot A))',
    formulaDisplay: 'A\' = clamp(k · A, 0, 255)',
    whatIsThis:
      'Scalar multiplication in linear algebra means multiplying every single element in a matrix by a single real number k. In image processing, this operation corresponds exactly to adjusting exposure and brightness: k > 1 brightens the image, 0 < k < 1 darkens it, and k = 0 turns the entire image black.',
    whyNeedIt:
      'Scalar multiplication is the fundamental mathematical tool for adjusting photographic exposure, digital camera ISO sensitivity, display backlighting, and contrast normalization.',
    howItWorks: [
      {
        step: 1,
        title: 'Choose Scalar Factor',
        description: 'Select a scalar multiplier k (e.g. k = 1.5 to brighten by 50%, or k = 0.5 to dim by 50%).'
      },
      {
        step: 2,
        title: 'Element-by-Element Multiplication',
        description: 'Compute a\'_{ij} = k × a_{ij} for every row i and column j across the entire matrix.'
      },
      {
        step: 3,
        title: 'Range Clamping',
        description: 'If a calculated value exceeds 255, clamp it to 255 to prevent integer overflow.'
      },
      {
        step: 4,
        title: 'Display New Image',
        description: 'Render the new matrix A\' with scaled brightness values.'
      }
    ],
    symbols: [
      { symbol: 'k', name: 'Scalar Multiplier', meaning: 'The scaling factor applied uniformly across all elements.' },
      { symbol: 'A', name: 'Original Matrix', meaning: 'The baseline image matrix before brightness adjustment.' },
      { symbol: 'A\'', name: 'Resulting Matrix', meaning: 'The scaled image matrix after scalar multiplication.' },
      { symbol: 'clamp(x, 0, 255)', name: 'Saturation Clamp', meaning: 'Restricts numerical results to valid 8-bit boundaries [0, 255].' }
    ],
    workedExample: {
      title: 'Scaling a 2×2 Matrix by k = 1.5',
      input: 'Matrix A with values [[40, 100], [180, 220]] scaled by k = 1.5:',
      matrixDisplay: [
        [40, 100],
        [180, 220]
      ],
      calculation:
        'A\'[0, 0] = round(1.5 × 40) = 60\n' +
        'A\'[0, 1] = round(1.5 × 100) = 150\n' +
        'A\'[1, 0] = round(1.5 × 180) = 270 → clamp to 255\n' +
        'A\'[1, 1] = round(1.5 × 220) = 330 → clamp to 255',
      output: 'Dark pixels become lighter, while bright pixels saturate cleanly at the maximum 255 boundary.'
    },
    observations: [
      'Dragging the slider k > 1.0 brightens all non-zero pixels proportionally.',
      'Dragging k < 1.0 dims the entire image toward black.',
      'When k = 0, every cell becomes 0 (complete darkness). When k · a_ij > 255, the pixel clamps to 255 (blown-out highlights).'
    ],
    applications: [
      { name: 'Exposure Compensation in Cameras', desc: 'Digital sensor gain adjustment when taking photos in low light.' },
      { name: 'Night-Vision Enhancement', desc: 'Amplifying faint infrared light signals by multiplying pixel matrices by a gain scalar.' },
      { name: 'Display Brightness Sliders', desc: 'Smartphones and monitors adjust brightness via hardware/software scalar scaling.' }
    ],
    keyTakeaways: [
      'Scalar multiplication scales every number in a matrix by the exact same multiplier k.',
      'k > 1 amplifies brightness; 0 < k < 1 diminishes brightness; k = 0 results in total darkness.',
      'Values exceeding 255 must be clamped to avoid integer overflow and highlight distortion.'
    ]
  },

  4: {
    stepNumber: 4,
    code: '04',
    title: 'Single RGB Pixel as a 3D Vector',
    category: 'Pixel & Matrix',
    oneLiner: 'Represent any color pixel as a 3D column vector [R, G, B]ᵀ in Euclidean color space.',
    formula: '\\vec{p} = [R, G, B]^T \\in [0, 255]^3 \\subset \\mathbb{R}^3',
    formulaDisplay: 'p = [R, G, B]ᵀ ∈ ℝ³',
    whatIsThis:
      'Human vision perceives color through three cone photoreceptors sensitive to red, green, and blue light. In computer science and linear algebra, every color pixel is modeled as a 3D vector p = [R, G, B]ᵀ located inside an RGB color cube ranging from [0, 0, 0]ᵀ (Black) to [255, 255, 255]ᵀ (White).',
    whyNeedIt:
      'Treating colors as vectors allows us to use vector addition (additive color mixing), vector distance (perceptual color differences), and dot products (color matching and chroma-keying).',
    howItWorks: [
      {
        step: 1,
        title: 'Decompose Light Channels',
        description: 'Measure the amount of Red, Green, and Blue light present at that point.'
      },
      {
        step: 2,
        title: 'Form Column Vector',
        description: 'Stack the three intensities into a 3×1 column vector p = [R, G, B]ᵀ.'
      },
      {
        step: 3,
        title: 'Position in Color Space',
        description: 'Plot the vector as a point inside the 3D RGB color cube [0, 255]³.'
      },
      {
        step: 4,
        title: 'Additive Synthesis',
        description: 'Physical display pixels turn on red, green, and blue LEDs to synthesize the perceived color.'
      }
    ],
    symbols: [
      { symbol: 'p', name: 'Color Vector', meaning: 'A 3-dimensional column vector representing one pixel\'s color.' },
      { symbol: 'R', name: 'Red Component', meaning: 'Red light intensity scalar ∈ [0, 255].' },
      { symbol: 'G', name: 'Green Component', meaning: 'Green light intensity scalar ∈ [0, 255].' },
      { symbol: 'B', name: 'Blue Component', meaning: 'Blue light intensity scalar ∈ [0, 255].' },
      { symbol: 'ℝ³', name: '3D Vector Space', meaning: 'Three-dimensional real Euclidean vector space.' }
    ],
    workedExample: {
      title: 'Mixing Primary Components to Form Yellow',
      input: 'Setting Red = 255, Green = 255, Blue = 0:',
      matrixDisplay: [
        [255],
        [255],
        [0]
      ],
      calculation:
        'p = 255 · [1, 0, 0]ᵀ (pure red basis) + 255 · [0, 1, 0]ᵀ (pure green basis) + 0 · [0, 0, 1]ᵀ\n' +
        'Vector addition: [255, 0, 0]ᵀ + [0, 255, 0]ᵀ = [255, 255, 0]ᵀ',
      output: 'The human eye perceives the additive combination of full red and full green light as pure vibrant yellow.'
    },
    observations: [
      'When R = G = B, the vector lies along the main diagonal of the color cube, producing pure grayscale tones.',
      '[255, 0, 0]ᵀ is pure red, [0, 255, 0]ᵀ is pure green, and [0, 0, 255]ᵀ is pure blue.',
      'Vector addition of lights is additive: Red + Green = Yellow, Green + Blue = Cyan, Red + Blue = Magenta.'
    ],
    applications: [
      { name: 'Chroma-Key Green Screen Subtraction', desc: 'Isolating studio actors by calculating vector distance from pure green [0, 255, 0]ᵀ.' },
      { name: 'Color Palette Quantization', desc: 'Grouping similar color vectors using k-means clustering in 3D Euclidean space.' },
      { name: 'OLED / Micro-LED Display Engineering', desc: 'Calibrating individual sub-pixel voltage to synthesize target color coordinates.' }
    ],
    keyTakeaways: [
      'A single color pixel is a 3-dimensional vector [R, G, B]ᵀ.',
      'The RGB color model is additive: combining lights increases intensity toward white [255, 255, 255]ᵀ.',
      'Color differences can be computed mathematically using the Euclidean distance between two vectors.'
    ]
  },

  5: {
    stepNumber: 5,
    code: '05',
    title: 'RGB Channel Matrices Decomposition',
    category: 'Pixel & Matrix',
    oneLiner: 'Decompose a full-color image into three independent 2D matrices: Red, Green, and Blue.',
    formula: '\\mathcal{I} = (M_R, M_G, M_B) \\in \\mathbb{R}^{H \\times W \\times 3}',
    formulaDisplay: 'I = {M_R, M_G, M_B} ∈ ℝᴴˣᵂˣ³',
    whatIsThis:
      'While humans see a single unified color photograph, computers store it as a 3D tensor consisting of three separate 2D matrices: M_R (the Red channel), M_G (the Green channel), and M_B (the Blue channel). Each channel matrix is an H × W grayscale array recording the intensity of that specific primary wavelength.',
    whyNeedIt:
      'Separating channels allows algorithms to process colors independently—such as enhancing red contrast in astronomy, reducing blue haze in landscape photography, or compressing green with higher precision because the human eye is most sensitive to green.',
    howItWorks: [
      {
        step: 1,
        title: 'Tensor Slicing',
        description: 'Slice the full 3D tensor I along its color depth dimension into three 2D slices.'
      },
      {
        step: 2,
        title: 'Channel Isolation',
        description: 'M_R isolates red photon counts, M_G isolates green, and M_B isolates blue.'
      },
      {
        step: 3,
        title: 'Independent Processing',
        description: 'Apply linear algebraic operations (filtering, contrast, thresholding) to any channel separately.'
      },
      {
        step: 4,
        title: 'Tensor Stacking',
        description: 'Re-combine the three modified 2D matrices back into an H × W × 3 tensor for display.'
      }
    ],
    symbols: [
      { symbol: 'I', name: 'Color Image Tensor', meaning: '3D numerical array of dimensions Height × Width × 3 Channels.' },
      { symbol: 'M_R', name: 'Red Channel Matrix', meaning: '2D matrix of red light intensities (H × W).' },
      { symbol: 'M_G', name: 'Green Channel Matrix', meaning: '2D matrix of green light intensities (H × W).' },
      { symbol: 'M_B', name: 'Blue Channel Matrix', meaning: '2D matrix of blue light intensities (H × W).' }
    ],
    workedExample: {
      title: 'Decomposing a 2×2 Cyan & Red Image',
      input: 'Top row is pure Cyan [0, 255, 255], Bottom row is pure Red [255, 0, 0]:',
      matrixDisplay: [
        ['Cyan', 'Cyan'],
        ['Red', 'Red']
      ],
      calculation:
        'Red Matrix M_R   = [[0, 0], [255, 255]]\n' +
        'Green Matrix M_G = [[255, 255], [0, 0]]\n' +
        'Blue Matrix M_B  = [[255, 255], [0, 0]]',
      output: 'Viewing M_R shows pure black on top and bright white on bottom, completely decoupling the color bands.'
    },
    observations: [
      'Inspecting any single channel reveals a pure monochrome grayscale image.',
      'A yellow object appears bright in both the Red matrix and the Green matrix, but completely dark in the Blue matrix.',
      'Stacking the three 2D matrices back together reconstructs the original full-color image.'
    ],
    applications: [
      { name: 'JPEG Image Compression', desc: 'Separating brightness from color channels to compress color data more aggressively without visual loss.' },
      { name: 'Satellite Multispectral Remote Sensing', desc: 'Landsat satellites capture Earth in 11 separate wavelength matrices (visible, near-infrared, thermal).' },
      { name: 'CMYK Printing Separation', desc: 'Splitting color files into Cyan, Magenta, Yellow, and Key plates for commercial printing presses.' }
    ],
    keyTakeaways: [
      'A color image is a 3D tensor composed of three 2D matrices (Red, Green, Blue).',
      'Each channel matrix is an independent 2D grayscale array of numbers.',
      'Modern image compression and computer vision process channels independently.'
    ]
  },

  6: {
    stepNumber: 6,
    code: '06',
    title: 'Multi-Channel Scalar Operations',
    category: 'Pixel & Matrix',
    oneLiner: 'Scale individual RGB channels with independent multipliers to perform color grading and white balance.',
    formula: 'R\' = \\text{clamp}(k_R R), \\quad G\' = \\text{clamp}(k_G G), \\quad B\' = \\text{clamp}(k_B B)',
    formulaDisplay: 'R\' = k_R · R,  G\' = k_G · G,  B\' = k_B · B',
    whatIsThis:
      'Rather than multiplying all pixels by the same scalar (which only affects overall brightness), multi-channel scalar operations apply distinct scalar multipliers k_R, k_G, and k_B to the respective Red, Green, and Blue matrices. This transforms the color balance, temperature, and tint of the image.',
    whyNeedIt:
      'Cameras take photos under varied lighting conditions (fluorescent light, tungsten light, sunlight, shade). Multi-channel scaling is the exact mathematical algorithm used to correct color casts (White Balance) and create artistic photographic filters.',
    howItWorks: [
      {
        step: 1,
        title: 'Specify Per-Channel Scalars',
        description: 'Choose scaling factors: k_R for red, k_G for green, and k_B for blue.'
      },
      {
        step: 2,
        title: 'Parallel Matrix Scaling',
        description: 'Multiply M_R by k_R, M_G by k_G, and M_B by k_B.'
      },
      {
        step: 3,
        title: 'Independent Clamping',
        description: 'Clamp each channel independently between 0 and 255.'
      },
      {
        step: 4,
        title: 'Recombine Tensors',
        description: 'Merge the transformed matrices back into a composite color image.'
      }
    ],
    symbols: [
      { symbol: 'k_R', name: 'Red Gain', meaning: 'Scalar multiplier applied to the red channel matrix.' },
      { symbol: 'k_G', name: 'Green Gain', meaning: 'Scalar multiplier applied to the green channel matrix.' },
      { symbol: 'k_B', name: 'Blue Gain', meaning: 'Scalar multiplier applied to the blue channel matrix.' }
    ],
    workedExample: {
      title: 'Warm Sunlight Filter (Golden Hour Tint)',
      input: 'Neutral gray pixel p = [100, 100, 100]ᵀ with gains k_R = 1.3, k_G = 1.1, k_B = 0.7:',
      matrixDisplay: [
        [100],
        [100],
        [100]
      ],
      calculation:
        'R\' = round(1.3 × 100) = 130\n' +
        'G\' = round(1.1 × 100) = 110\n' +
        'B\' = round(0.7 × 100) = 70\n' +
        'New pixel vector p\' = [130, 110, 70]ᵀ',
      output: 'The neutral gray pixel transforms into a warm, sunset golden-amber tone.'
    },
    observations: [
      'Boosting k_R while lowering k_B warms the entire image (sunset / candlelight effect).',
      'Boosting k_B while lowering k_R cools the image (twilight / winter effect).',
      'Setting any single scalar to 0 completely extinguishes that primary color across the entire image.'
    ],
    applications: [
      { name: 'Auto White Balance (AWB)', desc: 'Camera image signal processors adjust k_R and k_B so that neutral gray objects appear truly neutral.' },
      { name: 'Cinematic Color Grading (LUTs)', desc: 'Hollywood film colorists apply diagonal gain matrices to establish atmospheric mood.' },
      { name: 'Night Shift & Blue Light Filters', desc: 'Smartphones decrease k_B at night to reduce eye strain and melatonin disruption.' }
    ],
    keyTakeaways: [
      'Independent scalar multiplication across channels controls color tint and balance.',
      'Warm tones boost red/green while reducing blue; cool tones boost blue while attenuating red.',
      'Auto white balance is simply automated diagonal matrix scaling on image channels.'
    ]
  },

  7: {
    stepNumber: 7,
    code: '07',
    title: '2D Coordinate Geometric Transformations',
    category: 'Transformations',
    oneLiner: 'Transform pixel 2D coordinates using 2×2 linear matrices: rotation, scaling, reflection, and shear.',
    formula: '\\begin{bmatrix} x\' \\\\ y\' \\end{bmatrix} = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix}',
    formulaDisplay: 'X\' = A · X  (A ∈ ℝ²ˣ²)',
    whatIsThis:
      'Geometric image transformations manipulate where pixels are located in space rather than altering their intensity. By multiplying every coordinate vector [x, y]ᵀ by a 2×2 transformation matrix A = [[a, b], [c, d]], we can rotate, stretch, compress, reflect, and shear the entire image on the 2D Cartesian plane.',
    whyNeedIt:
      'Computer graphics, autonomous vehicle vision systems, and aerial map alignments constantly need to rotate, reorient, and rectify camera perspectives using 2×2 and 3×3 transformation matrices.',
    howItWorks: [
      {
        step: 1,
        title: 'Extract Coordinate Vector',
        description: 'Represent each pixel location as a 2D column vector X = [x, y]ᵀ.'
      },
      {
        step: 2,
        title: 'Construct Matrix A',
        description: 'Choose matrix coefficients for the desired geometry (e.g. rotation matrix R(θ) = [[cos θ, -sin θ], [sin θ, cos θ]]).'
      },
      {
        step: 3,
        title: 'Matrix-Vector Product',
        description: 'Compute x\' = a·x + b·y and y\' = c·x + d·y.'
      },
      {
        step: 4,
        title: 'Resample Image Canvas',
        description: 'Place pixel colors at the calculated transformed coordinates [x\', y\']ᵀ.'
      }
    ],
    symbols: [
      { symbol: '[x, y]ᵀ', name: 'Input Coordinates', meaning: 'The original pixel coordinate vector.' },
      { symbol: '[x\', y\']ᵀ', name: 'Output Coordinates', meaning: 'The mapped coordinate vector after transformation.' },
      { symbol: 'A', name: 'Transformation Matrix', meaning: 'A 2×2 real matrix defining the linear spatial mapping.' }
    ],
    workedExample: {
      title: 'Rotating Point [2, 0]ᵀ by 90° Counter-Clockwise',
      input: 'Point X = [2, 0]ᵀ transformed by rotation matrix R(90°) = [[0, -1], [1, 0]]:',
      matrixDisplay: [
        [0, -1],
        [1, 0]
      ],
      calculation:
        'x\' = (0 × 2) + (-1 × 0) = 0\n' +
        'y\' = (1 × 2) + (0 × 0) = 2\n' +
        'New coordinates: X\' = [0, 2]ᵀ',
      output: 'The point along the positive horizontal axis rotates cleanly onto the positive vertical axis.'
    },
    observations: [
      'The origin [0, 0]ᵀ is always an invariant fixed point under any linear transformation.',
      'Parallel lines remain parallel after any linear transformation.',
      'Shearing shifts horizontal rows proportionally to their vertical distance, tilting square grids into parallelograms.'
    ],
    applications: [
      { name: 'Autonomous Driving Lane Detection', desc: 'Inverse perspective mapping transforms dashboard camera view into a bird’s-eye road view.' },
      { name: 'Video Stabilization & Gimbal Tracking', desc: 'Applying compensatory rotation and translation matrices to eliminate hand shake in video.' },
      { name: 'Augmented Reality (AR)', desc: 'Mapping virtual 3D models onto detected planar surfaces using homography matrices.' }
    ],
    keyTakeaways: [
      'A 2×2 matrix maps 2D coordinates to new 2D coordinates via linear multiplication.',
      'Specific matrices encode rotation, scaling, reflection, and shearing.',
      'All 2D linear transformations preserve straight lines and keep the origin stationary.'
    ]
  },

  8: {
    stepNumber: 8,
    code: '08',
    title: 'Matrix Blending',
    category: 'Visual Labs',
    oneLiner: 'Blend two image matrices using convex combination: C = αA + (1 − α)B.',
    formula: 'C = \\alpha A + (1 - \\alpha) B, \\quad \\alpha \\in [0, 1]',
    formulaDisplay: 'C = α · A + (1 − α) · B',
    whatIsThis:
      'Matrix blending combines two images of identical dimensions into a single composite image using weighted addition. The parameter α (alpha) controls the contribution of each image: when α = 1, only image A is visible; when α = 0, only image B is visible; when α = 0.5, both images contribute equally.',
    whyNeedIt:
      'Direct matrix addition (C = A + B) frequently produces pixel sums exceeding 255, resulting in severe highlight blowout. Convex combination guarantees that the blended result always stays strictly within the valid [0, 255] range without overflow.',
    howItWorks: [
      {
        step: 1,
        title: 'Ensure Dimension Match',
        description: 'Verify both matrices A and B have identical height H and width W.'
      },
      {
        step: 2,
        title: 'Choose Blending Factor',
        description: 'Select weight α between 0.0 and 1.0 (e.g. α = 0.7 gives 70% A and 30% B).'
      },
      {
        step: 3,
        title: 'Element-wise Convex Addition',
        description: 'Compute c_{ij} = α · a_{ij} + (1 - α) · b_{ij} for all rows i and columns j.'
      },
      {
        step: 4,
        title: 'Render Composite Image',
        description: 'Display the resulting matrix C smoothly without clamping artifacts.'
      }
    ],
    symbols: [
      { symbol: 'A', name: 'Image Matrix A', meaning: 'Primary input image matrix.' },
      { symbol: 'B', name: 'Image Matrix B', meaning: 'Secondary input image matrix.' },
      { symbol: 'α (alpha)', name: 'Blending Factor', meaning: 'Scalar weighting factor ∈ [0, 1].' },
      { symbol: 'C', name: 'Blended Matrix', meaning: 'The resulting composite image matrix.' }
    ],
    workedExample: {
      title: 'Blending Two Corresponding Pixels with α = 0.6',
      input: 'Pixel from Image A: a = 200; Pixel from Image B: b = 50. Alpha weight α = 0.6:',
      matrixDisplay: [
        [200, 50]
      ],
      calculation:
        'c = α · a + (1 - α) · b\n' +
        'c = (0.6 × 200) + (0.4 × 50)\n' +
        'c = 120 + 20 = 140',
      output: 'The resulting pixel intensity is 140, a balanced blend that never exceeds 255.'
    },
    observations: [
      'Dragging α from 0 to 1 produces a seamless cross-dissolve transition from image B to image A.',
      'Because α + (1 - α) = 1, the blended pixel value is always bounded between min(a, b) and max(a, b).',
      'This operation is mathematically known as a convex linear combination.'
    ],
    applications: [
      { name: 'Video Cross-Fade Transitions', desc: 'Smoothly transitioning between two scenes in video editing suites.' },
      { name: 'UI Transparency & Glassmorphism', desc: 'Compositing semi-transparent overlays on top of desktop backgrounds.' },
      { name: 'HDR Exposure Bracketing', desc: 'Fusing an under-exposed photograph with an over-exposed photograph to preserve full dynamic range.' }
    ],
    keyTakeaways: [
      'Convex matrix blending prevents numerical overflow by ensuring weights sum to 1.',
      'Alpha parameter α smoothly interpolates between two visual states.',
      'Every digital dissolve and translucent UI layer relies on this exact equation.'
    ]
  },

  9: {
    stepNumber: 9,
    code: '09',
    title: 'Background Detection',
    category: 'Visual Labs',
    oneLiner: 'Subtract an empty background from a video frame to isolate moving objects.',
    formula: 'D = |I - B| > T, \\quad F = M \\odot I',
    formulaDisplay: 'D = |I − B| > T,  F = M ⊙ I',
    whatIsThis:
      'Background subtraction is the foundation of motion vision. A surveillance camera maintains a reference matrix B of an empty scene. When a person or vehicle moves into view in frame I, subtracting the two image matrices (D = |I − B|) cancels out all static background pixels to near-zero (black), leaving only the altered foreground pixels illuminated.',
    whyNeedIt:
      'Video streams generate gigabytes of data every minute. Background subtraction allows computers to ignore 95% of every video frame, focusing expensive neural networks and trackers strictly on moving foreground objects.',
    subsections: [
      {
        title: 'Matrix Subtraction for Background Cancellation',
        content:
          'When an empty room background matrix B is subtracted from active frame I, identical background pixels cancel to zero: I(x, y) − B(x, y) ≈ 0.\n' +
          'Taking the absolute value D(x, y) = |I(x, y) − B(x, y)| ensures that both darker objects (e.g. black coat against white wall) and brighter objects (e.g. headlights at night) produce positive non-zero difference values.',
        formula: 'D(x, y) = |I(x, y) - B(x, y)|'
      },
      {
        title: 'Sensitivity Thresholding to Suppress Sensor Noise',
        content:
          'Physical camera sensors suffer from subtle thermal noise and illumination flickers (D ≈ 5 to 15) even in a completely static room.\n' +
          'Applying a threshold cutoff T converts raw analog differences into a clean binary segmentation mask M:\n' +
          'M(x, y) = 1 if D(x, y) > T (foreground), and 0 otherwise (background).',
        formula: 'M(x, y) = \\begin{cases} 1 & \\text{if } D(x, y) > T \\\\ 0 & \\text{otherwise} \\end{cases}'
      },
      {
        title: 'Foreground Object Extraction via Hadamard Masking',
        content:
          'Multiplying the original image I by the binary mask M via an element-wise Hadamard product isolates the moving subject in its original colors while completely erasing the background:\n' +
          'F(x, y) = M(x, y) × I(x, y).',
        formula: 'F = M \\odot I'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Save Background (B)',
        description: 'Take a picture of the empty room as your baseline reference matrix.'
      },
      {
        step: 2,
        title: 'Capture Active Frame (I)',
        description: 'Capture a new picture when an object moves into the field of view.'
      },
      {
        step: 3,
        title: 'Subtract Pixels (D)',
        description: 'Calculate absolute matrix difference: D = |I − B|.'
      },
      {
        step: 4,
        title: 'Threshold & Segment (M)',
        description: 'If D > T, flag as foreground mask (1); multiply F = M ⊙ I to isolate the subject.'
      }
    ],
    symbols: [
      { symbol: 'I', name: 'Active Frame Matrix', meaning: 'The live image containing the moving object.' },
      { symbol: 'B', name: 'Background Matrix', meaning: 'The baseline reference image of the empty scene.' },
      { symbol: 'D', name: 'Difference Matrix', meaning: 'Pixel-wise absolute delta: |I − B|.' },
      { symbol: 'T', name: 'Detection Threshold', meaning: 'Minimum intensity delta required to trigger motion classification.' },
      { symbol: 'M', name: 'Binary Segmentation Mask', meaning: 'Boolean matrix where 1 = Foreground, 0 = Background.' },
      { symbol: 'F', name: 'Segmented Foreground', meaning: 'Extracted object image: F = M ⊙ I.' }
    ],
    additionalFormulas: [
      { label: 'Difference Matrix', formula: 'D = |I - B|', desc: 'Element-wise absolute intensity difference.' },
      { label: 'Binary Thresholding', formula: 'M(x, y) = \\mathbb{I}(D(x, y) > T)', desc: 'Indicator function creating binary motion mask.' },
      { label: 'Foreground Isolation', formula: 'F = M \\odot I', desc: 'Hadamard product masking background to black.' }
    ],
    workedExample: {
      title: 'Checking One Pixel for Motion',
      input: 'Empty wall pixel B = 60. Person enters wearing a bright jacket I = 210. Threshold T = 25:',
      matrixDisplay: [
        [60, 210]
      ],
      calculation:
        'Difference D = |210 - 60| = 150\n' +
        'Compare against threshold: 150 > 25 (True)\n' +
        'Mask result: M = 1 (Motion detected at this pixel!)\n' +
        'Segmented value: F = 1 × 210 = 210 (Jacket preserved in full brightness)',
      output: 'The system highlights this pixel as part of the moving person.'
    },
    observations: [
      'Areas of the room that did not change cancel out to 0 (pure black).',
      'The threshold filters out subtle lighting flickers and camera sensor noise.',
      'The absolute value | | ensures both dark objects and light objects get detected.',
      'Setting threshold T too low introduces salt-and-pepper noise; setting T too high creates holes in the moving object.'
    ],
    applications: [
      { name: 'Security & Intrusion Surveillance', desc: 'Triggering alarms and video recording only when unauthorized motion enters a monitored zone.' },
      { name: 'Smart Traffic Flow Monitoring', desc: 'Counting vehicles and estimating highway congestion speeds using overhead cameras.' },
      { name: 'Video Conferencing Background Blur', desc: 'Segmenting the speaker’s silhouette in real time to apply virtual background blurs.' }
    ],
    keyTakeaways: [
      'Subtracting two images reveals only what changed.',
      'Unchanged areas cancel out to zero.',
      'Thresholding removes sensor noise to create a clean binary motion map.',
      'The binary mask isolates moving subjects via element-wise multiplication F = M ⊙ I.'
    ]
  },

  10: {
    stepNumber: 10,
    code: '10',
    title: 'Change Detection',
    category: 'Visual Labs',
    oneLiner: 'Compare two photos of the same scene to spot what was added, removed, or moved.',
    formula: 'D = |A - B| > T',
    formulaDisplay: 'D = |A − B| > T',
    whatIsThis:
      'Change detection compares two photographs of the same scene captured at different times (Time 1 vs Time 2). Unchanged structures cancel out to zero, while any object that was added, removed, or displaced produces a non-zero difference matrix D = |A − B|.',
    whyNeedIt:
      'Human visual inspection struggles with subtle changes across complex visual scenes, such as a missing microscopic resistor on a circuit board or structural crack growth on a bridge. Matrix differencing spots alterations in milliseconds.',
    subsections: [
      {
        title: 'Differential Image Analysis & Matrix Subtraction',
        content:
          'Given baseline matrix A and inspection matrix B, subtraction identifies every spatial pixel location where scene reflectance altered:\n' +
          'D(x, y) = |A(x, y) − B(x, y)|.\n' +
          'When an object is moved from position P₁ to position P₂, change detection produces two distinct difference clusters: a negative void at P₁ (where the object was taken) and a positive delta at P₂ (where the object was placed).',
        formula: 'D = |A - B|'
      },
      {
        title: 'Sensitivity Threshold Parameter Tuning',
        content:
          'Natural changes in ambient sunlight, cloud cover, and sensor exposure cause global baseline shifts across all pixels.\n' +
          'By tuning threshold parameter T, users separate minor atmospheric noise from genuine structural deviations.',
        formula: 'M(x, y) = 1 \\iff D(x, y) > T'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Reference Photo (A)',
        description: 'Capture the original baseline picture of the scene before any changes.'
      },
      {
        step: 2,
        title: 'Inspection Photo (B)',
        description: 'Capture a second picture after alterations occur.'
      },
      {
        step: 3,
        title: 'Matrix Difference (D)',
        description: 'Compute absolute difference: D = |A − B|.'
      },
      {
        step: 4,
        title: 'Threshold Flagging (M)',
        description: 'Highlight pixels exceeding sensitivity threshold T as verified alterations.'
      }
    ],
    symbols: [
      { symbol: 'A', name: 'Reference Matrix', meaning: 'Original photograph taken at time t₁.' },
      { symbol: 'B', name: 'Inspection Matrix', meaning: 'Second photograph taken at time t₂.' },
      { symbol: 'D', name: 'Difference Matrix', meaning: 'Absolute pixel change: |A − B|.' },
      { symbol: 'T', name: 'Sensitivity Threshold', meaning: 'Cutoff below which differences are attributed to lighting noise.' }
    ],
    additionalFormulas: [
      { label: 'Differential Change Map', formula: 'D = |A - B|', desc: 'Absolute pixel difference between two scenes.' },
      { label: 'Thresholded Change Flag', formula: 'M(x, y) = (D(x, y) > T)', desc: 'Boolean map highlighting confirmed physical alterations.' }
    ],
    workedExample: {
      title: 'Spotting a Missing Object',
      input: 'Photo 1 has a key on the desk (pixel = 230). Photo 2 has the key removed (desk pixel = 50). Threshold T = 30:',
      matrixDisplay: [
        [230, 50]
      ],
      calculation:
        'Difference D = |230 - 50| = 180\n' +
        'Check against threshold: 180 > 30 (True)\n' +
        'Result: An altered area is flagged at this pixel coordinate.',
      output: 'The system highlights the spot where the key was picked up.'
    },
    observations: [
      'Areas that stayed the same turn black (0 difference).',
      'When an object moves, it creates two spots: where it was taken from, and where it was placed.',
      'A good threshold prevents minor room lighting changes from looking like real alterations.'
    ],
    applications: [
      { name: 'Factory Quality Control', desc: 'Checking manufactured circuit boards to catch missing components.' },
      { name: 'Satellite Monitoring', desc: 'Tracking changes like deforestation or new construction over time.' },
      { name: 'Security Monitoring', desc: 'Detecting when an unattended bag is left in an airport hallway.' }
    ],
    keyTakeaways: [
      'Matrix subtraction highlights differences instantly.',
      'Identical regions cancel out to zero.',
      'Thresholding separates real physical changes from lighting fluctuations.'
    ]
  },

  11: {
    stepNumber: 11,
    code: '11',
    title: 'Image Inversion',
    category: 'Visual Labs',
    oneLiner: 'Flip dark and light pixel values using complement math: A′ = 255 − A.',
    formula: 'A\' = 255 - A, \\quad A\'\' = 255 - (255 - A) = A',
    formulaDisplay: 'A\' = 255 − A,  A\'\' = A',
    whatIsThis:
      'Image inversion converts an image into its photographic negative by subtracting each pixel intensity from the maximum 8-bit dynamic range ceiling (255). Pure black (0) flips to pure white (255), pure white (255) flips to pure black (0), and midtone gray (128) maps to 127.',
    whyNeedIt:
      'Human visual perception detects subtle low-contrast edges and fine structural lines more reliably when dark shadows are transformed into bright highlights against dark backdrops. Medical radiography (X-ray scans), astronomy, and document restoration rely heavily on negative image representations.',
    subsections: [
      {
        title: 'Complementary Dynamic Range Inversion',
        content:
          'In standard 8-bit digital imaging, intensities are bounded in [0, 255].\n' +
          'Inversion computes the algebraic complement of each pixel:\n' +
          'A′(x, y) = 255 − A(x, y).\n' +
          'Because the sum of any pixel and its inverted counterpart always equals 255 (A + A′ = 255), total dynamic range energy is symmetrically conserved across the grayscale spectrum.',
        formula: 'A\'(x, y) = 255 - A(x, y) \\iff A(x, y) + A\'(x, y) = 255'
      },
      {
        title: 'Medical Radiography & X-Ray Absorption Physics',
        content:
          'Medical X-ray film measures tissue density. Dense calcium in bones absorbs X-ray photons, casting an optical shadow that leaves underlying film crystals unexposed (dark in standard development).\n' +
          'Inverting the radiograph flips bone shadows into brilliant white structures, allowing radiologists to inspect hairline fractures with maximum visual clarity.',
        formula: '\\text{Bone Shadow } (0 \\le A \\le 30) \\implies \\text{Inverted Highlight } (225 \\le A\' \\le 255)'
      },
      {
        title: 'The Involution Property: Perfect Lossless Reversibility',
        content:
          'Like matrix inverse A⁻¹(Ax) = x and mirror reflection R² = I, photographic inversion is a mathematical involution:\n' +
          'A′′ = 255 − (255 − A) = 255 − 255 + A = A.\n' +
          'Applying inversion twice returns the original image with zero numerical loss.',
        formula: 'A\'\' = 255 - (255 - A) = A'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Read Pixel Intensity',
        description: 'Read the discrete 8-bit integer A(x, y) ∈ [0, 255].'
      },
      {
        step: 2,
        title: 'Subtract from 255',
        description: 'Calculate complementary intensity: A′(x, y) = 255 − A(x, y).'
      },
      {
        step: 3,
        title: 'Global Array Transformation',
        description: 'Execute the subtraction across all H × W matrix cells.'
      },
      {
        step: 4,
        title: 'Render Negative Canvas',
        description: 'Display inverted highlights and shadows.'
      }
    ],
    symbols: [
      { symbol: 'A', name: 'Original Pixel Intensity', meaning: 'Input brightness value between 0 (black) and 255 (white).' },
      { symbol: '255', name: 'Dynamic Range Ceiling', meaning: 'Upper bound of 8-bit unsigned integer depth (2⁸ − 1).' },
      { symbol: 'A\'', name: 'Inverted Pixel', meaning: 'Complementary brightness value: 255 − A.' },
      { symbol: 'k', name: 'Blend Factor', meaning: 'Continuous slider blending from original (k = 0) to full negative (k = 1).' }
    ],
    additionalFormulas: [
      { label: 'Negative Transformation', formula: 'A\' = 255 - A', desc: 'Direct 8-bit complementary intensity inversion.' },
      { label: 'Involution Identity', formula: '255 - (255 - A) = A', desc: 'Inverting twice returns the original image losslessly.' },
      { label: 'Inversion Blend Interpolation', formula: 'A\'_k = (1 - k)A + k(255 - A)', desc: 'Smooth transition from positive to negative photograph.' }
    ],
    workedExample: {
      title: 'Inverting Light and Dark Pixels',
      input: 'A dark shadow pixel (A = 25) and a bright highlight pixel (A = 235):',
      matrixDisplay: [
        [25, 235]
      ],
      calculation:
        'Dark pixel: 255 - 25 = 230 (becomes a bright highlight)\n' +
        'Bright pixel: 255 - 235 = 20 (becomes a dark shadow)\n' +
        'Midtone pixel: 255 - 128 = 127 (barely changes)',
      output: 'The brightness scale is completely reversed.'
    },
    observations: [
      'Inverting twice returns the exact original picture: 255 - (255 - A) = A.',
      'The sum of any original pixel and its inverted partner always equals 255.',
      'Midtone gray (128) is right at the center, so it barely changes.'
    ],
    applications: [
      { name: 'Medical X-Rays', desc: 'Viewing dense bone details as bright shapes on dark film.' },
      { name: 'Faded Document Recovery', desc: 'Making dark or faded handwriting on old paper easier to read.' },
      { name: 'Photo Film Processing', desc: 'Reversing camera film negatives into normal positive photographs.' }
    ],
    keyTakeaways: [
      'Inversion subtracts each pixel from 255.',
      'Dark becomes light, and light becomes dark.',
      'Doing it twice returns the original image without any loss.'
    ]
  },

  12: {
    stepNumber: 12,
    code: '12',
    title: 'Determinant Lab',
    category: 'Visual Labs',
    oneLiner: 'Understand the determinant of a 2×2 matrix as the geometric area scaling factor.',
    formula: '\\det(A) = ad - bc \\quad \\text{for} \\quad A = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}',
    formulaDisplay: 'det(A) = ad − bc,  Area\' = |det(A)| · Area',
    whatIsThis:
      'The determinant of a 2×2 transformation matrix A = [[a, b], [c, d]] is the scalar quantity det(A) = ad − bc. Geometrically, it measures the exact factor by which any 2D surface area expands or contracts under that linear transformation. The sign of the determinant indicates spatial orientation: positive preserves orientation; negative flips orientation (mirror reflection); zero indicates dimensional collapse onto a 1D line.',
    whyNeedIt:
      'The determinant reveals fundamental geometric capabilities of any linear system: whether space expands or contracts, whether coordinates preserve chiral handedness, and whether the transformation can be reversed (det(A) ≠ 0).',
    subsections: [
      {
        title: 'The 2×2 Determinant Formula: det(A) = ad − bc',
        content:
          'For a matrix A = [[a, b], [c, d]], basis vector î = [1, 0]ᵀ maps to [a, c]ᵀ and ĵ = [0, 1]ᵀ maps to [b, d]ᵀ.\n' +
          'The determinant calculates the cross-difference of main and off-diagonals:\n' +
          'det(A) = (a × d) − (b × c).',
        formula: '\\det(A) = ad - bc'
      },
      {
        title: 'Geometric Area Scaling Factor',
        content:
          'Any geometric shape in the 2D plane (a polygon, circle, or digital photograph) with initial area S transforms into a shape with area S′ given by:\n' +
          'Area′ = |det(A)| × Area_initial.\n' +
          '• If |det(A)| > 1: The transformation stretches and expands area.\n' +
          '• If |det(A)| < 1: The transformation compresses and minifies area.\n' +
          '• If |det(A)| = 1: Area is perfectly preserved (e.g. pure rotations and shears).',
        formula: '\\text{Area}\' = |\\det(A)| \\cdot \\text{Area}_{\\text{initial}}'
      },
      {
        title: 'Signed Determinants & Orientation Reversal (det < 0)',
        content:
          'When det(A) < 0, the transformation contains a spatial reflection (mirror reversal).\n' +
          'The shape is flipped inside-out, reversing the clockwise vs counter-clockwise orientation of coordinate vertices.',
        formula: '\\det(A) < 0 \\implies \\text{Spatial Reflection (Chiral Reversal)}'
      },
      {
        title: 'Singular Matrices & 1D Dimensional Collapse (det = 0)',
        content:
          'When det(A) = 0, columns [a, c]ᵀ and [b, d]ᵀ are linearly dependent (collinear).\n' +
          'The entire 2D plane collapses into a flat 1D line or point (Rank 1 or 0), causing permanent area loss (Area′ = 0). Such matrices cannot be inverted.',
        formula: '\\det(A) = 0 \\implies \\text{Dimensional Collapse (Non-Invertible)}'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Extract Matrix Entries',
        description: 'Read the four entries of 2×2 matrix A: row 1 is [a, b], row 2 is [c, d].'
      },
      {
        step: 2,
        title: 'Calculate Cross Products',
        description: 'Multiply the main diagonal (a × d) and the off diagonal (b × c).'
      },
      {
        step: 3,
        title: 'Compute Difference',
        description: 'Subtract the off-diagonal product from the main diagonal: det(A) = ad − bc.'
      },
      {
        step: 4,
        title: 'Geometric Interpretation',
        description: 'Area of transformed shape = |det(A)| × original area.'
      }
    ],
    symbols: [
      { symbol: 'A', name: '2×2 Matrix', meaning: 'Linear transformation matrix [[a, b], [c, d]].' },
      { symbol: 'det(A)', name: 'Determinant', meaning: 'Signed area scaling factor ad − bc.' },
      { symbol: '|det(A)|', name: 'Absolute Area Scale', meaning: 'Magnitude of area scaling.' },
      { symbol: 'det(A) = 0', name: 'Singularity', meaning: 'Degenerate transformation that collapses 2D space into a 1D line.' }
    ],
    additionalFormulas: [
      { label: '2×2 Determinant', formula: '\\det(A) = ad - bc', desc: 'Formula for determinant of 2×2 matrix.' },
      { label: 'Area Transformation', formula: '\\text{Area}\' = |\\det(A)| \\cdot \\text{Area}', desc: 'Surface area expands or contracts by |det(A)|.' },
      { label: 'Product Determinant Theorem', formula: '\\det(A \\cdot B) = \\det(A) \\cdot \\det(B)', desc: 'The determinant of a product is the product of determinants.' }
    ],
    workedExample: {
      title: 'Scaling Matrix Area Expansion',
      input: 'Matrix A = [[2, 0], [0, 3]] acting on a unit square of area = 1:',
      matrixDisplay: [
        [2, 0],
        [0, 3]
      ],
      calculation:
        'det(A) = (a × d) - (b × c)\n' +
        'det(A) = (2 × 3) - (0 × 0) = 6 - 0 = 6\n' +
        'Transformed Area = |6| × 1 = 6',
      output: 'The original 1×1 unit square transforms into a 2×3 rectangle with an area of exactly 6 square units.'
    },
    observations: [
      'When det(A) = 1 (pure rotation), area is perfectly conserved.',
      'When det(A) < 0 (reflection), the shape is flipped like a mirror image.',
      'When det(A) = 0, the unit square collapses into a flat 1D line, losing one spatial dimension.'
    ],
    applications: [
      { name: 'Computer Graphics UV Mapping', desc: 'Measuring texture distortion and stretching when wrapping 2D textures onto 3D game models.' },
      { name: 'Robotics Kinematics', desc: 'Checking Jacobian determinants to identify singularities where robot arms lose mobility.' },
      { name: 'Calculus Change of Variables', desc: 'The Jacobian determinant scales the differential area element dx dy during double integrals.' }
    ],
    keyTakeaways: [
      'The determinant det(A) = ad − bc measures the area scaling factor of a 2D transformation.',
      'Negative determinants indicate spatial reflection (mirror reversal of orientation).',
      'det(A) = 0 indicates dimensional collapse; such matrices cannot be inverted.'
    ]
  },

  13: {
    stepNumber: 13,
    code: '13',
    title: 'Matrix Inverse',
    category: 'Visual Labs',
    oneLiner: 'Use the inverse matrix A⁻¹ to reverse transformations and restore original image coordinates.',
    formula: 'A^{-1} A = I \\implies x = A^{-1} x\', \\quad A^{-1} = \\frac{1}{\\det(A)} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}',
    formulaDisplay: 'A⁻¹ · A = I,  x = A⁻¹ · x\'',
    whatIsThis:
      'The inverse of a square matrix A is a unique matrix denoted A⁻¹ that undoes the spatial transformation performed by A. When A maps coordinate vector x to x′ via x′ = Ax, multiplying by A⁻¹ maps x′ right back to original x: x = A⁻¹x′. Multiplying A by A⁻¹ yields the identity matrix I (A⁻¹ · A = I), the matrix equivalent of the scalar number 1. A matrix has an inverse if and only if its determinant is non-zero (det(A) ≠ 0).',
    whyNeedIt:
      'When an image undergoes optical distortion, perspective tilt, camera shake, or coordinate deformation during physical capture or transmission, computing and applying A⁻¹ enables exact geometric reconstruction, returning every pixel and feature to its true original position.',
    subsections: [
      {
        title: 'Determinant & Invertibility Criterion (det(A) ≠ 0)',
        content:
          'A matrix is invertible (non-singular) if and only if its determinant is non-zero: det(A) ≠ 0.\n' +
          '• If det(A) ≠ 0: The matrix performs a bijective (one-to-one and onto) mapping across 2D space. Every input coordinate maps to a distinct output coordinate, preserving full 2D area (Rank 2).\n' +
          '• If det(A) = 0: The matrix is singular. It squashes 2D space onto a 1D line (Rank 1) or a single point (Rank 0). Multiple distinct points collapse onto the same line, resulting in irreversible information loss where no inverse function can exist (division by zero).',
        formula: '\\det(A) = ad - bc \\neq 0 \\implies A^{-1} \\text{ exists}'
      },
      {
        title: 'Adjugate Matrix Construction for 2×2 Matrices',
        content:
          'For any 2×2 matrix A = [[a, b], [c, d]], the inverse is computed algebraically using the adjugate matrix adj(A):\n' +
          '1. Swap the main diagonal entries: a ↔ d.\n' +
          '2. Negate the off-diagonal entries: b ➔ −b and c ➔ −c.\n' +
          '3. Scale every element of the resulting adjugate matrix by 1 / det(A).',
        formula: 'A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}'
      },
      {
        title: 'Bijective Mapping & The Round-Trip Identity',
        content:
          'The round-trip composition of forward matrix A followed by inverse matrix A⁻¹ leaves every coordinate vector unchanged:\n' +
          'x = A⁻¹(Ax) = (A⁻¹A)x = Ix = x.\n' +
          'Likewise, applying the inverse first followed by the forward matrix produces the identity: A(A⁻¹x) = (AA⁻¹)x = Ix = x.',
        formula: 'A^{-1} \\cdot A = A \\cdot A^{-1} = I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Evaluate Determinant',
        description: 'Calculate det(A) = ad − bc. If det(A) = 0, the matrix is singular and cannot be inverted.'
      },
      {
        step: 2,
        title: 'Form Adjugate Matrix',
        description: 'Swap main diagonal entries (a and d) and negate off-diagonal entries (−b and −c).'
      },
      {
        step: 3,
        title: 'Multiply by 1 / det(A)',
        description: 'Multiply every entry of the adjugate matrix by the scalar reciprocal factor 1 / det(A).'
      },
      {
        step: 4,
        title: 'Coordinate Reconstruction',
        description: 'Multiply distorted coordinates x′ by A⁻¹ to restore original coordinates: x = A⁻¹ x′.'
      }
    ],
    symbols: [
      { symbol: 'A', name: 'Forward Matrix', meaning: 'The original 2×2 linear transformation matrix [[a, b], [c, d]].' },
      { symbol: 'A⁻¹', name: 'Inverse Matrix', meaning: 'The unique matrix satisfying A⁻¹ · A = I.' },
      { symbol: 'I', name: 'Identity Matrix', meaning: 'The neutral matrix [[1, 0], [0, 1]] that leaves coordinates unchanged.' },
      { symbol: 'det(A)', name: 'Determinant', meaning: 'Signed area scaling factor ad − bc. Must be non-zero for invertibility.' },
      { symbol: 'adj(A)', name: 'Adjugate Matrix', meaning: 'Matrix formed by swapping diagonal elements and negating off-diagonals.' },
      { symbol: 'x, x\'', name: 'Coordinate Vectors', meaning: 'Original coordinate point x = [x, y]ᵀ and transformed coordinate point x′ = [x′, y′]ᵀ.' }
    ],
    additionalFormulas: [
      { label: 'Round-Trip Identity', formula: 'A^{-1} \\cdot A = I', desc: 'Multiplying a matrix by its inverse yields the 2×2 identity matrix.' },
      { label: 'Coordinate Recovery', formula: 'x = A^{-1} \\cdot x\'', desc: 'Applying A⁻¹ to transformed coordinates restores original positions.' },
      { label: 'Determinant Reciprocal', formula: '\\det(A^{-1}) = \\frac{1}{\\det(A)}', desc: 'The determinant of the inverse matrix is the reciprocal of det(A).' },
      { label: 'Product Inverse Rule', formula: '(AB)^{-1} = B^{-1} A^{-1}', desc: 'The inverse of a matrix product reverses the order of operations.' }
    ],
    workedExample: {
      title: 'Inverting a 2×2 Scaling Matrix',
      input: 'Forward matrix A = [[2, 0], [0, 4]]:',
      matrixDisplay: [
        [2, 0],
        [0, 4]
      ],
      calculation:
        'det(A) = (2 × 4) - (0 × 0) = 8 (Non-zero, so invertible!)\n' +
        'Adjugate = [[4, 0], [0, 2]]\n' +
        'A⁻¹ = (1 / 8) · [[4, 0], [0, 2]] = [[0.5, 0], [0, 0.25]]\n' +
        'Verification: A⁻¹ · A = [[0.5×2, 0], [0, 0.25×4]] = [[1, 0], [0, 1]] = I',
      output: 'Applying A⁻¹ shrinks the enlarged coordinates back to their original size.'
    },
    observations: [
      'Applying A and then A⁻¹ returns all points to their starting coordinates.',
      'If you drag a slider such that det(A) = 0, the inverse matrix ceases to exist (division by zero).',
      'The inverse of a rotation by angle θ is simply a rotation by −θ: R(θ)⁻¹ = R(−θ).',
      'The inverse of a pure shear matrix S(k) = [[1, k], [0, 1]] is S(−k) = [[1, −k], [0, 1]].'
    ],
    applications: [
      { name: 'Camera Lens Distortion Correction', desc: 'Inverting fish-eye and barrel distortion matrices in action cameras and aerial drones.' },
      { name: 'Photogrammetry & 3D Scanning', desc: 'Inverting projection matrices to calculate real-world 3D coordinates from 2D photos.' },
      { name: 'Computer Graphics Undo & Scene Graphs', desc: 'Traversing inverted hierarchical matrices to transform mouse clicks back into model space.' },
      { name: 'Public Key Cryptography', desc: 'Matrix inversion forms the mathematical basis of Hill Cipher encryption and decryption.' }
    ],
    keyTakeaways: [
      'The inverse matrix A⁻¹ completely reverses the effect of transformation matrix A.',
      'A matrix can be inverted if and only if its determinant is non-zero (det(A) ≠ 0).',
      'Multiplying a matrix by its inverse always produces the Identity Matrix I: A⁻¹ · A = I.',
      'Singular matrices (det = 0) collapse dimensions, resulting in permanent information loss that cannot be undone.'
    ]
  },

  14: {
    stepNumber: 14,
    code: '14',
    title: 'Zoom & Matrix Inversion',
    category: 'Visual Labs',
    oneLiner: 'Resize images using diagonal scaling matrices S = diag(k, k) and reverse zoom via S⁻¹ = diag(1/k, 1/k).',
    formula: 'S = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}, \\quad S^{-1} = \\begin{bmatrix} 1/k & 0 \\\\ 0 & 1/k \\end{bmatrix}, \\quad S^{-1} \\cdot S = I',
    formulaDisplay: 'S = diag(k, k),  S⁻¹ = diag(1/k, 1/k),  S⁻¹ · S = I',
    whatIsThis:
      'Camera zoom and image scaling are diagonal linear coordinate transformations governed by the matrix S = [[k, 0], [0, k]]. When scale factor k > 1, coordinates expand away from the origin (magnification/zoom in); when 0 < k < 1, coordinates contract toward the origin (minification/zoom out). Applying the inverse diagonal scaling matrix S⁻¹ = [[1/k, 0], [0, 1/k]] precisely cancels the magnification and restores the initial coordinate scale without distortion.',
    whyNeedIt:
      'Digital displays vary from tiny smartwatches to massive ultra-wide monitors. Understanding scaling matrices is essential for responsive graphics, GPU texture sampling, image resizing, and optical zoom calibration.',
    subsections: [
      {
        title: 'Uniform Scaling Geometry & Diagonal Matrices',
        content:
          'A diagonal scaling matrix S = [[k, 0], [0, k]] acts on any coordinate point [x, y]ᵀ via matrix multiplication:\n' +
          'x′ = k·x and y′ = k·y.\n' +
          'Because both coordinate axes are multiplied by the exact same scalar factor k, the aspect ratio is strictly conserved, angles between vectors remain identical, and shapes expand isotropically without angular shearing.',
        formula: '\\begin{bmatrix} x\' \\\\ y\' \\end{bmatrix} = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix} \\begin{bmatrix} x \\\\ y \\end{bmatrix} = \\begin{bmatrix} k x \\\\ k y \\end{bmatrix}'
      },
      {
        title: 'Area Scaling & The Quadratic Determinant Rule',
        content:
          'While linear dimensions (width and height) grow by factor k, 2D surface area scales quadratically by the determinant:\n' +
          'det(S) = (k)(k) − (0)(0) = k².\n' +
          'For example, a 2× zoom (k = 2) quadruples the image area (4× pixel count), while a 3× zoom yields a 9× area expansion.\n' +
          'Conversely, the inverse scaling matrix has determinant det(S⁻¹) = 1/k², guaranteeing det(S⁻¹) · det(S) = (1/k²) · k² = 1 upon round-trip.',
        formula: '\\det(S) = k^2, \\quad \\det(S^{-1}) = \\frac{1}{k^2}, \\quad \\det(S^{-1}) \\cdot \\det(S) = 1'
      },
      {
        title: 'Digital Resampling & Interpolation Algorithms',
        content:
          'In continuous geometry, scaling is seamless. However, digital images are discrete 2D arrays of pixels. When zooming in (k > 1), new pixels must be synthesized:\n' +
          '• Nearest Neighbor Interpolation: Copies the intensity of the nearest pixel coordinate. Fast and preserves original values, but creates visible blocky pixelation at high zoom.\n' +
          '• Bilinear Interpolation: Computes a weighted average of the 4 surrounding pixels, producing smooth gradients and softening jagged edges.\n' +
          '• Digital Zoom vs Optical Zoom: Digital zoom merely resamples existing discrete pixel data; unlike physical optical lenses, it cannot create new physical optical photons or resolve details below camera sensor resolution.',
        formula: '(x, y) = S^{-1}(x\', y\') = \\left(\\frac{x\'}{k}, \\frac{y\'}{k}\\right)'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Choose Zoom Factor (k)',
        description: 'Set uniform zoom factor k (e.g. k = 2.0 for 2× magnification, k = 0.5 for 50% minification).'
      },
      {
        step: 2,
        title: 'Construct Diagonal Matrix S',
        description: 'Place scale factor k on the main diagonal: S = [[k, 0], [0, k]]. Determinant is det(S) = k².'
      },
      {
        step: 3,
        title: 'Construct Inverse Matrix S⁻¹',
        description: 'Compute reciprocal 1/k for diagonal entries: S⁻¹ = [[1/k, 0], [0, 1/k]]. Determinant is 1/k².'
      },
      {
        step: 4,
        title: 'Reverse Zoom via S⁻¹',
        description: 'Multiply scaled coordinates by S⁻¹ to restore initial 1.00× scale: S⁻¹ · S = I.'
      }
    ],
    symbols: [
      { symbol: 'k', name: 'Zoom Scale Factor', meaning: 'Uniform linear magnification factor along both axes (k > 1 enlarges, k < 1 shrinks).' },
      { symbol: 'S', name: 'Scaling Matrix', meaning: 'Diagonal matrix [[k, 0], [0, k]] that scales coordinates isotropically.' },
      { symbol: 'S⁻¹', name: 'Inverse Zoom Matrix', meaning: 'Diagonal matrix [[1/k, 0], [0, 1/k]] that precisely reverses zoom S.' },
      { symbol: 'det(S) = k²', name: 'Area Scale Factor', meaning: 'The determinant of S; surface area expands quadratically with k².' },
      { symbol: 'I', name: 'Identity Matrix', meaning: 'The 2×2 neutral matrix [[1, 0], [0, 1]] representing 1.00× standard scale.' }
    ],
    additionalFormulas: [
      { label: 'Scaling Matrix', formula: 'S = \\begin{bmatrix} k & 0 \\\\ 0 & k \\end{bmatrix}', desc: 'Diagonal matrix for uniform 2D expansion.' },
      { label: 'Inverse Diagonal Rule', formula: 'S^{-1} = \\begin{bmatrix} 1/k & 0 \\\\ 0 & 1/k \\end{bmatrix}', desc: 'The inverse of a diagonal matrix is formed by taking the reciprocal of diagonal entries.' },
      { label: 'Quadratic Area Scaling', formula: '\\text{Area}\' = k^2 \\cdot \\text{Area}', desc: 'Surface area expands proportionately to the square of linear scale k.' },
      { label: 'Round-Trip Identity', formula: 'S^{-1} \\cdot S = I', desc: 'Restores the original coordinate proportions exactly.' }
    ],
    workedExample: {
      title: '2× Magnification on a 2×2 Image',
      input: 'A 2×2 matrix enlarged by k = 2 produces a 4×4 matrix (4 times the area):',
      matrixDisplay: [
        [100, 200],
        [50, 150]
      ],
      calculation:
        'Original area: 2 × 2 = 4 pixels\n' +
        'Scaled area: (2 × 2) × k² = 4 × 2² = 16 pixels\n' +
        'Each original single pixel expands into a 2×2 block of identical values under nearest neighbor.\n' +
        'Applying S⁻¹ = [[0.5, 0], [0, 0.5]]:\n' +
        'S⁻¹ · S = [[0.5×2, 0], [0, 0.5×2]] = [[1, 0], [0, 1]] = I (Restores 2×2 scale).',
      output: 'The image becomes twice as wide and twice as tall, and is perfectly restored by S⁻¹.'
    },
    observations: [
      'Digital zoom (unlike physical optical lens zoom) cannot create new optical detail; it resamples existing pixels.',
      'Zooming in too far reveals individual square pixel blocks (pixelation).',
      'The total number of pixels in the image scales with the square of the zoom factor (k²).',
      'Because S is diagonal, its inverse S⁻¹ is trivially computed by taking 1/k without cross-multiplication.'
    ],
    applications: [
      { name: 'Smartphone Camera Pinch-to-Zoom', desc: 'Real-time GPU texture scaling with bilinear/bicubic sampling filters.' },
      { name: 'Satellite Imagery Super-Resolution', desc: 'Deep learning neural networks upscaling low-resolution aerial photos.' },
      { name: 'Medical Endoscopy Magnification', desc: 'Surgeons zooming into micro-vascular tissue feeds during laparoscopic surgery.' },
      { name: 'Responsive Web Design', desc: 'SVG vector graphics and CSS transform: scale(k) rendering across high-DPI screens.' }
    ],
    keyTakeaways: [
      'Spatial zooming is governed by a diagonal scaling matrix S = diag(k, k).',
      'Linear dimensions scale by k, but image surface area scales quadratically by det(S) = k².',
      'The inverse zoom matrix S⁻¹ = diag(1/k, 1/k) exactly reverses scaling without shear distortion.',
      'Digital upscaling requires interpolation to approximate pixel values between discrete grid coordinates.'
    ]
  },

  15: {
    stepNumber: 15,
    code: '15',
    title: 'Matrix Multiplication & Optical Shadows',
    category: 'Visual Labs',
    oneLiner: 'Compare row-by-column matrix multiplication (C = A·B ≠ B·A) with element-wise Hadamard shadow masks (B = A ⊙ S).',
    formula: 'C = A \\cdot B \\quad \\text{vs} \\quad B = A \\odot S \\implies A = B \\oslash S',
    formulaDisplay: 'C = A · B (c_ij = ∑ a_ik · b_kj)  vs  B = A ⊙ S ⟹ A = B ⊘ S',
    whatIsThis:
      'This module contrasts two fundamental forms of matrix multiplication in computer vision and linear algebra:\n' +
      '1. Standard Matrix Multiplication (C = A · B): Combines rows of A with columns of B via dot products. It is non-commutative (AB ≠ BA) and models directional geometric transformations, lens cascades, and coordinate changes.\n' +
      '2. Hadamard Element-Wise Product (B = A ⊙ S): Multiplies corresponding matrix cells directly (b_ij = a_ij × s_ij). It models physical optical shadows falling across an image and can be mathematically inverted using entry-by-entry division: A = B ⊘ S.',
    whyNeedIt:
      'Confusing standard row-by-column matrix multiplication with element-wise multiplication is one of the most common pitfalls in machine learning, graphics rendering, and computer vision. Recognizing when to use dot products (geometry/filtering) versus entry-wise products (shadows/attenuation) is fundamental.',
    subsections: [
      {
        title: 'Standard Matrix Multiplication & Row-Column Dot Products',
        content:
          'Unlike scalar numbers where 3 × 5 = 5 × 3, matrix multiplication C = AB computes directional dot products between each row of A and each column of B:\n' +
          'c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + ... + a_{in}b_{nj} = ∑_{k=1}^n a_{ik} b_{kj}.\n' +
          'Geometrically, AB represents composite mapping: transformation B is applied first, followed by transformation A.',
        formula: 'c_{ij} = \\sum_{k=1}^n a_{ik} b_{kj}'
      },
      {
        title: 'Why Matrix Multiplication Does Not Commute (AB ≠ BA)',
        content:
          'In general, matrix multiplication is non-commutative: AB ≠ BA.\n' +
          '• Directional Pairing: AB dots rows of A with columns of B, whereas BA dots rows of B with columns of A.\n' +
          '• Visual Image Transposition: Multiplying pixel matrices AB vs BA causes horizontal visual features to rotate into vertical features.\n' +
          '• Commuting Cases: Commutativity (AB = BA) holds only in special symmetric cases, such as when multiplying by the Identity matrix I (AI = IA = A) or when both matrices share the exact same eigenvector basis.',
        formula: 'A \\cdot B \\neq B \\cdot A \\quad (\\text{Non-Commutative})'
      },
      {
        title: 'Optical Shadows via Hadamard Product (A ⊙ S)',
        content:
          'When an opaque obstacle casts a shadow on a real scene, light intensity is attenuated locally at each pixel rather than mixing across rows and columns. This is mathematically modeled by the element-wise Hadamard product:\n' +
          'B[i, j] = A[i, j] × S[i, j],\n' +
          'where A is the unshaded image matrix and S is the shadow transmission mask with values between 0.0 (total occlusion) and 1.0 (unobstructed ambient light).',
        formula: 'B = A \\odot S, \\quad b_{ij} = a_{ij} \\cdot s_{ij}'
      },
      {
        title: 'Exact Mathematical Shadow Inversion (A = B ⊘ S)',
        content:
          'Because the Hadamard product operates strictly entry-by-entry, it can be mathematically inverted without computing matrix inverses:\n' +
          'A[i, j] = B[i, j] / S[i, j]  (for all S[i, j] > 0).\n' +
          'In physical digital cameras, 8-bit quantization introduces slight roundoff in deep shadows, but the unshaded illumination is mathematically restored.',
        formula: 'A = B \\oslash S, \\quad a_{ij} = \\frac{b_{ij}}{s_{ij}}'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Compute Product AB',
        description: 'Take row i of A and column j of B to compute dot product entry c_{ij} = ∑ a_{ik}b_{kj}.'
      },
      {
        step: 2,
        title: 'Compute Product BA',
        description: 'Reverse the order: dot row i of B with column j of A to observe disparity AB ≠ BA.'
      },
      {
        step: 3,
        title: 'Evaluate Disparity Matrix',
        description: 'Calculate numerical difference Δ = |AB − BA| to measure non-commutativity.'
      },
      {
        step: 4,
        title: 'Cast & Invert Shadows',
        description: 'Apply shadow mask via B = A ⊙ S, then recover unshaded pixels via element-wise division A = B ⊘ S.'
      }
    ],
    symbols: [
      { symbol: 'A · B', name: 'Matrix Product', meaning: 'Standard linear algebraic dot product of rows and columns (non-commutative).' },
      { symbol: '⊙', name: 'Hadamard Product', meaning: 'Element-by-element matrix multiplication: c_{ij} = a_{ij} × b_{ij}.' },
      { symbol: '⊘', name: 'Hadamard Division', meaning: 'Element-by-element matrix division used to invert optical shadows: a_{ij} = b_{ij} / s_{ij}.' },
      { symbol: 'S', name: 'Shadow Mask Matrix', meaning: 'Spatial attenuation matrix with transmission coefficients between 0.0 (shadow) and 1.0 (bright).' },
      { symbol: 'Δ = |AB − BA|', name: 'Disparity Matrix', meaning: 'Matrix measuring the cell-by-cell numerical difference between AB and BA.' }
    ],
    additionalFormulas: [
      { label: 'Dot Product Definition', formula: 'c_{ij} = \\sum_{k=1}^n a_{ik} b_{kj}', desc: 'Standard row-by-column matrix multiplication formula.' },
      { label: 'Commuting Exception', formula: 'A \\cdot I = I \\cdot A = A', desc: 'Multiplying by the Identity matrix always commutes.' },
      { label: 'Shadow Attenuation', formula: 'B = A \\odot S, \\quad b_{ij} = a_{ij} \\cdot s_{ij}', desc: 'Casting an optical shadow by element-wise multiplication.' },
      { label: 'Shadow Inversion', formula: 'A = B \\oslash S, \\quad a_{ij} = b_{ij} / s_{ij}', desc: 'Exact mathematical shadow recovery via Hadamard division.' }
    ],
    guidedInquiry: [
      {
        question: '1. Do AB and BA share identical dimensions?',
        answer: 'Yes. Since A is n×n and B is n×n, both AB and BA produce valid n×n square outputs with identical shape.'
      },
      {
        question: '2. Are numerical values equal?',
        answer: 'Generally No. Unless A and B are commuting matrices (such as when B = I), AB and BA have completely distinct numerical entries.'
      },
      {
        question: '3. Do their resulting images match?',
        answer: 'No. Visual image matrices show that horizontal gradients in AB orient vertically in BA due to reversed row-column pairing.'
      },
      {
        question: '4. Why does matrix multiplication not commute?',
        answer: 'Real numbers commute (3 × 5 = 5 × 3), but matrices represent directional coordinate mappings: rotating and then shearing is fundamentally different from shearing first and then rotating.'
      }
    ],
    workedExample: {
      title: 'Casting and Removing a 50% Shadow',
      input: 'Unshaded flower petal pixel a = 200. Tree branch casts a shadow reducing light by half (s = 0.5):',
      matrixDisplay: [
        [200, 0.5]
      ],
      calculation:
        'Shadowed Pixel b = a × s = 200 × 0.5 = 100\n' +
        'Shadow Removal: a = b / s = 100 / 0.5 = 200\n' +
        'The unshaded petal brightness is perfectly recovered through element-wise division.',
      output: 'The original bright pixel value (200) is mathematically restored.'
    },
    observations: [
      'Standard matrix multiplication mixes rows and columns together, whereas Hadamard multiplication only interacts with corresponding cells.',
      'Multiplying by the Identity matrix I leaves any matrix unchanged (A · I = I · A = A).',
      'Reversing multiplication order (BA instead of AB) alters the resulting image dramatically.',
      'Shadowed regions can be restored by element-wise division as long as the shadow mask values are strictly greater than zero.'
    ],
    applications: [
      { name: 'Video Game Shading Pipelines', desc: 'Rendering engines multiply albedo texture matrices by dynamic ambient occlusion and shadow maps.' },
      { name: 'Satellite Terrain Shadow Normalization', desc: 'Removing mountain shadows in satellite imagery to accurately classify ground vegetation.' },
      { name: 'Deep Learning Convolution Layers', desc: 'Convolutional neural networks compute millions of dot products per frame.' },
      { name: 'Computational Photography', desc: 'Smartphone HDR burst photography isolating and brightening shadows in portraits.' }
    ],
    keyTakeaways: [
      'Standard matrix multiplication C = A · B computes dot products and is non-commutative (AB ≠ BA).',
      'Optical shadows are element-wise Hadamard products B = A ⊙ S.',
      'Shadowed images can be mathematically recovered by element-wise division: A = B ⊘ S.',
      'Commutativity (AB = BA) occurs only under special symmetric conditions, such as with the Identity matrix.'
    ]
  },

  16: {
    stepNumber: 16,
    code: '16',
    title: 'My Image, My Matrix',
    category: 'Visual Labs',
    oneLiner: 'Upload your own custom image or capture from webcam to inspect its live pixel matrix and apply 8 fundamental operations.',
    formula: 'A\' = f(A), \\quad \\dim(A) = H \\times W \\times C, \\quad C \\in \\{1, 3\\}',
    formulaDisplay: 'A\' = f(A),  dim(A) = H × W × C',
    whatIsThis:
      'This open laboratory bridges linear algebra theory with real-world digital media. Upload any photo from your device or capture a live frame from your webcam. Inspect the raw numerical values of your own face or surroundings, select custom regions of interest (ROI), and apply 8 core matrix operations explored throughout MathLens: scalar multiplication, addition, subtraction, rotation, scaling, reflection, shearing, and matrix inversion.',
    whyNeedIt:
      'Theoretical models are most powerful when applied to real-world data. Seeing your own photograph translated directly into rows and columns of numbers cements the core premise of visual linear algebra: every image is a matrix, and all image processing is matrix algebra.',
    subsections: [
      {
        title: 'Digital Images as 2D Arrays and 3D Spatial Tensors',
        content:
          'Every photograph stored on a computer or smartphone is represented as an array of numerical light values:\n' +
          '• Grayscale Images: A 2D matrix of dimensions H × W (Height rows by Width columns) where each entry A[r, c] ∈ [0, 255] represents monochrome brightness.\n' +
          '• Color Images: A 3D tensor of shape H × W × 3, consisting of three stacked 2D matrices for the Red, Green, and Blue color channels.',
        formula: 'A \\in \\mathbb{R}^{H \\times W \\times C}, \\quad C \\in \\{1, 3\\}'
      },
      {
        title: 'Pixel Intensity Operations (Point Arithmetic)',
        content:
          'Point operations alter brightness values without altering spatial coordinates:\n' +
          '• Scalar Multiplication: A′ = clamp(k · A, 0, 255). Uniformly brightens (k > 1) or dims (k < 1) the photograph.\n' +
          '• Matrix Addition (Blending): C = αA + (1 − α)B. Linear combination of two image matrices for cross-dissolves and watermark overlays.\n' +
          '• Matrix Subtraction (Inversion): A′ = 255 − A. Flips light and shadow into a photographic negative.',
        formula: 'A\'[i, j] = g(A[i, j])'
      },
      {
        title: '2D Spatial Coordinate Transformations',
        content:
          'Geometric transformations relocate pixel coordinates via 2×2 matrix multiplication [x′, y′]ᵀ = M · [x, y]ᵀ:\n' +
          '• Rotation R(θ): Rotates pixels around the origin by angle θ.\n' +
          '• Scaling S(k): Expands or contracts image dimensions.\n' +
          '• Reflection: Flips coordinates across coordinate axes (M_x or M_y).\n' +
          '• Shearing: Slants one coordinate axis proportionately to the other: [x + s_x·y, y]ᵀ.\n' +
          '• Inverse Mapping: To avoid empty holes in the output canvas, computer graphics uses backward coordinate mapping: (x, y) = M⁻¹(x′, y′).',
        formula: '\\begin{bmatrix} x\' \\\\ y\' \\end{bmatrix} = M \\begin{bmatrix} x \\\\ y \\end{bmatrix}'
      },
      {
        title: 'Sub-Matrices and Regions of Interest (ROI)',
        content:
          'Cropping an image is mathematically equivalent to extracting a sub-matrix A[r₁:r₂, c₁:c₂]. Inspecting local 5×5 or 10×10 ROIs exposes the discrete pixel quantization, local contrast gradients, and color variations that blend into smooth visual pictures.',
        formula: '\\text{ROI} = A[r_1:r_2, \\, c_1:c_2]'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Image Ingestion',
        description: 'Upload a PNG/JPEG file or stream live video from your webcam.'
      },
      {
        step: 2,
        title: 'Resolution Resampling',
        description: 'Resample the image to an interactive matrix grid (10×10, 20×20, 50×50, 100×100) to make numbers legible.'
      },
      {
        step: 3,
        title: 'ROI Pixel Inspection',
        description: 'Click any pixel on the photo to inspect its exact numerical grayscale or RGB tensor values.'
      },
      {
        step: 4,
        title: 'Execute Matrix Operations',
        description: 'Select from 8 operations (scalar, addition, subtraction, rotation, scaling, reflection, shearing, inverse) and test predictions.'
      }
    ],
    symbols: [
      { symbol: 'A', name: 'User Image Matrix', meaning: 'The 2D/3D numerical matrix extracted directly from your photo or camera.' },
      { symbol: 'f(A)', name: 'Matrix Operator', meaning: 'Linear algebraic transformation applied to the array.' },
      { symbol: 'H × W', name: 'Array Dimensions', meaning: 'Height (number of rows) and width (number of columns).' },
      { symbol: 'M', name: '2×2 Geometric Matrix', meaning: 'Transformation matrix mapping coordinate vectors [x, y]ᵀ to [x′, y′]ᵀ.' },
      { symbol: 'ROI', name: 'Region of Interest', meaning: 'A localized sub-matrix cropped for detailed pixel inspection.' }
    ],
    additionalFormulas: [
      { label: 'Scalar Brightness', formula: 'A\' = k \\cdot A, \\quad k \\in [0.1, 3.0]', desc: 'Multiplies pixel intensities by scalar factor k.' },
      { label: 'Alpha Blending', formula: 'C = \\alpha A + (1 - \\alpha) B', desc: 'Weighted linear combination of two image matrices.' },
      { label: '2D Rotation Matrix', formula: 'R(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}', desc: 'Rigid rotation preserving angles and lengths.' },
      { label: 'Horizontal Shear', formula: 'H_x = \\begin{bmatrix} 1 & s_x \\\\ 0 & 1 \\end{bmatrix}', desc: 'Slants x coordinates proportionately to y.' }
    ],
    workedExample: {
      title: 'Inverting a 2×2 User Photo Crop',
      input: 'User uploads a photo containing a 2×2 crop of a dark jacket and skin tone:',
      matrixDisplay: [
        [30, 45],
        [210, 195]
      ],
      calculation:
        'A\' = 255 - A\n' +
        'Row 1: [255 - 30, 255 - 45] = [225, 210]\n' +
        'Row 2: [255 - 210, 255 - 195] = [45, 60]',
      output: 'The dark jacket becomes brilliant white; the bright skin tone becomes deep charcoal.'
    },
    observations: [
      'Every photograph stored on your phone or computer is fundamentally a matrix of numbers.',
      'Switching between resolution levels shows how high-resolution continuous photos emerge from discrete pixel matrices.',
      'All professional image editing software (Photoshop, Lightroom) operates by running matrix algebra on your photos.',
      'Interactive pixel inspection reveals that visual edges correspond to sharp numerical differences between neighboring matrix entries.'
    ],
    applications: [
      { name: 'Computer Vision Training Pipelines', desc: 'Loading user photos as normalized NumPy / PyTorch tensors for neural network training.' },
      { name: 'Biometric Face Recognition', desc: 'Extracting landmark feature matrices from webcam images to verify identity.' },
      { name: 'Forensic Image Analysis', desc: 'Examining subtle matrix quantization artifacts to detect photo tampering and AI deepfakes.' },
      { name: 'Digital Photography Filters', desc: 'Real-time camera shader passes applying color balance and spatial warps on smartphones.' }
    ],
    keyTakeaways: [
      'Any photograph is a matrix of integers ready for mathematical analysis.',
      'Point operations modify pixel values; geometric operations relocate pixel coordinates.',
      'Sub-matrices (ROIs) can be isolated and processed independently.',
      'All modern image processing tools are built upon the fundamental matrix operations explored in MathLens.'
    ]
  },

  17: {
    stepNumber: 17,
    code: '17',
    title: 'Ray Optics & Optical Matrices',
    category: 'Ray Optics',
    oneLiner: 'Model light rays as 2D direction vectors and optical reflections as 2×2 linear matrix transformations.',
    formula: 'd\' = R \\cdot d, \\quad R_x = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}, \\quad R_y = \\begin{bmatrix} -1 & 0 \\\\ 0 & 1 \\end{bmatrix}, \\quad R_y R_x = R_x R_y = -I',
    formulaDisplay: 'd\' = R · d,  R_x = [1 0; 0 −1],  R_y = [−1 0; 0 1],  R_y · R_x = −I',
    whatIsThis:
      'In geometric and matrix optics, a light ray traveling through a 2D optical system is modeled as a direction vector d = [dx, dy]ᵀ. When a light ray strikes a mirror or passes through optical components, Snell\'s Law and the Law of Reflection are expressed as linear matrix multiplications d′ = R · d. By chaining matrices together, optical engineers track millions of laser beams through complex lens trains, mirrors, and retroreflectors.',
    whyNeedIt:
      'Designing telescope systems, laser resonators, camera lenses, and retroreflectors requires calculating light ray trajectories with extreme precision. Ray Transfer Matrix Analysis (ABCD matrix formalism) replaces laborious manual trigonometry with compact, high-speed matrix multiplications.',
    subsections: [
      {
        title: 'Light Rays as 2D Direction Vectors',
        content:
          'A propagating beam of light in the xy-plane is formalized as a direction vector d = [dx, dy]ᵀ:\n' +
          '• Horizontal velocity component dx and vertical velocity component dy.\n' +
          '• Ray slope: m = dy / dx.\n' +
          '• Propagation angle relative to the optical x-axis: θ = atan2(dy, dx).\n' +
          '• Beam magnitude/speed: ‖d‖ = √(dx² + dy²).',
        formula: 'd = \\begin{bmatrix} dx \\\\ dy \\end{bmatrix}, \\quad m = \\frac{dy}{dx}, \\quad \\|d\\| = \\sqrt{dx^2 + dy^2}'
      },
      {
        title: 'Specular Mirror Reflection & The Involution Property (R² = I)',
        content:
          'When light strikes a flat mirror, the angle of incidence equals the angle of reflection (θ_i = θ_r):\n' +
          '• Horizontal Mirror (x-axis): Reverses vertical velocity dy while preserving dx: R_x = [[1, 0], [0, −1]].\n' +
          '• Vertical Mirror (y-axis): Reverses horizontal velocity dx while preserving dy: R_y = [[−1, 0], [0, 1]].\n' +
          '• Normal Incidence: When incidence angle i = 0°, reflection angle r = 0°, bouncing the beam directly back along its normal.\n' +
          '• Involution Property: Reflecting twice across the same mirror returns the ray to its initial state: R_x² = I and R_y² = I.\n' +
          '• Orientation Inversion: Every single reflection has determinant det(R) = −1, flipping ray chirality (handedness).',
        formula: 'R_x = \\begin{bmatrix} 1 & 0 \\\\ 0 & -1 \\end{bmatrix}, \\quad R_x^2 = I, \\quad \\det(R_x) = -1'
      },
      {
        title: 'Beam Rotation via Rotation Matrices R(θ)',
        content:
          'Rotating a light beam by angle θ is achieved by multiplying the ray vector by the standard 2D rotation matrix R(θ):\n' +
          'd′ = R(θ) · d = [[cosθ, −sinθ], [sinθ, cosθ]] · [dx, dy]ᵀ.\n' +
          'Because det(R(θ)) = cos²θ + sin²θ = 1, rotation preserves ray magnitude ‖d‖ and orientation without reflection.',
        formula: 'R(\\theta) = \\begin{bmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{bmatrix}, \\quad \\det(R(\\theta)) = 1'
      },
      {
        title: 'Successive Reflections & 90° Corner Cube Retroreflection',
        content:
          'When light bounces off two perpendicular plane mirrors at 90° (first horizontal mirror R_x, then vertical mirror R_y):\n' +
          'R_total = R_y · R_x = [[−1, 0], [0, 1]] · [[1, 0], [0, −1]] = [[−1, 0], [0, −1]] = −I.\n' +
          'Notice that R_y · R_x = R_x · R_y = −I (the matrices commute to −I!).\n' +
          'Multiplying any incoming ray d by −I yields d′′ = −I · d = −d.\n' +
          'The beam emerges exactly anti-parallel (180° reversed) to its incoming direction, regardless of the angle of incidence!\n' +
          'For two plane mirrors intersecting at an arbitrary angle α, two successive reflections produce a pure rotation by angle 2α: R₂ · R₁ = R(2α).',
        formula: 'R_y \\cdot R_x = R_x \\cdot R_y = -I = \\begin{bmatrix} -1 & 0 \\\\ 0 & -1 \\end{bmatrix} \\implies d\'\' = -d'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Define Ray Vector (d)',
        description: 'Represent the propagating light beam as direction vector d = [dx, dy]ᵀ.'
      },
      {
        step: 2,
        title: 'Apply Reflection Matrix',
        description: 'Multiply by mirror matrix R_x to invert vertical velocity: d′ = R_x · d = [dx, −dy]ᵀ.'
      },
      {
        step: 3,
        title: 'Rotate via R(θ)',
        description: 'Multiply by rotation matrix R(θ) to steer the light beam through angle θ without distortion.'
      },
      {
        step: 4,
        title: '90° Retroreflection',
        description: 'Reflect off perpendicular mirrors to achieve matrix product −I, sending light 180° back to its source.'
      }
    ],
    symbols: [
      { symbol: 'd = [dx, dy]ᵀ', name: 'Ray Direction Vector', meaning: 'Spatial direction and velocity vector of propagating light ray.' },
      { symbol: 'R_x', name: 'Horizontal Mirror Matrix', meaning: '[[1, 0], [0, −1]] reflecting across the horizontal plane.' },
      { symbol: 'R_y', name: 'Vertical Mirror Matrix', meaning: '[[−1, 0], [0, 1]] reflecting across the vertical plane.' },
      { symbol: '-I', name: 'Retroreflector Matrix', meaning: '[[−1, 0], [0, −1]] reversing ray direction 180° back toward source.' },
      { symbol: 'R(θ)', name: 'Beam Rotation Matrix', meaning: '[[cosθ, −sinθ], [sinθ, cosθ]] steering beam angle.' },
      { symbol: 'α', name: 'Mirror Intersection Angle', meaning: 'Angle between two intersecting mirrors; successive reflection yields R(2α).' }
    ],
    additionalFormulas: [
      { label: 'Ray Direction Vector', formula: 'd = [dx, dy]^T, \\quad \\|d\\| = \\sqrt{dx^2 + dy^2}', desc: 'Cartesian representation of propagating light ray.' },
      { label: 'Mirror Involution Property', formula: 'R_x^2 = I, \\quad R_y^2 = I', desc: 'Reflecting twice across the same mirror returns original ray.' },
      { label: 'Corner Cube Retroreflection', formula: 'R_y \\cdot R_x = -I \\implies d\'\' = -d', desc: 'Perpendicular mirrors reverse ray direction by 180° regardless of incidence.' },
      { label: 'Dual Mirror Rotation Theorem', formula: 'R_2 \\cdot R_1 = R(2\\alpha)', desc: 'Reflecting across two mirrors angled at α produces a pure rotation by 2α.' }
    ],
    workedExample: {
      title: 'Ray Hitting a Perpendicular Corner Cube Reflector',
      input: 'Incident laser ray d = [3, -2]ᵀ reflecting off horizontal mirror R_x then vertical mirror R_y:',
      matrixDisplay: [
        [1, 0],
        [0, -1]
      ],
      calculation:
        'First reflection: d\' = R_x · d = [[1, 0], [0, -1]] · [3, -2]ᵀ = [3, 2]ᵀ\n' +
        'Second reflection: d\'\' = R_y · d\' = [[-1, 0], [0, 1]] · [3, 2]ᵀ = [-3, 2]ᵀ\n' +
        'Total transformation: R_y · R_x = [[-1, 0], [0, -1]] = -I\n' +
        '-I · [3, -2]ᵀ = [-3, 2]ᵀ = -[3, -2]ᵀ (Exact 180° reverse direction!)',
      output: 'The light ray reflects back exactly parallel to its original incoming path.'
    },
    observations: [
      'A plane mirror is an involution: R² = I (reflecting twice across the same mirror returns the original direction).',
      'Two perpendicular mirrors form a retroreflector with matrix product R_y · R_x = −I.',
      'A retroreflector returns any light ray back toward its source regardless of the initial angle of incidence.',
      'Single reflections reverse chiral orientation (det = −1), while two reflections restore orientation (det = (−1)(−1) = +1).'
    ],
    applications: [
      { name: 'Apollo Lunar Laser Ranging Retroreflectors', desc: 'Astronauts placed corner-cube prism reflectors on the Moon to measure Earth-Moon distance with millimeter laser precision.' },
      { name: 'Highway & Bicycle Safety Reflectors', desc: 'Corner-cube reflectors bounce car headlight beams directly back to the driver’s eyes in the dark.' },
      { name: 'Laser Cavity Resonators', desc: 'ABCD optical transfer matrices simulate photon round-trips inside helium-neon and ultrafast fiber laser cavities.' },
      { name: 'Surveying & LIDAR Prisms', desc: 'Optical surveying total stations measure kilometer distances using retroreflecting target prisms.' }
    ],
    keyTakeaways: [
      'Light rays in 2D are vectors [dx, dy]ᵀ; optical reflections are matrix multiplications.',
      'A single mirror reflection matrix has det(R) = −1 and satisfies the involution rule R² = I.',
      'Perpendicular mirrors multiply to −I, returning rays directly back toward their source.',
      'Successive reflections across mirrors angled at α equal a pure rotation by 2α: R₂ · R₁ = R(2α).'
    ]
  },

  18: {
    stepNumber: 18,
    code: '18',
    title: 'Eigenvalues & Eigenvectors',
    category: 'Visual Labs',
    oneLiner: 'Discover the invariant directions where a linear transformation acts as pure scalar stretching: Av = λv.',
    formula: 'A \\vec{v} = \\lambda \\vec{v}, \\quad \\det(A - \\lambda I) = 0, \\quad (A - \\lambda I)\\vec{v} = \\vec{0}',
    formulaDisplay: 'A · v = λ · v,  det(A − λI) = 0,  (A − λI)v = 0',
    whatIsThis:
      'When a matrix transforms space, it usually rotates and shears vectors onto completely new lines. However, for every transformation there exist special invariant directions called eigenvectors (v). When matrix A acts on an eigenvector v, it does not rotate it at all—it merely stretches, shrinks, or reflects it along its original directional line by a scalar factor called the eigenvalue (λ): Av = λv.',
    whyNeedIt:
      'Eigenvalues and eigenvectors simplify complex multidimensional matrix transformations by breaking them down into their natural, uncoupled coordinate axes. They form the foundation of Google’s PageRank algorithm, facial recognition (Eigenfaces/PCA), quantum mechanical wavefunctions, and structural vibration analysis in engineering.',
    subsections: [
      {
        title: 'The Invariant Direction Principle (Av = λv)',
        content:
          'For almost any vector x, the transformed vector Ax points in a completely different direction. But if vector v is an eigenvector, transformation by matrix A maintains its exact straight-line span:\n' +
          'Av = λv.\n' +
          'The transformation along this line acts purely as scalar multiplication by eigenvalue λ.',
        formula: 'A \\vec{v} = \\lambda \\vec{v}'
      },
      {
        title: 'Solving the Characteristic Equation: det(A − λI) = 0',
        content:
          'Rearranging Av = λv yields the homogeneous linear system (A − λI)v = 0.\n' +
          'For a non-zero eigenvector v to exist, the matrix (A − λI) must be non-invertible (singular). This requires its determinant to vanish:\n' +
          'det(A − λI) = 0.\n' +
          'For a 2×2 matrix, this expands into the characteristic quadratic polynomial: λ² − tr(A)λ + det(A) = 0. The roots of this equation are the eigenvalues λ.',
        formula: '\\det(A - \\lambda I) = \\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0'
      },
      {
        title: 'Geometric Spectrum of Eigenvalues (λ > 0, λ < 0, λ = 0)',
        content:
          '• λ > 1: Expands/stretches vectors outward along the eigenvector direction.\n' +
          '• 0 < λ < 1: Compresses/shrinks vectors inward toward the origin.\n' +
          '• λ = 1: Fixed invariant subspace (vectors along this axis remain completely unchanged).\n' +
          '• λ = −1: Negative eigenvalue reflection! For mirror matrix A = [[−1, 0], [0, 1]], the vector v₁ = [1, 0]ᵀ maps to [−1, 0]ᵀ = −1·v₁. It points backward, yet remains on the exact same invariant straight-line subspace!\n' +
          '• λ = 0: Dimensional collapse. The eigenvector lies in the null space (kernel) of matrix A.',
        formula: 'A \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} -1 \\\\ 0 \\end{bmatrix} = (-1) \\begin{bmatrix} 1 \\\\ 0 \\end{bmatrix}'
      },
      {
        title: 'Why Pure 2D Rotations Lack Real Eigenvectors',
        content:
          'When an object rotates in the 2D plane by angle θ (other than 0° or 180°), every single direction in the plane rotates off its line. Solving det(R(θ) − λI) = 0 yields complex conjugate roots λ = cosθ ± i·sinθ = e^{±iθ}. Because there are no real roots, no real 1D line in the plane remains invariant.',
        formula: '\\det(R(\\theta) - \\lambda I) = \\lambda^2 - 2\\lambda\\cos\\theta + 1 = 0 \\implies \\lambda = e^{\\pm i\\theta}'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'The Invariant Condition',
        description: 'Set up the fundamental relation: Av = λv, which rearranges to (A − λI)v = 0.'
      },
      {
        step: 2,
        title: 'Solve Characteristic Equation',
        description: 'Set det(A − λI) = 0 and solve the quadratic polynomial to find eigenvalues λ.'
      },
      {
        step: 3,
        title: 'Solve for Eigenvectors',
        description: 'Substitute each eigenvalue λ back into (A − λI)v = 0 to solve for the invariant vector directions.'
      },
      {
        step: 4,
        title: 'Geometric Interpretation',
        description: 'Input vectors along v maintain their exact angle, scaling in length by factor λ.'
      }
    ],
    symbols: [
      { symbol: 'A', name: 'Transformation Matrix', meaning: 'The n×n linear operator acting on vector space.' },
      { symbol: 'v', name: 'Eigenvector', meaning: 'A non-zero vector whose direction remains unchanged under A: Av = λv.' },
      { symbol: 'λ (lambda)', name: 'Eigenvalue', meaning: 'The scalar scaling factor by which eigenvector v is stretched or shrunk.' },
      { symbol: 'I', name: 'Identity Matrix', meaning: 'Square identity matrix matching the dimensions of A.' },
      { symbol: 'det(A − λI) = 0', name: 'Characteristic Equation', meaning: 'Polynomial whose roots yield the eigenvalues of A.' },
      { symbol: 'tr(A)', name: 'Matrix Trace', meaning: 'Sum of main diagonal entries (a + d), equal to the sum of eigenvalues λ₁ + λ₂.' }
    ],
    additionalFormulas: [
      { label: 'Eigenvalue Definition', formula: 'A \\vec{v} = \\lambda \\vec{v} \\iff (A - \\lambda I)\\vec{v} = \\vec{0}', desc: 'Fundamental eigenvector equation.' },
      { label: 'Characteristic Polynomial', formula: '\\lambda^2 - \\text{tr}(A)\\lambda + \\det(A) = 0', desc: 'Quadratic equation to compute 2×2 eigenvalues.' },
      { label: 'Trace & Determinant Relation', formula: '\\text{tr}(A) = \\lambda_1 + \\lambda_2, \\quad \\det(A) = \\lambda_1 \\lambda_2', desc: 'Trace is sum of eigenvalues; determinant is product of eigenvalues.' },
      { label: 'Reflection Invariant Subspace', formula: 'A = \\begin{bmatrix} -1 & 0 \\\\ 0 & 1 \\end{bmatrix} \\implies \\lambda_1 = -1, \\, \\lambda_2 = 1', desc: 'Reflection matrices have eigenvalues ±1 preserving orthogonal axes.' }
    ],
    guidedInquiry: [
      {
        question: '1. Why do most vectors rotate off their span, but eigenvectors do not?',
        answer: 'Matrix transformations generally shear and rotate coordinate space. Eigenvectors represent the natural principal axes of the transformation where shear is zero and the mapping reduces to simple 1D scalar stretching.'
      },
      {
        question: '2. What happens when an eigenvalue is negative (e.g. λ = −1)?',
        answer: 'The vector flips 180° backward along the exact same straight line (Av = −v). The direction flips, but the 1D linear subspace (the line through the origin) remains invariant.'
      },
      {
        question: '3. Can a rotation matrix have real eigenvectors in 2D?',
        answer: 'Only for 0° (identity matrix, all vectors are eigenvectors with λ = 1) and 180° (all vectors are eigenvectors with λ = −1). For all other angles, every vector rotates off its span, yielding complex eigenvalues.'
      },
      {
        question: '4. What does an eigenvalue of zero (λ = 0) mean geometrically?',
        answer: 'If λ = 0, then Av = 0·v = 0. The matrix crushes that entire eigenvector dimension down to a single point at the origin. This occurs if and only if the matrix is singular (det(A) = 0).'
      }
    ],
    workedExample: {
      title: 'Finding Eigenvalues of A = [[2, 0], [0, 1]]',
      input: 'Diagonal matrix A that doubles horizontal coordinates while preserving vertical coordinates:',
      matrixDisplay: [
        [2, 0],
        [0, 1]
      ],
      calculation:
        'det(A - λI) = (2 - λ)(1 - λ) - 0 = 0\n' +
        'Eigenvalues: λ₁ = 2,  λ₂ = 1\n' +
        'For λ₁ = 2: A · [1, 0]ᵀ = [2, 0]ᵀ = 2 · [1, 0]ᵀ → Eigenvector v₁ = [1, 0]ᵀ (x-axis)\n' +
        'For λ₂ = 1: A · [0, 1]ᵀ = [0, 1]ᵀ = 1 · [0, 1]ᵀ → Eigenvector v₂ = [0, 1]ᵀ (y-axis)',
      output: 'Vectors along the x-axis double in length without rotating; vectors along the y-axis stay completely unchanged.'
    },
    observations: [
      'Rotate the input vector X. When X and AX lie on the exact same straight line, you have found an eigenvector!',
      'When λ > 1, the eigenvector expands; when 0 < λ < 1, it contracts; when λ < 0, it flips direction 180° along the same line.',
      'For pure rotation matrices (by angles other than 0° or 180°), there are no real eigenvectors because all vectors rotate off their line.',
      'The determinant equals the product of eigenvalues: det(A) = λ₁ · λ₂. If any eigenvalue is 0, det(A) = 0.'
    ],
    applications: [
      { name: 'Google PageRank Algorithm', desc: 'Ranking billions of web pages by computing the dominant eigenvector of the global web link transition matrix.' },
      { name: 'Eigenfaces Facial Recognition', desc: 'Compressing facial image databases by projecting photographs onto the principal eigenvectors of pixel covariance (PCA).' },
      { name: 'Bridge & Earthquake Resonance Analysis', desc: 'Civil engineers compute the lowest eigenvalues of structural stiffness matrices to avoid catastrophic resonance collapses.' },
      { name: 'Quantum Mechanical Energy States', desc: 'In quantum physics, physical observables are Hermitian operators whose eigenvalues correspond to measurable energy levels.' }
    ],
    keyTakeaways: [
      'Eigenvectors are special directions that do not rotate when transformed by matrix A.',
      'Eigenvalues λ are the scalar factors by which eigenvectors are stretched or shrunk: Av = λv.',
      'Negative eigenvalues (λ = −1) preserve straight-line subspaces while flipping vector direction.',
      'Eigen-decomposition reveals the fundamental axes of vibration, variance, and stability in physical and digital systems.'
    ]
  },

  19: {
    stepNumber: 19,
    code: '19',
    title: 'Rank of a Matrix — Information Redundancy in Images & Physics',
    category: 'Matrix Rank',
    oneLiner: 'Discover how much independent information images, force vectors, and multi-sensor signals contain: rank(M) = dim(col(M)).',
    formula: '\\text{rank}(M) = \\dim(\\text{col}(M)), \\quad C = 2A + B \\implies \\text{rank}([A \\mid B \\mid C]) = \\text{rank}([A \\mid B])',
    formulaDisplay: 'rank(M) = dim(col(M)),  C = 2A + B ⟹ rank([A | B | C]) = 2',
    whatIsThis:
      'The rank of a matrix is the fundamental measure of how much truly independent information it contains. In digital image collections, a collection of three images does not necessarily contain three independent visual signals: if image B is twice as bright as A (B = 2A) and image C is three times as bright (C = 3A), both images B and C are redundant. In linear algebra, flattening each 2D image into a column vector forms an image collection matrix M = [a | b | c]. Because columns b and c are scalar multiples of a, Gaussian elimination reduces the columns to a single non-zero pivot column: rank(M) = 1.',
    whyNeedIt:
      'Matrix rank connects linear algebra to data compression (SVD / PCA), signal processing, computer vision, and experimental physics. By identifying linear dependence, engineers can eliminate redundant sensors in IoT networks, compress gigapixel image databases without loss of essential structure, and determine whether multiple forces acting on a mechanical structure provide new degrees of freedom or merely repeat existing directional constraints.',
    subsections: [
      {
        title: 'Information Redundancy in 2×2 Grayscale Images',
        content:
          'Consider an image A represented by a (2×2) pixel-intensity matrix: A = [[40, 80], [120, 160]]. Suppose image B = 2A and C = 3A. Unrolling each image into a column vector yields a 4×3 collection matrix M = [vec(A) | vec(B) | vec(C)]. Because columns 2 and 3 can be constructed purely by scalar multiplication of column 1, knowing image A alone is sufficient to reconstruct both B and C. The mathematical rank of M is 1.',
        formula: 'M = \\begin{bmatrix} 40 & 80 & 120 \\\\ 80 & 160 & 240 \\\\ 120 & 240 & 360 \\\\ 160 & 320 & 480 \\end{bmatrix} \\implies \\text{rank}(M) = 1'
      },
      {
        title: 'Linear Combinations Preserve Matrix Rank',
        content:
          'If an image C is generated from existing images A and B through a linear combination C = 2A + B, does it add a new dimension to the collection? No. Because vector c lies entirely in the span(a, b), the rank of [A | B | C] equals rank([A | B]) = 2. A linear combination never increases the rank of a dataset.',
        formula: 'C = c_1 A + c_2 B \\implies \\text{rank}([A \\mid B \\mid C]) = \\text{rank}([A \\mid B]) = 2'
      },
      {
        title: 'Exact vs. Approximate Dependence in Natural Photographs',
        content:
          'In synthetic matrices, B = 2A yields exact linear dependence (rank = 1). In natural photographs of flowers or trees captured under different lighting (morning, noon ambient, direct sun), lighting shifts scale the overall luminance manifold while cast shadows introduce minor variations. Singular Value Decomposition (SVD) reveals that the first singular value σ₁ dominates with >85–95% of total variance, demonstrating that multi-lighting photos are approximately dependent (effective rank ≈ 1).',
        formula: '\\frac{\\sigma_1^2}{\\sigma_1^2 + \\sigma_2^2 + \\sigma_3^2} > 90\\% \\implies \\text{Effective Rank} \\approx 1'
      },
      {
        title: 'Physics Example 1: Forces in a 2D Plane',
        content:
          'Consider three forces acting on an object in a plane: F₁ = [2, 1]ᵀ, F₂ = [4, 2]ᵀ, and F₃ = [1, 3]ᵀ. Arranging them into matrix F = [[2, 4, 1], [1, 2, 3]], we see F₂ = 2F₁. Forces F₁ and F₂ lie along the exact same line of action in the plane. Because F₃ points in an independent direction, rank(F) = 2. In a 2D plane (ℝ²), any set of 3 or more vectors must be linearly dependent because dim(ℝ²) = 2.',
        formula: 'F = \\begin{bmatrix} 2 & 4 & 1 \\\\ 1 & 2 & 3 \\end{bmatrix}, \\quad F_2 = 2F_1 \\implies \\text{rank}(F) = 2'
      },
      {
        title: 'Physics Example 2: Multi-Sensor Signal Processing',
        content:
          'Three sensors record the displacement of an oscillating object across four time instants: S₁ = [1, 2, 3, 4]ᵀ, S₂ = [2, 4, 6, 8]ᵀ, and S₃ = [3, 6, 9, 12]ᵀ. Because S₂ = 2S₁ and S₃ = 3S₁, rank(S) = 1. Although three physical instruments are deployed, they measure only 1 independent physical signal. If the third sensor is modified to capture an independent vibration mode, rank(S) increases to 2.',
        formula: 'S_2 = 2S_1, \\, S_3 = 3S_1 \\implies \\text{rank}(S_{4 \\times 3}) = 1'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Vectorize the Observations',
        description: 'Unroll each 2D image or time-series record into a column vector v_i ∈ ℝ^m.'
      },
      {
        step: 2,
        title: 'Form the Collection Matrix',
        description: 'Stack all observations side-by-side into matrix M = [v₁ | v₂ | ... | v_n] of order m × n.'
      },
      {
        step: 3,
        title: 'Row Reduction / SVD',
        description: 'Apply Gaussian elimination to find pivot columns, or compute SVD to examine singular value decay.'
      },
      {
        step: 4,
        title: 'Interpret Information Content',
        description: 'Rank equals the number of independent signals. Any rank strictly less than n indicates redundancy.'
      }
    ],
    symbols: [
      { symbol: 'M', name: 'Collection Matrix', meaning: 'The m × n matrix containing n column observations of dimension m.' },
      { symbol: 'rank(M)', name: 'Matrix Rank', meaning: 'The dimension of the column space col(M), equal to the number of linearly independent columns.' },
      { symbol: 'span(v₁, ..., v_k)', name: 'Linear Span', meaning: 'The set of all possible linear combinations c₁v₁ + ... + c_k v_k.' },
      { symbol: 'c₁A + c₂B', name: 'Linear Combination', meaning: 'Reconstructing an image via scalar weighting and matrix addition.' },
      { symbol: 'σ_i (sigma)', name: 'Singular Values', meaning: 'Square roots of eigenvalues of MᵀM indicating independent energy distribution.' },
      { symbol: 'det([F₁, F₂])', name: '2D Minor / Determinant', meaning: 'Zero cross-product indicates collinear force vectors along the same line.' }
    ],
    additionalFormulas: [
      { label: 'Rank-Nullity Theorem', formula: '\\text{rank}(M) + \\text{nullity}(M) = n', desc: 'Dimension of column space plus dimension of kernel equals number of columns.' },
      { label: 'Linear Independence Condition', formula: 'c_1 \\vec{v}_1 + c_2 \\vec{v}_2 + c_3 \\vec{v}_3 = \\vec{0} \\implies c_1 = c_2 = c_3 = 0', desc: 'Columns are independent only if trivial combination produces zero.' },
      { label: 'Collinearity in ℝ²', formula: '\\det([\\vec{F}_1, \\vec{F}_2]) = F_{1x}F_{2y} - F_{1y}F_{2x} = 0', desc: 'Vectors are collinear if their 2×2 determinant vanishes.' },
      { label: 'SVD Energy Ratio', formula: 'E_1 = \\frac{\\sigma_1^2}{\\sum_{i} \\sigma_i^2} \\times 100\\%', desc: 'Percentage of total matrix energy captured by the dominant singular value.' }
    ],
    guidedInquiry: [
      {
        question: '1. Why does knowing Image A allow us to reconstruct B = 2A and C = 3A?',
        answer: 'Because scalar multiplication scales every pixel intensity uniformly by a constant factor. The spatial distribution and ratios between pixels remain identical, so no new visual information exists in B or C.'
      },
      {
        question: '2. Does creating image C = 2A + B increase the rank of [A | B]?',
        answer: 'No. Matrix rank measures the dimension of the subspace spanned by the columns. Since C is already an element of span(A, B), adding C does not expand the subspace dimension.'
      },
      {
        question: '3. Why are real photographs under different lighting approximately dependent rather than exactly dependent?',
        answer: 'Real light sources cast shadows and highlight specularity that introduce minor local nonlinearities. However, the underlying geometric reflectance remains constant, causing the first singular value to dominate with >85% of energy.'
      },
      {
        question: '4. Why can you not have 3 linearly independent force vectors in a 2D plane?',
        answer: 'The ambient vector space ℝ² has dimension 2. Any set of k vectors in an n-dimensional space with k > n must be linearly dependent.'
      }
    ],
    workedExample: {
      title: 'Determining Rank of M = [A | 2A | 3A]',
      input: 'A = [[40, 80], [120, 160]] unrolled to column vector a = [40, 80, 120, 160]ᵀ:',
      matrixDisplay: [
        [40, 80, 120],
        [80, 160, 240],
        [120, 240, 360],
        [160, 320, 480]
      ],
      calculation:
        'Gaussian Elimination:\n' +
        'Row 1 scaled by 1/40: [1, 2, 3]\n' +
        'Eliminate Row 2: Row 2 - 80 × Row 1 = [0, 0, 0]\n' +
        'Eliminate Row 3: Row 3 - 120 × Row 1 = [0, 0, 0]\n' +
        'Eliminate Row 4: Row 4 - 160 × Row 1 = [0, 0, 0]\n' +
        'RREF has exactly 1 non-zero pivot row: rank(M) = 1',
      output: 'The collection matrix has rank 1. Exactly 1 independent image exists; the other 2 are completely redundant.'
    },
    observations: [
      'Scalar multiplication of an image preserves spatial pattern and does not increase matrix rank.',
      'Linear combinations (C = 2A + B) create composite images that lie entirely within the existing subspace.',
      'In experimental physics, redundant sensors waste bandwidth and computational power by providing rank-1 measurements.',
      'Modifying a sensor or capturing an orthogonal signal increases rank, indicating new physical degrees of freedom.'
    ],
    applications: [
      { name: 'Low-Rank Image Compression (PCA & SVD)', desc: 'Compressing surveillance video and facial databases by storing only the dominant rank-k basis vectors.' },
      { name: 'Sensor Fusion & Fault Detection', desc: 'Detecting failed or stuck sensors in aircraft and industrial turbines by analyzing the rank of telemetry correlation matrices.' },
      { name: 'Structural Mechanics & Degree-of-Freedom Analysis', desc: 'Civil engineers compute stiffness matrix ranks to ensure structures have adequate independent load-bearing supports.' },
      { name: 'Computer Vision Photometric Stereo', desc: 'Reconstructing 3D surface normals by capturing photographs under at least 3 linearly independent lighting directions.' }
    ],
    keyTakeaways: [
      'Rank equals the number of linearly independent column observations in a dataset.',
      'Images related by scalar multiples or linear combinations are redundant and do not increase rank.',
      'Natural photos under varied lighting exhibit low effective rank (approximate dependence) dominated by the 1st singular value.',
      'In an n-dimensional physical space, at most n independent force or sensor directions can exist.'
    ]
  },

  20: {
    stepNumber: 20,
    code: '20',
    title: 'System of Linear Equations — Recovering Hidden Images (AX = b)',
    category: 'Linear Systems',
    oneLiner: 'Unmix blended digital image layers into their pristine originals by formulating and inverting the linear system AX = B.',
    formula: 'A X = B \\implies X = A^{-1} B',
    formulaDisplay:
      '\\begin{bmatrix} B_1 \\\\ B_2 \\end{bmatrix} = \\begin{bmatrix} a_{11} & a_{12} \\\\ a_{21} & a_{22} \\end{bmatrix} \\begin{bmatrix} X_1 \\\\ X_2 \\end{bmatrix} \\implies \\begin{bmatrix} X_1 \\\\ X_2 \\end{bmatrix} = \\frac{1}{a_{11}a_{22} - a_{12}a_{21}} \\begin{bmatrix} a_{22} & -a_{12} \\\\ -a_{21} & a_{11} \\end{bmatrix} \\begin{bmatrix} B_1 \\\\ B_2 \\end{bmatrix}',
    whatIsThis:
      'In digital imaging, medical diagnostics, and remote sensing, sensors frequently capture overlapping mixtures of physical layers. A system of linear equations AX = B models this blending at every single pixel. When the mixing matrix A is non-singular (det(A) ≠ 0), its inverse A⁻¹ exists and acts as an unmixing filter. By applying negative linear combinations to the mixed layers, A⁻¹ cancels out ghost artifacts and perfectly reconstructs the original hidden images X₁ and X₂.',
    whyNeedIt:
      'In dual-energy X-ray imaging, radiologists need to cleanly separate dense bone from soft tissue to detect fractures and pulmonary nodules. In chemical spectrophotometry, solutions containing multiple dyes create superimposed absorption spectra that must be unmixed to find exact chemical concentrations. Furthermore, exploring matrix singularity (det(A) = 0 and rank collapse) teaches learners why duplicate or proportional sensor readings cause irreversible information loss where unmixing is mathematically impossible.',
    subsections: [
      {
        title: 'Forward Blending (AX = B)',
        desc: 'Combine pristine images X₁ (Circle) and X₂ (Triangle) using weights: B₁ = 0.8X₁ + 0.2X₂ and B₂ = 0.3X₁ + 0.7X₂.'
      },
      {
        title: 'Inverse Unmixing (X = A⁻¹ B)',
        desc: 'Compute the inverse matrix A⁻¹ and observe how negative weights cancel the unwanted ghost layer at every pixel.'
      },
      {
        title: 'Singularity & Rank Collapse (det(A) = 0)',
        desc: 'Set identical mixtures B₁ = B₂ = 0.5X₁ + 0.5X₂ to trigger rank collapse (Rank = 1) and witness division-by-zero failure.'
      },
      {
        title: 'Matrix Sandbox & Interactive Sliders',
        desc: 'Dynamically vary all four matrix entries, monitor the determinant in real time, and unmix custom test shapes.'
      },
      {
        title: 'Real-World Medical & Chemical Imaging',
        desc: 'Explore dual-energy bone/tissue separation, chemical spectrophotometry dye unmixing, and CMYK color printing.'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Linear Layer Combination',
        description: 'Each sensor captures a linear mixture of the true source layers: B_i(x, y) = a_i1 X₁(x, y) + a_i2 X₂(x, y).'
      },
      {
        step: 2,
        title: 'Formulate Matrix System',
        description: 'Stack into the compact system A · [X₁, X₂]ᵀ = [B₁, B₂]ᵀ with mixing matrix A = [[a₁₁, a₁₂], [a₂₁, a₂₂]].'
      },
      {
        step: 3,
        title: 'Check Invertibility',
        description: 'Compute the determinant det(A) = a₁₁a₂₂ - a₁₂a₂₁. If det(A) ≠ 0, the matrix has full rank (Rank = 2) and A⁻¹ exists.'
      },
      {
        step: 4,
        title: 'Invert & Cancel Ghosts',
        description: 'Multiply both sides by A⁻¹: X = A⁻¹ B. The negative off-diagonal coefficients in A⁻¹ subtract the ghost layer from each mixture.'
      }
    ],
    symbols: [
      { symbol: 'X₁, X₂', name: 'Original Image Layers', meaning: 'Pristine ground-truth 2D matrices of pixel intensities (Circle and Triangle).' },
      { symbol: 'B₁, B₂', name: 'Mixed Observed Images', meaning: 'Composite images recorded by cameras or sensors with overlapping signals.' },
      { symbol: 'A', name: 'Mixing Matrix (2×2)', meaning: 'Coefficients specifying the percentage blend of each layer into each observation.' },
      { symbol: 'A⁻¹', name: 'Unmixing Matrix (Inverse)', meaning: 'The inverse operator that reconstructs original layers from the mixed observations.' },
      { symbol: 'det(A)', name: 'Matrix Determinant', meaning: 'The scaling factor a₁₁a₂₂ - a₁₂a₂₁; if zero, the system is singular and unsolvable.' },
      { symbol: 'Rank(A)', name: 'System Rank', meaning: 'Number of linearly independent equations; Rank = 1 indicates redundant information.' }
    ],
    additionalFormulas: [
      { label: '2×2 Matrix Inversion', formula: 'A^{-1} = \\frac{1}{ad - bc} \\begin{bmatrix} d & -b \\\\ -c & a \\end{bmatrix}', desc: 'Explicit formula for the inverse of a 2×2 matrix.' },
      { label: 'Unmixing Equations', formula: 'X_1 = 1.4 B_1 - 0.4 B_2, \\quad X_2 = -0.6 B_1 + 1.6 B_2', desc: 'Inverse equations for mixing matrix [[0.8, 0.2], [0.3, 0.7]].' },
      { label: 'Singularity Condition', formula: '\\det(A) = 0 \\iff a_{11}a_{22} = a_{12}a_{21}', desc: 'Proportional rows produce an infinite null space and no unique solution.' },
      { label: 'Condition Number', formula: '\\kappa(A) = \\|A\\| \\|A^{-1}\\|', desc: 'Measures numerical sensitivity; ill-conditioned matrices amplify sensor noise.' }
    ],
    guidedInquiry: [
      {
        question: '1. Why does recovering the original images require negative coefficients in the inverse matrix?',
        answer: 'Each mixed image B₁ and B₂ contains a fraction of both X₁ and X₂. To isolate X₁, we must subtract the unwanted triangle ghost contributed by X₂. The negative coefficient (-0.4 in X₁ = 1.4B₁ - 0.4B₂) provides exact destructive cancellation of the triangle layer.'
      },
      {
        question: '2. What happens visually if both mixed images are identical (B₁ = B₂)?',
        answer: 'When B₁ = B₂ = 0.5X₁ + 0.5X₂, both rows of matrix A are identical. The determinant det(A) = (0.5)(0.5) - (0.5)(0.5) = 0. The system collapses to Rank 1, meaning we have two copies of the same equation. We have 1 equation with 2 unknowns, resulting in infinitely many valid solutions and zero unique recovery.'
      },
      {
        question: '3. What happens if the mixing matrix is nearly singular (ill-conditioned)?',
        answer: 'If det(A) is very small (e.g. 0.001), the unmixing coefficients (1/det(A)) blow up into huge numbers. Even a tiny 1-pixel sensor noise or rounding difference gets magnified into extreme visual artifacts, producing blown-out or noisy reconstructions.'
      },
      {
        question: '4. How does medical dual-energy CT use AX = B in clinical practice?',
        answer: 'CT scanners pulse X-rays at 70 kVp (low energy) and 140 kVp (high energy). Calcium in bones absorbs low-energy photons much more strongly than soft tissue (water and muscle). The linear attenuation equations form a 2×2 system at every voxel, solved in real time to produce separate bone-free and tissue-free diagnostic scans.'
      }
    ],
    workedExample: {
      title: 'Unmixing Circle and Triangle at a Specific Pixel',
      input: 'At pixel (16, 16), original circle has X₁ = 200, triangle has X₂ = 50. Blending matrix A = [[0.8, 0.2], [0.3, 0.7]]:',
      matrixDisplay: [
        [0.8, 0.2],
        [0.3, 0.7]
      ],
      calculation:
        '1. Forward Mixing:\n' +
        '   B₁ = 0.8(200) + 0.2(50) = 160 + 10 = 170\n' +
        '   B₂ = 0.3(200) + 0.7(50) = 60 + 35 = 95\n\n' +
        '2. Determinant:\n' +
        '   det(A) = (0.8)(0.7) - (0.2)(0.3) = 0.56 - 0.06 = 0.50\n\n' +
        '3. Inverse Matrix A⁻¹:\n' +
        '   A⁻¹ = (1 / 0.50) · [[0.7, -0.2], [-0.3, 0.8]] = [[1.4, -0.4], [-0.6, 1.6]]\n\n' +
        '4. Unmixing Reconstruction:\n' +
        '   X₁ = 1.4(170) - 0.4(95) = 238 - 38 = 200 (Exact Circle!)\n' +
        '   X₂ = -0.6(170) + 1.6(95) = -102 + 152 = 50 (Exact Triangle!)',
      output: 'Both original pixel intensities (200 and 50) are recovered with 100% mathematical precision.'
    },
    observations: [
      'Digital image blending is a linear algebraic transformation governed by AX = B.',
      'Unmixing requires solving AX = B independently at every single pixel (x, y) across the image matrix.',
      'Negative coefficients in the inverse matrix A⁻¹ act as optical phase cancelers that eliminate ghost silhouettes.',
      'When rows of A are linearly dependent, det(A) = 0 and recovery fails completely, proving that independent information is essential for solving linear systems.'
    ],
    applications: [
      { name: 'Dual-Energy Medical Computed Tomography (DECT)', desc: 'Isolating bone fractures and kidney stones from soft organ tissues using two distinct X-ray energy spectra.' },
      { name: 'Chemical Spectrophotometry & Dye Deconvolution', desc: 'Separating overlapping chemical absorption spectra in liquid chromatography and pharmaceutical testing.' },
      { name: 'Multi-Spectral Satellite Remote Sensing', desc: 'Unmixing composite satellite pixels into percentages of vegetation, water, and urban concrete using spectral linear mixture models.' },
      { name: 'CMYK Printing & Color Separation', desc: 'Decomposing RGB screen imagery into physical Cyan, Magenta, Yellow, and Key black ink pigment densities.' }
    ],
    keyTakeaways: [
      'Image layer mixing is a forward matrix multiplication AX = B.',
      'If det(A) ≠ 0, the inverse A⁻¹ uniquely recovers original pristine images via X = A⁻¹ B.',
      'Negative unmixing coefficients are mathematically necessary to cancel ghost artifacts.',
      'If det(A) = 0, the matrix collapses to Rank 1 and unique image recovery is impossible.'
    ]
  },

  21: {
    stepNumber: 21,
    code: '21',
    title: 'Vector Norms — What is Length & Measuring Image Distance',
    category: 'Vector Norms',
    oneLiner: 'Discover what "length" truly means for vectors, explore unit balls (diamond L₁, circle L₂, square L_∞), and see how norms measure concentrated vs. distributed image defects.',
    formula: '\\|v\\|_1 = |x| + |y|, \\quad \\|v\\|_2 = \\sqrt{x^2 + y^2}, \\quad \\|v\\|_\\infty = \\max(|x|, |y|)',
    formulaDisplay: '‖v‖₁ = |x| + |y|,  ‖v‖₂ = √(x² + y²),  ‖v‖_∞ = max(|x|, |y|)',
    whatIsThis:
      'In everyday geometry, the "length" of a vector is calculated using the Pythagorean theorem: ||v||₂ = √(x² + y²). But in linear algebra, data science, and image processing, Euclidean length is only one of many ways to measure magnitude! A norm is any mathematical function that assigns a strictly positive magnitude to non-zero vectors while satisfying positive definiteness, absolute homogeneity, and the triangle inequality. Different norms measure geometry differently: L₁ produces diamond unit balls, L₂ produces circles, and L_∞ produces squares.',
    whyNeedIt:
      'Norms allow computers to measure the "distance" or difference between two digital images, high-dimensional data points, or AI predictions. In computer vision, subtracting two images produces an error matrix D = |I_mod - I_orig|. The L₁ norm measures the total cumulative pixel change (useful for sparse error detection), L₂ measures root-mean-square energy (overall visual fidelity), and L_∞ identifies the single worst peak pixel error (maximum distortion). Understanding norms explains why JPEG compression, LASSO regression, and deep learning loss functions choose specific metrics.',
    subsections: [
      {
        title: 'Module 1: What is the Length of a Vector?',
        content:
          'Begin with a 2D vector v = [3, 4]ᵀ. Its Euclidean length is ||v||₂ = √(3² + 4²) = 5. If we double both components to 2v = [6, 8]ᵀ, the length doubles to √(6² + 8²) = 10 = 2 × 5. But is Euclidean distance the only way to measure vector size? This fundamental question motivates the concept of general vector norms.',
        formula: '\\|v\\|_2 = \\sqrt{x^2 + y^2}, \\quad v = \\begin{bmatrix} 3 \\\\ 4 \\end{bmatrix} \\implies \\|v\\|_2 = 5'
      },
      {
        title: 'Step 2: The Three Axiomatic Norm Properties',
        content:
          'For a function N(v) to qualify as a valid norm, it must satisfy three rigorous axioms:\n' +
          '1. Positive Definiteness: ||X|| ≥ 0, and ||X|| = 0 if and only if X = 0.\n' +
          '2. Absolute Homogeneity: ||c·X|| = |c|·||X|| for any scalar c.\n' +
          '3. Triangle Inequality: ||X + Y|| ≤ ||X|| + ||Y|| (the shortest distance between two points is direct).',
        formula: '\\|X\\| \\ge 0 \\iff X \\ne \\mathbf{0}, \\quad \\|cX\\| = |c|\\|X\\|, \\quad \\|X + Y\\| \\le \\|X\\| + \\|Y\\|'
      },
      {
        title: 'Step 3: Unit Balls — Why L₁ is a Diamond, L₂ is a Circle, and L_∞ is a Square',
        content:
          'A closed unit ball contains all vectors whose norm is ≤ 1; at its boundary, ||v|| = 1. The unit ball need not be circular!\n' +
          '• L₁ norm (Manhattan): |x| + |y| = 1. In the first quadrant, x + y = 1 connecting (1, 0) and (0, 1). Rotating across four quadrants forms a Diamond!\n' +
          '• L₂ norm (Euclidean): √(x² + y²) = 1 ⟹ x² + y² = 1, the standard Circle.\n' +
          '• L_∞ norm (Chebyshev): max(|x|, |y|) = 1 ⟹ x ∈ [-1, 1] and y ∈ [-1, 1], forming a Square with corners at (±1, ±1).',
        formula: '\\{ v \\in \\mathbb{R}^2 \\mid \\|v\\|_p \\le 1 \\}: \\quad L_1 \\to \\text{Diamond}, \\quad L_2 \\to \\text{Circle}, \\quad L_\\infty \\to \\text{Square}'
      },
      {
        title: 'Activity: Measuring Image Changes (One Large vs. Four Small Errors)',
        content:
          'Consider a 3×3 grayscale image where all pixels are 40. Suppose Modification 1 changes the central pixel by +80, while Modification 2 changes four pixels by +20 each. In both cases, the L₁ norm of the difference matrix is identically 80!\n' +
          'Does this mean the images changed in the same way? No! Modification 1 is a severe single-pixel spike (dead pixel / impulse noise), with L_∞ = 80 and L₂ = 80. Modification 2 distributes the error into gentle blur, dropping L₂ to 40 and L_∞ to 20. Different norms distinguish between concentrated and distributed image defects!',
        formula: '\\Delta_1 = [80, 0, ..., 0] \\implies \\|D\\|_1 = 80, \\, \\|D\\|_2 = 80, \\, \\|D\\|_\\infty = 80'
      }
    ],
    howItWorks: [
      {
        step: 1,
        title: 'Vectorize or Flatten Observations',
        description: 'Represent vectors v = [x, y]ᵀ or unroll 2D image difference matrices into column vectors D ∈ ℝ^n.'
      },
      {
        step: 2,
        title: 'Choose the Metric Norm',
        description: 'Select L₁ for absolute sum / sparsity, L₂ for Euclidean magnitude / RMS energy, or L_∞ for peak worst-case error.'
      },
      {
        step: 3,
        title: 'Compute Component Sums',
        description: 'Sum absolute components (|x| + |y|), sum squares (√(x² + y²)), or find the maximum element (max |x_i|).'
      },
      {
        step: 4,
        title: 'Interpret Visual Error Geometry',
        description: 'Compare L₁ vs L₂ vs L_∞: identical L₁ with lower L_∞ proves the error is distributed; equal L₁ and L_∞ proves concentrated defect.'
      }
    ],
    symbols: [
      { symbol: '‖v‖₁', name: 'L₁ Norm (Manhattan / Taxicab)', meaning: 'Sum of absolute coordinates: |x| + |y|. Unit ball is a diamond.' },
      { symbol: '‖v‖₂', name: 'L₂ Norm (Euclidean Distance)', meaning: 'Standard geometric length: √(x² + y²). Unit ball is a circle.' },
      { symbol: '‖v‖_∞', name: 'L_∞ Norm (Chebyshev / Max)', meaning: 'Largest absolute coordinate: max(|x|, |y|). Unit ball is a square.' },
      { symbol: 'N(X + Y) ≤ N(X) + N(Y)', name: 'Triangle Inequality', meaning: 'The length of the direct vector path cannot exceed the sum of detour legs.' },
      { symbol: 'N(cX) = |c|·N(X)', name: 'Absolute Homogeneity', meaning: 'Scaling a vector by c stretches its length by exactly |c|.' },
      { symbol: 'D = |I_mod − I_orig|', name: 'Pixel Difference Matrix', meaning: 'Absolute pixel-by-pixel intensity error between baseline and altered images.' }
    ],
    additionalFormulas: [
      { label: 'General Lp Norm Definition', formula: '\\|v\\|_p = \\left( \\sum_{i=1}^n |v_i|^p \\right)^{1/p}', desc: 'Generalized p-norm family for p ≥ 1.' },
      { label: 'Norm Equivalence in ℝⁿ', formula: '\\|v\\|_\\infty \\le \\|v\\|_2 \\le \\|v\\|_1 \\le \\sqrt{n} \\|v\\|_2 \\le n \\|v\\|_\\infty', desc: 'Topological equivalence: all norms bound each other within constant geometric factors in finite dimensions.' },
      { label: 'Cauchy-Schwarz Inequality', formula: '|\\vec{u} \\cdot \\vec{v}| \\le \\|\\vec{u}\\|_2 \\|\\vec{v}\\|_2', desc: 'Upper bound on inner product yielding the Euclidean triangle inequality.' },
      { label: 'Peak Signal-to-Noise Ratio (PSNR)', formula: '\\text{PSNR} = 10 \\log_{10}\\left(\\frac{255^2}{\\frac{1}{mn}\\|D\\|_2^2}\\right)', desc: 'Standard visual quality metric inversely proportional to squared L₂ error.' }
    ],
    workedExample: {
      title: 'Comparing One Large Error vs Four Small Errors on 3×3 Image',
      input: 'Original image is uniform 40 across all 9 pixels. We compare two distinct modifications:',
      matrixDisplay: [
        [0, 20, 0],
        [20, 0, 20],
        [0, 20, 0]
      ],
      calculation:
        'Case 1: Single Center Pixel +80:\n' +
        '   Difference Vector: [0, 0, 0, 0, 80, 0, 0, 0, 0]ᵀ\n' +
        '   L₁ Norm = |80| = 80\n' +
        '   L₂ Norm = √(80²) = 80\n' +
        '   L_∞ Norm = max(80) = 80\n\n' +
        'Case 2: Four Cross Pixels +20 Each:\n' +
        '   Difference Vector: [0, 20, 0, 20, 0, 20, 0, 20, 0]ᵀ\n' +
        '   L₁ Norm = 20 + 20 + 20 + 20 = 80\n' +
        '   L₂ Norm = √(20² + 20² + 20² + 20²) = √(4 × 400) = √1600 = 40\n' +
        '   L_∞ Norm = max(20, 20, 20, 20) = 20\n\n' +
        'Hierarchy: Case 1 has L₁ = L₂ = L_∞ = 80. Case 2 has L₁ > L₂ > L_∞ (80 > 40 > 20).',
      output: 'Both modifications have the exact same L₁ error (80), but Case 2 has half the Euclidean error (40) and one-quarter the peak error (20).'
    },
    observations: [
      'The Euclidean length ||v||₂ = √(x² + y²) is the straight-line hypotenuse given by Pythagoras.',
      'A norm must satisfy positive definiteness (only zero vector has length 0), homogeneity (linear scaling), and triangle inequality.',
      'Functions like x² + y² fail homogeneity, while |x + y| and |xy| fail positive definiteness because non-zero vectors can evaluate to 0.',
      'Unit balls are not always circular: L₁ produces a diamond, L₂ a circle, and L_∞ a square.',
      'Different norms distinguish between concentrated and distributed image errors: identical L₁ with lower L₂ and L_∞ reveals distributed changes.'
    ],
    applications: [
      { name: 'JPEG & Wavelet Lossy Compression', desc: 'Using L₂ and L₁ frequency coefficient thresholds to discard imperceptible image data while maintaining high PSNR.' },
      { name: 'LASSO Regression & Compressed Sensing', desc: 'L₁ regularization drives coefficients to exact zero, selecting sparse feature subsets and reconstructing images from minimal sensor measurements.' },
      { name: 'Adversarial Attack Robustness (L_∞ Perturbations)', desc: 'Testing AI computer vision models against imperceptible adversarial perturbations bounded within an L_∞ epsilon square.' },
      { name: 'Robot Motion Planning (Manhattan vs Euclidean Grid)', desc: 'Calculating grid navigation costs: L₁ for street grid taxi routes, L₂ for drone flight paths, and L_∞ for simultaneous multi-axis CNC machine movement.' }
    ],
    keyTakeaways: [
      'A vector norm assigns a non-negative magnitude satisfying positive definiteness, homogeneity, and triangle inequality.',
      'Unit balls {v | ||v|| ≤ 1} change geometry: diamond for L₁, circle for L₂, and square for L_∞.',
      'L₁ measures total absolute error budget, L₂ measures root-mean-square energy, and L_∞ measures peak outlier distortion.',
      'Two different image modifications can have identical L₁ norm (80), yet completely different visual character (concentrated spike vs distributed blur).'
    ]
  },
  22: {
    stepNumber: 22,
    code: '22',
    title: 'QR Decomposition — Orthogonality, Gram–Schmidt & Image Reconstruction',
    category: 'QR Decomposition',
    oneLiner: 'Factorize matrices into orthonormal columns Q and upper-triangular weights R to resolve vectors and reconstruct grayscale images.',
    formula: 'A = Q R, \\quad Q^T Q = I, \\quad u_k = a_k - \\sum_{j=1}^{k-1} \\frac{u_j^T a_k}{u_j^T u_j} u_j',
    formulaDisplay: 'A = QR,  Q^T Q = I,  u_k = a_k - ∑ proj_{u_j}(a_k)',
    whatIsThis:
      'QR Decomposition is a cornerstone matrix factorization that expresses any matrix A as the product of an orthogonal matrix Q (with mutually perpendicular unit columns) and an upper-triangular matrix R. While standard basis vectors like (1, 0) and (0, 1) are perpendicular, arbitrary vectors in data science and image processing rarely are. The Gram–Schmidt process systematically strips away redundant parallel projections, yielding a pristine orthonormal basis Q and the reconstruction weights R.',
    whyNeedIt:
      'Perpendicular unit vectors eliminate numerical instability and redundancy. In digital image processing, a grayscale pixel matrix can be decomposed into an orthonormal spatial feature basis Q and mixing weights R, answering the foundational question: "Can an image be represented using perpendicular unit vectors and perfectly reconstructed?" Yes! QR decomposition is also the computational engine behind numerically stable linear least-squares regression, computer graphics ray reflections, and the QR algorithm for calculating matrix eigenvalues.',
    subsections: [
      {
        title: 'Module 1: What Does Perpendicular Mean?',
        content:
          'Two vectors a and b are perpendicular (orthogonal) if and only if their dot product is zero: a · b = a_x b_x + a_y b_y = 0. For example, a = [3, 1]ᵀ and b = [-1, 3]ᵀ yield (3)(-1) + (1)(3) = -3 + 3 = 0, forming an exact 90° angle. Perpendicular vectors have zero correlation—neither vector casts any projection onto the other.',
        formula: 'a \\cdot b = a_x b_x + a_y b_y = 0 \\iff \\theta = 90^\\circ'
      },
      {
        title: 'Module 2: Projection — How Much of One Vector Lies Along Another?',
        content:
          'To resolve vector b along base vector a, we compute the orthogonal projection: proj_a(b) = ((aᵀ b) / (aᵀ a)) a. For a = [3, 1]ᵀ and b = [2, 3]ᵀ, aᵀ b = 9 and aᵀ a = 10, giving proj_a(b) = 0.9 × [3, 1]ᵀ = [2.7, 0.9]ᵀ. The remaining perpendicular component is b_⊥ = b - proj_a(b) = [-0.7, 2.1]ᵀ. Together, they form a right triangle: b = proj_a(b) + b_⊥ with (proj_a(b)) · b_⊥ = 0.',
        formula: '\\text{proj}_a(b) = \\frac{a^T b}{a^T a} a, \\quad b_\\perp = b - \\text{proj}_a(b)'
      },
      {
        title: 'Module 3: Gram–Schmidt Orthogonalization (2D & 3D)',
        content:
          'Given linearly independent vectors a₁, a₂, ..., the Gram–Schmidt algorithm systematically constructs orthogonal vectors u_k and orthonormal vectors q_k:\n' +
          '1. Set u₁ = a₁\n' +
          '2. Subtract the projection: u₂ = a₂ - proj_{u₁}(a₂)\n' +
          '3. For 3D: u₃ = a₃ - proj_{u₁}(a₃) - proj_{u₂}(a₃)\n' +
          '4. Normalize each vector to unit length: q_k = u_k / ||u_k||.\n' +
          'For a₁ = [2, 1]ᵀ and a₂ = [1, 2]ᵀ, subtracting the projection gives u₂ = [-0.6, 1.2]ᵀ, which is exactly perpendicular to u₁.',
        formula: 'u_1 = a_1, \\quad u_2 = a_2 - \\frac{u_1^T a_2}{u_1^T u_1} u_1, \\quad q_i = \\frac{u_i}{\\|u_i\\|}'
      },
      {
        title: 'Module 4: Building Q and R Matrices (A = QR)',
        content:
          'Collecting the orthonormal unit vectors q_i as columns forms matrix Q. Because its columns are orthonormal, Qᵀ Q = I. The upper-triangular matrix R stores the projection lengths: R_{ij} = q_iᵀ a_j for i ≤ j, with zeros below the diagonal. Multiplying Q × R reconstructs the original matrix A with zero loss.',
        formula: 'A = Q R, \\quad Q^T Q = I, \\quad R = Q^T A = \\begin{bmatrix} r_{11} & r_{12} \\\\ 0 & r_{22} \\end{bmatrix}'
      },
      {
        title: 'Module 5: Representing Digital Images with Perpendicular Vectors',
        content:
          'Can we represent an image matrix using perpendicular unit vectors? Yes! When applied to a 2×2 or 3×3 grayscale image matrix A, Q provides an orthogonal basis of spatial column patterns with zero redundant overlap, and R provides the upper-triangular blending coefficients. Computing Q × R reconstructs every pixel with 100% mathematical precision.',
        formula: 'A_{\\text{image}} = Q R \\implies \\text{Reconstructed Image} = Q \\times R'
      }
    ],
    workedExample: {
      title: 'Gram–Schmidt Orthogonalization of A = [[2, 1], [1, 2]]',
      input: 'Column vectors a₁ = [2, 1]ᵀ and a₂ = [1, 2]ᵀ:',
      matrixDisplay: [
        [2, 1],
        [1, 2]
      ],
      calculation:
        '1. First orthogonal vector: u₁ = a₁ = [2, 1]ᵀ\n' +
        '   Norm: ||u₁|| = √(2² + 1²) = √5 ≈ 2.2361\n' +
        '   Unit vector: q₁ = [2/√5, 1/√5]ᵀ ≈ [0.8944, 0.4472]ᵀ\n\n' +
        '2. Second orthogonal vector: subtract projection of a₂ onto u₁:\n' +
        '   u₁ᵀ a₂ = (2)(1) + (1)(2) = 4\n' +
        '   u₁ᵀ u₁ = 5\n' +
        '   proj_{u₁}(a₂) = (4/5) [2, 1]ᵀ = [1.6, 0.8]ᵀ\n' +
        '   u₂ = [1, 2]ᵀ - [1.6, 0.8]ᵀ = [-0.6, 1.2]ᵀ\n' +
        '   Check: u₁ · u₂ = 2(-0.6) + 1(1.2) = 0 ✓\n' +
        '   Norm: ||u₂|| = √((-0.6)² + 1.2²) = √1.8 ≈ 1.3416\n' +
        '   Unit vector: q₂ = u₂ / ||u₂|| ≈ [-0.4472, 0.8944]ᵀ\n\n' +
        '3. Assemble Q and R:\n' +
        '   Q = [[0.8944, -0.4472], [0.4472, 0.8944]]\n' +
        '   R = [[2.2361, 1.7889], [0, 1.3416]]\n' +
        '   Q × R = [[2.00, 1.00], [1.00, 2.00]] = A ✓',
      output: 'Matrix A is factored into orthonormal Q (Qᵀ Q = I) and upper-triangular R with exact reconstruction.'
    },
    observations: [
      'Two vectors are perpendicular if and only if their dot product a · b = 0.',
      'Vector projection decomposes any vector b into b = proj_a(b) + b_⊥, where b_⊥ is strictly perpendicular to a.',
      'Gram–Schmidt converts any linearly independent vector set into a mutually orthogonal set by subtracting prior projections.',
      'Normalizing the orthogonal vectors produces orthonormal matrix Q where Qᵀ Q = I.',
      'Upper-triangular matrix R stores the projection lengths and coordinates, making QR multiplication reproduce the exact original matrix.',
      'Digital images can be completely represented and losslessly reconstructed using perpendicular unit column vectors.'
    ],
    applications: [
      { name: 'Linear Least Squares & Regression', desc: 'Solving overdetermined systems Ax = b stably via Rx = Qᵀ b without squaring condition numbers in normal equations.' },
      { name: 'Computer Graphics & Optics Ray Tracing', desc: 'Decomposing incident light rays into parallel surface components and perpendicular normal reflections.' },
      { name: 'Eigenvalue QR Algorithm', desc: 'Iteratively computing A_{k+1} = R_k Q_k to determine all eigenvalues and eigenvectors of general matrices.' },
      { name: 'Image & Video Feature Orthogonalization', desc: 'Constructing non-redundant spatial bases for texture analysis, signal compression, and PCA/SVD preprocessing.' }
    ],
    keyTakeaways: [
      'Orthogonal vectors have zero dot product and zero redundant mutual projection.',
      'Vector projection resolves any vector into parallel and perpendicular components.',
      'Gram–Schmidt sequentially strips out parallel shadows to build an orthonormal coordinate frame.',
      'QR decomposition (A = QR) represents any matrix or image as an orthonormal basis Q scaled by triangular weights R.'
    ]
  }
};

