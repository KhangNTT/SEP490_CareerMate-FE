/**
 * Font to Base64 Converter
 * 
 * Usage:
 *   node tools/convert-font-to-base64.cjs <font-file-path> [output-file]
 * 
 * Examples:
 *   node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Regular.ttf
 *   node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Bold.ttf ./src/styles/inter-bold-base64.txt
 * 
 * This script reads a font file and converts it to Base64 string
 * that can be embedded in @font-face CSS rules.
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: No font file specified');
  console.log('\n📖 Usage:');
  console.log('  node tools/convert-font-to-base64.cjs <font-file-path> [output-file]\n');
  console.log('📝 Examples:');
  console.log('  node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Regular.ttf');
  console.log('  node tools/convert-font-to-base64.cjs ./public/fonts/Roboto-Bold.woff2 ./output.txt\n');
  process.exit(1);
}

const fontFilePath = args[0];
const outputFilePath = args[1];

// Check if font file exists
if (!fs.existsSync(fontFilePath)) {
  console.error(`❌ Error: Font file not found: ${fontFilePath}`);
  process.exit(1);
}

console.log('🔄 Converting font to Base64...\n');
console.log('📂 Input file:', fontFilePath);

try {
  // Read font file as buffer
  const fontBuffer = fs.readFileSync(fontFilePath);
  
  // Convert to Base64
  const base64String = fontBuffer.toString('base64');
  
  // Get font file info
  const fileSize = (fontBuffer.length / 1024).toFixed(2);
  const base64Size = (base64String.length / 1024).toFixed(2);
  const fileName = path.basename(fontFilePath);
  const fileExt = path.extname(fontFilePath).toLowerCase();
  
  // Determine font format
  let fontFormat = 'truetype';
  if (fileExt === '.woff') fontFormat = 'woff';
  else if (fileExt === '.woff2') fontFormat = 'woff2';
  else if (fileExt === '.otf') fontFormat = 'opentype';
  
  // Determine MIME type
  let mimeType = 'font/ttf';
  if (fileExt === '.woff') mimeType = 'font/woff';
  else if (fileExt === '.woff2') mimeType = 'font/woff2';
  else if (fileExt === '.otf') mimeType = 'font/otf';
  
  console.log('📊 File info:');
  console.log(`  - Original size: ${fileSize} KB`);
  console.log(`  - Base64 size: ${base64Size} KB`);
  console.log(`  - Format: ${fontFormat}`);
  console.log(`  - MIME type: ${mimeType}\n`);
  
  // Generate @font-face CSS example
  const cssExample = `@font-face {
  font-family: "YourFontName"; /* Replace with actual font name */
  src: url("data:${mimeType};base64,${base64String.substring(0, 60)}...") format("${fontFormat}");
  font-weight: 400; /* Adjust weight: 300, 400, 600, 700 */
  font-style: normal; /* or italic */
  font-display: swap;
}`;
  
  console.log('✅ Conversion successful!\n');
  console.log('📋 Copy the Base64 string below:\n');
  console.log('─'.repeat(80));
  
  // If output file specified, write to file
  if (outputFilePath) {
    const outputContent = `/* Font: ${fileName} */
/* Format: ${fontFormat} */
/* Original size: ${fileSize} KB */
/* Base64 size: ${base64Size} KB */

${base64String}

/* CSS Example:
${cssExample}
*/`;
    
    fs.writeFileSync(outputFilePath, outputContent);
    console.log(`💾 Base64 string saved to: ${outputFilePath}\n`);
  } else {
    // Print to console (truncated for readability)
    if (base64String.length > 1000) {
      console.log(base64String.substring(0, 500));
      console.log('\n... (truncated) ...\n');
      console.log(base64String.substring(base64String.length - 500));
    } else {
      console.log(base64String);
    }
  }
  
  console.log('─'.repeat(80));
  console.log('\n💡 CSS Example:\n');
  console.log(cssExample);
  console.log('\n🎯 Next steps:');
  console.log('  1. Copy the Base64 string');
  console.log('  2. Paste it into your @font-face CSS rule');
  console.log('  3. Update font-family, font-weight, and font-style');
  console.log('  4. Use in your Puppeteer HTML template\n');
  
  // Return data for programmatic usage
  return {
    base64: base64String,
    format: fontFormat,
    mimeType: mimeType,
    size: {
      original: fileSize,
      base64: base64Size
    }
  };
  
} catch (error) {
  console.error('❌ Error converting font:', error.message);
  process.exit(1);
}
