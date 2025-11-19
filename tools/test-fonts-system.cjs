/**
 * Test script to check available fonts on Windows system
 * Run: node tools/test-fonts-system.cjs
 */

const { execSync } = require('child_process');
const os = require('os');

console.log('🔤 Checking system fonts...\n');
console.log('Platform:', os.platform());
console.log('OS:', os.type(), os.release());

if (os.platform() === 'win32') {
  try {
    // List fonts from Windows Registry
    const fontsCmd = 'reg query "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Fonts" /s';
    const result = execSync(fontsCmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    
    const fonts = result.split('\n')
      .filter(line => line.includes('REG_SZ'))
      .map(line => {
        const match = line.match(/\s+(.*?)\s+REG_SZ\s+(.*)/);
        return match ? { name: match[1].trim(), file: match[2].trim() } : null;
      })
      .filter(Boolean);

    console.log(`\n✅ Found ${fonts.length} fonts installed\n`);

    // Check for common fonts used in CVs
    const commonFonts = [
      'Inter',
      'Roboto', 
      'Arial',
      'Times New Roman',
      'Calibri',
      'Segoe UI',
      'Georgia',
      'Verdana'
    ];

    console.log('📋 Common CV fonts available:');
    commonFonts.forEach(fontName => {
      const found = fonts.some(f => 
        f.name.toLowerCase().includes(fontName.toLowerCase())
      );
      console.log(`  ${found ? '✅' : '❌'} ${fontName}`);
    });

    console.log('\n📦 Recommendation:');
    console.log('  - Use Google Fonts CDN links in HTML');
    console.log('  - Fallback to Arial, Segoe UI (Windows default)');
    console.log('  - Test with: https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

  } catch (error) {
    console.error('❌ Error reading fonts:', error.message);
  }
} else {
  console.log('⚠️  This script is designed for Windows. For Mac/Linux, check /Library/Fonts or /usr/share/fonts');
}

console.log('\n🎯 Next steps:');
console.log('  1. Ensure Google Fonts are loaded in HTML head');
console.log('  2. Set viewport to A4 dimensions (794×1123)');
console.log('  3. Use emulateMediaType("screen")');
console.log('  4. Set printBackground: true');
