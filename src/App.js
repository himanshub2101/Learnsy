// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AllCoursesPage from './pages/AllCoursesPage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Preloader from './components/Preloader';
import ContactPage from './pages/ContactPage';

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Simulate loading on initial render and on route change
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800); // Adjust time as needed
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? (
    <Preloader />
  ) : (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<AllCoursesPage />} />
            <Route path="/contact" element={<ContactPage />} />

    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
