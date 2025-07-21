export function hasSessionCookie(): boolean {
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith('connect.sid='));
}
