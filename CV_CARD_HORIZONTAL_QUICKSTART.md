# CV Card Horizontal - Quick Start Guide

## 🚀 Cài đặt và Sử dụng

### 1. Import Component
```tsx
import { CVCardHorizontal } from "@/components/cv-management";
```

### 2. Sử dụng cơ bản
```tsx
<CVCardHorizontal
  cv={cvData}
  isDefault={false}
  onPreview={() => handlePreview(cvData)}
  onSync={() => handleSync(cvData)}
  onDelete={() => handleDelete(cvData.id)}
/>
```

### 3. Hiển thị Default CV với Gradient Container
```tsx
{defaultCV && (
  <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6 shadow-md">
    <div className="mb-4">
      <h2 className="text-lg font-semibold text-white">Default CV</h2>
      <p className="text-sm text-white/90">
        This CV will be used automatically when applying for jobs
      </p>
    </div>
    
    <CVCardHorizontal
      cv={defaultCV}
      isDefault
      onPreview={() => handlePreview(defaultCV)}
      onSync={() => handleSync(defaultCV)}
    />
  </div>
)}
```

## 🎯 Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `cv` | `CV` | ✅ Yes | Dữ liệu CV object |
| `isDefault` | `boolean` | ❌ No | Highlight CV là default |
| `onSetDefault` | `() => void` | ❌ No | Callback khi set default |
| `onPreview` | `() => void` | ❌ No | Callback khi preview CV |
| `onSync` | `() => void` | ❌ No | Callback khi sync CV |
| `onDelete` | `() => void` | ❌ No | Callback khi delete CV |

## 📦 CV Data Structure

```typescript
interface CV {
  id: string;
  name: string;                              // "CV_John_Doe_2025.pdf"
  source: "upload" | "builder" | "draft";   // Nguồn CV
  fileUrl: string;                           // URL file CV
  parsedStatus: "processing" | "ready" | "failed";
  isDefault: boolean;
  privacy: "private" | "public";
  updatedAt: string;                         // "2025-11-08"
  fileSize?: string;                         // "1.2 MB"
}
```

## 🎨 Visual States

### 1. Default CV (Highlighted)
- Border: `ring-2 ring-[#3a4660]`
- Badge: "Default" với bg `#3a4660`
- Không hiển thị nút "Set Default"

### 2. Regular CV
- Border: `border-gray-200`
- Hiển thị nút "Set Default"

### 3. Processing CV
- Hiển thị spinner animation
- Sync button bị disabled

### 4. Hover State
- Border: `hover:border-[#3a4660]`
- Shadow: `hover:shadow-md`
- Icon: Change color to `#3a4660`

## 📱 Responsive Behavior

```tsx
// Desktop: Horizontal layout
sm:flex-row sm:h-[140px]

// Mobile: Vertical stack
flex-col h-auto
```

## 🎭 Use Cases

### 1. Featured Default CV Section
```tsx
<div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6">
  <CVCardHorizontal cv={defaultCV} isDefault />
</div>
```

### 2. CV List
```tsx
<div className="space-y-3">
  {cvList.map(cv => (
    <CVCardHorizontal
      key={cv.id}
      cv={cv}
      isDefault={cv.isDefault}
      onSetDefault={() => setDefault(cv)}
      onSync={() => syncCV(cv)}
      onDelete={() => deleteCV(cv.id)}
    />
  ))}
</div>
```

### 3. Single CV Preview
```tsx
<CVCardHorizontal
  cv={cv}
  onPreview={() => openModal(cv)}
/>
```

## 🔧 Customization

### Custom Container
```tsx
<div className="bg-white rounded-xl p-4 shadow-lg">
  <CVCardHorizontal cv={cv} />
</div>
```

### Custom Actions
```tsx
<CVCardHorizontal
  cv={cv}
  onSync={async () => {
    await syncToProfile(cv);
    toast.success("Synced!");
  }}
  onDelete={async () => {
    if (confirm("Delete?")) {
      await deleteCV(cv.id);
    }
  }}
/>
```

## 🎨 Color Scheme

```css
Primary: #3a4660
Hover: #3a4660
Border: border-gray-200 → border-[#3a4660] (hover)
Shadow: shadow-sm → shadow-md (hover)

Badges:
- Uploaded: bg-blue-100 text-blue-700
- Builder: bg-purple-100 text-purple-700
- Draft: bg-orange-100 text-orange-700
- Private/Public: bg-gray-100 text-gray-700
- Default: bg-[#3a4660] text-white
```

## ✅ Best Practices

1. **Luôn wrap Default CV trong gradient container**
   ```tsx
   <div className="bg-gradient-to-r from-[#3a4660] to-gray-400 rounded-xl p-6">
     <CVCardHorizontal cv={defaultCV} isDefault />
   </div>
   ```

2. **Xử lý async actions với loading state**
   ```tsx
   const [loading, setLoading] = useState(false);
   
   const handleSync = async () => {
     setLoading(true);
     await syncCV(cv);
     setLoading(false);
   };
   ```

3. **Sử dụng space-y cho list**
   ```tsx
   <div className="space-y-3">
     {cvs.map(cv => <CVCardHorizontal key={cv.id} cv={cv} />)}
   </div>
   ```

4. **Confirm trước khi delete**
   ```tsx
   onDelete={() => {
     if (window.confirm("Are you sure?")) {
       deleteCV(cv.id);
     }
   }}
   ```

## 🐛 Common Issues

### Issue 1: Card không responsive
**Solution**: Đảm bảo container có `w-full`
```tsx
<div className="w-full">
  <CVCardHorizontal cv={cv} />
</div>
```

### Issue 2: Menu bị crop
**Solution**: Container cần có `overflow-visible` hoặc `relative`
```tsx
<div className="relative">
  <CVCardHorizontal cv={cv} />
</div>
```

### Issue 3: Hover không hoạt động
**Solution**: Kiểm tra z-index của parent elements

## 📊 Performance Tips

1. Sử dụng `key` prop khi render list
2. Memoize callbacks với `useCallback`
3. Lazy load thumbnail images (nếu có)
4. Debounce search/filter operations

## 🔗 Files Liên quan

```
src/
├── components/
│   └── cv-management/
│       ├── CVCardHorizontal.tsx    ← Component này
│       ├── CVCard.tsx              ← Vertical version
│       ├── CVGrid.tsx
│       └── index.ts                ← Export
├── app/
│   └── candidate/
│       └── cv-management/
│           └── page.tsx            ← Usage example
└── services/
    └── cvService.ts                ← CV interface
```

## 🎉 Summary

✅ Horizontal layout hiện đại  
✅ Responsive mobile/desktop  
✅ Gradient container support  
✅ Full action buttons  
✅ CareerMate design system  
✅ TypeScript type-safe  
✅ Tailwind CSS styling  

---

**Created**: November 21, 2025  
**Component**: `CVCardHorizontal`  
**Status**: Production Ready ✅
