export function hasSessionCookie(): boolean {
  console.debug('Checking for session cookie...');
  console.debug(JSON.stringify(document.cookie));
  return document.cookie.split(';').some(cookie => cookie.trim().startsWith('connect.sid='));
}
