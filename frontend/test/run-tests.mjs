import {
  clampPixel,
  scaleMatrix,
  addMatrices,
  subtractMatrices,
  invertMatrix,
  hadamardProduct,
  multiplyMatrices
} from '../src/core/mathEngine.js';

import {
  computeDeterminant,
  computeInverseMatrix,
  getRotationMatrix,
  getScalingMatrix,
  getShearMatrix,
  multiply2x2,
  transformPoint
} from '../src/core/transformEngine.js';

import {
  l1Norm,
  l2Norm,
  lInfNorm,
  lpNorm,
  CANDIDATE_FUNCTIONS
} from '../src/core/math/vectorNorms.js';

import { FEATURES, CATEGORIES } from '../src/config/features.js';
import { MODULE_DOCUMENTATION } from '../src/data/moduleDocumentation.js';
import katex from 'katex';
import fs from 'fs';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function assertClose(val, expected, message, epsilon = 0.001) {
  totalTests++;
  if (Math.abs(val - expected) < epsilon) {
    passedTests++;
    console.log(`  ✓ ${message} (${val} ≈ ${expected})`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message} (Expected ${expected}, got ${val})`);
  }
}

console.log('====================================================');
console.log('       MathLens Genuine Verification Suite          ');
console.log('====================================================\n');

// 1. Math Engine Core Operations
console.log('Test Group 1: Math Engine Operations');
{
  assert(clampPixel(-10) === 0, 'clampPixel negative value clamps to 0');
  assert(clampPixel(300) === 255, 'clampPixel excessive value clamps to 255');
  assert(clampPixel(128.6) === 129, 'clampPixel rounds float correctly');

  const mat = [[10, 20], [30, 40]];
  const scaled = scaleMatrix(mat, 2);
  assert(scaled[0][0] === 20 && scaled[1][1] === 80, 'scaleMatrix doubles values correctly');

  const matA = [[100, 50], [20, 10]];
  const matB = [[50, 50], [10, 5]];
  const blended = addMatrices(matA, matB, 0.5);
  assert(blended[0][0] === 75, 'addMatrices 50/50 convex blend calculates correctly');

  const diff = subtractMatrices(matA, matB, 'abs');
  assert(diff[0][0] === 50 && diff[0][1] === 0, 'subtractMatrices absolute difference calculates correctly');

  const inverted = invertMatrix([[0, 255], [100, 155]]);
  assert(inverted[0][0] === 255 && inverted[0][1] === 0, 'invertMatrix inverts image pixels 255 - X');

  const hadamard = hadamardProduct([[2, 3]], [[4, 5]]);
  assert(hadamard[0][0] === 8 && hadamard[0][1] === 15, 'hadamardProduct element-wise multiplication');

  const matMul = multiplyMatrices([[1, 2], [3, 4]], [[2, 0], [1, 2]]);
  assert(matMul[0][0] === 4 && matMul[0][1] === 4 && matMul[1][0] === 10 && matMul[1][1] === 8, 'multiplyMatrices 2x2 matrix product');
}

// 2. Transform Engine Operations
console.log('\nTest Group 2: Transform Engine (Linear Algebra 2D)');
{
  const idMat = { a: 1, b: 0, c: 0, d: 1 };
  assert(computeDeterminant(idMat) === 1, 'computeDeterminant of Identity is 1');

  const singular = { a: 2, b: 4, c: 1, d: 2 };
  assert(computeDeterminant(singular) === 0, 'computeDeterminant of singular matrix is 0');

  const rot90 = getRotationMatrix(90);
  assert(rot90.a === 0 && rot90.b === -1 && rot90.c === 1 && rot90.d === 0, 'Rotation 90° returns {a:0, b:-1, c:1, d:0}');

  const scaleMat = getScalingMatrix(2, 3);
  assert(scaleMat.a === 2 && scaleMat.d === 3, 'getScalingMatrix diagonal scaling values');

  const shearMat = getShearMatrix(0.5, 0);
  assert(shearMat.b === 0.5 && shearMat.c === 0, 'getShearMatrix shear values');

  const pt = transformPoint({ a: 2, b: 0, c: 0, d: 2 }, { x: 3, y: 4 });
  assert(pt.x === 6 && pt.y === 8, 'transformPoint scales 2D vector');

  const invScale = computeInverseMatrix(scaleMat);
  assert(invScale !== null, 'computeInverseMatrix invertible matrix');
  assertClose(invScale.a, 0.5, 'Inverse scale sx = 1/2');
  assertClose(invScale.d, 1 / 3, 'Inverse scale sy = 1/3');

  const invSingular = computeInverseMatrix(singular);
  assert(invSingular === null, 'computeInverseMatrix returns null for singular matrix (det = 0)');

  const composed = multiply2x2(getScalingMatrix(2, 2), getScalingMatrix(3, 3));
  assert(composed.a === 6 && composed.d === 6, 'multiply2x2 combines successive transformations');
}

// 3. Vector Norms & Mathematical Properties
console.log('\nTest Group 3: Vector Norms & Lp Metrics');
{
  const v = [3, 4];
  assert(l1Norm(v) === 7, 'L1 Norm (Manhattan) |3| + |4| = 7');
  assert(l2Norm(v) === 5, 'L2 Norm (Euclidean) sqrt(3^2 + 4^2) = 5');
  assert(lInfNorm(v) === 4, 'L-infinity Norm max(|3|, |4|) = 4');

  const lp2 = lpNorm(v, 2);
  assertClose(lp2, 5, 'Lp Norm with p=2 matches Euclidean norm');

  assert(CANDIDATE_FUNCTIONS.length >= 6, 'Vector norm playground candidates defined');
  const l2Cand = CANDIDATE_FUNCTIONS.find(c => c.id === 'l2');
  assert(l2Cand && l2Cand.isValidNorm === true, 'Candidate L2 is validated as a legitimate norm');

  const sumSqCand = CANDIDATE_FUNCTIONS.find(c => c.id === 'sumSq');
  assert(sumSqCand && sumSqCand.isValidNorm === false, 'Candidate sumSq correctly classified as non-norm (fails homogeneity)');
}

// 4. Feature Registry & Modules Integrity
console.log('\nTest Group 4: Feature Registry & Documentation Completeness');
{
  assert(FEATURES.length === 23, `All 23 visual laboratories registered (got ${FEATURES.length})`);
  assert(CATEGORIES.length >= 4, `Thematic chapters defined (got ${CATEGORIES.length})`);

  for (let i = 1; i <= 23; i++) {
    const feat = FEATURES.find(f => f.stepNumber === i);
    assert(feat !== undefined, `Feature Step ${i} exists`);

    const doc = MODULE_DOCUMENTATION[i];
    assert(doc !== undefined, `Documentation Step ${i} exists`);
    assert(typeof doc.title === 'string' && doc.title.length > 0, `Step ${i} documentation has valid title`);
    assert(typeof doc.whatIsThis === 'string' && doc.whatIsThis.length > 10, `Step ${i} has conceptual explanation`);
    assert(typeof doc.whyNeedIt === 'string' && doc.whyNeedIt.length > 10, `Step ${i} has motivation explanation`);
    assert(
      (Array.isArray(doc.howItWorks) && doc.howItWorks.length > 0) ||
      (typeof doc.howItWorks === 'string' && doc.howItWorks.length > 10),
      `Step ${i} has algorithmic explanation (${Array.isArray(doc.howItWorks) ? doc.howItWorks.length + ' steps' : 'text'})`
    );

    // KaTeX formula test
    let katexOk = true;
    try {
      katex.renderToString(doc.formula, { throwOnError: true, displayMode: true });
    } catch {
      katexOk = false;
    }
    assert(katexOk, `Step ${i} LaTeX formula compiles cleanly in KaTeX: "${doc.formula.slice(0, 35)}..."`);
  }
}

// 5. Contact Section Email Channels Verification
console.log('\nTest Group 5: Contact Channels & Email Directory');
{
  const contactCode = fs.readFileSync('src/components/contact/ContactSection.jsx', 'utf8');

  assert(
    contactCode.includes('payalwadhwa511@gmail.com'),
    'First email channel & form receiver is payalwadhwa511@gmail.com'
  );
  assert(
    contactCode.includes('payal_wadhwa@iiitvadodara.ac.in'),
    'Second email channel is payal_wadhwa@iiitvadodara.ac.in'
  );
  assert(
    contactCode.includes('202451091@iiitvadodara.ac.in'),
    'Third email channel is 202451091@iiitvadodara.ac.in'
  );
  assert(
    contactCode.includes('202451104@iiitvadodara.ac.in'),
    'Fourth email channel is 202451104@iiitvadodara.ac.in'
  );
  assert(
    contactCode.includes('202451113@iiitvadodara.ac.in'),
    'Fifth email channel is 202451113@iiitvadodara.ac.in'
  );
  assert(
    contactCode.includes('https://mathlens-7fj5.vercel.app/sendMail'),
    'Integrated with https://mathlens-7fj5.vercel.app/sendMail'
  );
}

console.log('\n====================================================');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${failedTests} failed)`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED SUCCESSFULLY! Genuine verification complete.\n');
}
