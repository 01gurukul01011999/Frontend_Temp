/* eslint-disable unicorn/no-document-cookie, unicorn/no-typeof-undefined, @typescript-eslint/no-explicit-any */
// Cookie utility functions

export const cookieUtils = {
  // Set a cookie
  setCookie: (name: string, value: string, days: number = 7): void => {
    if (typeof globalThis.document === 'undefined') return;

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

    globalThis.document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  },

  // Get a cookie value
  getCookie: (name: string): string | null => {
    const doc = globalThis.document as Document | undefined;
    if (doc === undefined) return null;

    const nameEQ = name + '=';
    const cookieString = (doc as any)['cookie'] ?? '';
    const ca = cookieString.split(';');

    for (const raw of ca) {
      let c = raw;
      while (c.charAt(0) === ' ') c = c.slice(1);
      if (c.indexOf(nameEQ) === 0) return c.slice(nameEQ.length);
    }
    
    return null;
  },

  // Delete a cookie
  deleteCookie: (name: string): void => {
  const doc = globalThis.document as Document | undefined;
  if (doc === undefined) return;

  (doc as any)['cookie'] = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  },

  // Check if a cookie exists
  hasCookie: (name: string): boolean => {
    return cookieUtils.getCookie(name) !== null;
  },

  // Get all cookies as an object
  getAllCookies: (): Record<string, string> => {
    const doc = globalThis.document;
    if (doc === undefined) return {};

    const cookies: Record<string, string> = {};
  const cookieArray = ((doc as any)['cookie'] ?? '').split(';');

    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value;
      }
    }
    
    return cookies;
  },

  // Set a secure cookie (HTTPS only)
  setSecureCookie: (name: string, value: string, days: number = 7): void => {
  const doc = globalThis.document as Document | undefined;
  if (doc === undefined) return;

  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));

  const secure = globalThis.location?.protocol === 'https:' ? ';Secure' : '';
  (doc as any)['cookie'] = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${secure}`;
  },

  // Set an HTTP-only cookie (server-side only)
  setHttpOnlyCookie: (name: string, value: string, days: number = 7): string => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return `${name}=${value};expires=${expires.toUTCString()};path=/;HttpOnly;SameSite=Strict`;
  },
};
