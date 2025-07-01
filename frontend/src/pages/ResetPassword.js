import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token    = params.get('token');          // from e‑mail
  const nav      = useNavigate();
  const [pwd,setPwd] = useState('');
  const [done,setDone]=useState(false);

  const submit = async e => {
    e.preventDefault();
    await api.post('/auth/reset-password', { token, new_password: pwd });
    setDone(true);
    setTimeout(()=>nav('/login'), 1500);
  };

  if (!token) return <p>Missing token</p>;

  return done ? (
    <p>Password changed – you can now log in.</p>
  ) : (
    <form className="auth-box" onSubmit={submit}>
      <h2>Choose a new password</h2>
      <input type="password" value={pwd}
             onChange={e=>setPwd(e.target.value)}
             placeholder="New password" required/>
      <button>Reset</button>
    </form>
  );
}

