import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ onMinimizeChange }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsVisible(!mobile); // Sidebar visible by default on desktop
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

const toggleMinimize = () => {
  const newState = !isMinimized;
  setIsMinimized(newState);
  if (onMinimizeChange) onMinimizeChange(newState);
};
  const toggleSidebar = () => setIsVisible(!isVisible);

  // Hamburger only on mobile when sidebar is hidden
  if (!isVisible && isMobile) {
    return (
      <div className="mobile-hamburger-wrapper">
        <button className="hamburger" onClick={toggleSidebar}>☰</button>
      </div>
    );
  }

  return (
    <div className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
      <div className="sidebar-header">
        {!isMinimized && (
          <img src="/assets/logo.png" alt="Learnsy Logo" className="sidebar-logo" />
        )}
        <div className="sidebar-controls">
          <button onClick={toggleMinimize} title={isMinimized ? "Maximize" : "Minimize"}>
            {isMinimized ? '🗖' : '🗕'}
          </button>
          {isMobile && (
            <button onClick={toggleSidebar} title="Close">✖</button>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/admin"><i className="fas fa-tachometer-alt"></i> {!isMinimized && 'Dashboard'}</Link></li>
  <li><Link to="/add-course"><i className="fas fa-plus-circle"></i> {!isMinimized && 'Add Course'}</Link></li>
          <li><Link to="/enrollments"><i className="fas fa-user-check"></i> {!isMinimized && 'Enrollments'}</Link></li>
          <li><Link to="/students"><i className="fas fa-users"></i> {!isMinimized && 'Students'}</Link></li>
          <li><Link to="/instructors"><i className="fas fa-chalkboard-teacher"></i> {!isMinimized && 'Instructors'}</Link></li>
          <li><Link to="/messages"><i className="fas fa-envelope"></i> {!isMinimized && 'Messages'}</Link></li>
          <li><Link to="/reports"><i className="fas fa-chart-line"></i> {!isMinimized && 'Reports'}</Link></li>
          <li><Link to="/settings"><i className="fas fa-cog"></i> {!isMinimized && 'Settings'}</Link></li>
          <li><Link to="/logout"><i className="fas fa-sign-out-alt"></i> {!isMinimized && 'Logout'}</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
