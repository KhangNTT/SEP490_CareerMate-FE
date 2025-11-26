/**
 * Font Download Helper
 * 
 * This script provides instructions and links to download fonts
 * needed for embedded Base64 font generation.
 * 
 * Usage:
 *   node tools/download-fonts-helper.cjs
 */

const fs = require('fs');
const path = require('path');

const FONTS_DIR = './public/fonts';

console.log('📥 Font Download Helper\n');
console.log('═'.repeat(80));
console.log('\n🎯 Goal: Download fonts for Base64 embedding in PDF generation\n');

// Check if fonts directory exists
if (!fs.existsSync(FONTS_DIR)) {
  console.log('📁 Creating fonts directory...');
  fs.mkdirSync(FONTS_DIR, { recursive: true });
  console.log(`✅ Created: ${FONTS_DIR}\n`);
} else {
  console.log(`📁 Fonts directory exists: ${FONTS_DIR}\n`);
}

// List existing fonts
const existingFonts = fs.existsSync(FONTS_DIR) 
  ? fs.readdirSync(FONTS_DIR).filter(f => /\.(ttf|woff|woff2|otf)$/i.test(f))
  : [];

if (existingFonts.length > 0) {
  console.log('✅ Existing fonts found:\n');
  existingFonts.forEach(font => {
    const stats = fs.statSync(path.join(FONTS_DIR, font));
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`   - ${font} (${sizeKB} KB)`);
  });
  console.log();
} else {
  console.log('⚠️  No fonts found in directory\n');
}

console.log('═'.repeat(80));
console.log('\n📚 FONT SOURCES\n');

console.log('1️⃣  INTER FONT (Modern, clean sans-serif)\n');
console.log('   🔗 Website: https://rsms.me/inter/');
console.log('   📦 Download: https://github.com/rsms/inter/releases/latest');
console.log('   ✅ Recommended: Inter-Regular.ttf, Inter-SemiBold.ttf, Inter-Bold.ttf');
console.log('   📋 License: Open Font License (free for commercial use)\n');

console.log('2️⃣  ROBOTO FONT (Material Design)\n');
console.log('   🔗 Website: https://fonts.google.com/specimen/Roboto');
console.log('   📦 Download: Click "Download family" button');
console.log('   ✅ Recommended: Roboto-Regular.ttf, Roboto-Bold.ttf');
console.log('   📋 License: Apache License 2.0 (free for commercial use)\n');

console.log('3️⃣  GOOGLE FONTS (Alternative method)\n');
console.log('   🔗 Website: https://fonts.google.com/');
console.log('   📝 Steps:');
console.log('      1. Search for font (Inter, Roboto, etc.)');
console.log('      2. Click font card');
console.log('      3. Click "Download family" button in top right');
console.log('      4. Extract ZIP and copy .ttf files to ./public/fonts/\n');

console.log('═'.repeat(80));
console.log('\n📋 REQUIRED FONTS FOR CV TEMPLATES\n');

const requiredFonts = [
  { name: 'Inter-Regular.ttf', weight: 400, essential: true },
  { name: 'Inter-SemiBold.ttf', weight: 600, essential: true },
  { name: 'Inter-Bold.ttf', weight: 700, essential: true },
  { name: 'Inter-Light.ttf', weight: 300, essential: false },
  { name: 'Inter-Medium.ttf', weight: 500, essential: false },
  { name: 'Roboto-Regular.ttf', weight: 400, essential: true },
  { name: 'Roboto-Bold.ttf', weight: 700, essential: true },
  { name: 'Roboto-Light.ttf', weight: 300, essential: false },
  { name: 'Roboto-Medium.ttf', weight: 500, essential: false },
];

console.log('Essential fonts (required):');
requiredFonts.filter(f => f.essential).forEach(font => {
  const exists = existingFonts.includes(font.name);
  console.log(`   ${exists ? '✅' : '❌'} ${font.name} (weight: ${font.weight})`);
});

console.log('\nOptional fonts (recommended):');
requiredFonts.filter(f => !f.essential).forEach(font => {
  const exists = existingFonts.includes(font.name);
  console.log(`   ${exists ? '✅' : '⭕'} ${font.name} (weight: ${font.weight})`);
});

console.log('\n═'.repeat(80));
console.log('\n🚀 NEXT STEPS\n');

const missingEssential = requiredFonts
  .filter(f => f.essential)
  .filter(f => !existingFonts.includes(f.name));

if (missingEssential.length > 0) {
  console.log('❌ Missing essential fonts:\n');
  missingEssential.forEach(f => console.log(`   - ${f.name}`));
  console.log('\n📥 Please download and place them in ./public/fonts/\n');
} else {
  console.log('✅ All essential fonts are present!\n');
}

console.log('After downloading fonts, run:\n');
console.log('   1. node tools/generate-embedded-fonts.cjs');
console.log('      → Converts fonts to Base64 and generates embedded-fonts.css\n');
console.log('   2. Test PDF generation');
console.log('      → Reload your app and export a PDF\n');
console.log('   3. Verify fonts render correctly in the PDF\n');

console.log('═'.repeat(80));
console.log('\n💡 TIPS\n');
console.log('   • Prefer TTF format (universal support)');
console.log('   • WOFF2 has better compression (~30% smaller)');
console.log('   • Include only weights you actually use (400, 600, 700)');
console.log('   • Each font weight adds ~50-200 KB to final CSS');
console.log('   • Total embedded-fonts.css can be 500KB - 2MB\n');

console.log('═'.repeat(80));
console.log('\n📚 DOCUMENTATION\n');
console.log('   Read: EMBEDDED_FONTS_GUIDE.md for full documentation\n');

console.log('═'.repeat(80));
