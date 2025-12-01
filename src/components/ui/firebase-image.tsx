/**
 * Firebase Image Component
 * 
 * A React component that handles displaying images from Firebase Storage.
 * It automatically resolves storage paths to download URLs and handles loading states.
 * 
 * Supports both:
 * - Storage paths: "careermate-files/candidates/5/avatar/xxx.jpg"
 * - Full URLs: "https://firebasestorage.googleapis.com/..."
 */

"use client";

import React, { useState } from "react";
import { useFileUrl } from "@/lib/firebase-file";
import { cn } from "@/lib/utils";

interface FirebaseImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  /** The storage path or full URL to the image */
  src: string | undefined | null;
  /** Alt text for the image */
  alt: string;
  /** Fallback content or image to show while loading or on error */
  fallback?: React.ReactNode;
  /** Additional class names */
  className?: string;
  /** Show skeleton while loading */
  showSkeleton?: boolean;
  /** Callback when image fails to load */
  onLoadError?: (error: Error) => void;
}

/**
 * FirebaseImage - Image component that handles Firebase Storage paths/URLs
 * 
 * @example
 * // Using storage path
 * <FirebaseImage 
 *   src="careermate-files/candidates/5/avatar/photo.jpg" 
 *   alt="User avatar"
 *   className="w-20 h-20 rounded-full"
 * />
 * 
 * @example
 * // Using full URL (also works)
 * <FirebaseImage 
 *   src="https://firebasestorage.googleapis.com/..."
 *   alt="User avatar"
 *   fallback={<UserIcon />}
 * />
 */
export function FirebaseImage({
  src,
  alt,
  fallback,
  className,
  showSkeleton = true,
  onLoadError,
  ...props
}: FirebaseImageProps) {
  const resolvedUrl = useFileUrl(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Handle no src provided
  if (!src) {
    return fallback ? <>{fallback}</> : null;
  }

  // Handle error state
  if (hasError) {
    return fallback ? <>{fallback}</> : null;
  }

  // Handle loading state
  if (!resolvedUrl) {
    if (showSkeleton) {
      return (
        <div 
          className={cn(
            "animate-pulse bg-gray-200",
            className
          )}
          aria-label={`Loading ${alt}`}
        />
      );
    }
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <>
      {/* Show skeleton while image is loading */}
      {!isLoaded && showSkeleton && (
        <div 
          className={cn(
            "animate-pulse bg-gray-200",
            className
          )}
          aria-hidden="true"
        />
      )}
      <img
        src={resolvedUrl}
        alt={alt}
        className={cn(
          className,
          !isLoaded && "sr-only" // Hide image until loaded
        )}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          setHasError(true);
          onLoadError?.(new Error(`Failed to load image: ${src}`));
        }}
        {...props}
      />
    </>
  );
}

/**
 * FirebaseAvatar - Specialized avatar component for Firebase Storage
 */
interface FirebaseAvatarProps {
  src: string | undefined | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackInitials?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-20 h-20 text-xl",
};

export function FirebaseAvatar({
  src,
  alt,
  size = "md",
  className,
  fallbackInitials,
}: FirebaseAvatarProps) {
  const initials = fallbackInitials || alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fallbackContent = (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-medium",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );

  return (
    <FirebaseImage
      src={src}
      alt={alt}
      className={cn(
        "rounded-full object-cover",
        sizeClasses[size],
        className
      )}
      fallback={fallbackContent}
    />
  );
}

export default FirebaseImage;
