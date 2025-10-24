import { useState, useTransition, useEffect } from "react";
import useDebounceValue from "./useDebounceValue.hook";
import useFetch from "./useFetch.hook";
import { DOMAIN } from '../utils/constants';
import { getToken } from "../utils/utilFunctions";
import { Lecture, SearchResponse } from '../types/lecture.types';

interface UseLecturesSearchReturn {
  searchResults: Lecture[];
  loading: boolean;
  error: string | null;
  isPending: boolean;
  debouncedQuery: string;
}

export default function useFetchResults(query: string): UseLecturesSearchReturn {
  const [searchResults, setSearchResults] = useState<Lecture[]>([]);
  const [isPending, startTransition] = useTransition();
  
  const debouncedQuery = useDebounceValue(query, 300);
  const encodedQuery = encodeURIComponent(debouncedQuery);
  
  const { loading, value, error } = useFetch<SearchResponse>(
    debouncedQuery?.trim()
      ? `${DOMAIN}/api/lectures/search?courseId=${'test-course'}&query=${encodedQuery}`
      : null, // null URL will prevent the fetch
    {
      headers: {
        Authorization: `Bearer ${getToken('accessToken')}`
      }
    },
    [debouncedQuery]
  );

  useEffect(() => {
    if (!debouncedQuery?.trim()) {
      // Clear results when query is empty
      startTransition(() => setSearchResults([]));
    } else if (value && !error) {
      // Update results when we have valid data
      startTransition(() => {
        setSearchResults(value.results || []);
      });
    } else if (error) {
      // Keep previous results on error, but the error will be shown
      console.error('Search error:', error);
    }
  }, [debouncedQuery, value, error]);

  return { 
    searchResults, 
    loading: debouncedQuery?.trim() ? loading : false, 
    error: error 
      ? (error.message ?? "Error searching for: " + debouncedQuery.trim())
      : null, 
    isPending,
    debouncedQuery
  };
}
