import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './signup.css';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    first_name:'', last_name:'', email:'', phone:'', password:''
  });
  const [err,setErr] = useState('');

  const onChange = e => setForm({...form,[e.target.name]:e.target.value});

  const submit = async e => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/signup', form);
      localStorage.setItem('token', data.access_token);
      nav('/');                      // logged‑in home
    } catch (e) {
      setErr(e.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <form className="auth-box" onSubmit={submit}>
      <h2>Create account</h2>
      {err && <p className="error">{err}</p>}
      <input name="first_name" placeholder="First name" onChange={onChange} required/>
      <input name="last_name"  placeholder="Last name"  onChange={onChange} required/>
      <input name="email" type="email" placeholder="Email" onChange={onChange} required/>
      <input name="phone"          placeholder="Phone" onChange={onChange} required/>
      <input name="password" type="password" placeholder="Password" onChange={onChange} required/>
      <button>Sign Up</button>
    </form>
  );
}
