import axios from 'axios';
// import toast from 'react-hot-toast';
import { getCachedToken } from '../utils/auth.cache.utility';
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCachedToken();
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    // (error) => {
    //     toast.error(
    //         error.response?.data?.message || 'An error occurred. Please try again later.'
    //     );
    //     return Promise.reject(error);
    // }
);

export default axiosInstance;
