/**
 * Batch Font Converter - Convert multiple fonts to Base64 and generate embedded-fonts.css
 * 
 * Usage:
 *   node tools/generate-embedded-fonts.cjs
 * 
 * This script:
 * 1. Scans ./public/fonts/ for font files
 * 2. Converts each font to Base64
 * 3. Generates src/styles/embedded-fonts.css with @font-face rules
 * 4. Creates a ready-to-use CSS file for Puppeteer PDF generation
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FONTS_DIR = './public/fonts';
const OUTPUT_CSS = './src/styles/embedded-fonts.css';

// Font mapping: filename -> font properties
const FONT_CONFIG = {
  // Inter font family
  'Inter-Light.ttf': { family: 'Inter', weight: 300, style: 'normal' },
  'Inter-Regular.ttf': { family: 'Inter', weight: 400, style: 'normal' },
  'Inter-Medium.ttf': { family: 'Inter', weight: 500, style: 'normal' },
  'Inter-SemiBold.ttf': { family: 'Inter', weight: 600, style: 'normal' },
  'Inter-Bold.ttf': { family: 'Inter', weight: 700, style: 'normal' },
  
  // Roboto font family
  'Roboto-Light.ttf': { family: 'Roboto', weight: 300, style: 'normal' },
  'Roboto-Regular.ttf': { family: 'Roboto', weight: 400, style: 'normal' },
  'Roboto-Medium.ttf': { family: 'Roboto', weight: 500, style: 'normal' },
  'Roboto-Bold.ttf': { family: 'Roboto', weight: 700, style: 'normal' },
};

/**
 * Convert font file to Base64 string
 */
function convertFontToBase64(fontPath) {
  try {
    const fontBuffer = fs.readFileSync(fontPath);
    return fontBuffer.toString('base64');
  } catch (error) {
    console.error(`❌ Error reading ${fontPath}:`, error.message);
    return null;
  }
}

/**
 * Get font format and MIME type from file extension
 */
function getFontFormat(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  
  const formats = {
    '.ttf': { format: 'truetype', mime: 'font/ttf' },
    '.woff': { format: 'woff', mime: 'font/woff' },
    '.woff2': { format: 'woff2', mime: 'font/woff2' },
    '.otf': { format: 'opentype', mime: 'font/otf' },
  };
  
  return formats[ext] || { format: 'truetype', mime: 'font/ttf' };
}

/**
 * Generate @font-face CSS rule with embedded Base64 font
 */
function generateFontFace(fileName, base64, config) {
  const { format, mime } = getFontFormat(fileName);
  const { family, weight, style } = config;
  
  const size = (base64.length / 1024).toFixed(2);
  
  return `
/* ${fileName} - ${size} KB */
@font-face {
  font-family: "${family}";
  src: url("data:${mime};base64,${base64}") format("${format}");
  font-weight: ${weight};
  font-style: ${style};
  font-display: swap;
}`;
}

/**
 * Main function
 */
function main() {
  console.log('🚀 Starting batch font conversion...\n');
  
  // Check if fonts directory exists
  if (!fs.existsSync(FONTS_DIR)) {
    console.error(`❌ Fonts directory not found: ${FONTS_DIR}`);
    console.log('\n💡 Please create the directory and add your font files:');
    console.log(`   mkdir -p ${FONTS_DIR}`);
    console.log('   # Then add Inter-Regular.ttf, Roboto-Regular.ttf, etc.\n');
    process.exit(1);
  }
  
  // Scan fonts directory
  const fontFiles = fs.readdirSync(FONTS_DIR)
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.ttf', '.woff', '.woff2', '.otf'].includes(ext);
    });
  
  if (fontFiles.length === 0) {
    console.warn('⚠️  No font files found in', FONTS_DIR);
    console.log('\n💡 Expected font files:');
    Object.keys(FONT_CONFIG).forEach(file => console.log(`   - ${file}`));
    console.log('\n📥 Download fonts from:');
    console.log('   - Inter: https://rsms.me/inter/');
    console.log('   - Roboto: https://fonts.google.com/specimen/Roboto\n');
    process.exit(1);
  }
  
  console.log(`📂 Found ${fontFiles.length} font file(s):\n`);
  fontFiles.forEach(file => console.log(`   - ${file}`));
  console.log();
  
  // Generate CSS content
  let cssContent = `/**
 * Embedded Fonts for Puppeteer PDF Generation
 * 
 * This file contains Base64-encoded fonts that are embedded directly
 * in the CSS to ensure fonts render correctly in headless environments
 * (Puppeteer, Docker, CI/CD).
 * 
 * Generated: ${new Date().toISOString()}
 * 
 * IMPORTANT:
 * - Do NOT modify this file manually
 * - Regenerate using: node tools/generate-embedded-fonts.cjs
 * - File size: Large (Base64 encoding increases size by ~33%)
 */

/* ============================================
   EMBEDDED FONTS
   ============================================ */
`;
  
  let successCount = 0;
  let totalSize = 0;
  
  // Process each font file
  for (const fileName of fontFiles) {
    const fontPath = path.join(FONTS_DIR, fileName);
    const config = FONT_CONFIG[fileName];
    
    if (!config) {
      console.warn(`⚠️  Skipping ${fileName} - no configuration found`);
      continue;
    }
    
    console.log(`🔄 Converting ${fileName}...`);
    
    const base64 = convertFontToBase64(fontPath);
    if (!base64) {
      console.error(`   ❌ Failed to convert ${fileName}`);
      continue;
    }
    
    const sizeKB = (base64.length / 1024).toFixed(2);
    totalSize += parseFloat(sizeKB);
    
    console.log(`   ✅ Converted (${sizeKB} KB)`);
    
    cssContent += generateFontFace(fileName, base64, config);
    successCount++;
  }
  
  // Add usage examples
  cssContent += `

/* ============================================
   USAGE EXAMPLE
   ============================================ */

/*
body {
  font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.heading {
  font-family: 'Inter', sans-serif;
  font-weight: 700; /* Bold */
}

.body-text {
  font-family: 'Roboto', sans-serif;
  font-weight: 400; /* Regular */
}
*/

/* ============================================
   FONT FAMILIES INCLUDED
   ============================================ */

/*
${Array.from(new Set(Object.values(FONT_CONFIG).map(c => c.family))).map(family => {
  const weights = Object.values(FONT_CONFIG)
    .filter(c => c.family === family)
    .map(c => c.weight)
    .sort((a, b) => a - b);
  return `- ${family}: ${weights.join(', ')}`;
}).join('\n')}
*/
`;
  
  // Create output directory if not exists
  const outputDir = path.dirname(OUTPUT_CSS);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write CSS file
  fs.writeFileSync(OUTPUT_CSS, cssContent);
  
  console.log('\n✅ Font conversion complete!\n');
  console.log('📊 Summary:');
  console.log(`   - Converted: ${successCount}/${fontFiles.length} fonts`);
  console.log(`   - Total size: ${totalSize.toFixed(2)} KB`);
  console.log(`   - Output: ${OUTPUT_CSS}\n`);
  
  console.log('🎯 Next steps:');
  console.log('   1. Review the generated CSS file');
  console.log('   2. Import it in your Puppeteer HTML template');
  console.log('   3. Test PDF generation\n');
  
  console.log('💡 Usage in Puppeteer:');
  console.log('   const embeddedFontsCSS = fs.readFileSync("./src/styles/embedded-fonts.css", "utf8");');
  console.log('   const html = `<style>${embeddedFontsCSS}</style>${yourHtml}`;');
  console.log('   await page.setContent(html);\n');
}

// Run main function
main();
