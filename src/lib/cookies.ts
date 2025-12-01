// Cookie helper functions
const MAX_AGE = 30 * 24 * 60 * 60 // 30 days

export function setCookie(name: string, value: string) {
  // Don't use Secure flag on localhost (http://)
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  
  document.cookie = `${name}=${value}; path=/; max-age=${MAX_AGE}${secureFlag}; SameSite=Lax`;
  console.log(`🍪 [setCookie] Set cookie: ${name} (secure: ${isSecure})`);
}

export function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}