// AdminLogin.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 🔐 Get Firebase ID token
    const token = await user.getIdToken();

    // ✅ Store token and user info
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminEmail', user.email);

    // 🔁 Redirect to admin dashboard
    window.location.href = '/admin';
  } catch (err) {
    console.error(err);
    setError('Invalid credentials');
  }
};


  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Admin Login</h2>
        {error && <p className="auth-error">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
