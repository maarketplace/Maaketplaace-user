// UserContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUser } from '../api/query';


interface UserContextType {
    data: any;
    isLoading: boolean;
    error: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState()
    const {
        data,
        isLoading,
        error,
    } = useQuery(["getUser"], getUser, {
        onError: () => {
        },
    });
    useEffect(()=>{
        setUser(data?.data?.data?.data)
    }, [data])
    const value: UserContextType = {
        data: user,
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
