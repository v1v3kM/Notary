/**
 * Date utilities for consistent formatting across server and client
 * Prevents hydration mismatches by using consistent formatting
 */

/**
 * Format date for display with consistent locale and timezone
 * Prevents SSR/client hydration mismatches
 */
export function formatDateTime(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    // Use consistent formatting that works on both server and client
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Use UTC to prevent timezone mismatches
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format date only (no time) with consistent formatting
 */
export function formatDate(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'UTC'
    });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format time only with consistent formatting
 */
export function formatTime(date: Date | string | number): string {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid time';
    }
    
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  } catch {
    return 'Invalid time';
  }
}

/**
 * Check if we're on the client side
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Safe date formatting that prevents hydration issues
 * Returns a placeholder on server, actual date on client after hydration
 */
export function safeFormatDateTime(date: Date | string | number): string {
  // For server-side rendering, return a consistent placeholder
  if (!isClient()) {
    return 'Loading...';
  }
  
  // On client, format normally
  return formatDateTime(date);
}
