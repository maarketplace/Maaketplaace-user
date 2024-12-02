import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCachedAuthData } from '../utils/auth.cache.utility';


interface CartContextType {
    isUserAuthenticated: boolean;
    setIsUserAuthenticated: (token: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isUserAuthenticated, setIsUserAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const getToken = getCachedAuthData()

        if (getToken !== undefined) {
            setIsUserAuthenticated(true)
        } else {
            setIsUserAuthenticated(false)
        }
    }, [isUserAuthenticated]);


    return (
        <CartContext.Provider value={{isUserAuthenticated, setIsUserAuthenticated}}>
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
