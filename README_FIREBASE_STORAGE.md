# 🗄️ Firebase Storage Setup – CareerMate

This document explains how **CareerMate** stores user-uploaded files (CVs, avatars, etc.) using **Firebase Storage** — front-end only, without backend upload proxy.  
It ensures:
- secure & private CV storage,  
- public avatars for profile display,  
- easy integration with Next.js & Firebase Auth.

---

## ⚙️ 1. Firebase Storage Structure

```
/careermate-files/
 └── candidates/
      └── {userId}/
           ├── cv/        ← CV files (private)
           └── profile/   ← Avatar images (public)
```

- `{userId}` = Firebase Auth UID of the current user.
- CV files are readable only by the file owner.
- Profile avatars are public (anyone can view).

---

## 🔐 2. Firebase Storage Security Rules

Paste this rule set in  
**Firebase Console → Storage → Rules**

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // === CV files: private ===
    match /careermate-files/candidates/{userId}/cv/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // === Avatars: public read, private write ===
    match /careermate-files/candidates/{userId}/profile/{fileName} {
      allow read: if true; // anyone can view
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // === Block everything else ===
    match /{path=**} {
      allow read, write: if false;
    }
  }
}
```

✅ **Summary of access rules:**

| Path | Read | Write | Description |
|------|------|--------|-------------|
| `/cv/` | Only owner | Only owner | Confidential CV files |
| `/profile/` | Public | Only owner | Public avatar for profile |
| `others` | None | None | Prevent unauthorized access |

---

## 🪄 3. Firebase Config in Next.js (Front-end only)

### Install SDK:
```bash
npm install firebase
```

### Create `/lib/firebase.ts`
```ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(app);
export const auth = getAuth(app);
```

All keys must start with `NEXT_PUBLIC_` since they’re used in the client.

---

## 📤 4. File Upload Helpers

### Upload CV (private)
```ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export async function uploadCV(userId: string, file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const fileRef = ref(storage, `careermate-files/candidates/${userId}/cv/${fileName}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
```

### Upload Avatar (public)
```ts
export async function uploadAvatar(userId: string, file: File) {
  const fileName = `${Date.now()}_${file.name}`;
  const fileRef = ref(storage, `careermate-files/candidates/${userId}/profile/${fileName}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}
```

---

## 🧩 5. Example Component (optional)

```tsx
"use client";
import { useState } from "react";
import { uploadAvatar } from "@/lib/upload";

export default function AvatarUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const uploadedUrl = await uploadAvatar(userId, file);
    setUrl(uploadedUrl);
  };

  return (
    <div className="flex flex-col gap-2">
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload}>Upload Avatar</button>
      {url && <img src={url} alt="avatar" className="w-24 h-24 rounded-full" />}
    </div>
  );
}
```

---

## 🌍 6. Example Public Avatar URL

After upload, avatars are accessible via public Firebase URL:

```
https://firebasestorage.googleapis.com/v0/b/<bucket-name>.appspot.com/o/careermate-files%2Fcandidates%2F<uid>%2Fprofile%2Favatar.jpg?alt=media
```

You can display this URL directly in candidate profile cards or recruiter view.

---

## 🧹 7. Cleanup Recommendations
- Keep only the latest 1–2 avatars per user.
- Allow up to 5 CVs per user; delete older ones via Firebase Functions or scheduled jobs.

---

## ✅ 8. Summary

| Feature | Implementation |
|----------|----------------|
| Storage | Firebase Storage |
| Auth | Firebase Auth |
| FE upload | Next.js + Firebase SDK |
| BE involvement | None (FE-only) |
| CV privacy | Private per user |
| Avatar | Public read, private write |
| Integration | Copilot can read this doc to generate upload & profile components |

---

> **Maintainer Note:**  
> This setup is safe, scalable, and compatible with Spring Boot or Next.js backends later — just replace Firebase Auth with JWT if backend-managed authentication is added.
