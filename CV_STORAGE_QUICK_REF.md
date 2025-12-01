# 🚀 CV Storage Upload - Quick Reference

## 📦 Installation

```typescript
// Import functions
import { uploadCvFile, extractOriginalName } from '@/services/cvStorageUpload';
```

## 🎯 File Naming Format

```
[originalName]_CM_[timestamp].[ext]

Examples:
  CV.pdf          → CV_CM_1732702341123.pdf
  My Resume.pdf   → My Resume_CM_1732702341123.pdf
  document.docx   → document_CM_1732702341123.docx
```

## 📁 Storage Structure

```
candidates/
  └── {candidateId}/
      ├── CV_CM_1732702341123.pdf
      ├── Resume_CM_1732702400000.pdf
      └── Portfolio_CM_1732702500000.pdf
```

## 💻 Quick Usage

### 1. Upload File

```typescript
const result = await uploadCvFile(candidateId, file);

// Returns:
{
  originalName: "CV.pdf",
  storageName: "CV_CM_1732702341123.pdf",
  downloadUrl: "https://firebasestorage.googleapis.com/...",
  fullPath: "candidates/123/CV_CM_1732702341123.pdf",
  extension: "pdf",
  size: 1234567,
  contentType: "application/pdf",
  uploadedAt: "2024-11-27T10:30:00.000Z"
}
```

### 2. Extract Display Name

```typescript
const displayName = extractOriginalName("CV_CM_1732702341123.pdf");
// → "CV.pdf"
```

### 3. Complete Flow

```typescript
// Upload
const result = await uploadCvFile(candidateId, file);

// Save to DB (store storageName)
await createResume({
  resumeUrl: result.downloadUrl,
  storageName: result.storageName,  // ✅ Save this
  type: "UPLOAD",
});

// Display on UI (use originalName)
const displayName = extractOriginalName(result.storageName);
console.log(displayName); // "CV.pdf"
```

## 🎨 UI Display

```typescript
// In your component
{resumes.map(resume => {
  const displayName = extractOriginalName(resume.storageName);
  
  return (
    <div>
      <h3>{displayName}</h3>  {/* Show: "CV.pdf" */}
      <a href={resume.resumeUrl} download={displayName}>
        Download
      </a>
    </div>
  );
})}
```

## 🛡️ Validation

```typescript
// Default: pdf, doc, docx, jpg, png
await uploadCvFile(candidateId, file);

// Custom validation
await uploadCvFile(candidateId, file, {
  allowedExtensions: ['pdf', 'docx']
});

// Disable validation
await uploadCvFile(candidateId, file, {
  validate: false
});
```

## 🔧 Helper Functions

```typescript
// Generate storage name
generateStorageName("CV.pdf")
// → "CV_CM_1732702341123.pdf"

// Extract original name
extractOriginalName("CV_CM_1732702341123.pdf")
// → "CV.pdf"

// Get extension
getFileExtension("CV.pdf")
// → "pdf"

// Validate file
isValidFileExtension("CV.pdf")
// → true

// Sanitize name
sanitizeFileName("My CV (final)!.pdf")
// → "My CV final.pdf"
```

## 📊 Database Schema

```typescript
interface Resume {
  resumeId: number;
  resumeUrl: string;        // Firebase download URL
  storageName: string;      // "CV_CM_1732702341123.pdf"
  type: "UPLOAD" | "WEB";
  isActive: boolean;
  createdAt: string;
}
```

## 🔍 Common Patterns

### Pattern 1: Upload & Display

```typescript
// Upload
const { storageName, downloadUrl } = await uploadCvFile(candidateId, file);

// Save
await saveToDatabase({ storageName, downloadUrl });

// Display
const displayName = extractOriginalName(storageName);
```

### Pattern 2: Load & Show

```typescript
// Load from DB
const resumes = await loadFromDatabase();

// Display each
resumes.forEach(resume => {
  const name = extractOriginalName(resume.storageName);
  showInUI(name, resume.downloadUrl);
});
```

### Pattern 3: Download with Original Name

```typescript
const resume = await getResume(id);
const originalName = extractOriginalName(resume.storageName);

// Download with original name
const link = document.createElement('a');
link.href = resume.downloadUrl;
link.download = originalName;
link.click();
```

## ⚠️ Important Rules

1. **Always save `storageName` to database**
   ```typescript
   // ✅ Correct
   { storageName: "CV_CM_1732702341123.pdf" }
   
   // ❌ Wrong
   { fileName: "CV.pdf" }
   ```

2. **Always display `originalName` to users**
   ```typescript
   // ✅ Correct
   <h3>{extractOriginalName(resume.storageName)}</h3>
   
   // ❌ Wrong
   <h3>{resume.storageName}</h3>
   ```

3. **Use `downloadUrl` for download/preview**
   ```typescript
   // ✅ Correct
   <a href={resume.downloadUrl}>Download</a>
   
   // ❌ Wrong
   <a href={resume.storageName}>Download</a>
   ```

## 🐛 Debugging

```typescript
// Enable console logs (already built-in)
const result = await uploadCvFile(candidateId, file);

// Logs will show:
// 📤 Starting CV upload: {...}
// 🧹 Sanitized file name: ...
// 📝 Generated storage name: ...
// 📁 Storage path: ...
// ⬆️ Uploading to Firebase Storage...
// ✅ Upload successful: {...}
// 🔗 Fetching download URL...
// ✅ Download URL obtained: ...
// ✅ Upload complete: {...}
```

## 📝 Cheat Sheet

| Task | Function | Input | Output |
|------|----------|-------|--------|
| Upload | `uploadCvFile()` | File object | Upload result |
| Display | `extractOriginalName()` | Storage name | Original name |
| Validate | `isValidFileExtension()` | File name | true/false |
| Sanitize | `sanitizeFileName()` | File name | Clean name |
| Extension | `getFileExtension()` | File name | Extension |

## ✅ Quick Check

Before deploying, verify:
- [ ] Upload returns `storageName` with `_CM_` separator
- [ ] Database saves `storageName` field
- [ ] UI displays `originalName` (extracted from `storageName`)
- [ ] Download uses `downloadUrl` with `originalName` as filename
- [ ] Preview uses `downloadUrl`

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Upload fails | Check Firebase Storage Rules |
| No `_CM_` in name | Use `uploadCvFile()` not old function |
| Wrong name displayed | Use `extractOriginalName()` |
| Download fails | Check `downloadUrl` is valid |
| Preview blank | Ensure Firebase URL is accessible |

## 📞 Support

- Check console logs for detailed error messages
- Verify Firebase configuration in `.env`
- Test file naming with `cvFileNameHelper.test.ts`
- See full guide: `CV_STORAGE_UPLOAD_GUIDE.md`

---

**Version**: 1.0.0  
**Last Updated**: November 27, 2025  
**Status**: ✅ Ready to Use
