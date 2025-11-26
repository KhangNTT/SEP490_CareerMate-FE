# CV Firebase Integration - Usage Examples

## Overview
This document shows how to integrate the Firebase CV fetching system into your pages using the `useCVData` hook and `cvService`.

## Table of Contents
- [Basic Hook Usage](#basic-hook-usage)
- [Page Integration Example](#page-integration-example)
- [Service Layer Usage](#service-layer-usage)
- [Complete Example](#complete-example)

---

## Basic Hook Usage

### Simple Realtime Hook
```tsx
"use client";

import { useCVData } from "@/hooks/useCVData";

export default function MyPage() {
  // Hook automatically gets userId from auth store
  const { cvs, defaultCV, loading, error, refresh } = useCVData();

  if (loading) return <div>Loading CVs...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Default CV: {defaultCV?.name || "None"}</h2>
      <ul>
        {cvs.map((cv) => (
          <li key={cv.id}>{cv.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Simple One-Time Fetch (No Realtime)
```tsx
import { useCVDataSimple } from "@/hooks/useCVData";

export default function MyPage() {
  const { cvs, defaultCV, loading, error, refresh } = useCVDataSimple();
  
  // Same interface, but no realtime updates
  // Use refresh() to manually reload data
}
```

### With Specific User ID
```tsx
const { cvs, loading } = useCVData("specific-user-id-123");
```

---

## Page Integration Example

### Replace Mock Data in CV Management Page

**Before (Mock Data):**
```tsx
// src/app/candidate/cv-management/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function CVManagementPage() {
  const [uploadedCVs, setUploadedCVs] = useState([]);
  const [builtCVs, setBuiltCVs] = useState([]);
  const [defaultCV, setDefaultCV] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      setUploadedCVs([/* mock data */]);
      setBuiltCVs([/* mock data */]);
      setDefaultCV(/* mock data */);
      setLoading(false);
    }, 1000);
  }, []);

  // ... rest of component
}
```

**After (Firebase Integration):**
```tsx
// src/app/candidate/cv-management/page.tsx
"use client";

import { useCVData } from "@/hooks/useCVData";
import { useMemo } from "react";

export default function CVManagementPage() {
  // Get all CVs with realtime updates
  const { cvs: allCVs, defaultCV, loading, error, refresh } = useCVData();

  // Split CVs by type
  const { uploadedCVs, builtCVs, draftCVs } = useMemo(() => {
    return {
      uploadedCVs: allCVs.filter((cv) => cv.type === "uploaded" || cv.source === "upload"),
      builtCVs: allCVs.filter((cv) => cv.type === "built" || cv.source === "builder"),
      draftCVs: allCVs.filter((cv) => cv.source === "draft"),
    };
  }, [allCVs]);

  if (loading) {
    return <div>Loading CVs...</div>;
  }

  if (error) {
    return <div>Error loading CVs: {error.message}</div>;
  }

  // ... rest of component with uploadedCVs, builtCVs, defaultCV
}
```

---

## Service Layer Usage

### Upload CV
```tsx
import { cvService } from "@/services/cvService";
import { useAuthStore } from "@/stores/use-auth-store";

export default function UploadCVButton() {
  const { candidateId } = useAuthStore();
  const { refresh } = useCVData(); // Get refresh function from hook

  const handleUpload = async (file: File) => {
    try {
      const cv = await cvService.uploadCV(candidateId, file, {
        type: "uploaded",
        visibility: "private",
        parsedStatus: "processing",
      });

      console.log("Uploaded CV:", cv);
      
      // Refresh hook data (optional - realtime updates will handle this)
      await refresh();
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <input
      type="file"
      accept=".pdf,.doc,.docx"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
      }}
    />
  );
}
```

### Set Default CV
```tsx
import { cvService } from "@/services/cvService";
import { useAuthStore } from "@/stores/use-auth-store";

const handleSetDefault = async (cvId: string) => {
  const { candidateId } = useAuthStore.getState();
  
  try {
    await cvService.setDefaultCV(candidateId, cvId);
    // Realtime hook will automatically update!
    console.log("Default CV updated");
  } catch (error) {
    console.error("Failed to set default:", error);
  }
};
```

### Delete CV
```tsx
const handleDelete = async (cvId: string) => {
  try {
    await cvService.deleteCV(cvId);
    // Realtime hook will automatically remove it from the list
    console.log("CV deleted");
  } catch (error) {
    console.error("Failed to delete:", error);
  }
};
```

### Rename CV
```tsx
const handleRename = async (cvId: string, newName: string) => {
  try {
    await cvService.renameCV(cvId, newName);
    // Realtime hook will automatically update the name
    console.log("CV renamed");
  } catch (error) {
    console.error("Failed to rename:", error);
  }
};
```

### Update CV Visibility
```tsx
const handleTogglePrivacy = async (cvId: string, isPublic: boolean) => {
  try {
    await cvService.updateCVPrivacy(cvId, isPublic ? "public" : "private");
    console.log("Privacy updated");
  } catch (error) {
    console.error("Failed to update privacy:", error);
  }
};
```

### Download CV
```tsx
const handleDownload = async (cvId: string, fileName: string) => {
  try {
    const blob = await cvService.downloadCV(cvId);
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to download:", error);
  }
};
```

---

## Complete Example

### Full CV Management Page with Firebase Integration

```tsx
"use client";

import { useCVData } from "@/hooks/useCVData";
import { cvService } from "@/services/cvService";
import { useAuthStore } from "@/stores/use-auth-store";
import { CVCardHorizontal } from "@/components/cv-management/CVCardHorizontal";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw } from "lucide-react";

export default function CVManagementPage() {
  // Get user info
  const { candidateId, user } = useAuthStore();
  const userId = candidateId || user?.id || "";

  // Get CVs with realtime updates
  const { cvs: allCVs, defaultCV, loading, error, refresh } = useCVData();

  // Local state
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Split CVs by type
  const { uploadedCVs, builtCVs, draftCVs } = useMemo(() => {
    return {
      uploadedCVs: allCVs.filter((cv) => cv.type === "uploaded" || cv.source === "upload"),
      builtCVs: allCVs.filter((cv) => cv.type === "built" || cv.source === "builder"),
      draftCVs: allCVs.filter((cv) => cv.source === "draft"),
    };
  }, [allCVs]);

  // ===== Event Handlers =====

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      await cvService.uploadCV(userId, file, {
        type: "uploaded",
        visibility: "private",
        parsedStatus: "processing",
      });
      // Realtime updates will automatically add it to the list
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload CV");
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (cvId: string) => {
    try {
      await cvService.setDefaultCV(userId, cvId);
      // Realtime updates will automatically update isDefault flags
    } catch (error) {
      console.error("Failed to set default:", error);
      alert("Failed to set default CV");
    }
  };

  const handleDelete = async (cvId: string) => {
    if (!confirm("Are you sure you want to delete this CV?")) return;

    try {
      await cvService.deleteCV(cvId);
      // Realtime updates will automatically remove it
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete CV");
    }
  };

  const handleDownload = async (cvId: string, fileName: string) => {
    try {
      const blob = await cvService.downloadCV(cvId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download:", error);
      alert("Failed to download CV");
    }
  };

  const handleRename = async (cvId: string, newName: string) => {
    try {
      await cvService.renameCV(cvId, newName);
      // Realtime updates will automatically update the name
    } catch (error) {
      console.error("Failed to rename:", error);
      alert("Failed to rename CV");
    }
  };

  const handleTogglePrivacy = async (cvId: string, isPublic: boolean) => {
    try {
      await cvService.updateCVPrivacy(cvId, isPublic ? "public" : "private");
    } catch (error) {
      console.error("Failed to update privacy:", error);
      alert("Failed to update privacy");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refresh();
    } finally {
      setRefreshing(false);
    }
  };

  // ===== Render =====

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your CVs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">Error loading CVs</p>
          <p className="text-sm mb-4">{error.message}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">CV Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => document.getElementById("cv-upload-input")?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Upload CV"}
          </Button>
          <input
            id="cv-upload-input"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </div>
      </div>

      {/* Default CV Section */}
      {defaultCV && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Default CV</h2>
          <CVCardHorizontal
            id={defaultCV.id}
            name={defaultCV.name}
            source={defaultCV.source || "upload"}
            fileUrl={defaultCV.downloadUrl}
            parsedStatus={defaultCV.parsedStatus || "ready"}
            isDefault={true}
            privacy={defaultCV.visibility}
            updatedAt={defaultCV.updatedAt || defaultCV.createdAt}
            fileSize={defaultCV.fileSize}
            onSetDefault={() => {}} // Already default
            onDelete={() => handleDelete(defaultCV.id)}
            onDownload={() => handleDownload(defaultCV.id, defaultCV.name)}
            onRename={(newName) => handleRename(defaultCV.id, newName)}
            onTogglePrivacy={(isPublic) => handleTogglePrivacy(defaultCV.id, isPublic)}
          />
        </div>
      )}

      {/* Uploaded CVs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Uploaded CVs ({uploadedCVs.length})
        </h2>
        {uploadedCVs.length === 0 ? (
          <p className="text-gray-500">No uploaded CVs yet</p>
        ) : (
          <div className="grid gap-4">
            {uploadedCVs.map((cv) => (
              <CVCardHorizontal
                key={cv.id}
                id={cv.id}
                name={cv.name}
                source={cv.source || "upload"}
                fileUrl={cv.downloadUrl}
                parsedStatus={cv.parsedStatus || "ready"}
                isDefault={cv.isDefault}
                privacy={cv.visibility}
                updatedAt={cv.updatedAt || cv.createdAt}
                fileSize={cv.fileSize}
                onSetDefault={() => handleSetDefault(cv.id)}
                onDelete={() => handleDelete(cv.id)}
                onDownload={() => handleDownload(cv.id, cv.name)}
                onRename={(newName) => handleRename(cv.id, newName)}
                onTogglePrivacy={(isPublic) => handleTogglePrivacy(cv.id, isPublic)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Built CVs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Built CVs ({builtCVs.length})
        </h2>
        {builtCVs.length === 0 ? (
          <p className="text-gray-500">No built CVs yet</p>
        ) : (
          <div className="grid gap-4">
            {builtCVs.map((cv) => (
              <CVCardHorizontal
                key={cv.id}
                id={cv.id}
                name={cv.name}
                source={cv.source || "builder"}
                fileUrl={cv.downloadUrl}
                parsedStatus={cv.parsedStatus || "ready"}
                isDefault={cv.isDefault}
                privacy={cv.visibility}
                updatedAt={cv.updatedAt || cv.createdAt}
                fileSize={cv.fileSize}
                onSetDefault={() => handleSetDefault(cv.id)}
                onDelete={() => handleDelete(cv.id)}
                onDownload={() => handleDownload(cv.id, cv.name)}
                onRename={(newName) => handleRename(cv.id, newName)}
                onTogglePrivacy={(isPublic) => handleTogglePrivacy(cv.id, isPublic)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Draft CVs */}
      {draftCVs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Draft CVs ({draftCVs.length})
          </h2>
          <div className="grid gap-4">
            {draftCVs.map((cv) => (
              <CVCardHorizontal
                key={cv.id}
                id={cv.id}
                name={cv.name}
                source={cv.source || "draft"}
                fileUrl={cv.downloadUrl}
                parsedStatus={cv.parsedStatus || "processing"}
                isDefault={cv.isDefault}
                privacy={cv.visibility}
                updatedAt={cv.updatedAt || cv.createdAt}
                fileSize={cv.fileSize}
                onSetDefault={() => handleSetDefault(cv.id)}
                onDelete={() => handleDelete(cv.id)}
                onDownload={() => handleDownload(cv.id, cv.name)}
                onRename={(newName) => handleRename(cv.id, newName)}
                onTogglePrivacy={(isPublic) => handleTogglePrivacy(cv.id, isPublic)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Key Points

### ✅ Realtime Updates
- The `useCVData` hook uses Firestore's `onSnapshot` for realtime updates
- Any changes (upload, delete, rename, etc.) will automatically reflect in the UI
- No need to manually call `refresh()` after mutations (but you can if needed)

### ✅ Auth Integration
- Hook automatically gets `userId` from `useAuthStore`
- Falls back to: `candidateId` → `user.id` → throws error if both missing
- Can override with custom `userId` parameter

### ✅ Error Handling
- All service methods include try/catch blocks
- Hook provides `error` state with Error object
- Display errors to users with appropriate UI

### ✅ Loading States
- Hook provides `loading` boolean
- Use it to show loading spinners/skeletons
- Separate loading states for individual operations (uploading, deleting, etc.)

### ✅ Type Safety
- All functions are fully typed with TypeScript
- CV interface includes all required and optional fields
- Type exports: `CV`, `CVType`, `CVVisibility`, `CVParsedStatus`

---

## Next Steps

1. ✅ **Integration Complete** - Firebase service and hook are ready
2. ⏭️ **Test Upload** - Try uploading a CV file
3. ⏭️ **Test Realtime** - Open page in two tabs, change in one, see update in other
4. ⏭️ **Test CRUD** - Try all operations (upload, delete, rename, set default)
5. ⏭️ **Add Toasts** - Consider adding success/error toast notifications

---

**Created**: 2024
**Author**: CareerMate Development Team
