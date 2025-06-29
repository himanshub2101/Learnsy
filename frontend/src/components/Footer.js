import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* 1. About Section */}
        <div className="footer-section about">
          <h4>
            <img src="/logo.png" alt="Learnsy Logo" className="footer-logo" />
          </h4>
          <p>
            Learnsy offers top-notch online courses in web development, programming,
            digital marketing, video editing and more. Empower your career with expert-led content.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div className="footer-section links">
          <h4>Useful Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/courses">All Courses</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* 3. Contact Details */}
        <div className="footer-section contact">
          <h4>Contact Us</h4>
          <p>Email: support@learnx.com</p>
          <p>Phone: +91-9876543210</p>
          <p>Mon - Sat: 9 AM to 6 PM</p>
        </div>

        {/* 4. Social Networks */}
        <div className="footer-section social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Learnsy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
