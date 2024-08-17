import axios from "axios";

const { VITE_ENDPOINT } = import.meta.env;
const { VITE_TOKEN_USER } = import.meta.env;

export const userSignup = async (data: any) => {
    return await axios.post(`${VITE_ENDPOINT}/user`, data)
};

export const userVerify = async (data: any) => {
    return await axios.patch(`${VITE_ENDPOINT}/user/verify`, data)
};

export const userLogin = async (data: any) => {
    return await axios.post(`${VITE_ENDPOINT}/user/login`, data)
};
export const logOutUser = async (id: string) => {
    // console.log(id)
    return await axios.post(`${VITE_ENDPOINT}/user/logout/${id}`)
}

export const userLike = async (id: string) => {
    const useToken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.post(`${VITE_ENDPOINT}/product/${id}/like/user`, {}, {
        headers: {
            'Authorization': `Bearer ${useToken}`
        }
    })
}
export const addProductToCart = async ({ id, data }: { id: string, data: number }) => {
    const useToken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.post(`${VITE_ENDPOINT}/carts/product/${id}`, data, {
        headers: {
            'Authorization': `Bearer ${useToken}`
        }
    })
}
export const clearCart = async () => {
    const useToken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.delete(`${VITE_ENDPOINT}/order`,{
        headers: {
            'Authorization': `Bearer ${useToken}`
        }
    })
}

export const userComment = async ({id, comment}: { id: string | undefined, comment: string }) => {
    const useToken = localStorage.getItem(VITE_TOKEN_USER)
  console.log(comment)
    return await axios.post(`${VITE_ENDPOINT}/comment/products/${id}`, {comment}, {
        headers: {
            'Authorization': `Bearer ${useToken}`

        }
    })
}

export const userLikeAComment = async (id: string | undefined) => {
    const useToken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.post(`${VITE_ENDPOINT}/comment/${id}/like/user`, {}, {
        headers: {
            'Authorization': `Bearer ${useToken}`
        }
    })
}

export const userForgotPassword = async (email: string)=>{
    return await axios.post(`${VITE_ENDPOINT}/user/forgot`, email)
}

export const userResetPassword = async (data: { id: string | undefined, password: string })=>{
    const { id, password } = data
    return await axios.patch(`${VITE_ENDPOINT}/user/ps-change/${id}`, { password })
}

export const userBuyNow = async (id: string)=>{
    const userToken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.post(`${VITE_ENDPOINT}/orders/products/${id}/buy`, {}, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
}

export const userPayWithKora = async (id: string)=>{
    const userToken = localStorage.getItem(VITE_TOKEN_USER)
    return await axios.post(`${VITE_ENDPOINT}/init-kora/orders/${id}/single`,{}, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
}