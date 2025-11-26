# 🎨 Embedded Base64 Fonts for Puppeteer PDF Generation

## 📖 Overview

This guide shows how to embed fonts as Base64 strings directly in CSS, ensuring 100% reliable font rendering in Puppeteer PDFs across all environments (local, Docker, CI/CD).

---

## 🚀 Quick Start

### Step 1: Download Fonts

Download font files (.ttf, .woff2) and place them in `./public/fonts/`:

```bash
# Create fonts directory
mkdir -p public/fonts

# Download Inter font from https://rsms.me/inter/
# Download Roboto from https://fonts.google.com/specimen/Roboto

# Expected structure:
# ./public/fonts/
#   ├── Inter-Regular.ttf
#   ├── Inter-SemiBold.ttf
#   ├── Inter-Bold.ttf
#   ├── Roboto-Regular.ttf
#   └── Roboto-Bold.ttf
```

### Step 2: Convert Fonts to Base64

**Option A: Convert single font**
```bash
node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Regular.ttf
```

**Option B: Batch convert all fonts** (Recommended)
```bash
node tools/generate-embedded-fonts.cjs
```

This will:
- Scan `./public/fonts/` for font files
- Convert each to Base64
- Generate `./src/styles/embedded-fonts.css` with all @font-face rules

### Step 3: Use in Puppeteer

Update your `src/app/api/export-pdf/route.ts`:

```typescript
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  // ... browser setup ...
  
  // ✅ Read embedded fonts CSS
  const embeddedFontsPath = path.join(process.cwd(), 'src/styles/embedded-fonts.css');
  const embeddedFontsCSS = fs.existsSync(embeddedFontsPath) 
    ? fs.readFileSync(embeddedFontsPath, 'utf8')
    : '';
  
  // ✅ Inject embedded fonts + your styles
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          /* Embedded Base64 fonts */
          ${embeddedFontsCSS}
          
          /* Your custom styles */
          body {
            font-family: 'Inter', 'Roboto', sans-serif;
            font-size: 14px;
            line-height: 1.5;
          }
          
          h1, h2, h3 {
            font-family: 'Inter', sans-serif;
            font-weight: 700;
          }
          
          /* ... rest of your CSS ... */
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
  
  // ✅ Set content with embedded fonts
  await page.setContent(styledHtml, { 
    waitUntil: 'networkidle0',
    timeout: 30000 
  });
  
  // ✅ Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  
  // ... return response ...
}
```

---

## 🛠️ Tools Reference

### 1. `convert-font-to-base64.cjs`

Convert a single font file to Base64.

**Usage:**
```bash
node tools/convert-font-to-base64.cjs <font-file> [output-file]
```

**Examples:**
```bash
# Print to console
node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Regular.ttf

# Save to file
node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Bold.ttf ./inter-bold.txt
```

**Output:**
- Base64 string (printed or saved)
- File size info
- CSS @font-face example

---

### 2. `generate-embedded-fonts.cjs`

Batch convert all fonts and generate complete CSS file.

**Usage:**
```bash
node tools/generate-embedded-fonts.cjs
```

**What it does:**
1. Scans `./public/fonts/` for `.ttf`, `.woff`, `.woff2`, `.otf` files
2. Converts each to Base64
3. Generates `./src/styles/embedded-fonts.css` with all @font-face rules
4. Includes usage examples in comments

**Configuration:**

Edit `FONT_CONFIG` in the script to match your font files:

```javascript
const FONT_CONFIG = {
  'Inter-Light.ttf': { family: 'Inter', weight: 300, style: 'normal' },
  'Inter-Regular.ttf': { family: 'Inter', weight: 400, style: 'normal' },
  'Inter-SemiBold.ttf': { family: 'Inter', weight: 600, style: 'normal' },
  'Inter-Bold.ttf': { family: 'Inter', weight: 700, style: 'normal' },
  
  'Roboto-Regular.ttf': { family: 'Roboto', weight: 400, style: 'normal' },
  'Roboto-Bold.ttf': { family: 'Roboto', weight: 700, style: 'normal' },
};
```

---

## 📋 Font File Structure

### Recommended Structure

```
project-root/
├── public/
│   └── fonts/
│       ├── Inter-Light.ttf         (300)
│       ├── Inter-Regular.ttf       (400) ← Essential
│       ├── Inter-Medium.ttf        (500)
│       ├── Inter-SemiBold.ttf      (600) ← Essential
│       ├── Inter-Bold.ttf          (700) ← Essential
│       ├── Roboto-Light.ttf        (300)
│       ├── Roboto-Regular.ttf      (400) ← Essential
│       ├── Roboto-Medium.ttf       (500)
│       └── Roboto-Bold.ttf         (700) ← Essential
│
├── src/
│   └── styles/
│       ├── embedded-fonts.css           ← Generated
│       └── embedded-fonts.template.css  ← Template
│
└── tools/
    ├── convert-font-to-base64.cjs
    └── generate-embedded-fonts.cjs
```

### Font Weights Reference

| Weight | Name       | Usage                    |
|--------|------------|--------------------------|
| 300    | Light      | Subtle text              |
| 400    | Regular    | Body text (default)      |
| 500    | Medium     | Emphasis                 |
| 600    | SemiBold   | Subheadings              |
| 700    | Bold       | Headings, strong text    |

---

## ⚠️ Important Notes

### ✅ Advantages of Base64 Fonts

- **100% Reliable**: Works in Docker, CI/CD, serverless
- **No External Dependencies**: No Google Fonts CDN, no network requests
- **Offline**: Works without internet
- **No CORS Issues**: Everything is inline
- **Consistent Rendering**: Same result everywhere

### ❌ Disadvantages

- **Large File Size**: Base64 increases size by ~33%
  - Each font weight: ~50-200 KB
  - Total CSS: 500 KB - 2 MB for 5-10 fonts
- **Not Cached Separately**: Can't leverage browser cache
- **Slower Initial Load**: Large inline CSS
- **Bundle Size**: Increases Next.js bundle if imported in client code

### 💡 Best Practices

1. **Use ONLY for PDF generation** (Puppeteer/headless)
2. **Keep using Google Fonts for web pages** (client-side)
3. **Include only essential weights**: 400, 600, 700 (skip 300, 500 if not needed)
4. **Prefer WOFF2 format**: Better compression than TTF
5. **Don't commit large CSS to git**: Add to .gitignore if > 1 MB
6. **Regenerate after adding fonts**: Run `generate-embedded-fonts.cjs` again

---

## 🧪 Testing

### Test Font Conversion

```bash
# Test single font conversion
node tools/convert-font-to-base64.cjs ./public/fonts/Inter-Regular.ttf

# Expected output:
# ✅ Conversion successful!
# 📊 File info:
#   - Original size: 165.23 KB
#   - Base64 size: 220.31 KB
#   - Format: truetype
```

### Test Batch Conversion

```bash
node tools/generate-embedded-fonts.cjs

# Expected output:
# 🚀 Starting batch font conversion...
# 📂 Found 5 font file(s)
# 🔄 Converting Inter-Regular.ttf...
#    ✅ Converted (220.31 KB)
# ...
# ✅ Font conversion complete!
```

### Test PDF Generation

```typescript
// In your API route or test file
const html = '<h1>Test</h1><p>Hello World</p>';
const response = await fetch('/api/export-pdf', {
  method: 'POST',
  body: JSON.stringify({ html }),
});

const pdfBlob = await response.blob();
// Open PDF and check if fonts render correctly
```

---

## 🔧 Troubleshooting

### Fonts not rendering in PDF?

**Check 1: CSS file exists**
```bash
ls -la src/styles/embedded-fonts.css
```

**Check 2: CSS is being injected**
```typescript
console.log('Embedded fonts CSS length:', embeddedFontsCSS.length);
// Should be > 100,000 characters if fonts are embedded
```

**Check 3: Font-family matches**
```css
/* In CSS */
font-family: 'Inter', sans-serif;

/* In @font-face */
@font-face {
  font-family: "Inter";  /* ← Must match exactly */
}
```

**Check 4: Font weight matches**
```css
.bold-text {
  font-weight: 700;  /* ← Must have @font-face with weight: 700 */
}
```

### File size too large?

**Solution 1: Use fewer weights**
```javascript
// Only include essential weights
const FONT_CONFIG = {
  'Inter-Regular.ttf': { family: 'Inter', weight: 400, style: 'normal' },
  'Inter-Bold.ttf': { family: 'Inter', weight: 700, style: 'normal' },
  // Skip 300, 500, 600 if not needed
};
```

**Solution 2: Use WOFF2 format**
- Download WOFF2 instead of TTF
- ~30% smaller than TTF
- Better compression

**Solution 3: Subset fonts**
```bash
# Use pyftsubset to include only needed characters
pip install fonttools
pyftsubset Inter-Regular.ttf \
  --output-file=Inter-Regular-subset.woff2 \
  --flavor=woff2 \
  --unicodes=U+0020-007F,U+00A0-00FF
```

---

## 📚 Resources

- [Inter Font](https://rsms.me/inter/) - Modern, clean sans-serif
- [Roboto Font](https://fonts.google.com/specimen/Roboto) - Material Design font
- [WOFF2 Compression](https://www.w3.org/TR/WOFF2/) - Web font format
- [Font Subsetting](https://github.com/fonttools/fonttools) - Reduce font file size
- [Puppeteer PDF API](https://pptr.dev/api/puppeteer.page.pdf) - PDF generation options

---

## ✅ Checklist

Before deploying to production:

- [ ] Downloaded font files to `./public/fonts/`
- [ ] Configured `FONT_CONFIG` in `generate-embedded-fonts.cjs`
- [ ] Ran `node tools/generate-embedded-fonts.cjs`
- [ ] Verified `./src/styles/embedded-fonts.css` exists
- [ ] Updated `export-pdf/route.ts` to read and inject CSS
- [ ] Tested PDF generation locally
- [ ] Checked PDF fonts render correctly
- [ ] Verified fonts work in Docker container
- [ ] File size acceptable (< 2 MB total CSS)
- [ ] Added `embedded-fonts.css` to .gitignore (if > 1 MB)
- [ ] Documented font usage in team wiki

---

**✅ Status**: Ready for production
**📅 Created**: November 15, 2025
**👤 Author**: GitHub Copilot
