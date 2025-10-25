import { useState, useEffect } from 'react';
import useFetchResults from './useLecturesSearch';
import { Lecture } from '../types/lecture.types';

interface UseSearchStateReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchList: boolean;
  searchResults: Lecture[];
  searchLoading: boolean;
  searchError: string | null;
  renderingSearchState: boolean;
  debouncedQuery: string;
}

export default function useSearchState(): UseSearchStateReturn {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchList, setShowSearchList] = useState<boolean>(false);
  
  const {
    searchResults,
    loading: searchLoading,
    error: searchError,
    isPending: renderingSearchState,
    debouncedQuery
  } = useFetchResults(searchQuery);

  useEffect(() => {
    if (searchQuery.trim() && debouncedQuery.trim()) {
      setShowSearchList(true);
    } else {
      setShowSearchList(false);
    }
  }, [debouncedQuery, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    showSearchList,
    searchResults,
    searchLoading,
    searchError,
    renderingSearchState,
    debouncedQuery
  };
}
