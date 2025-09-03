// Token utility functions

export const tokenUtils = {
  // Parse JWT token without verification (for client-side display purposes only)
  parseToken: (token: string) => {
    try {
      const parts = token.split('.');
      const base64Url = parts[1];
      const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
      const jsonPayload = decodeURIComponent(
        [...atob(base64)]
          .map((c) => '%' + ('00' + c.codePointAt(0)!.toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = tokenUtils.parseToken(token);
      if (!payload || !payload.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    try {
      const payload = tokenUtils.parseToken(token);
      if (!payload || !payload.exp) return null;
      
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  },

  // Get time until token expires (in seconds)
  getTimeUntilExpiration: (token: string): number => {
    try {
      const payload = tokenUtils.parseToken(token);
      if (!payload || !payload.exp) return 0;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return Math.max(0, payload.exp - currentTime);
    } catch {
      return 0;
    }
  },

  // Generate a random token (for testing purposes)
  generateRandomToken: (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};
