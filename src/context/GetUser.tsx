import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { QueryObserverResult, useQuery, QueryClient, QueryClientProvider } from 'react-query';
import { getUser } from '../api/query';
import { getCachedAuthData } from '../utils/auth.cache.utility';

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
  // Check if user is authenticated
  const isAuthenticated = !!getCachedAuthData();

  const {
    data: user,
    isLoading,
    error,
    refetch: fetchUser,
  } = useQuery<User, Error>(
    ['USER_DATA'],
    async () => {
      // Only fetch if authenticated
      if (!isAuthenticated) {
        throw new Error('User not authenticated');
      }

      const response = await getUser();
      const userResponse: UserResponse = {
        status: response.status === 200,
        data: response.data.data,
      };
      console.log('User data fetched successfully:', userResponse);
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
      enabled: isAuthenticated, // Only run the query if authenticated
      staleTime: 300000, // 5 minutes
      cacheTime: 600000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );

  // Force refetch when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, fetchUser]);

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>{children}</UserProvider>
  </QueryClientProvider>
);