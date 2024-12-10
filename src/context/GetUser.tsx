// UserContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { QueryObserverResult, useQuery } from 'react-query';
import { getUser } from '../api/query';


interface UserContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    isLoading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fetchMerchant: () => Promise<QueryObserverResult<any, unknown>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState()
    const {
        data,
        isLoading,
        error,
        refetch: fetchMerchant,
    } = useQuery(["getUser"], getUser,  { enabled: false });
    useEffect(() => {
        if (data?.data?.data?.data) {
            setUser(data?.data?.data?.data);
        }
    }, [data, user]);
    const value: UserContextType = {
        data: user,
        isLoading,
        error,
        fetchMerchant,
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
