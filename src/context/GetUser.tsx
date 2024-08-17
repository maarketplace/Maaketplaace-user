// UserContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from 'react-query';
import { getUser } from '../api/query';


interface UserContextType {
    data: any;
    isLoading: boolean;
    error: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const {
        data,
        isLoading,
        error,
    } = useQuery(["getMerchant"], getUser, {
        // enabled: !!localStorage.getItem('VITE_TOKEN'),
        // refetchOnWindowFocus: true,
        onError: (error: any) => {
            console.log(error?.response?.data?.message)
        },
    });
    const value: UserContextType = {
        data: data?.data?.data?.data,
        isLoading,
        error,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useMerchant must be used within a UserProvider');
    }
    return context;
};
