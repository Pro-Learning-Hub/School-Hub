import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selectors/uiSelectors';

/**
 * UserProfile component displays user information above the logout button
 * Shows user's profile picture, name, and basic info
 */
export default function UserProfile() {
	const { firstName, lastName, role, pictureThumbnail } = useSelector(selectUser).toJS();

  // Don't render if no essential user data
  if (!firstName && !lastName && !role) {
    return null;
  }

  const fullName = `${firstName || ''} ${lastName || ''}`.trim();

  return (
    <div className="user-profile">
      <div className="user-profile-content">
        {pictureThumbnail && (
          <img
            src={pictureThumbnail}
            alt={`${fullName}'s profile`}
            className="user-profile-image"
            onError={(e) => {
              // Fallback to a default avatar if image fails to load
              e.target.style.display = 'none';
            }}
          />
        )}
        <div className="user-profile-info">
          {fullName && (
            <div className="user-profile-name">{fullName}</div>
          )}
          {role && (
            <div className="user-profile-role">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
