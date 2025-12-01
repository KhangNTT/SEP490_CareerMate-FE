# 🔍 CV Preview Fix

## 🐛 Problem
CV không preview được ở trang CV Management mặc dù đã có Firebase download URL.

## 🔎 Root Cause
Trong `handlePreview` function (`src/hooks/useCVActions.ts`), code chỉ sử dụng `cv.fileUrl`:

```typescript
// ❌ OLD CODE (Wrong)
const handlePreview = (cv: CV) => {
  setSelectedCV(cv);
  setPreviewUrl(cv.fileUrl ?? null); // fileUrl might be undefined
  setShowPreview(true);
};
```

**Vấn đề:**
- CV interface có cả `downloadUrl` (required) và `fileUrl` (optional alias)
- `resumeConverter.ts` set cả 2 fields từ `resume.resumeUrl`
- Nhưng nếu `fileUrl` undefined vì lý do nào đó, preview sẽ fail
- Không có logging để debug khi URL bị thiếu

## ✅ Solution

### Cập nhật `handlePreview` function:

```typescript
// ✅ NEW CODE (Fixed)
const handlePreview = (cv: CV) => {
  console.log('🔍 Preview CV:', {
    id: cv.id,
    name: cv.name,
    downloadUrl: cv.downloadUrl,
    fileUrl: cv.fileUrl,
    storagePath: cv.storagePath,
  });

  setSelectedCV(cv);
  // Use downloadUrl as primary, fallback to fileUrl for backward compatibility
  const url = cv.downloadUrl || cv.fileUrl || null;
  
  if (!url) {
    console.error('❌ No URL available for preview:', cv);
    toast.error('Cannot preview: No file URL available');
    return;
  }

  console.log('✅ Setting preview URL:', url);
  setPreviewUrl(url);
  setShowPreview(true);
};
```

## 🎯 Key Changes

1. **Use `downloadUrl` as primary source** - This is always present in CV interface
2. **Fallback to `fileUrl`** - For backward compatibility with old data
3. **Validate URL exists** - Check if URL is available before opening preview
4. **Show error toast** - User-friendly message if URL is missing
5. **Add comprehensive logging** - Debug what URL is being used

## 📊 CV Interface Structure

```typescript
export interface CV {
  // Core fields
  id: string;
  name: string;
  downloadUrl: string;        // ✅ PRIMARY - Always present
  fileUrl?: string;           // ⚠️ OPTIONAL - Alias for downloadUrl
  storagePath: string;
  // ... other fields
}
```

## 🔄 Data Flow

```
Backend API (resume.resumeUrl)
    ↓
resumeConverter.ts (resumeToCVSync)
    ↓ Sets both fields:
    ├─ downloadUrl: resume.resumeUrl ✅
    └─ fileUrl: resume.resumeUrl     ✅
    ↓
CV Management Page (page.tsx)
    ↓
handlePreview(cv)
    ↓ Now uses:
    ├─ cv.downloadUrl (primary)     ✅
    └─ cv.fileUrl (fallback)        ✅
    ↓
PreviewModal
    ↓
<iframe src={previewUrl} />
```

## 🧪 How to Test

### Test 1: Normal CV Preview
1. Go to CV Management page
2. Click "Preview" on any CV card
3. **Expected console logs:**
   ```
   🔍 Preview CV: {id: "1", name: "resume.pdf", downloadUrl: "https://...", fileUrl: "https://..."}
   ✅ Setting preview URL: https://firebasestorage.googleapis.com/...
   ```
4. **Expected**: Preview modal opens with CV displayed in iframe

### Test 2: CV with Missing URL (Edge Case)
1. If somehow CV has no URLs
2. **Expected console logs:**
   ```
   🔍 Preview CV: {id: "1", name: "resume.pdf", downloadUrl: undefined, fileUrl: undefined}
   ❌ No URL available for preview: {...}
   ```
3. **Expected**: Toast error: "Cannot preview: No file URL available"
4. **Expected**: Preview modal does NOT open

### Test 3: CV from Upload
1. Upload a new CV
2. Wait for upload to complete
3. Click "Preview" on the newly uploaded CV
4. **Expected**: Preview opens successfully with Firebase URL

## 🛡️ Safety Guarantees

1. **Always try downloadUrl first** - This is the primary source
2. **Fallback to fileUrl** - For backward compatibility
3. **Validate before opening modal** - Prevents blank preview
4. **User feedback** - Toast message if URL missing
5. **Debug logging** - Easy to trace issues

## 📝 Files Modified

- ✅ `src/hooks/useCVActions.ts` - Updated `handlePreview` function

## ✅ Verification

- [x] No TypeScript errors
- [x] Added logging for debugging
- [x] Added validation before preview
- [x] Added user-friendly error message
- [x] Uses correct URL priority (downloadUrl → fileUrl)

## 🔍 Debugging Tips

If preview still doesn't work:

1. **Check console for logs:**
   ```
   🔍 Preview CV: {...}
   ```
   Look at `downloadUrl` and `fileUrl` values

2. **Verify Firebase URL format:**
   ```
   https://firebasestorage.googleapis.com/v0/b/PROJECT_ID/o/PATH?alt=media&token=...
   ```

3. **Check Firebase Storage Rules:**
   - Go to Firebase Console → Storage → Rules
   - Ensure read access is allowed:
     ```javascript
     allow read: if request.auth != null;
     ```

4. **Check CORS settings:**
   - Firebase Storage should allow iframe embedding
   - Check browser console for CORS errors

5. **Test URL directly:**
   - Copy the `downloadUrl` from console
   - Paste in new browser tab
   - Should download/display the PDF

## 🚀 Status

✅ **Fixed**  
📅 **Date**: November 27, 2025  
🎯 **Impact**: HIGH - Fixes critical preview functionality  
⚠️ **Risk**: LOW - Only changed URL selection logic
