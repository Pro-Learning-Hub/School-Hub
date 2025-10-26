import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Presentation, EllipsisVertical, SquarePen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Tag from './Tag';
import { Link } from 'react-router-dom';
import { selectUserRole } from '../../redux/selectors/uiSelectors';
import { deleteLecture } from '../../redux/actions/lecturesThunks';

export default function LectureEntry({
  title = '',
  id = '',
  description = '',
  tags = [],
  sectionId = '',
  courseId = '',
}) {
  const userRole = useSelector(selectUserRole);
  const dispatch = useDispatch();
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = () => {
    // Close the dropdown first
    setShowOptions(false);
    // Navigate to edit page
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this lecture?')) {
      dispatch(deleteLecture(sectionId, id));
      setShowOptions(false);
    }
  };

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
            {userRole !== 'student' && (
              <div className="position-relative" ref={dropdownRef}>
                <button 
                  type="button" 
                  className="btn btn-link p-1 text-muted"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <EllipsisVertical size={16} />
                </button>
                {showOptions && (
                  <div className="dropdown-menu show position-absolute end-0 mt-1" style={{ minWidth: '160px' }}>
                    <Link 
                      to={`/lectures/${id}/edit`} 
                      className="dropdown-item d-flex align-items-center text-decoration-none"
                      onClick={handleEdit}
                    >
                      <SquarePen size={16} className="me-2" />
                      Edit Lecture
                    </Link>
                    <button 
                      className="dropdown-item d-flex align-items-center text-danger" 
                      type="button"
                      onClick={handleDelete}
                    >
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
