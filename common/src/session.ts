/**
 * Interface describing a login request.
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Data returned for new sessions
 */
export interface SessionData {
  license: boolean;
  admin: boolean;
  firstName: string;
}
