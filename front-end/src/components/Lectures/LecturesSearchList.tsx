// @ts-ignore
import LectureEntry from './LectureEntry';
import React from 'react';
import { Search, AlertCircle, Loader2 } from 'lucide-react';

interface Lecture {
	id: string;
	title: string;
	description: string;
	tags: string[];
}

interface LecturesSearchListProps {
	results: Lecture[];
	loading: boolean;
	error?: string | null;
	query?: string;
}

export default function LecturesSearchList(
	{ results, loading, error, query }: LecturesSearchListProps
) {
  // Loading state
  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Loader2 className="mb-3 text-primary" size={48} style={{ animation: 'spin 1s linear infinite' }} />
        <p className="text-muted fs-5">Searching lectures...</p>
      </div>
    );
  }

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

  // No results state
  if (results.length === 0 && query && query.trim()) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center py-5">
        <Search className="mb-3 text-muted" size={48} />
        <h5 className="text-muted mb-2">No lectures found</h5>
        <p className="text-muted text-center">
          No lectures match your search for "<strong>{query}</strong>"
        </p>
        <small className="text-muted">Try different keywords or check your spelling</small>
      </div>
    );
  }

  // Results state
  return (
    <div className="search-results fade-in">
      <div className="mb-4">
        <h5 className="text-dark mb-2">
          Search Results ({results.length} lecture{results.length !== 1 ? 's' : ''} found)
        </h5>
        {query && (
          <p className="text-muted mb-0">
            Showing results for "<strong>{query}</strong>"
          </p>
        )}
      </div>
      <div className="row g-4">
        {results.map((lecture, index) => (
          <div 
            key={lecture.id} 
            className="col-12 fade-in-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <LectureEntry {...lecture} />
          </div>
        ))}
      </div>
    </div>
  );
}
