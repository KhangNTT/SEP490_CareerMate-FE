# 🛠️ Tools Directory

This directory contains utility scripts for font conversion and PDF generation optimization.

---

## 📁 Files

### Font Conversion Tools

| File | Purpose | Command |
|------|---------|---------|
| `convert-font-to-base64.cjs` | Convert single font to Base64 | `node tools/convert-font-to-base64.cjs <font-file>` |
| `generate-embedded-fonts.cjs` | Batch convert all fonts in `./public/fonts/` | `node tools/generate-embedded-fonts.cjs` |
| `download-fonts-helper.cjs` | Show download instructions and check existing fonts | `node tools/download-fonts-helper.cjs` |

### System Diagnostic Tools

| File | Purpose | Command |
|------|---------|---------|
| `test-fonts-system.cjs` | Check system fonts installed on Windows | `node tools/test-fonts-system.cjs` |
| `check-chrome.cjs` | Verify Chrome/Chromium installation | `node tools/check-chrome.cjs` |

---

## 🚀 Quick Start

### 1. Download Fonts

```bash
node tools/download-fonts-helper.cjs
```

Follow the instructions to download Inter and Roboto fonts.

### 2. Generate Embedded Fonts

```bash
node tools/generate-embedded-fonts.cjs
```

This creates `./src/styles/embedded-fonts.css` with Base64-encoded fonts.

### 3. Test System

```bash
# Check system fonts
node tools/test-fonts-system.cjs

# Check Chrome installation
node tools/check-chrome.cjs
```

---

## 📖 Documentation

For detailed guides, see:
- `EMBEDDED_FONTS_GUIDE.md` - Complete implementation guide
- `EMBEDDED_BASE64_FONTS_SUMMARY.md` - Quick summary
- `PDF_EXPORT_OPTIMIZATION.md` - PDF optimization tips

---

**Last updated**: November 15, 2025
