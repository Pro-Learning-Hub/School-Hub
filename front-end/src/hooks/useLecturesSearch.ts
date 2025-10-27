import { useState, useTransition, useEffect } from "react";
import { useSelector } from 'react-redux';
import useDebounceValue from "./useDebounceValue.hook";
import useFetch from "./useFetch.hook";
import { DOMAIN } from '../utils/constants';
// @ts-ignore
import { getToken as _getToken } from "../utils/utilFunctions";
import { Lecture, SearchResponse } from '../types/lecture.types';
import { selectCourseId } from '../redux/selectors/uiSelectors';

const getToken = _getToken as (type: string) => string;

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
  
  // Get courseId from Redux state instead of hardcoding
  const courseId = useSelector(selectCourseId);
  
  const debouncedQuery = useDebounceValue(query, 300);
  const encodedQuery = encodeURIComponent(debouncedQuery);
  
  const { loading, value, error } = useFetch<SearchResponse>(
    debouncedQuery?.trim() && courseId
      ? `${DOMAIN}/api/lectures/search?courseId=${courseId}&query=${encodedQuery}`
      : null, // null URL will prevent the fetch
    {
      headers: {
        Authorization: `Bearer ${getToken('accessToken')}`
      }
    },
    [debouncedQuery, courseId]
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
