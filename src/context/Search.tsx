import { createContext, useState, ReactNode, FC } from 'react';

// Create a context for the search functionality
interface SearchContextProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

// SearchProvider component to provide the search state and updater function
export const SearchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};
