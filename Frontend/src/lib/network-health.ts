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
  return navigator.onLine;
};

/**
 * Test connection to Supabase
 */
export const testSupabaseConnection = async (): Promise<NetworkStatus> => {
  const startTime = Date.now();
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
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
  } catch (error) {
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
  const interval = setInterval(checkStatus, 30000);
  
  // Listen for online/offline events
  const handleOnline = () => onStatusChange({ isOnline: true, latency: 0, lastCheck: new Date() });
  const handleOffline = () => onStatusChange({ isOnline: false, latency: -1, lastCheck: new Date() });
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
};

/**
 * Get user-friendly network error message
 */
export const getNetworkErrorMessage = (error: any): string => {
  if (error.message?.includes('Failed to fetch')) {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  if (error.message?.includes('timeout') || error.message?.includes('aborted')) {
    return 'Request timed out. Please check your internet connection and try again.';
  }
  
  if (error.message?.includes('NetworkError')) {
    return 'Network error occurred. Please check your connection and try again.';
  }
  
  if (!navigator.onLine) {
    return 'You are currently offline. Please check your internet connection.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};
