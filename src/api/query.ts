import axiosInstance from "./axiosInstance";

export const getUser = async () => {
    return await axiosInstance.get("/user");
};

export const getAllProduct = async (params?: { page?: number; limit?: number; random?: boolean }) => {
    return await axiosInstance.get("/products", { params });
};

export const getOneProduct = async (id: string) => {
    return await axiosInstance.get(`/products/${id}`);
};

export const getAllComment = async () => {
    return await axiosInstance.get("/comments");
};

export const getUserOrders = async () => {
    return await axiosInstance.get("/orders/users");
};

export const getUserOrderDetails = async (id: string) => {
    return await axiosInstance.get(`/orders/${id}`);
};

export const getOneMerchantStoreProduct = async (businessName: string | null) => {
    return await axiosInstance.get(`/merchants/products/${businessName}`);
};

export const getProductComment = async (id: string) => {
    return await axiosInstance.get(`/comments/products/${id}`);
};

export const getProductCommentResponse = async (id: string | null) => {
    return await axiosInstance.post(`/comments/${id}/replies`);
};

export const getOrderSummary = async (reference: string | null) => {
    return await axiosInstance.get("/payment", {
        params: { reference }
    });
};

export const getAllQuciks = async () => {
    return await axiosInstance.get("/quicks");
};

export const getQuicksComment = async (id: string) => {
    return await axiosInstance.get(`/quicks/comments/${id}`);
};

export const searchByQuery = async (params: Record<string, string>) => {
    return await axiosInstance.get('/products/search-by-fields', { params });
};

export const searchProduct = async (page: number, limit: number, search: string) => {
 const trimmedSearch = search.trim();
    return await axiosInstance.get(`/products/search`, {
        params: { search: trimmedSearch, page, limit }
    });
};

export const getAllEvents = async (params?: { page?: number; limit?: number }) => {
    return await axiosInstance.get("/events", { params });
}

export const getOneEvent = async (id: string) => {
    return await axiosInstance.get(`/events/${id}`);
};
