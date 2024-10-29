import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction, useMemo } from 'react';

const { VITE_TOKEN_USER } = import.meta.env;

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
        const handleStorageChange = () => {
            setUserToken(localStorage.getItem(VITE_TOKEN_USER));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);
    
    const contextValue = useMemo(() => ({
        isUserAuthenticated,
        setUserToken,
    }), [isUserAuthenticated]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useAuth must be used within a CartProvider');
    }
    return context;
};
