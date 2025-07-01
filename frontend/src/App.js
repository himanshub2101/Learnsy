// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import AllCoursesPage from './pages/AllCoursesPage';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Preloader from './components/Preloader';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLogin from './admin/auth/AdminLogin';
import AdminRegister from './admin/register/AdminRegister';
import ProtectedRoute from './ProtectedRoutes/ProtectedRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddCourse from './admin/pages/AddCourse';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? (
    <Preloader />
  ) : (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<AllCoursesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/signup"          element={<Signup/>} />
      <Route path="/login"           element={<Login/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/reset-password"  element={<ResetPassword/>} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          
          </ProtectedRoute>
        }
      />

      <Route
  path="/add-course"
  element={
    <ProtectedRoute>
      <AddCourse />
    </ProtectedRoute>
  }
/>

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />
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
