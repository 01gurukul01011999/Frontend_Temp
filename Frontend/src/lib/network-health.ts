/**
 * Network health check utilities
 * Helps detect and handle network connectivity issues
 */

export interface NetworkStatus {
  isOnline: boolean;
  latency: number;
  lastCheck: Date;
}

/**
 * Check if the user is online
 */
export const checkOnlineStatus = (): boolean => {
  return globalThis.navigator?.onLine ?? true;
};

/**
 * Test connection to Supabase
 */
export const testSupabaseConnection = async (): Promise<NetworkStatus> => {
  const startTime = Date.now();
  
  try {
    // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 second timeout
    
    const response = await fetch('/api/health', {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const latency = Date.now() - startTime;
    
    return {
      isOnline: true,
      latency,
      lastCheck: new Date(),
    };
  } catch {
    return {
      isOnline: false,
      latency: -1,
      lastCheck: new Date(),
    };
  }
};

/**
 * Monitor network status changes
 */
export const createNetworkMonitor = (onStatusChange: (status: NetworkStatus) => void) => {
  const checkStatus = async () => {
    const status = await testSupabaseConnection();
    onStatusChange(status);
  };
  
  // Check immediately
  checkStatus();
  
  // Check every 30 seconds
  const interval = setInterval(checkStatus, 30_000);
  
  // Listen for online/offline events
  const handleOnline = () => onStatusChange({ isOnline: true, latency: 0, lastCheck: new Date() });
  const handleOffline = () => onStatusChange({ isOnline: false, latency: -1, lastCheck: new Date() });
  
  globalThis.addEventListener('online', handleOnline);
  globalThis.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
  globalThis.removeEventListener('online', handleOnline);
  globalThis.removeEventListener('offline', handleOffline);
  };
};

/**
 * Get user-friendly network error message
 */
export const getNetworkErrorMessage = (error: unknown): string => {
  const maybeMessage = (error as { message?: unknown } | undefined)?.message;

  if (typeof maybeMessage === 'string' && maybeMessage.includes('Failed to fetch')) {
    return 'Network connection failed. Please check your internet connection.';
  }

  if (typeof maybeMessage === 'string' && (maybeMessage.includes('timeout') || maybeMessage.includes('aborted'))) {
    return 'Request timed out. Please check your internet connection and try again.';
  }

  if (typeof maybeMessage === 'string' && maybeMessage.includes('NetworkError')) {
    return 'Network error occurred. Please check your connection and try again.';
  }

  if (globalThis.navigator?.onLine === false) {
    return 'You are currently offline. Please check your internet connection.';
  }

  return 'An unexpected error occurred. Please try again.';
};
