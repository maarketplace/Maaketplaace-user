/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance";

const { VITE_ENDPOINT } = import.meta.env;


export const userSignup = async (data: any) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/user`, data)
};

export const userVerify = async (data: any) => {
    return await axiosInstance.patch(`${VITE_ENDPOINT}/user/verify`, data)
};

export const userLogin = async (data: any) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/user/login`, data)
};
export const logOutUser = async (id: string) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/user/logout/${id}`)
}
export const userLike = async (id: string) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/products/${id}/like/user`, {})
}
export const addProductToCart = async ({ id, data }: { id: string, data: number }) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/carts/products/${id}`, data,)
}
export const clearCart = async () => {
    return await axiosInstance.delete(`${VITE_ENDPOINT}/order`)
}

export const userComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/comment/products/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const userQuicksComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {


    return await axiosInstance.post(`${VITE_ENDPOINT}/quicks/comment/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const userReplyComment = async ({ id, comment }: { id: string | null, comment: string }) => {


    return await axiosInstance.post(`${VITE_ENDPOINT}/comments/${id}/replies`, comment);
};

export const userLikeAComment = async (id: string | undefined) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/comment/${id}/like/user`, {})
}
export const userLikeAQuicks = async (id: string | undefined) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/quicks/${id}/like/user`, {})
}
export const userForgotPassword = async (email: string) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/user/forgot`, { email })
}

export const userResetPassword = async (data: { id: string | undefined, password: string }) => {
    const { id, password } = data
    return await axiosInstance.patch(`${VITE_ENDPOINT}/user/ps-change/${id}`, { password })
}

export const userBuyNow = async (id: string) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/orders/products/${id}/buy`, {})
}

export const userPayWithKora = async (id: string) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/init-kora/orders/${id}/single`, {})
}

export const userFollowMerchant = async (id: string) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/users/merchants/${id}`, {})
}

export const resendVerification = async (email: string | null) => {
    return await axiosInstance.post(`${VITE_ENDPOINT}/email?email=${email}&type=user`,);
};

export const deleteComment = async (id: string) => {
    return await axiosInstance.delete(`${VITE_ENDPOINT}/comments/${id}`, {
        params: {
            type: 'comment'
        }
    });
};