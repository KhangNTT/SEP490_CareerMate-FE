/**
 * Test file for CV File Naming System
 * 
 * Run these tests to verify the file naming utilities work correctly
 */

import {
  extractOriginalName,
  generateStorageName,
  getFileExtension,
  isValidFileExtension,
  sanitizeFileName,
} from '../utils/cvFileNameHelper';

console.log('🧪 Running CV File Name Tests...\n');

// ===== Test 1: Generate Storage Name =====
console.log('📝 Test 1: Generate Storage Name');
console.log('─────────────────────────────────');

const testFiles = [
  'CV.pdf',
  'My Resume.pdf',
  'document.docx',
  'photo.jpg',
  'file with spaces.pdf',
  'no-extension',
];

testFiles.forEach(fileName => {
  const storageName = generateStorageName(fileName);
  console.log(`Input:  "${fileName}"`);
  console.log(`Output: "${storageName}"`);
  console.log(`✓ Contains _CM_: ${storageName.includes('_CM_')}`);
  console.log(`✓ Has timestamp: ${/\d{13}/.test(storageName)}`);
  console.log('');
});

// ===== Test 2: Extract Original Name =====
console.log('📝 Test 2: Extract Original Name');
console.log('─────────────────────────────────');

const testStorageNames = [
  'CV_CM_1732702341123.pdf',
  'My Resume_CM_1732702341123.pdf',
  'document_CM_1732702341123.docx',
  'photo_CM_1732702341123.jpg',
  'CV.pdf', // No separator
];

testStorageNames.forEach(storageName => {
  const originalName = extractOriginalName(storageName);
  console.log(`Storage: "${storageName}"`);
  console.log(`Display: "${originalName}"`);
  console.log('');
});

// ===== Test 3: Round Trip Test =====
console.log('📝 Test 3: Round Trip Test (Original → Storage → Original)');
console.log('──────────────────────────────────────────────────────────');

const roundTripFiles = [
  'CV.pdf',
  'My Resume.pdf',
  'Test Document.docx',
];

roundTripFiles.forEach(original => {
  const storage = generateStorageName(original);
  const extracted = extractOriginalName(storage);
  const matches = original === extracted;
  
  console.log(`Original:  "${original}"`);
  console.log(`Storage:   "${storage}"`);
  console.log(`Extracted: "${extracted}"`);
  console.log(`✓ Match:   ${matches ? '✅ YES' : '❌ NO'}`);
  console.log('');
});

// ===== Test 4: File Extension =====
console.log('📝 Test 4: Get File Extension');
console.log('──────────────────────────────');

const extensionTests = [
  'CV.pdf',
  'document.docx',
  'photo.jpg',
  'file.tar.gz',
  'noextension',
];

extensionTests.forEach(fileName => {
  const ext = getFileExtension(fileName);
  console.log(`File: "${fileName}" → Extension: "${ext}"`);
});
console.log('');

// ===== Test 5: File Validation =====
console.log('📝 Test 5: File Validation');
console.log('───────────────────────────');

const validationTests = [
  { file: 'CV.pdf', expected: true },
  { file: 'resume.docx', expected: true },
  { file: 'photo.jpg', expected: true },
  { file: 'image.png', expected: true },
  { file: 'document.doc', expected: true },
  { file: 'virus.exe', expected: false },
  { file: 'script.js', expected: false },
  { file: 'data.csv', expected: false },
];

validationTests.forEach(({ file, expected }) => {
  const isValid = isValidFileExtension(file);
  const result = isValid === expected ? '✅ PASS' : '❌ FAIL';
  console.log(`${result} - "${file}" → ${isValid} (expected: ${expected})`);
});
console.log('');

// ===== Test 6: Sanitize File Names =====
console.log('📝 Test 6: Sanitize File Names');
console.log('───────────────────────────────');

const sanitizeTests = [
  'My CV.pdf',
  'CV (final)!.pdf',
  'Resume@2024#.pdf',
  'File   with   spaces.pdf',
  'Résumé.pdf',
  '!!!Special!!!.pdf',
];

sanitizeTests.forEach(fileName => {
  const sanitized = sanitizeFileName(fileName);
  console.log(`Before: "${fileName}"`);
  console.log(`After:  "${sanitized}"`);
  console.log('');
});

// ===== Test 7: Edge Cases =====
console.log('📝 Test 7: Edge Cases');
console.log('─────────────────────');

const edgeCases = [
  { input: '', desc: 'Empty string' },
  { input: '.pdf', desc: 'Only extension' },
  { input: 'file.', desc: 'Trailing dot' },
  { input: 'file..pdf', desc: 'Double dots' },
  { input: 'file_CM_123.pdf', desc: 'Already has _CM_' },
];

edgeCases.forEach(({ input, desc }) => {
  try {
    const storage = generateStorageName(input);
    const extracted = extractOriginalName(storage);
    console.log(`${desc}:`);
    console.log(`  Input:     "${input}"`);
    console.log(`  Storage:   "${storage}"`);
    console.log(`  Extracted: "${extracted}"`);
    console.log(`  ✓ No errors`);
  } catch (error) {
    console.log(`${desc}:`);
    console.log(`  Input: "${input}"`);
    console.log(`  ❌ Error: ${error}`);
  }
  console.log('');
});

// ===== Test 8: Performance Test =====
console.log('📝 Test 8: Performance Test');
console.log('────────────────────────────');

const iterations = 10000;
const testFile = 'CV.pdf';

console.time('Generate 10k storage names');
for (let i = 0; i < iterations; i++) {
  generateStorageName(testFile);
}
console.timeEnd('Generate 10k storage names');

const testStorage = 'CV_CM_1732702341123.pdf';
console.time('Extract 10k original names');
for (let i = 0; i < iterations; i++) {
  extractOriginalName(testStorage);
}
console.timeEnd('Extract 10k original names');

console.log('');

// ===== Test Summary =====
console.log('═══════════════════════════════════');
console.log('✅ All Tests Complete!');
console.log('═══════════════════════════════════');

// Export for use in actual tests
export const testResults = {
  generateStorageName: {
    'CV.pdf': generateStorageName('CV.pdf'),
    'My Resume.pdf': generateStorageName('My Resume.pdf'),
  },
  extractOriginalName: {
    'CV_CM_1732702341123.pdf': extractOriginalName('CV_CM_1732702341123.pdf'),
    'My Resume_CM_1732702341123.pdf': extractOriginalName('My Resume_CM_1732702341123.pdf'),
  },
  validation: {
    'CV.pdf': isValidFileExtension('CV.pdf'),
    'virus.exe': isValidFileExtension('virus.exe'),
  },
};

/**
 * Verify expected behavior
 */
export function verifyBehavior() {
  const errors: string[] = [];

  // Test 1: Generate and extract should be reversible
  const original1 = 'CV.pdf';
  const storage1 = generateStorageName(original1);
  const extracted1 = extractOriginalName(storage1);
  if (original1 !== extracted1) {
    errors.push(`Round trip failed for "${original1}": got "${extracted1}"`);
  }

  // Test 2: Storage name should contain _CM_
  if (!storage1.includes('_CM_')) {
    errors.push('Storage name should contain _CM_ separator');
  }

  // Test 3: Storage name should have timestamp
  if (!/\d{13}/.test(storage1)) {
    errors.push('Storage name should have 13-digit timestamp');
  }

  // Test 4: Valid extensions should pass
  if (!isValidFileExtension('CV.pdf')) {
    errors.push('Valid PDF should pass validation');
  }

  // Test 5: Invalid extensions should fail
  if (isValidFileExtension('virus.exe')) {
    errors.push('Invalid EXE should fail validation');
  }

  // Test 6: Empty input should not crash
  try {
    generateStorageName('');
    extractOriginalName('');
  } catch (error) {
    errors.push('Empty input should not throw error');
  }

  if (errors.length > 0) {
    console.error('❌ Verification Errors:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }

  console.log('✅ All behavior verifications passed!');
  return true;
}

// Run verification
verifyBehavior();
