# 🚀 CV PDF Layout Fix - Quick Reference

## 📋 Problem Summary

PDF export breaks layout:
- ❌ Sidebar disappears
- ❌ Flex/Grid collapses
- ❌ Colors missing
- ❌ Spacing inconsistent

## ✅ Solution

Created `src/styles/cv-print.css` (10.85 KB) with @media print fixes.

---

## 🎯 Quick Implementation

### HTML Structure (Required)

```html
<div class="cv-container" data-template="professional">
  <div class="cv-layout-two-column">
    <aside class="cv-sidebar">
      <!-- 260px fixed width -->
    </aside>
    <main class="cv-content">
      <!-- calc(210mm - 260px) width -->
    </main>
  </div>
</div>
```

### Classes to Remove

❌ Remove these from CV templates:
- `h-screen`, `min-h-screen`, `max-h-screen`
- `flex-1`, `flex-grow`
- `overflow-hidden`
- `w-1/4`, `w-3/4` (use fixed widths)

### Classes to Add

✅ Add these:
- `.cv-container` - Wrapper (A4 size)
- `.cv-layout-two-column` - Grid container
- `.cv-sidebar` - Left column (260px)
- `.cv-content` - Right column (flexible)
- `.cv-template` - Template wrapper
- `.page-break-before`, `.page-break-after` - Control pagination

---

## 🔧 API Route (Already Updated)

File: `src/app/api/export-pdf/route.ts`

```typescript
// ✅ Already implemented
const cvPrintCSS = fs.readFileSync('src/styles/cv-print.css', 'utf8');

const html = `
  <style>
    ${embeddedFontsCSS}
    ${tailwindUtilities}
    ${cvPrintCSS}  /* ← Print fixes here */
  </style>
  ${yourHtml}
`;
```

---

## 🧪 Testing Checklist

```bash
# 1. Check CSS loaded
Console: ✅ Loaded CV print styles (10.85 KB)

# 2. Generate PDF
Click "Lưu CV vào Firebase"

# 3. Verify in PDF:
✅ Sidebar visible (left side, 260px)
✅ Content on right
✅ Colors correct
✅ Spacing consistent
✅ No blank pages
```

---

## 📊 Key Fixes

| Fix | CSS Rule | Why |
|-----|----------|-----|
| **Force colors** | `-webkit-print-color-adjust: exact` | Chrome ignores colors by default |
| **Sidebar visible** | `grid-template-columns: 260px 1fr` | Grid more reliable than flex |
| **No overflow** | `overflow: visible !important` | Chrome hides overflow:hidden content |
| **Auto height** | `height: auto !important` | vh units break in PDF |
| **No transform** | `transform: none` | Remove zoom effects |

---

## 🎨 Template-Specific Fixes

### Modern Template (Two-column)
```html
<div class="cv-container" data-template="modern">
  <div class="cv-layout-two-column">
    <aside class="cv-sidebar bg-gray-800 text-white p-6">
      <!-- Skills, Languages -->
    </aside>
    <main class="cv-content p-8">
      <!-- Experience, Education -->
    </main>
  </div>
</div>
```

### Classic Template (Single-column)
```html
<div class="cv-container" data-template="classic">
  <div class="cv-template p-12">
    <!-- All content in one column -->
  </div>
</div>
```

### Professional Template (Header + Two-column)
```html
<div class="cv-container" data-template="professional">
  <div class="cv-header p-8">
    <!-- Name, Contact, Summary -->
  </div>
  <div class="cv-layout-two-column">
    <aside class="cv-sidebar">...</aside>
    <main class="cv-content">...</main>
  </div>
</div>
```

---

## 🐛 Common Issues & Fixes

### Issue: Sidebar still missing

**Cause:** Not using `.cv-layout-two-column` class

**Fix:**
```html
<!-- Before (Wrong) -->
<div class="flex">
  <aside class="w-1/4">Sidebar</aside>
  <main class="flex-1">Content</main>
</div>

<!-- After (Correct) -->
<div class="cv-layout-two-column">
  <aside class="cv-sidebar">Sidebar</aside>
  <main class="cv-content">Content</main>
</div>
```

---

### Issue: Colors missing

**Cause:** `printBackground: false` in Puppeteer

**Fix:**
```typescript
await page.pdf({
  printBackground: true,  // ← Must be true
  format: 'A4'
});
```

---

### Issue: Blank pages

**Cause:** `height: 100vh` on container

**Fix:**
```css
/* Automatically fixed by cv-print.css */
@media print {
  .cv-container {
    height: auto !important;
  }
}
```

---

### Issue: Layout collapses to single column

**Cause:** Using flex instead of grid

**Fix:**
```css
/* cv-print.css automatically converts to: */
@media print {
  .cv-layout-two-column {
    display: grid !important;
    grid-template-columns: 260px 1fr !important;
  }
}
```

---

## 📝 Update Existing Templates

### Step 1: Add wrapper classes

```diff
- <div className="flex h-screen">
+ <div className="cv-container" data-template="modern">
+   <div className="cv-layout-two-column">
```

### Step 2: Update sidebar

```diff
-     <aside className="w-1/4 bg-gray-800 overflow-hidden">
+     <aside className="cv-sidebar bg-gray-800">
```

### Step 3: Update content

```diff
-     <main className="flex-1 overflow-y-auto">
+     <main className="cv-content">
```

### Step 4: Close wrappers

```diff
+   </div>
  </div>
```

---

## 🎯 Verification

Run this command to check files:

```powershell
# Check CSS exists
Test-Path src/styles/cv-print.css
# Output: True

# Check file size
Get-Item src/styles/cv-print.css | Select-Object Length
# Output: ~10.85 KB
```

---

## 📚 Documentation

Full guides:
- `CV_PDF_LAYOUT_FIX.md` - Complete solution (15 KB)
- `PDF_EXPORT_OPTIMIZATION.md` - Performance tips
- `EMBEDDED_FONTS_GUIDE.md` - Font embedding

---

## ✅ Status

| Component | Status | Notes |
|-----------|--------|-------|
| CSS file | ✅ Created | `src/styles/cv-print.css` (10.85 KB) |
| API route | ✅ Updated | Loads and injects CSS |
| Documentation | ✅ Complete | 2 guides created |
| Testing | ⏳ Pending | Manual testing needed |

---

## 🚀 Next Steps

1. **Update CV templates** with new class structure
2. **Test PDF generation** for each template
3. **Verify sidebar** appears in all PDFs
4. **Check colors** render correctly
5. **Test page breaks** for multi-page CVs

---

**Total time to implement:** ~5 minutes  
**Files modified:** 2 (route.ts + created cv-print.css)  
**Breaking changes:** None (backward compatible)

---

**📅 Created:** November 15, 2025  
**✅ Ready to use:** Yes
