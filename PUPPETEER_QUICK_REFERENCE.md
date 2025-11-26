# 🎯 Puppeteer PDF Quick Reference

One-page cheat sheet for PDF generation with Puppeteer.

---

## 📐 A4 Paper Dimensions

```
Physical:  210mm × 297mm
At 96 DPI: 794px × 1123px
```

---

## 🖥️ Viewport Setup

```typescript
await page.setViewport({
  width: 794,              // A4 width
  height: 1123,            // A4 height
  deviceScaleFactor: 1,    // 1 = standard, 2 = retina
});
```

---

## 📄 PDF Generation

```typescript
const pdf = await page.pdf({
  format: "A4",
  printBackground: true,
  preferCSSPageSize: false,
  scale: 1,                // 0.1 - 2
  margin: {
    top: "10mm",
    right: "10mm",
    bottom: "10mm",
    left: "10mm",
  },
  landscape: false,        // false = portrait
  omitBackground: false,   // false = white bg
  waitForFonts: true,
  timeout: 30000,
});
```

---

## 📡 Content Loading

```typescript
await page.setContent(html, {
  waitUntil: "networkidle0",  // All requests done
  timeout: 30000,
});

await page.emulateMediaType("screen");  // or "print"
await page.evaluateHandle('document.fonts.ready');
```

---

## 🚀 Browser Launch

```typescript
// Development
const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-web-security",
    "--font-render-hinting=none",
  ],
});

// Production (Serverless)
const browser = await puppeteerCore.launch({
  args: chromium.args,
  executablePath: await chromium.executablePath(),
  headless: true,
});
```

---

## ✅ Pre-Flight Checklist

- [ ] Viewport = 794×1123 (A4)
- [ ] `waitUntil: "networkidle0"`
- [ ] `await document.fonts.ready`
- [ ] `printBackground: true`
- [ ] CSS: `-webkit-print-color-adjust: exact`
- [ ] CSS: `overflow: visible`, `height: auto`
- [ ] All resources embedded inline
- [ ] Timeout ≥ 30 seconds

---

## 🐛 Common Fixes

| Problem | Solution |
|---------|----------|
| Blank PDF | `waitUntil: "networkidle0"` |
| No colors | `printBackground: true` |
| No fonts | `await page.evaluateHandle('document.fonts.ready')` |
| Layout broken | Match viewport to format (794×1123) |
| Content cut off | Use `height: auto`, `overflow: visible` |
| Slow generation | Use `waitUntil: "domcontentloaded"` |

---

## 📊 Quick Configs

### High Quality
```typescript
deviceScaleFactor: 2
waitUntil: "networkidle0"
scale: 1
```

### Fast Preview
```typescript
deviceScaleFactor: 1
waitUntil: "domcontentloaded"
scale: 0.8
waitForFonts: false
```

### Landscape
```typescript
width: 1123, height: 794
landscape: true
```

---

## 🎨 CSS for Print

```css
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    overflow: visible !important;
  }
  
  body {
    width: 210mm;
    height: auto;
    margin: 0;
  }
  
  .no-print { display: none; }
  .page-break { page-break-after: always; }
}
```

---

## 📚 Full Docs

- **Complete Guide:** `PUPPETEER_PDF_CONFIG.md`
- **Changes Applied:** `PUPPETEER_CONFIG_APPLIED.md`
- **API Reference:** https://pptr.dev/

---

**📅 Last updated:** November 15, 2025
