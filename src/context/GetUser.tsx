import React, { createContext, useContext, ReactNode } from 'react';
import { QueryObserverResult, useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { getUser } from '../api/query';

interface User {
  _id: string | undefined;
  fullName: string;
  email: string;
  phoneNumber: string;
  is_admin: boolean;
  verified: boolean;
  verificationCode: number;
  createdAt: string;
  updatedAt: string;
  role_slug: string;
  followingMerchants: string[];
  image: string;
}

interface UserResponse {
  status: boolean;
  data: {
    data: User;
  };
}

interface UserContextType {
  user: User | undefined;
  isLoading: boolean;
  error: Error | null;
  fetchUser: () => Promise<QueryObserverResult<User, Error>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    data: user,
    isLoading,
    error,
    refetch: fetchUser,
  } = useQuery<User, Error>(
    ['user'],
    async () => {
      const response = await getUser();
      const userResponse: UserResponse = {
        status: response.status === 200,
        data: response.data.data,
      };
      console.log(userResponse)
      return userResponse.data.data;
    },
    {
      initialData: () => {
        const cachedUser = localStorage.getItem('user');
        return cachedUser ? JSON.parse(cachedUser) : undefined;
      },
      onSuccess: (data) => {
        localStorage.setItem('user', JSON.stringify(data));
      },
      staleTime: 0,
      cacheTime: 0,
      retry: 2,
      refetchOnWindowFocus: true,
    }
  );

  const value: UserContextType = {
    user,
    isLoading,
    error,
    fetchUser,
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
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const queryClient = new QueryClient();
queryClient.prefetchQuery(['user'], async () => {
  const response = await getUser();
  const userResponse: UserResponse = {
    status: response.status === 200,
    data: response.data.data,
  };
  return userResponse.data.data;
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>{children}</UserProvider>
  </QueryClientProvider>
);