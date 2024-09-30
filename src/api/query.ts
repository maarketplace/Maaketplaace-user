import axios from "axios";

const { VITE_ENDPOINT } = import.meta.env;
const { VITE_TOKEN_USER } = import.meta.env;


export const getUser = async () => {
    const usertoken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.get(`${VITE_ENDPOINT}/user`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`,
        },
    })
};
export const getAllProduct = async () => {
    return await axios.get(`${VITE_ENDPOINT}/product`)
}

export const getOneProduct = async (id: string) => {
    // console.log(data?.queryKey[1])
    return await axios.get(`${VITE_ENDPOINT}/product/${id}`)
}

export const getAllComment = async () => {
    return await axios.get(``)
}

export const getUserOrders = async () => {
    const usertoken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.get(`${VITE_ENDPOINT}/orders/users`, {
        headers: {
            'Authorization': `Bearer ${usertoken}`
        }
    })
};
export const getOneMerchantStoreProduct = async (businessName: string | null) => {
    // console.log(data);
    return await axios.get(`${VITE_ENDPOINT}/merchants/products`, {
        params: {
         businessName
        }
    })
}
export const getProductComment = async (id: string) => {
    return await axios.get(`${VITE_ENDPOINT}/comments/products/${id}`)
}