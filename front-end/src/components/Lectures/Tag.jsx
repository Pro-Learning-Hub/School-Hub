import React from 'react';

export default function Tag({ content }) {
  return (
    <span className="badge bg-light text-dark border me-2 mb-1 lecture-tag">
      {content}
    </span>
  );
}
