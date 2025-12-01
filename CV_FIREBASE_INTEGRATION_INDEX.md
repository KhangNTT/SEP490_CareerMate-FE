# CV Firebase Integration - Documentation Index

## 📚 Quick Navigation

### 🚀 Getting Started
1. **[Quick Summary](CV_FIREBASE_INTEGRATION_SUMMARY.md)** ⭐ START HERE
   - Overview of what was built
   - Quick start guide
   - Testing checklist

2. **[Usage Examples](CV_FIREBASE_INTEGRATION_EXAMPLE.md)**
   - Basic hook usage
   - Page integration examples
   - Complete working code

---

## 📁 Source Code Files

### Core Implementation
| File | Lines | Description |
|------|-------|-------------|
| `src/services/cvFirebaseService.ts` | ~450 | Firebase service layer with CRUD operations |
| `src/hooks/useCVData.ts` | ~230 | React hook for realtime CV data |
| `src/services/cvService.ts` | ~165 | Wrapper service for Firebase integration |
| `src/lib/firebase.ts` | - | Firebase config (updated with Firestore) |

### UI Components (Previous Work)
| File | Lines | Description |
|------|-------|-------------|
| `src/components/cv-management/CVCardHorizontal.tsx` | ~282 | Horizontal CV card component |

---

## 📖 Documentation Files

### Firebase Integration Docs (Current Work)
- ✅ **CV_FIREBASE_INTEGRATION_SUMMARY.md** - Quick reference guide
- ✅ **CV_FIREBASE_INTEGRATION_EXAMPLE.md** - Complete usage examples
- ✅ **CV_FIREBASE_INTEGRATION_INDEX.md** - This file

### CV Card Component Docs (Previous Work)
- ✅ **CV_CARD_HORIZONTAL_DOCUMENTATION.md** - Full component docs
- ✅ **CV_CARD_HORIZONTAL_QUICKSTART.md** - Quick start guide
- ✅ **CV_CARD_HORIZONTAL_COMPARISON.md** - Visual comparison
- ✅ **CV_CARD_HORIZONTAL_SUMMARY.md** - Implementation summary

---

## 🎯 What Was Accomplished

### Phase 1: UI Component ✅
- Created `CVCardHorizontal` component
- Horizontal layout (96px thumbnail left, info right)
- Responsive design with flex-row/flex-col
- Complete with badges, actions, and animations

### Phase 2: Firebase Integration ✅ (Current)
- Created Firebase service layer (`cvFirebaseService.ts`)
- Created React hook with realtime updates (`useCVData.ts`)
- Updated existing service wrapper (`cvService.ts`)
- Added Firestore to Firebase config
- Complete CRUD operations
- Auth store integration
- Error handling and loading states

---

## 🔧 API Reference

### Hook: `useCVData(userId?)`
```typescript
const { cvs, defaultCV, loading, error, refresh } = useCVData();
```

**Returns:**
- `cvs: CV[]` - All CVs for the user
- `defaultCV: CV | null` - The default CV
- `loading: boolean` - Loading state
- `error: Error | null` - Error state
- `refresh: () => Promise<void>` - Manual refresh

### Service Functions

#### Read Operations
```typescript
cvService.fetchCVs(userId) // Get all CVs grouped by type
cvService.getCVById(cvId) // Get single CV
cvService.getDefaultCV(userId) // Get default CV
```

#### Write Operations
```typescript
cvService.uploadCV(userId, file, metadata) // Upload new CV
cvService.setDefaultCV(userId, cvId) // Set as default
cvService.deleteCV(cvId) // Delete CV
cvService.renameCV(cvId, newName) // Rename CV
cvService.updateCVPrivacy(cvId, privacy) // Update visibility
cvService.updateCV(cvId, updates) // Update metadata
```

#### Utility Operations
```typescript
cvService.downloadCV(cvId) // Download CV blob
cvService.syncStorageWithFirestore(userId) // Sync orphaned files
```

---

## 💾 Data Structure

### CV Interface
```typescript
interface CV {
  id: string;
  name: string;
  type: "uploaded" | "built";
  createdAt: string; // ISO
  size: number; // bytes
  isDefault: boolean;
  visibility: "public" | "private";
  downloadUrl: string;
  userId: string;
  storagePath: string;
  parsedStatus?: "processing" | "ready" | "failed";
  fileSize?: string; // "1.2 MB"
  updatedAt?: string; // ISO
  source?: "upload" | "builder" | "draft"; // alias
  privacy?: "public" | "private"; // alias
  fileUrl?: string; // alias
}
```

### Firestore Document: `cvs/{cvId}`
```json
{
  "id": "cv-abc123",
  "name": "John_Doe_Resume.pdf",
  "type": "uploaded",
  "userId": "user-xyz789",
  "isDefault": true,
  "visibility": "public",
  "storagePath": "cvs/user-xyz789/cv-abc123.pdf",
  "downloadUrl": "https://firebasestorage...",
  "size": 1234567,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "parsedStatus": "ready"
}
```

### Storage Path: `cvs/{userId}/{filename}`
```
cvs/
  └── user-xyz789/
      ├── cv-abc123.pdf
      ├── cv-def456.pdf
      └── resume-2024.docx
```

---

## 🧪 Testing Guide

### Manual Testing Steps

#### 1. Upload CV
```tsx
const handleUpload = async (file: File) => {
  await cvService.uploadCV(userId, file);
};
```
**Expected:**
- ✅ File appears in Firebase Storage
- ✅ Document created in Firestore
- ✅ UI updates automatically

#### 2. Set Default CV
```tsx
await cvService.setDefaultCV(userId, cvId);
```
**Expected:**
- ✅ Old default CV's `isDefault` set to false
- ✅ New CV's `isDefault` set to true
- ✅ UI updates automatically

#### 3. Delete CV
```tsx
await cvService.deleteCV(cvId);
```
**Expected:**
- ✅ File deleted from Firebase Storage
- ✅ Document deleted from Firestore
- ✅ UI removes CV automatically

#### 4. Realtime Updates
**Test:**
1. Open page in two browser tabs
2. Upload/delete/rename in tab 1
3. Watch tab 2 update automatically

**Expected:**
- ✅ Changes appear in both tabs
- ✅ No page refresh needed
- ✅ onSnapshot listener working

---

## 🐛 Troubleshooting

### Issue: Hook returns empty array
**Solution:**
- Check userId is correct
- Verify Firestore collection exists
- Check Firebase Security Rules

### Issue: Upload fails
**Solution:**
- Check file size limit
- Verify Storage Security Rules
- Check file type is allowed

### Issue: Realtime updates not working
**Solution:**
- Verify using `useCVData()` not `useCVDataSimple()`
- Check Firestore listener is active
- Verify component is not unmounting

### Issue: "userId is required" error
**Solution:**
- Ensure user is logged in
- Check `useAuthStore` has `candidateId` or `user.id`
- Pass `userId` explicitly to hook if needed

---

## 🔐 Security Rules (Firebase Console)

### Firestore Rules - Collection: `cvs`
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cvs/{cvId} {
      // Allow read if authenticated user is the owner
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      
      // Allow write if authenticated user is the owner
      allow create, update: if request.auth != null && 
                              request.resource.data.userId == request.auth.uid;
      
      // Allow delete if authenticated user is the owner
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

### Storage Rules - Folder: `cvs/{userId}`
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /cvs/{userId}/{fileName} {
      // Allow read if authenticated user is the owner
      allow read: if request.auth != null && 
                     request.auth.uid == userId;
      
      // Allow write if authenticated user is the owner
      allow write: if request.auth != null && 
                      request.auth.uid == userId;
    }
  }
}
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     React Components                     │
│                    (CV Management Page)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ useCVData()
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Custom Hook Layer                     │
│              (useCVData / useCVDataSimple)              │
│                                                          │
│  • useState for cvs, loading, error                     │
│  • useEffect for onSnapshot listener                    │
│  • useCallback for refresh                              │
│  • Auto-gets userId from useAuthStore                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ getCVsByUser()
                     │ uploadCV()
                     │ setDefaultCV()
                     │ deleteCV()
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Service Layer                          │
│              (cvFirebaseService.ts)                      │
│                                                          │
│  • CRUD operations                                       │
│  • Firestore queries                                     │
│  • Storage operations                                    │
│  • Type conversions (Timestamp → ISO)                   │
│  • Helper functions (formatFileSize, etc.)              │
└──────────────┬──────────────────────────────────────────┘
               │
               │ collection(), query(), getDocs()
               │ uploadBytes(), getDownloadURL()
               ▼
┌─────────────────────────────────────────────────────────┐
│                Firebase Backend                          │
│                                                          │
│  ┌──────────────────┐      ┌──────────────────┐        │
│  │    Firestore     │      │   Storage         │        │
│  │                  │      │                   │        │
│  │  cvs/           │      │  cvs/{userId}/    │        │
│  │    {cvId}/      │◄────►│    file.pdf       │        │
│  │      metadata    │      │    file.docx      │        │
│  └──────────────────┘      └──────────────────┘        │
│                                                          │
│  ┌──────────────────┐                                   │
│  │  Authentication  │                                   │
│  │  (user context)  │                                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Completion Status

### ✅ Completed
- [x] Firebase service layer created
- [x] React hook with realtime updates
- [x] Auth store integration
- [x] Service wrapper updated
- [x] Type definitions exported
- [x] Error handling implemented
- [x] Loading states added
- [x] Complete documentation
- [x] Usage examples
- [x] Zero TypeScript errors

### 🎯 Ready for Integration
- [ ] Update CV Management page with `useCVData()`
- [ ] Test upload functionality
- [ ] Test delete functionality
- [ ] Test set default functionality
- [ ] Test realtime updates
- [ ] Add toast notifications
- [ ] Add confirmation modals

---

## 🎓 Learning Resources

### Firebase Documentation
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Storage Documentation](https://firebase.google.com/docs/storage)
- [Realtime Listeners](https://firebase.google.com/docs/firestore/query-data/listen)

### Related CareerMate Docs
- CM Profile Avatar Fetching Pattern
- Auth Store Documentation
- Component Library Guidelines

---

## 📝 Changelog

### 2024-01-15
- ✅ Created `cvFirebaseService.ts` with 9 CRUD functions
- ✅ Created `useCVData.ts` hook with realtime updates
- ✅ Updated `cvService.ts` to use Firebase backend
- ✅ Added Firestore to `firebase.ts` config
- ✅ Exported types: `CV`, `CVType`, `CVVisibility`, `CVParsedStatus`
- ✅ Created complete documentation suite

---

## 🤝 Support

For questions or issues:
1. Check the **[Usage Examples](CV_FIREBASE_INTEGRATION_EXAMPLE.md)** first
2. Review the **[Summary](CV_FIREBASE_INTEGRATION_SUMMARY.md)**
3. Check TypeScript types in source files
4. Review Firebase Console for data/errors

---

**Status**: ✅ **Implementation Complete - Ready for Integration**  
**Last Updated**: 2024  
**Author**: CareerMate Development Team  
**Version**: 1.0.0
