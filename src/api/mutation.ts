import axios from "axios";

const { VITE_ENDPOINT } = import.meta.env;
const { VITE_TOKEN_USER } = import.meta.env;

const userToken = localStorage.getItem(VITE_TOKEN_USER)
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

export const userComment = async ({ id, formData }: { id: string | undefined, formData: FormData }) => {
    const useToken = localStorage.getItem(VITE_TOKEN_USER);
  
    return await axios.post(`${VITE_ENDPOINT}/comment/products/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${useToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  
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
    return await axios.post(`${VITE_ENDPOINT}/orders/products/${id}/buy`, {}, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
}

export const userPayWithKora = async (id: string)=>{
    return await axios.post(`${VITE_ENDPOINT}/init-kora/orders/${id}/single`,{}, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
}

export const userFollowMerchant = async (id: string) => {
    return await axios.post(`${VITE_ENDPOINT}/users/merchants/${id}`, {}, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        }
    })
}

export const resendVerification = async (email: string | null) => {
    return await axios.post(`${VITE_ENDPOINT}/email?email=${email}`);
};

export const deleteComment = async ( id: string) => {
    return await axios.delete(`${VITE_ENDPOINT}/comments/${id}`, {
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
        params: {
            type: 'comment'
        }
    });
};