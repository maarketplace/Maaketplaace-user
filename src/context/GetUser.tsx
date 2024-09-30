// UserContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUser } from '../api/query';


interface UserContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState()
    const {
        data,
        isLoading,
        error,
    } = useQuery(["getUser"], getUser, {});
    useEffect(() => {
        if (data?.data?.data?.data) {
            setUser(data?.data?.data?.data); // Adjust based on actual response structure
        }
    }, [data]);
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

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useMerchant must be used within a UserProvider');
    }
    return context;
};
