// src/pages/AdminRegister.jsx
import React, { useState } from 'react';
import axios from '../../api/axios';          // centralised axios instance
import { Link, useNavigate } from 'react-router-dom';
import './AdminRegister.css';
import Header from '../../components/Header';
/* ——— helper to normalise FastAPI errors ——— */
const extractErrors = (err) => {
  const detail = err?.response?.data?.detail;

  // Pydantic validation → list of {loc, msg, type, …}
  if (Array.isArray(detail)) return detail.map((d) => d.msg);

  // Our HTTPException detail → string
  if (typeof detail === 'string') return [detail];

  // Network / Axios message fallback
  return [err.message || 'Something went wrong'];
};

const AdminRegister = () => {
  const navigate = useNavigate();

  /* ——— state ——— */
  const [formData, setFormData] = useState({
    firstName: '',
    lastName : '',
    phone    : '',
    email    : '',
    password : '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors , setErrors]  = useState([]);   // <- array of strings

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  /* ——— submit ——— */
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors([]);

    const { firstName, lastName, phone,
            email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrors(['Passwords do not match']);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post('/auth/signup', {
        first_name: firstName,
        last_name : lastName,
        phone,
        email,
        password,
      });

      localStorage.setItem('adminToken', res.data.access_token);
      localStorage.setItem('adminEmail', email);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setErrors(extractErrors(err));
    } finally {
      setLoading(false);
    }
  };

  /* ——— JSX ——— */

  return (
<>
    <Header/>
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Admin Registration</h2>

        {/* error block */}
        {errors.length > 0 && (
          <div className="auth-error">
            {errors.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}

        <input
          name="firstName" placeholder="First Name" required
          value={formData.firstName} onChange={handleChange}
        />
        <input
          name="lastName" placeholder="Last Name" required
          value={formData.lastName} onChange={handleChange}
        />
        <input
          name="phone" type="tel" placeholder="Phone" required
          value={formData.phone} onChange={handleChange}
        />
        <input
          name="email" type="email" placeholder="Email" required
          value={formData.email} onChange={handleChange}
        />
        <input
          name="password" type="password" placeholder="Password" required
          value={formData.password} onChange={handleChange}
        />
        <input
          name="confirmPassword" type="password"
          placeholder="Confirm Password" required
          value={formData.confirmPassword} onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Registering…' : 'Register'}
        </button>

        <div className="auth-links">
          <p>
            Already have an account?{' '}
            <Link to="/admin-login">Login</Link>
          </p>
        </div>
      </form>
    </div>
  </>
  );
};

export default AdminRegister;
