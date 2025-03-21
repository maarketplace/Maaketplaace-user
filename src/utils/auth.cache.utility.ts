const AUTH_DATA_KEY = "user/marketplace";

export interface AuthData {
  token: string;
}

/**
 * Stores authentication data in localStorage
 * @param token - The authentication token to cache
 * @throws Error if localStorage is not available
 */
export const cacheAuthData = (token: string): void => {
  try {
    localStorage.setItem(AUTH_DATA_KEY, token);
  } catch (error) {
    console.error('Failed to cache auth data:', error);
    throw new Error('Failed to store authentication data');
  }
};

/**
 * Retrieves cached authentication data from localStorage
 * @returns The cached auth token or null if not found
 * @throws Error if localStorage is not available
 */
export const getCachedAuthData = (): string | null => {
  try {
    const serializedData = localStorage.getItem(AUTH_DATA_KEY);
    if (!serializedData) return null;
    const token = localStorage.getItem(AUTH_DATA_KEY);
    return token ? token : null;
  } catch {
    return null;
  }
};

/**
 * Removes cached authentication data from localStorage
 * @throws Error if localStorage is not available
 */
export const deleteCachedAuthData = (): void => {
  try {
    localStorage.removeItem(AUTH_DATA_KEY);
  } catch (error) {
    console.error('Failed to delete auth data:', error);
    throw new Error('Failed to delete authentication data');
  }
};

/**
 * Checks if there is valid cached auth data
 * @returns boolean indicating if valid auth data exists
 */
export const hasValidAuthData = (): boolean => {
  try {
    const token = getCachedAuthData();
    return token !== null;
  } catch {
    return false;
  }
};