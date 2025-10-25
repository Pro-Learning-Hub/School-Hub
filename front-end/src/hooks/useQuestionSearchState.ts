import { useState, useEffect } from 'react';
import useQuestionsSearch from './useQuestionsSearch';

type ParentType = 'course' | 'lecture';

interface UseQuestionSearchStateReturn {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showSearchResults: boolean;
  searchResults: any[];
  searchResultIds: string[];
  searchLoading: boolean;
  searchError: string | null;
  renderingSearchState: boolean;
  debouncedQuery: string;
  hasQuery: boolean;
}

/**
 * Hook for managing question search state
 */
export default function useQuestionSearchState(
  parentType: ParentType, 
  parentId: string
): UseQuestionSearchStateReturn {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);
  
  const {
    searchResults,
    searchResultIds,
    loading: searchLoading,
    error: searchError,
    isPending: renderingSearchState,
    debouncedQuery,
    hasQuery
  } = useQuestionsSearch(searchQuery, parentType, parentId);

  useEffect(() => {
    if (hasQuery) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [hasQuery]);

  return {
    searchQuery,
    setSearchQuery,
    showSearchResults,
    searchResults,
    searchResultIds,
    searchLoading,
    searchError,
    renderingSearchState,
    debouncedQuery,
    hasQuery
  };
}
