import axios from "axios";

import { getCachedAuthData } from "../utils/auth.cache.utility";

const { VITE_ENDPOINT } = import.meta.env;

const getToken = getCachedAuthData()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userSignup = async (data: any) => {
    return await axios.post(`${VITE_ENDPOINT}/user`, data)
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userVerify = async (data: any) => {
    return await axios.patch(`${VITE_ENDPOINT}/user/verify`, data)
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const userLogin = async (data: any) => {
    return await axios.post(`${VITE_ENDPOINT}/user/login`, data)
};
export const logOutUser = async (id: string) => {
    // console.log(id)
    return await axios.post(`${VITE_ENDPOINT}/user/logout/${id}`)
}
export const userLike = async (id: string) => {
    return await axios.post(`${VITE_ENDPOINT}/product/${id}/like/user`, {}, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}
export const addProductToCart = async ({ id, data }: { id: string, data: number }) => {
    return await axios.post(`${VITE_ENDPOINT}/carts/product/${id}`, data, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}
export const clearCart = async () => {
    return await axios.delete(`${VITE_ENDPOINT}/order`, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}

export const userComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {


    return await axios.post(`${VITE_ENDPOINT}/comment/products/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${getToken}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const userQuicksComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {


    return await axios.post(`${VITE_ENDPOINT}/quicks/comment/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${getToken}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const userReplyComment = async ({ id, comment }: { id: string | null, comment: string }) => {


    return await axios.post(`${VITE_ENDPOINT}/comments/${id}/replies`, comment, {
        headers: {
            'Authorization': `Bearer ${getToken}`,
        },
    });
};

export const userLikeAComment = async (id: string | undefined) => {
    return await axios.post(`${VITE_ENDPOINT}/comment/${id}/like/user`, {}, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}
export const userLikeAQuicks = async (id: string | undefined) => {
    return await axios.post(`${VITE_ENDPOINT}/quicks/${id}/like/user`, {}, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}
export const userForgotPassword = async (email: string) => {
    return await axios.post(`${VITE_ENDPOINT}/user/forgot`, {email})
}

export const userResetPassword = async (data: { id: string | undefined, password: string }) => {
    const { id, password } = data
    return await axios.patch(`${VITE_ENDPOINT}/user/ps-change/${id}`, { password })
}

export const userBuyNow = async (id: string) => {
    return await axios.post(`${VITE_ENDPOINT}/orders/products/${id}/buy`, {}, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}

export const userPayWithKora = async (id: string) => {
    return await axios.post(`${VITE_ENDPOINT}/init-kora/orders/${id}/single`, {}, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}

export const userFollowMerchant = async (id: string) => {
    return await axios.post(`${VITE_ENDPOINT}/users/merchants/${id}`, {}, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        }
    })
}

export const resendVerification = async (email: string | null) => {
    return await axios.post(`${VITE_ENDPOINT}/email?email=${email}&type=user`,);
};

export const deleteComment = async (id: string) => {
    return await axios.delete(`${VITE_ENDPOINT}/comments/${id}`, {
        headers: {
            'Authorization': `Bearer ${getToken}`
        },
        params: {
            type: 'comment'
        }
    });
};