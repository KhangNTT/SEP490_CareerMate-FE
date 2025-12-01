# 🔍 CV Upload Debug Quick Reference

## Problem: uploadedCv.downloadUrl is undefined

### Quick Diagnosis Steps

1. **Open Browser Console** (F12)
2. **Attempt to upload a CV**
3. **Look for these specific log patterns**:

---

## ✅ Success Pattern

```
🔥 Firebase initializing with config
✅ Firebase app initialized
📤 CV Upload Flow Start: {fileName: "resume.pdf"}
✅ Validation passed. CandidateId: 123
🚀 STEP 1: Uploading to Firebase Storage...
📤 Uploading CV start
📁 Storage path: careermate-files/candidates/123/cv/abc.pdf
⬆️ Uploading bytes to Firebase Storage...
✅ Upload bytes successful
🔗 Fetching download URL...
✅ Download URL obtained: https://firebasestorage...
✅ Firebase upload complete
✅ downloadUrl validation passed
🚀 STEP 2: Creating resume in backend...
📤 Creating resume in backend...
✅ Backend response: {code: 200}
✅ CV Upload Flow Complete!
```

**Action**: ✅ Everything working correctly!

---

## ❌ Error Pattern 1: Permission Denied

```
🔗 Fetching download URL...
⚠️ getDownloadURL attempt failed (1/3): {code: "storage/unauthorized"}
❌ Firebase Storage Error: Permission denied. Check Firebase Storage Rules
⏳ Retrying in 1 second...
```

**Root Cause**: Firebase Storage Rules deny read access

**Solution**:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `cm-storage-86d7d`
3. Go to **Storage** → **Rules**
4. Update rules to:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /careermate-files/candidates/{candidateId}/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
5. Click **Publish**
6. Wait 1 minute for propagation
7. Try upload again

---

## ❌ Error Pattern 2: Bucket Not Found

```
📤 Uploading CV start
⚠️ getDownloadURL attempt failed (1/3): {code: "storage/bucket-not-found"}
❌ Firebase Storage Error: Bucket not found
```

**Root Cause**: `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` env var is wrong

**Solution**:
1. Check your `.env` file:
   ```env
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cm-storage-86d7d.firebasestorage.app
   ```
2. Go to [Firebase Console](https://console.firebase.google.com) → **Storage**
3. Copy the bucket URL from the top (format: `gs://project-id.appspot.com`)
4. Update `.env` with correct bucket (without `gs://` prefix)
5. Restart dev server: `npm run dev`

---

## ❌ Error Pattern 3: Missing Environment Variable

```
❌ Missing Firebase environment variables: [NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET]
```

**Root Cause**: Environment variable not defined

**Solution**:
1. Create or update `.env.local` file in project root
2. Add missing variable:
   ```env
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cm-storage-86d7d.firebasestorage.app
   ```
3. Restart dev server
4. Verify with: `console.log(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)`

---

## ❌ Error Pattern 4: downloadUrl Still Undefined (Critical)

```
✅ Firebase upload result: {downloadUrl: undefined}
❌ CRITICAL ERROR: uploadedCv.downloadUrl is undefined!
```

**Root Cause**: This should NEVER happen with the new code. If it does:

**Investigation Steps**:
1. Check console for earlier Firebase errors
2. Look for `getDownloadURL` errors in the retry attempts
3. Check if all 3 retry attempts failed
4. Verify Firebase Storage is accessible: [https://console.firebase.google.com](https://console.firebase.google.com)
5. Check browser network tab for 403/404 errors

**Temporary Workaround**:
1. Try uploading a different file
2. Clear browser cache and reload
3. Try in incognito mode
4. Check internet connection

---

## ❌ Error Pattern 5: Backend Fails to Save

```
✅ Firebase upload complete
✅ downloadUrl validation passed
🚀 STEP 2: Creating resume in backend...
❌ Error creating resume: Network Error
```

**Root Cause**: Backend API is down or unreachable

**Solution**:
1. Check if backend is running: `http://localhost:8080/api/resume`
2. Check console for CORS errors
3. Verify API endpoint in `src/lib/api.ts`
4. Check backend logs for errors
5. Verify user is authenticated (check `Authorization` header)

---

## 🛠️ Debugging Tools

### Console Commands

```javascript
// Check Firebase config
console.log(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

// Check auth state
console.log(useAuthStore.getState());

// Test Firebase Storage access
import { storage } from '@/lib/firebase';
import { ref, listAll } from 'firebase/storage';
const testRef = ref(storage, 'careermate-files/candidates/123/cv/');
listAll(testRef).then(console.log).catch(console.error);
```

### Network Tab Inspection

1. Open **DevTools** → **Network** tab
2. Filter by **XHR/Fetch**
3. Look for:
   - Firebase Storage API calls: `firebasestorage.googleapis.com`
   - Backend API calls: `localhost:8080/api/resume`
4. Check status codes:
   - **200**: Success ✅
   - **401**: Unauthorized (auth issue)
   - **403**: Forbidden (permission issue)
   - **404**: Not found (wrong endpoint)
   - **500**: Server error (backend issue)

---

## 🎯 Common Issues & Quick Fixes

| Symptom | Quick Fix |
|---------|-----------|
| "Permission denied" | Update Firebase Storage Rules |
| "Bucket not found" | Fix `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` in .env |
| "No candidateId" | Re-login / check auth state |
| "File too large" | Use file < 3MB |
| "Backend error" | Check backend is running on port 8080 |
| "CORS error" | Configure CORS in backend |
| "Network error" | Check internet connection |

---

## 📞 When to Ask for Help

Contact support if:
- ✅ All logs show success but file not saved
- ✅ Error persists after following all solutions
- ✅ Issue occurs for all users (not just you)
- ✅ Backend logs show database errors
- ✅ Firebase console shows service outage

**Include in your support request**:
1. Complete console logs (copy all)
2. Network tab HAR file
3. Screenshot of Firebase Storage Rules
4. Your `.env` file (remove API keys!)
5. Steps to reproduce

---

## 🔄 Quick Recovery Steps

If upload fails:

1. **Clear cache**: Ctrl + Shift + Delete
2. **Hard reload**: Ctrl + Shift + R
3. **Re-login**: Logout → Login again
4. **Check Firebase Console**: Verify Storage is accessible
5. **Restart dev server**: `npm run dev`
6. **Try smaller file**: Use < 1MB PDF as test
7. **Try incognito mode**: Rules out extension issues

---

## ✅ Verification Checklist

Before reporting an issue, verify:

- [ ] `.env` file has all Firebase variables
- [ ] Backend is running (`http://localhost:8080`)
- [ ] User is logged in (check auth state)
- [ ] File is < 3MB and is PDF/DOC/DOCX
- [ ] Internet connection is stable
- [ ] Firebase Storage Rules allow read/write
- [ ] Console shows no JavaScript errors
- [ ] Browser is up-to-date

---

**Last Updated**: November 27, 2025  
**Quick Help**: Check console logs → Match error pattern → Apply solution
