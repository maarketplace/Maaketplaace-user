import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const { VITE_TOKEN_USER } = import.meta.env;

interface CartContextType {
    isUserAuthenticated: boolean;
    setUserToken: (token: string | null) => void;
    loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userToken, setUserToken] = useState<string | null>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem(VITE_TOKEN_USER);
        setUserToken(storedToken);
        setLoading(false); // Stop loading after token retrieval
    }, []);

    // Memoize context values
    const isUserAuthenticated = !!userToken;

    const contextValue = useMemo(() => ({
        isUserAuthenticated,
        setUserToken: (token: string | null) => {
            if (token) {
                localStorage.setItem(VITE_TOKEN_USER, token);
            } else {
                localStorage.removeItem(VITE_TOKEN_USER);
            }
            setUserToken(token);
        },
        loading,
    }), [isUserAuthenticated, loading]);

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useAuth must be used within a CartProvider');
    return context;
};
