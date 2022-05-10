import { environment } from '../environments/environment';

/**
 * Appends relative route to backend URL. Requires leading '/'.
 *
 * @param url
 * @returns complete url
 */
export function constructUrl(url: string): string {
  return `${environment.backendUrl}${url}`;
}
