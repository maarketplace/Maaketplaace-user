
const { VITE_TOKEN_USER } = import.meta.env;
import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';

interface CartContextType {
    isUserAuthenticated: boolean;
    setUserToken: Dispatch<SetStateAction<string | null>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {

    const [userToken, setUserToken] = useState<string | null>(localStorage.getItem(VITE_TOKEN_USER));

    const isUserAuthenticated = !!userToken;

    useEffect(() => {
        // Add any additional setup logic here, such as checking the validity of the token
    }, [ userToken]);
    useEffect(() => {
        const storedUserToken = localStorage.getItem(VITE_TOKEN_USER);
        setUserToken(storedUserToken);
    }, []);
    const contextValue: CartContextType = {
        isUserAuthenticated,
        setUserToken,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

export const useAuth = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useAuth must be used within an CartProvider');
    }
    return context;
};
