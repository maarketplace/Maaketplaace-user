import axios from "axios";

const { VITE_ENDPOINT } = import.meta.env;
const { VITE_TOKEN_USER } = import.meta.env;

// Function to get the token directly when needed
const getToken = () => {
    return localStorage.getItem(VITE_TOKEN_USER);
};

export const getUser = async () => {
    const usertoken = getToken();
    if (!usertoken) throw new Error('No user token found'); // Handle missing token case
    return await axios.get(`${VITE_ENDPOINT}/user`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`,
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
    const usertoken = getToken();
    if (!usertoken) throw new Error('No user token found');
    return await axios.get(`${VITE_ENDPOINT}/orders/users`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        }
    });
};
export const getUserOrderDetails = async (id: string) => {
    const usertoken = getToken();
    if (!usertoken) throw new Error('No user token found');
    return await axios.get(`${VITE_ENDPOINT}/orders/${id}`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
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