import axios from "axios";
import { getCachedAuthData } from "../utils/auth.cache.utility";

const { VITE_ENDPOINT_STAGING } = import.meta.env;

const getToken = getCachedAuthData()

export const getUser = async () => {
    const usertoken = getToken;    
    return await axios.get(`${VITE_ENDPOINT_STAGING}/user`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`,
        },
    });
};

export const getAllProduct = async () => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/product`);
}

export const getOneProduct = async (id: string | undefined) => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/product/${id}`);
}

export const getAllComment = async () => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/comments`);
}
export const getUserOrders = async () => {
    const usertoken = getToken;
    return await axios.get(`${VITE_ENDPOINT_STAGING}/orders/users`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        }
    });
};
export const getUserOrderDetails = async (id: string) => {
    const usertoken = getToken;
    return await axios.get(`${VITE_ENDPOINT_STAGING}/orders/${id}`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        }
    });
};

export const getOneMerchantStoreProduct = async (businessName: string | null) => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/merchants/products/${businessName}`, {

    });
}

export const getProductComment = async (id: string) => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/comments/products/${id}`);
}
export const getProductCommentResponse = async (id: string | null) => {
    return await axios.post(`${VITE_ENDPOINT_STAGING}/comments/${id}/replies`,);
};
export const getOrderSummary = async (reference: string | null) => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/payment`, {
        params: {
            reference
        }
    })
  }

  export const getAllQuciks = async () => {
    const usertoken = getToken;
    return await axios.get(`${VITE_ENDPOINT_STAGING}/quicks`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        }
    });
};
export const getQuicksComment = async (id: string) => {
    return await axios.get(`${VITE_ENDPOINT_STAGING}/quicks/comments/${id}`);
}