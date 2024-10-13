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
    // Initialize userToken with localStorage value
    const [userToken, setUserToken] = useState<string | null>(localStorage.getItem(VITE_TOKEN_USER));

    // Determine if the user is authenticated based on the presence of the token
    const isUserAuthenticated = !!userToken;

    useEffect(() => {
        const storedUserToken = localStorage.getItem(VITE_TOKEN_USER);
        if (storedUserToken) {
            setUserToken(storedUserToken);  // Only update if there is a token
        }
    }, []);

    // Memoize the context value to avoid re-rendering unless userToken changes
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
