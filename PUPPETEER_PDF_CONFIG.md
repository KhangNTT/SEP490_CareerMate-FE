# 🎯 Puppeteer PDF Configuration Guide

Based on official Puppeteer documentation and best practices.

---

## 📋 Table of Contents

1. [Viewport Configuration](#viewport-configuration)
2. [PDF Options](#pdf-options)
3. [Browser Launch Args](#browser-launch-args)
4. [Content Loading](#content-loading)
5. [Media Type Emulation](#media-type-emulation)
6. [Common Configurations](#common-configurations)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

---

## 🖥️ Viewport Configuration

### What is Viewport?

The viewport determines the size of the browser window where content is rendered **before** converting to PDF.

### A4 Paper Dimensions

```typescript
// A4 paper: 210mm × 297mm
// At 96 DPI: 794px × 1123px

await page.setViewport({
  width: 794,              // A4 width at 96 DPI
  height: 1123,            // A4 height at 96 DPI
  deviceScaleFactor: 1,    // Standard DPI (use 2 for retina)
});
```

### Common Paper Sizes (at 96 DPI)

| Format | Size (mm) | Viewport (px) | Use Case |
|--------|-----------|---------------|----------|
| **A4** | 210 × 297 | 794 × 1123 | Standard documents, CVs |
| **Letter** | 215.9 × 279.4 | 816 × 1056 | US standard |
| **Legal** | 215.9 × 355.6 | 816 × 1344 | Legal documents |
| **A3** | 297 × 420 | 1123 × 1587 | Large posters |

### Device Scale Factor

```typescript
deviceScaleFactor: 1  // Standard displays (96 DPI)
deviceScaleFactor: 2  // Retina displays (192 DPI)
```

**Note:** Higher scale = sharper text but larger file size.

---

## 📄 PDF Options

### Complete Configuration

```typescript
const pdfBuffer = await page.pdf({
  // ============================================
  // PAPER FORMAT
  // ============================================
  format: "A4",                    // Pre-defined format
  // OR use custom dimensions:
  // width: "210mm",
  // height: "297mm",
  
  // ============================================
  // ORIENTATION
  // ============================================
  landscape: false,                // false = portrait, true = landscape
  
  // ============================================
  // SCALE
  // ============================================
  scale: 1,                        // Range: 0.1 - 2
                                   // 1 = 100%, 0.5 = 50%, 2 = 200%
  
  // ============================================
  // MARGINS
  // ============================================
  margin: {
    top: "10mm",                   // Supports: mm, cm, in, px
    right: "10mm",
    bottom: "10mm",
    left: "10mm",
  },
  
  // ============================================
  // BACKGROUND & COLORS
  // ============================================
  printBackground: true,           // Include background colors/images
  omitBackground: false,           // false = white bg, true = transparent
  
  // ============================================
  // HEADER & FOOTER
  // ============================================
  displayHeaderFooter: false,      // Enable header/footer
  headerTemplate: "",              // HTML for header
  footerTemplate: "",              // HTML for footer
  
  // ============================================
  // PAGE SIZE BEHAVIOR
  // ============================================
  preferCSSPageSize: false,        // false = use 'format' option
                                   // true = respect CSS @page size
  
  // ============================================
  // PAGE RANGES
  // ============================================
  pageRanges: "",                  // "" = all pages
                                   // "1-5, 8, 11-13" = specific pages
  
  // ============================================
  // FONT LOADING
  // ============================================
  waitForFonts: true,              // Wait for document.fonts.ready
  
  // ============================================
  // TIMEOUT
  // ============================================
  timeout: 30000,                  // 30 seconds (0 = no timeout)
  
  // ============================================
  // ACCESSIBILITY (Experimental)
  // ============================================
  tagged: false,                   // Generate tagged/accessible PDF
  outline: false,                  // Generate document outline
  
  // ============================================
  // FILE PATH (Optional)
  // ============================================
  // path: "./output.pdf",         // Save to disk (omit to return buffer)
});
```

### Header/Footer Templates

```typescript
displayHeaderFooter: true,
headerTemplate: `
  <div style="font-size: 10px; width: 100%; text-align: center;">
    <span class="title"></span> - Page <span class="pageNumber"></span>
  </div>
`,
footerTemplate: `
  <div style="font-size: 10px; width: 100%; text-align: center;">
    <span class="date"></span> - Page <span class="pageNumber"></span> of <span class="totalPages"></span>
  </div>
`,
```

**Available CSS Classes:**
- `.date` - Formatted print date
- `.title` - Document title
- `.url` - Document URL
- `.pageNumber` - Current page number
- `.totalPages` - Total pages

---

## 🚀 Browser Launch Args

### Development Configuration

```typescript
const browser = await puppeteer.launch({
  headless: true,                  // No UI
  
  args: [
    // Security
    "--no-sandbox",                // Required for Docker/CI
    "--disable-setuid-sandbox",    // Required for Docker/CI
    
    // Performance
    "--disable-dev-shm-usage",     // Overcome limited resources
    "--disable-gpu",               // Disable GPU acceleration
    
    // Networking
    "--disable-web-security",      // Allow cross-origin requests
    "--disable-features=IsolateOrigins,site-per-process",
    
    // Rendering
    "--font-render-hinting=none",  // Better font rendering
    "--disable-software-rasterizer",
    
    // Additional optimizations
    "--single-process",            // Run in single process
    "--no-zygote",                 // Disable zygote process
  ],
  
  defaultViewport: {
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  },
});
```

### Production (Serverless) Configuration

```typescript
import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

const browser = await puppeteerCore.launch({
  args: chromium.args,             // Pre-configured for AWS Lambda
  executablePath: await chromium.executablePath(),
  headless: true,
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});
```

---

## 📡 Content Loading

### Set Content with Wait Strategies

```typescript
// ✅ Best: Wait for all network requests
await page.setContent(html, {
  waitUntil: "networkidle0",       // Wait for 0 network connections
  timeout: 30000,                  // 30 second timeout
});

// Alternative strategies:
// waitUntil: "load"                // Wait for 'load' event
// waitUntil: "domcontentloaded"    // Wait for DOM ready
// waitUntil: "networkidle2"        // Wait for ≤2 network connections
```

### Wait for Fonts

```typescript
// Method 1: Explicit wait (recommended for custom fonts)
await page.evaluateHandle('document.fonts.ready');

// Method 2: Use waitForFonts in pdf() options
const pdf = await page.pdf({
  waitForFonts: true,              // Default behavior
});
```

### Wait for Images

```typescript
// Wait for all images to load
await page.evaluate(() => {
  return Promise.all(
    Array.from(document.images)
      .filter(img => !img.complete)
      .map(img => new Promise(resolve => {
        img.onload = img.onerror = resolve;
      }))
  );
});
```

---

## 🎨 Media Type Emulation

### Screen vs Print Media

```typescript
// Render as if viewing on screen
await page.emulateMediaType("screen");

// Render with @media print styles
await page.emulateMediaType("print");
```

### When to Use Each

| Media Type | Use When | CSS Applied |
|------------|----------|-------------|
| **screen** | You want exact on-screen appearance | `@media screen` styles |
| **print** | You want print-specific layout | `@media print` styles |

**Recommendation:** Use `screen` for CV templates to preserve colors and layout.

---

## 🔧 Common Configurations

### Configuration 1: High-Quality CV Export

```typescript
// Viewport: A4 with retina quality
await page.setViewport({
  width: 794,
  height: 1123,
  deviceScaleFactor: 2,            // High DPI
});

// Content loading
await page.setContent(html, {
  waitUntil: "networkidle0",
  timeout: 30000,
});

await page.evaluateHandle('document.fonts.ready');

// PDF generation
const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: false,
  scale: 1,
  margin: {
    top: "5mm",
    right: "5mm",
    bottom: "5mm",
    left: "5mm",
  },
  waitForFonts: true,
});
```

### Configuration 2: Fast Preview (Low Quality)

```typescript
await page.setViewport({
  width: 794,
  height: 1123,
  deviceScaleFactor: 1,            // Standard DPI
});

await page.setContent(html, {
  waitUntil: "domcontentloaded",   // Faster
  timeout: 10000,
});

const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  scale: 0.8,                      // Smaller scale
  margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
  waitForFonts: false,             // Skip font waiting
});
```

### Configuration 3: Multi-Page Document

```typescript
await page.setViewport({
  width: 794,
  height: 1123,
  deviceScaleFactor: 1,
});

await page.setContent(html, {
  waitUntil: "networkidle0",
  timeout: 60000,                  // Longer timeout for large docs
});

const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  margin: {
    top: "15mm",                   // Space for header
    bottom: "15mm",                // Space for footer
    left: "10mm",
    right: "10mm",
  },
  displayHeaderFooter: true,
  headerTemplate: `<div style="font-size: 10px; text-align: center; width: 100%;">My Company</div>`,
  footerTemplate: `<div style="font-size: 10px; text-align: center; width: 100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`,
});
```

### Configuration 4: Landscape Report

```typescript
await page.setViewport({
  width: 1123,                     // Swapped dimensions for landscape
  height: 794,
  deviceScaleFactor: 1,
});

const pdf = await page.pdf({
  format: "A4",
  landscape: true,                 // Landscape orientation
  printBackground: true,
  margin: {
    top: "10mm",
    right: "10mm",
    bottom: "10mm",
    left: "10mm",
  },
});
```

---

## ⚡ Performance Optimization

### 1. Minimize Network Requests

```typescript
// ✅ Embed CSS inline
const styledHtml = `
  <style>${cssContent}</style>
  ${html}
`;

// ❌ Avoid external CSS
// <link rel="stylesheet" href="https://...">
```

### 2. Use Base64 Fonts

```typescript
// ✅ Embed fonts as Base64
@font-face {
  font-family: "Inter";
  src: url("data:font/ttf;base64,...") format("truetype");
}

// ❌ Avoid external font URLs
// @import url('https://fonts.googleapis.com/...');
```

### 3. Optimize Images

```typescript
// Compress images before embedding
img {
  max-width: 100%;
  height: auto;
}
```

### 4. Reduce Timeout for Fast Generation

```typescript
await page.setContent(html, {
  waitUntil: "domcontentloaded",   // Faster than networkidle0
  timeout: 10000,
});
```

### 5. Disable Unnecessary Features

```typescript
const browser = await puppeteer.launch({
  args: [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
  ],
});
```

---

## 🐛 Troubleshooting

### Problem 1: Blank PDF

**Cause:** Content not loaded before PDF generation.

**Solution:**
```typescript
// ✅ Wait for content
await page.setContent(html, {
  waitUntil: "networkidle0",
  timeout: 30000,
});

// ✅ Check if content exists
const bodyHandle = await page.$("body");
const innerHTML = await page.evaluate(el => el.innerHTML, bodyHandle);
console.log("Content length:", innerHTML.length);
```

---

### Problem 2: Missing Colors

**Cause:** `printBackground: false`

**Solution:**
```typescript
const pdf = await page.pdf({
  printBackground: true,           // ✅ Enable background rendering
});

// Also add to CSS:
* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}
```

---

### Problem 3: Missing Fonts

**Cause:** Fonts not loaded before PDF generation.

**Solution:**
```typescript
// ✅ Wait for fonts explicitly
await page.evaluateHandle('document.fonts.ready');

// ✅ Or use embedded Base64 fonts
const styledHtml = `
  <style>
    @font-face {
      font-family: "Inter";
      src: url("data:font/ttf;base64,...") format("truetype");
    }
  </style>
  ${html}
`;
```

---

### Problem 4: Layout Broken

**Cause:** Viewport size doesn't match PDF format.

**Solution:**
```typescript
// ✅ Match viewport to PDF format
await page.setViewport({ width: 794, height: 1123 }); // A4

const pdf = await page.pdf({
  format: "A4",                    // Same format
});
```

---

### Problem 5: Content Cut Off

**Cause:** Fixed heights or `overflow: hidden`.

**Solution:**
```css
/* ❌ Avoid */
.container {
  height: 100vh;
  overflow: hidden;
}

/* ✅ Use instead */
.container {
  height: auto;
  overflow: visible;
}
```

---

### Problem 6: Slow Generation

**Cause:** Waiting for external resources.

**Solution:**
```typescript
// ✅ Use shorter timeout
await page.setContent(html, {
  waitUntil: "domcontentloaded",   // Faster
  timeout: 10000,
});

// ✅ Disable images (if not needed)
await page.setRequestInterception(true);
page.on('request', (req) => {
  if (req.resourceType() === 'image') {
    req.abort();
  } else {
    req.continue();
  }
});
```

---

## 📚 References

- **Puppeteer API Docs:** https://pptr.dev/
- **PDFOptions Interface:** https://pptr.dev/api/puppeteer.pdfoptions
- **Page.setViewport():** https://pptr.dev/api/puppeteer.page.setviewport
- **Page.pdf():** https://pptr.dev/api/puppeteer.page.pdf
- **@sparticuz/chromium:** https://github.com/Sparticuz/chromium

---

## ✅ Quick Checklist

Before generating PDF, ensure:

- [ ] Viewport set to correct dimensions (e.g., 794×1123 for A4)
- [ ] Content loaded with `waitUntil: "networkidle0"`
- [ ] Fonts loaded with `document.fonts.ready` or `waitForFonts: true`
- [ ] `printBackground: true` to preserve colors
- [ ] CSS uses `overflow: visible` and `height: auto`
- [ ] `-webkit-print-color-adjust: exact` in CSS
- [ ] All resources embedded inline (no external URLs)
- [ ] Media type set correctly (`screen` or `print`)
- [ ] Timeout sufficient (30 seconds minimum)
- [ ] Browser launched with correct args

---

**📅 Last updated:** November 15, 2025  
**📖 Based on:** Puppeteer v24.30.0  
**✅ Status:** Production-ready
