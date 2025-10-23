import React from 'react';
import { DOMAIN } from '../../utils/constants';

export default function SearchInput() {
  const handleSearch = (e) => {
    e.preventDefault();
    fetch(`${DOMAIN}/api/lectures/search?courseId=${'test-course'}&query=${e.target.elements[0].value}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Search Results:', data);
    })
    .catch((error) => {
      console.error('Error during search:', error);
    });
    e.target.elements[0].value = '';
  };

  return (
    <form
      className="d-flex mt-4 mb-5"
      role="search"
      onSubmit={handleSearch}
    >
      <input
        className="form-control me-2 p-3"
        type="search"
        placeholder="Search the content of the course"
        aria-label="Search"
      />
      <button className="btn btn-primary" type="submit">
        Search
      </button>
    </form>
  );
}
