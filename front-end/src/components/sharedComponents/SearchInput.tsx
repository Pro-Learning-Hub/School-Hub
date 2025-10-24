import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Search content..." 
}) => {
  const handleClear = (): void => {
    setSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // The search is handled by the debounced hook, so we don't need to do anything here
  };

  return (
    <form
      className="d-flex mt-4 mb-5 search-input-container"
      role="search"
      onSubmit={handleSubmit}
    >
      <div className="position-relative flex-grow-1 me-2">
        <Search 
          size={20} 
          className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" 
        />
        <input
          className="form-control ps-5 pe-5"
          type="search"
          placeholder={placeholder}
          aria-label="Search"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          style={{ 
            padding: '0.75rem 3rem 0.75rem 3rem',
            borderRadius: '8px',
            fontSize: '1rem'
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-1"
            aria-label="Clear search"
            style={{ border: 'none', background: 'none' }}
          >
            <X size={16} className="text-muted" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchInput;
