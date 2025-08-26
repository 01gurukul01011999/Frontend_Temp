// Cookie utility functions

export const cookieUtils = {
  // Set a cookie
  setCookie: (name: string, value: string, days: number = 7): void => {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  },

  // Get a cookie value
  getCookie: (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    
    return null;
  },

  // Delete a cookie
  deleteCookie: (name: string): void => {
    if (typeof document === 'undefined') return;
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  // Check if a cookie exists
  hasCookie: (name: string): boolean => {
    return cookieUtils.getCookie(name) !== null;
  },

  // Get all cookies as an object
  getAllCookies: (): Record<string, string> => {
    if (typeof document === 'undefined') return {};
    
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');
    
    cookieArray.forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
      }
    });
    
    return cookies;
  },

  // Set a secure cookie (HTTPS only)
  setSecureCookie: (name: string, value: string, days: number = 7): void => {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    const secure = window.location.protocol === 'https:' ? ';Secure' : '';
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${secure}`;
  },

  // Set an HTTP-only cookie (server-side only)
  setHttpOnlyCookie: (name: string, value: string, days: number = 7): string => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return `${name}=${value};expires=${expires.toUTCString()};path=/;HttpOnly;SameSite=Strict`;
  },
};
