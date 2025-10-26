import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogout } from '@react-oauth/google';
import { logout } from '../../redux/actions/uiActionCreators';
import Communities from './Communities';
import SidebarHeader from './SidebarHeader';
import Featured from './Featured';
import './sidebar.css';

// Navigation items configuration
const NAVIGATION_ITEMS = [
  {
    to: '/',
    icon: 'fa fa-home',
    label: 'Home',
  },
  {
    to: '/lectures',
    icon: 'fa fa-book',
    label: 'Lectures',
  },
  {
    to: '/discussion',
    icon: 'fa fa-comments',
    label: 'General Forum',
  },
  {
    to: '/announcements',
    icon: 'fa fa-bullhorn',
    label: 'Announcements',
  },
];

/**
 * Sidebar component with responsive offcanvas layout
 * - Offcanvas on narrow screens
 * - Fixed sidebar on wide screens
 */
export default function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.ui.get('isLoggedIn'));

  // Handle user logout
  const handleLogout = useCallback(() => {
    dispatch(logout());
    googleLogout();
  }, [dispatch]);

  // Toggle sidebar open/close state
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOnSidebar = event.target.closest('.offcanvas-body');
      const isClickOnToggler = event.target.closest('.navbar-toggler');
      
      if (!isClickOnSidebar && !isClickOnToggler) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Render navigation links
  const renderNavigationLinks = () => (
    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
      {NAVIGATION_ITEMS.map(({ to, icon, label }) => (
        <li key={to} className="nav-item">
          <Link className="nav-link text-white" to={to}>
            <i className={icon}></i> {label}
          </Link>
        </li>
      ))}
      
      {/* Additional Components */}
      <li className="nav-item">
        <Communities />
      </li>
      <li className="nav-item">
        <Featured />
      </li>
    </ul>
  );

  // Render logout button
  const renderLogoutButton = () => (
    <div className="offcanvas-footer">
      <ul>
        <li>
          <button
            type="button"
            className="btn btn-link text-white w-100"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <i className="fa fa-sign-out"></i> Logout
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <nav className="navbar navbar-dark bgd-style fixed-top position-relative">
      <div className="container-fluid">
        {/* Hamburger Menu Button */}
        {isLoggedIn && (
          <button
            className="navbar-toggler me-auto"
            type="button"
            onClick={toggleSidebar}
            aria-controls="offcanvasDarkNavbar"
            aria-expanded={isSidebarOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        )}

        {/* Brand Title */}
        <Link className="navbar-brand ms-auto" to="/">
          Pro Learning Hub
        </Link>

        {/* Offcanvas Sidebar */}
        <div
          className={`offcanvas offcanvas-start bgd-style ${isSidebarOpen ? 'show' : ''}`}
          tabIndex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          {/* Sidebar Header */}
          <SidebarHeader toggleSidebar={toggleSidebar} />
          
          <hr />
          
          {/* Sidebar Body */}
          <div className="offcanvas-body">
            {renderNavigationLinks()}
          </div>

          {/* Sidebar Footer */}
          {renderLogoutButton()}
        </div>
      </div>
    </nav>
  );
}
