# CV Firebase Integration - Quick Reference Card

## 🚀 5-Minute Quick Start

### 1. Import and Use Hook
```tsx
"use client";
import { useCVData } from "@/hooks/useCVData";

export default function MyPage() {
  const { cvs, defaultCV, loading, error, refresh } = useCVData();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Default: {defaultCV?.name}</h2>
      {cvs.map(cv => <div key={cv.id}>{cv.name}</div>)}
    </div>
  );
}
```

---

## 📦 Common Operations

### Upload CV
```tsx
import { cvService } from "@/services/cvService";

await cvService.uploadCV(userId, file, {
  type: "uploaded",
  visibility: "private"
});
```

### Set Default
```tsx
await cvService.setDefaultCV(userId, cvId);
```

### Delete CV
```tsx
await cvService.deleteCV(cvId);
```

### Rename CV
```tsx
await cvService.renameCV(cvId, "New Name");
```

### Update Privacy
```tsx
await cvService.updateCVPrivacy(cvId, "public");
```

### Download CV
```tsx
const blob = await cvService.downloadCV(cvId);
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "filename.pdf";
a.click();
```

---

## 🔑 Key Concepts

### Hook Returns
| Property | Type | Description |
|----------|------|-------------|
| `cvs` | `CV[]` | All CVs |
| `defaultCV` | `CV \| null` | Default CV |
| `loading` | `boolean` | Loading state |
| `error` | `Error \| null` | Error state |
| `refresh` | `() => Promise<void>` | Manual refresh |

### CV Properties
```typescript
{
  id: string;
  name: string;
  type: "uploaded" | "built";
  downloadUrl: string;
  isDefault: boolean;
  visibility: "public" | "private";
  size: number;
  fileSize: string; // "1.2 MB"
  parsedStatus?: "processing" | "ready" | "failed";
}
```

---

## ⚡ Features

- ✅ **Realtime Updates** - Auto-sync with Firebase
- ✅ **Auth Integration** - Auto-gets userId
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Error Handling** - Try/catch everywhere
- ✅ **Loading States** - Built-in loading flag

---

## 📚 Full Documentation

- **Quick Start**: `CV_FIREBASE_INTEGRATION_SUMMARY.md`
- **Examples**: `CV_FIREBASE_INTEGRATION_EXAMPLE.md`
- **Index**: `CV_FIREBASE_INTEGRATION_INDEX.md`

---

## 🎯 Pattern

```
Page → useCVData() → cvFirebaseService → Firebase
```

**That's it! Start with `useCVData()` and you're good to go!** 🚀
