/**
 * Appends relative route to backend URL. Requires leading '/'.
 *
 * @param url
 * @returns complete url
 */
export function constructUrl(url: string): string {
  return `/api${url}`;
}
