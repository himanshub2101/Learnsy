import React from 'react';
import './Preloader.css';

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="preloader-content">
        <img src="/logo.png" alt="Logo" className="preloader-logo" />
        <div className="loader"></div>
      </div>
    </div>
  );
};

export default Preloader;
