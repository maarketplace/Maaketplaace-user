/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "./axiosInstance";



export const userSignup = async (data: any) => {
    return await axiosInstance.post(`/user`, data)
};

export const userVerify = async (data: any) => {
    return await axiosInstance.patch(`/user/verify`, data)
};

export const userLogin = async (data: any) => {
    return await axiosInstance.post(`/user/login`, data)
};
export const logOutUser = async (id: string) => {
    return await axiosInstance.post(`/user/logout/${id}`)
}
export const userLike = async (id: string) => {
    return await axiosInstance.post(`/products/${id}/like/user`, {})
}
export const addProductToCart = async ({ id, data }: { id: string, data: number }) => {
    return await axiosInstance.post(`/carts/products/${id}`, data,)
}
export const clearCart = async () => {
    return await axiosInstance.delete(`/order`)
}

export const userComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {
    return await axiosInstance.post(`/comment/products/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export const userQuicksComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {


    return await axiosInstance.post(`/quicks/comment/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const userReplyComment = async ({ id, comment }: { id: string | null, comment: string }) => {


    return await axiosInstance.post(`/comments/${id}/replies`, comment);
};

export const userLikeAComment = async (id: string | undefined) => {
    return await axiosInstance.post(`/comment/${id}/like/user`, {})
}
export const userLikeAQuicks = async (id: string | undefined) => {
    return await axiosInstance.post(`/quicks/${id}/like/user`, {})
}
export const userForgotPassword = async (email: string) => {
    return await axiosInstance.post(`/user/forgot`, { email })
}

export const userResetPassword = async (data: { id: string | undefined, password: string }) => {
    const { id, password } = data
    return await axiosInstance.patch(`/user/ps-change/${id}`, { password })
}

export const userBuyNow = async (id: string) => {
    return await axiosInstance.post(`/orders/products/${id}/buy?type=product`, {})
}
export const userBuyTicket = async (id: string, attendees: string[]) => {
    return await axiosInstance.post(`/orders/products/${id}/buy?type=ticket`, {
        attendees
    })
}
export const userPayWithKora = async (id: string) => {
    return await axiosInstance.post(`/init-kora/orders/${id}/single`, {})
}

export const userFollowMerchant = async (id: string) => {
    return await axiosInstance.post(`/users/merchants/${id}`, {})
}

export const resendVerification = async (email: string | null) => {
    return await axiosInstance.post(`/email?email=${email}&type=user`,);
};

export const deleteComment = async (id: string) => {
    return await axiosInstance.delete(`/comments/${id}`, {
        params: {
            type: 'comment'
        }
    });
};


