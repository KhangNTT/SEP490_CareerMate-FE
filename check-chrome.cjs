/**
 * Helper to check Chrome installation on Windows
 * Run this in terminal: node check-chrome.js
 */

const fs = require('fs');
const path = require('path');

const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  path.join(process.env.LOCALAPPDATA || '', 'Google\\Chrome\\Application\\chrome.exe'),
];

console.log('🔍 Checking Chrome installation...\n');

let found = false;

chromePaths.forEach((chromePath) => {
  const exists = fs.existsSync(chromePath);
  console.log(`${exists ? '✅' : '❌'} ${chromePath}`);
  if (exists) {
    found = true;
    console.log(`   👉 Use this path in your code`);
  }
});

if (!found) {
  console.log('\n⚠️  Chrome not found!');
  console.log('📥 Please install Google Chrome from: https://www.google.com/chrome/');
  console.log('\nOr set CHROME_PATH environment variable to your Chrome executable location.');
} else {
  console.log('\n✅ Chrome found! PDF export should work.');
}

console.log('\n📝 Current platform:', process.platform);
console.log('📝 Node version:', process.version);
