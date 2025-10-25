import { useState, useTransition, useEffect } from "react";
import { useSelector } from 'react-redux';
import useDebounceValue from "./useDebounceValue.hook";
import useFetch from "./useFetch.hook";
import { DOMAIN } from '../utils/constants';
// @ts-ignore
import { getToken } from "../utils/utilFunctions";
import { 
  selectCourseGeneralDiscussion, 
  makeLectureDiscussionsSelector 
  // @ts-ignore
} from '../redux/selectors/DiscussionsSelectors';
import { List } from 'immutable';

type ParentType = 'course' | 'lecture';

interface SearchApiResponse {
  results: string[];
  total: number;
  query: string;
  context: {
    courseId?: string;
    lectureId?: string;
  };
}

interface UseQuestionsSearchReturn {
  searchResults: any[];
  searchResultIds: string[];
  loading: boolean;
  error: string | null;
  isPending: boolean;
  debouncedQuery: string;
  hasQuery: boolean;
}

/**
 * Hook for searching questions with Redux state filtering
 */
export default function useQuestionsSearch(
  query: string, 
  parentType: ParentType, 
  parentId: string
): UseQuestionsSearchReturn {
  const [searchResultIds, setSearchResultIds] = useState<string[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  
  const debouncedQuery = useDebounceValue(query, 300);
  const encodedQuery = encodeURIComponent(debouncedQuery);
  
  // Select appropriate questions from Redux state
  const lectureQuestionsSelector = makeLectureDiscussionsSelector(parentId);
  const allQuestions: List<any> | undefined = useSelector(parentType === 'course' 
    ? selectCourseGeneralDiscussion 
    : lectureQuestionsSelector
  );
  
  // Build the search URL based on parent type
  const searchUrl = debouncedQuery?.trim() && parentId
    ? `${DOMAIN}/api/questions/search?${parentType === 'course' ? 'courseId' : 'lectureId'}=${parentId}&query=${encodedQuery}`
    : null;

  const { loading, value, error } = useFetch<SearchApiResponse>(
    searchUrl,
    {
      headers: {
        Authorization: `Bearer ${getToken('accessToken')}`
      }
    },
    [debouncedQuery, parentType, parentId]
  );

  useEffect(() => {
    if (!debouncedQuery?.trim()) {
      // Clear results when query is empty
      startTransition(() => {
        setSearchResultIds([]);
        setFilteredQuestions([]);
      });
    } else if (value && !error && allQuestions) {
      // Update results when we have valid data
      startTransition(() => {
        const resultIds = value.results || [];
        setSearchResultIds(resultIds);
        
        // Filter Redux state based on returned IDs, maintaining order
        const filtered = resultIds
          .map((id: string) => allQuestions.find((question: any) => question.get('id') === id))
          .filter(Boolean); // Remove any undefined entries
        
        setFilteredQuestions(filtered);
      });
    } else if (error) {
      // Handle error case
      console.error('Questions search error:', error);
      startTransition(() => {
        setSearchResultIds([]);
        setFilteredQuestions([]);
      });
    }
  }, [debouncedQuery, value, error, allQuestions]);

  return { 
    searchResults: filteredQuestions,
    searchResultIds,
    loading: debouncedQuery?.trim() ? loading : false, 
    error: error
			? (error as any).message ?? "Error occured while searching..."
			: null, 
    isPending,
    debouncedQuery,
    hasQuery: Boolean(debouncedQuery?.trim() && query?.trim())
  };
}
