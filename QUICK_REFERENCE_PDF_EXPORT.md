# 🚀 CV PDF Export - Quick Reference

## 📦 What You Have

```
✅ Isolated print layout (NO header/footer/logo)
✅ Base64 data architecture (NO database dependency)
✅ 4 templates (classic, modern, professional, vintage)
✅ Tailwind + print.css working
✅ Plain <img> for avatars (NO Next/Image)
✅ Page-break utilities
✅ Production-ready Puppeteer config
```

---

## 🎯 Quick Start

### **1. Basic Export**

```tsx
const handleExport = async () => {
  const response = await fetch('/api/export-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      templateId: 'modern',
      cvData: {
        fullName: "John Doe",
        title: "Software Engineer",
        email: "john@example.com",
        // ... rest of CV data
      },
      fileName: 'my-cv',
    }),
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cv.pdf';
  a.click();
  window.URL.revokeObjectURL(url);
};
```

### **2. With Data Transformation**

```tsx
import { transformCVDataForPrint } from '@/lib/cv-data-transformer';

const printData = transformCVDataForPrint(yourAppCVData);

await fetch('/api/export-pdf', {
  method: 'POST',
  body: JSON.stringify({
    templateId: 'modern',
    cvData: printData,
  }),
});
```

### **3. With Base64 Avatar**

```tsx
import { prepareCVDataWithBase64Avatar } from '@/lib/cv-data-transformer';

const cvDataWithBase64 = await prepareCVDataWithBase64Avatar(cvData);

await fetch('/api/export-pdf', {
  method: 'POST',
  body: JSON.stringify({
    templateId: 'modern',
    cvData: cvDataWithBase64,
  }),
});
```

---

## 📋 CV Data Format

```typescript
{
  // Required
  fullName: "John Doe",
  
  // Personal (optional)
  title: "Software Engineer",
  email: "john@example.com",
  phone: "+1 234 567 8900",
  address: "San Francisco, CA",
  website: "https://johndoe.com",
  photoUrl: "https://example.com/avatar.jpg", // or base64
  summary: "Experienced developer...",
  
  // Experience
  experience: [
    {
      position: "Senior Engineer",
      company: "Tech Corp",
      period: "Jan 2020 - Present",
      description: "Led development...",
    }
  ],
  
  // Education
  education: [
    {
      degree: "Bachelor of Science",
      institution: "Stanford University",
      period: "2015 - 2019",
      description: "GPA: 3.9/4.0",
    }
  ],
  
  // Skills
  skills: [
    {
      category: "Programming",
      items: ["JavaScript", "TypeScript", "Python"],
    }
  ],
  
  // Languages
  languages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Intermediate" },
  ],
  
  // Optional
  certifications: [...],
  projects: [...],
}
```

---

## 🎨 Templates

| Template | Layout | Best For |
|----------|--------|----------|
| `classic` | Single column | Traditional/Conservative |
| `modern` | Two-column (dark sidebar) | Tech/Creative |
| `professional` | Two-column (gray sidebar) | Corporate/Business |
| `vintage` | Elegant serif | Design/Creative |

---

## 📄 Page Break Classes

```html
<!-- Force new page before -->
<div class="page-break">...</div>

<!-- Force new page after -->
<div class="page-break-after">...</div>

<!-- Prevent split across pages -->
<div class="avoid-break">...</div>
```

---

## 🖼️ Avatar Formats

```typescript
// External URL
photoUrl: "https://example.com/avatar.jpg"

// Base64
photoUrl: "data:image/jpeg;base64,/9j/4AAQ..."

// Firebase Storage
photoUrl: "https://firebasestorage.googleapis.com/..."
```

---

## 🧪 Testing

### Browser Test
```
http://localhost:3002/candidate/cv/print/modern?data=<base64>
```

### API Test
```bash
curl -X POST http://localhost:3002/api/export-pdf \
  -H "Content-Type: application/json" \
  -d '{"templateId":"modern","cvData":{...}}' \
  --output test.pdf
```

---

## 🔧 Utilities

```typescript
import {
  transformCVDataForPrint,      // Transform app data to print format
  convertImageToBase64,          // Convert image URL to base64
  prepareCVDataWithBase64Avatar, // Prepare CV with base64 avatar
  validateCVData,                // Validate before export
  sanitizeCVData,                // Sanitize to prevent XSS
} from '@/lib/cv-data-transformer';
```

---

## ⚙️ Environment Variables

```bash
# .env.local
NEXT_PUBLIC_BASE_URL=http://localhost:3002

# Production
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

## 🐛 Common Issues

### "Base URL cannot be determined"
→ Set `NEXT_PUBLIC_BASE_URL` in `.env.local`

### Fonts not loading
→ Check `fonts.css` and font file paths

### Avatar not showing
→ Try converting to base64 using utility

### Content cut off
→ Use `.page-break` classes to split content

---

## 📚 Full Documentation

- **Complete Guide:** `EXPORT_PDF_USAGE_GUIDE.md`
- **Architecture:** `CV_PRINT_ARCHITECTURE.md`
- **Summary:** `PDF_EXPORT_REFACTOR_COMPLETE.md`

---

## ✅ Verification Checklist

```
[ ] No header/footer in PDF
[ ] Correct fonts and spacing
[ ] Avatar displays correctly
[ ] All sections present
[ ] Tailwind styles working
[ ] No content overflow
[ ] Multi-page support works
```

---

**Status:** ✅ Production-Ready  
**Updated:** November 16, 2025
