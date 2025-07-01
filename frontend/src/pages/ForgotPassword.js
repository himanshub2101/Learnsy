import { useState } from 'react';
import api from '../api/axios';
import './forgotpassword.css';

export default function ForgotPassword() {
  const [email,setEmail] = useState('');
  const [sent,setSent]   = useState(false);

  const submit = async e => {
    e.preventDefault();
    await api.post('/auth/forgot-password', { email });
    setSent(true);                     // always “success” to avoid user‑enum
  };

  return (
    <form className="auth-box" onSubmit={submit}>
      <h2>Reset password</h2>
      {sent
        ? <p>Check your inbox for a reset link.</p>
        : <>
            <input type="email" value={email}
                   onChange={e=>setEmail(e.target.value)}
                   placeholder="E‑mail" required/>
            <button>Send link</button>
          </>
      }
    </form>
  );
}
