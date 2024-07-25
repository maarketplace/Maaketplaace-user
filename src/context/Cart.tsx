const { VITE_TOKEN } = import.meta.env;
const { VITE_TOKEN_USER } = import.meta.env;
import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getMyCart } from '../api/query';
import { addProductToCart } from '../api/mutation';

interface CartContextType {
    isUserAuthenticated: boolean;
    isAuthenticated: boolean;
    setToken: Dispatch<SetStateAction<string | null>>;
    setUserToken: Dispatch<SetStateAction<string | null>>;
    cartsLength: number;
    setCartsLength: Dispatch<SetStateAction<number>>;
    // handleAddToCart: (id: string) => Promise<void>;
    userHandleAddToCart: (id: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {

    const [token, setToken] = useState<string | null>(localStorage.getItem(VITE_TOKEN));
    const [userToken, setUserToken] = useState<string | null>(localStorage.getItem(VITE_TOKEN_USER));

    const [cartsLength, setCartsLength] = useState<number>(0);

    const isAuthenticated = !!token;
    const isUserAuthenticated = !!userToken;
    // console.log(isUserAuthenticated)
    const queryClient = useQueryClient();
    const userCartQuery = ['getmycart'];

    const { data: UsercartData } = useQuery(['getmycart'], getMyCart, {
        // refetchInterval: 1000,
    });
    // console.log(UsercartData?.data?.data?.data[0])

    React.useEffect(() => {
        if (UsercartData?.data?.data?.data) {
            setCartsLength(UsercartData?.data?.data?.data?.length);
        } else {
            setCartsLength(0)
        }
    }, [UsercartData]);
    // console.log(UsercartData?.data?.data?.data.length);
    const { mutate: userCartMutation } = useMutation(addProductToCart, {
        onSuccess: () => {
            queryClient.invalidateQueries(userCartQuery);
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message)
            queryClient.invalidateQueries(userCartQuery);

        }
    });

    const userHandleAddToCart = async (id: string) => {
        const existingCartItemIndex = UsercartData?.data?.data?.data?.findIndex((item: any) => item?.product && item.product.some((prod: any) => prod?._id === id));
        if (existingCartItemIndex == 1) {
            toast.success('Product quantity increased');
            const updatedCart = [...UsercartData?.data?.data?.data];
            updatedCart[existingCartItemIndex].quantity++;
            try {
                await userCartMutation({ id, data: updatedCart[existingCartItemIndex].quantity });
            } catch (error) {
                console.error(error);
            }
        } else {
            toast.success('Product added');
            try {
                setCartsLength((prevCount) => prevCount + 1);
                await userCartMutation({ id, data: 1 });
            } catch (error) {
                console.error(error);
            }
        }
        // await userCartMutation({ id, data: 1 });
    };

    useEffect(() => {
        // Add any additional setup logic here, such as checking the validity of the token
    }, [token, userToken]);
    useEffect(() => {
        const storedUserToken = localStorage.getItem(VITE_TOKEN_USER);
        setUserToken(storedUserToken);
    }, []);
    const contextValue: CartContextType = {
        isUserAuthenticated,
        isAuthenticated,
        setToken,
        setUserToken,
        cartsLength,
        setCartsLength,
        // handleAddToCart,
        userHandleAddToCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useAuth must be used within an CartProvider');
    }
    return context;
};
