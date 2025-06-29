import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, googleProvider, facebookProvider } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import './AdminRegister.css';

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phone, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'admins', user.uid), {
        firstName,
        lastName,
        phone,
        email,
        createdAt: new Date().toISOString(),
        provider: 'email',
      });

      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Registration failed');
    }
  };

  const handleSocialRegister = async (provider, providerName) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'admins', user.uid);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        await setDoc(docRef, {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          email: user.email,
          phone: '',
          createdAt: new Date().toISOString(),
          provider: providerName,
        });
      }

      const token = await user.getIdToken();
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminEmail', user.email);
      navigate('/admin');
    } catch (err) {
      console.error(`${providerName} registration failed:`, err);
      setError(`${providerName} registration failed`);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Admin Registration</h2>
        {error && <p className="auth-error">{error}</p>}

        <input
          name="firstName"
          type="text"
          placeholder="First Name"
          required
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          type="text"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone"
          required
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={handleChange}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button type="submit">Register</button>

        <div className="social-login">
  <p>Or register with:</p>
  
  <button type="button" className="google-btn" onClick={() => handleSocialRegister(googleProvider, 'Google')}>
    <i className="fab fa-google" style={{ marginRight: '8px' }}></i> Continue with Google
  </button>

  <button type="button" className="facebook-btn" onClick={() => handleSocialRegister(facebookProvider, 'Facebook')}>
    <i className="fab fa-facebook-f" style={{ marginRight: '8px' }}></i> Continue with Facebook
  </button>
</div>


        <div className="auth-links">
          <p>Already have an account? <Link to="/admin-login">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default AdminRegister;
