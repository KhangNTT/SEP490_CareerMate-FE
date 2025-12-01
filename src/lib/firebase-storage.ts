/**
 * Firebase Storage Utilities - Re-exports
 * 
 * This file provides a centralized import point for all Firebase storage utilities.
 * 
 * Usage:
 * import { getFileUrl, useFileUrl, FirebaseImage, FirebaseAvatar } from '@/lib/firebase-storage';
 */

// Core utilities for working with Firebase Storage
export {
  getFileUrl,
  useFileUrl,
  useFileUrls,
  resolveFileUrl,
  isStoragePath,
  extractStoragePath,
} from './firebase-file';

// Upload utilities
export {
  uploadAvatar,
  uploadAvatarUrl,
  uploadCV,
  uploadCVPDF,
  uploadCvFile,
  deleteFile,
  type UploadResult,
} from './firebase-upload';
