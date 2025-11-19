import React from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
// @ts-ignore
import DiscussionEntries from '../DiscussionEntries/DiscussionEntries';
import { fromJS } from 'immutable';

interface QuestionsSearchResultsProps {
  results: any[];
  loading: boolean;
  error?: string | null;
  query?: string;
  isLecture: boolean;
}

export default function QuestionsSearchResults({
  results,
  loading,
  error,
  query,
  isLecture
}: QuestionsSearchResultsProps) {
  
  // Error state
  if (error) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <AlertCircle className="mb-3 text-danger" size={48} />
        <h5 className="text-danger mb-2">Search Error</h5>
        <p className="text-muted text-center">
          Something went wrong while searching. Please try again.
        </p>
        <small className="text-muted">{error}</small>
      </div>
    );
  }

  // No results state (only when not loading and query exists)
  if (!loading && results.length === 0 && query && query.trim()) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Search className="mb-3 text-muted" size={48} />
        <h5 className="text-muted mb-2">No questions found</h5>
        <p className="text-muted text-center">
          No questions match your search for "<strong>{query}</strong>"
        </p>
        <small className="text-muted">Try different keywords or check your spelling</small>
      </div>
    );
  }

  // Convert results to Immutable List for DiscussionEntries component
  const immutableResults = fromJS(results);

  // Results state with optional loading indicator
  return (
    <div className="search-results">
      {/* Subtle loading indicator */}
      {loading && (
        <div className="d-flex align-items-center py-2 mb-2">
          <Loader2 className="me-2 text-muted" size={16} style={{ animation: 'spin 1s linear infinite' }} />
          <small className="text-muted">Searching...</small>
        </div>
      )}

      <div className="mb-4">
        <h5 className="text-dark mb-2">
          Search Results ({results.length} question{results.length !== 1 ? 's' : ''} found)
        </h5>
        {query && (
          <p className="text-muted mb-0">
            Showing results for "<strong>{query}</strong>"
          </p>
        )}
      </div>
      <div className="search-questions-results">
        <DiscussionEntries 
          entries={immutableResults} 
          chunkSize={10} 
          isLecture={isLecture}
        />
      </div>
    </div>
  );
}
