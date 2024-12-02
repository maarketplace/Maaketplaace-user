
const AUTH_DATA_KEY = "user/maarketplaace";

export const cacheAuthData = async (authData: string) => {
    localStorage.setItem(AUTH_DATA_KEY, authData);
};

export const getCachedAuthData = () => {
    const jsonValue = localStorage.getItem(AUTH_DATA_KEY);
    if (jsonValue) {
        return jsonValue
    } else {
        return undefined
    }
};

export const deleteCachedAuthData = () => {
    localStorage.removeItem(AUTH_DATA_KEY);
};

