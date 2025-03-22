const AUTH_DATA_KEY = "user/marketplace";

export interface AuthData {
  token: string;
  // You could expand this interface with additional fields if needed
  // expiresAt?: number;
  // refreshToken?: string;
}

/**
 * Stores authentication data in localStorage
 * @param token - The authentication token to cache
 * @throws Error if localStorage is not available
 */
export const cacheAuthData = (token: string): void => {
  try {
    localStorage.setItem(AUTH_DATA_KEY, JSON.stringify({ token }));
  } catch (error) {
    console.error('Failed to cache auth data:', error);
    throw new Error('Failed to store authentication data');
  }
};

/**
 * Retrieves cached authentication data from localStorage
 * @returns The cached AuthData object or null if not found
 * @throws Error if localStorage is not available
 */
export const getCachedAuthData = (): AuthData | null => {
  try {
    const serializedData = localStorage.getItem(AUTH_DATA_KEY);
    if (!serializedData) return null;

    try {
      return JSON.parse(serializedData) as AuthData;
    } catch (parseError) {
      // Handle case where data exists but isn't valid JSON
      console.error('Failed to parse auth data:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve auth data:', error);
    return null;
  }
};

/**
 * Retrieves just the token from cached authentication data
 * @returns The cached auth token string or null if not found
 */
export const getCachedToken = (): string | null => {
  const authData = getCachedAuthData();
  return authData?.token || null;
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
    const authData = getCachedAuthData();
    return authData !== null && typeof authData.token === 'string' && authData.token.length > 0;
  } catch {
    return false;
  }
};