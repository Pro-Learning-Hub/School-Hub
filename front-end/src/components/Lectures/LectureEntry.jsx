import React, { useState } from 'react';
import { Presentation, EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Tag from './Tag';
import { Link } from 'react-router-dom';

export default function LectureEntry({
  title = '',
  id = '',
  description = '',
  tags = [],
}) {
  // Just temporarily for now. It will be a selector from the state
  const [role] = useState('student');
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="card lecture-entry shadow-sm border-0 h-100 hover-shadow">
      <div className="card-body d-flex">
        {/* Icon Section */}
        <div className="flex-shrink-0 me-3">
          <div className="lecture-icon d-flex align-items-center justify-content-center">
            <Presentation size={24} className="text-primary" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">
              <Link 
                to={`/lectures/${id}`} 
                className="text-decoration-none text-dark hover-primary"
              >
                {title}
              </Link>
            </h5>
            
            {/* Options Menu */}
            {role !== 'student' && (
              <div className="position-relative">
                <button 
                  type="button" 
                  className="btn btn-link p-1 text-muted"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <EllipsisVertical size={16} />
                </button>
                {showOptions && (
                  <div className="dropdown-menu show position-absolute end-0 mt-1" style={{ minWidth: '160px' }}>
                    <button className="dropdown-item d-flex align-items-center" type="button">
                      <SquarePen size={16} className="me-2" />
                      Edit Lecture
                    </button>
                    <button className="dropdown-item d-flex align-items-center text-danger" type="button">
                      <Trash2 size={16} className="me-2" />
                      Delete Lecture
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="card-text text-muted mb-3 lecture-description">
              {description}
            </p>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="lecture-tags">
              {tags.map((tag, index) => (
                <Tag key={`${index}-${tag}`} content={tag} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
