import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import './signin.css';

export default function Login() {
  const nav = useNavigate();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [err,setErr] = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.access_token);
      nav('/');
    } catch (e) {
      setErr('Wrong e‑mail or password');
    }
  };

  return (
    <form className="auth-box" onSubmit={submit}>
      <h2>Log in</h2>
      {err && <p className="error">{err}</p>}
      <input value={email} onChange={e=>setEmail(e.target.value)}
             placeholder="E‑mail" type="email" required/>
      <input value={password} onChange={e=>setPassword(e.target.value)}
             placeholder="Password" type="password" required/>
      <button>Login</button>
      <Link to="/forgot-password" className="link">Forgot password?</Link>
    </form>
  );
}
