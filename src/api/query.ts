import axios from "axios";
import { getCachedToken } from "../utils/auth.cache.utility";

const { VITE_ENDPOINT } = import.meta.env;


// Function to get the token directly when needed
const getToken = getCachedToken()

export const getUser = async () => {  
    if (!getToken) throw new Error('No user token found');
    return await axios.get(`${VITE_ENDPOINT}/user`, {
        headers: {
            'Authorization': `Bearer ${getToken}`,
        },
    });
};

export const getAllProduct = async () => {
    return await axios.get(`${VITE_ENDPOINT}/product`);
}

export const getOneProduct = async (id: string) => {
    return await axios.get(`${VITE_ENDPOINT}/product/${id}`);
}

export const getAllComment = async () => {
    return await axios.get(`${VITE_ENDPOINT}/comments`);
}

export const getUserOrders = async () => {
    if (!getToken) throw new Error('No user token found');
    return await axios.get(`${VITE_ENDPOINT}/orders/users`, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    });
};
export const getUserOrderDetails = async (id: string) => {
    if (!getToken) throw new Error('No user token found');
    return await axios.get(`${VITE_ENDPOINT}/orders/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    });
};


export const getOneMerchantStoreProduct = async (businessName: string | null) => {
    return await axios.get(`${VITE_ENDPOINT}/merchants/products/${businessName}`, {

    });
}

export const getProductComment = async (id: string) => {
    return await axios.get(`${VITE_ENDPOINT}/comments/products/${id}`);
}
export const getProductCommentResponse = async (id: string | null) => {
    return await axios.post(`${VITE_ENDPOINT}/comments/${id}/replies`,);
};
export const getOrderSummary = async (reference: string | null) => {
    return await axios.get(`${VITE_ENDPOINT}/payment`, {
        params: {
            reference
        }
    })
  }

  export const getAllQuciks = async () => {
    return await axios.get(`${VITE_ENDPOINT}/quicks`, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    });
};
export const getQuicksComment = async (id: string) => {
    return await axios.get(`${VITE_ENDPOINT}/quicks/comments/${id}`);
}