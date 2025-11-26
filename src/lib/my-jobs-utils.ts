/**
 * Utility functions for MyJobs page
 */

/**
 * Calculate days difference from a date to now
 */
export const getDaysDiff = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const days = getDaysDiff(dateString);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
};
