import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('User@12345');
  const { login } = useAuth();
  const nav = useNavigate();
  return <div className='max-w-md mx-auto mt-20 bg-white p-6 rounded shadow space-y-2'>
    <h2 className='text-xl font-bold'>Login</h2>
    <input value={email} onChange={e => setEmail(e.target.value)} />
    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
    <button onClick={async () => { await login(email, password); nav('/calendar'); }}>Login</button>
  </div>;
}
