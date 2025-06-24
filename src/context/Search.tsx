import { createContext, useState, ReactNode, FC, useCallback, useEffect } from 'react';

interface SearchContextProps {
  searchQuery: string;
  debouncedSearchQuery: string;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
}

export const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce the search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearchQuery('');
  }, []);

  const isSearching = debouncedSearchQuery.trim().length > 0;

  return (
    <SearchContext.Provider value={{
      searchQuery,
      debouncedSearchQuery,
      setSearchQuery,
      clearSearch,
      isSearching
    }}>
      {children}
    </SearchContext.Provider>
  );
};