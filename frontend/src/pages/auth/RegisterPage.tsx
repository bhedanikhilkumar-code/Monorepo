import { useState } from 'react';
import { api } from '../../api/client';
export default function RegisterPage() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  return <div className='max-w-md mx-auto mt-20 bg-white p-6 rounded shadow space-y-2'>
    <h2 className='text-xl font-bold'>Register</h2>
    <input value={email} onChange={e => setEmail(e.target.value)} />
    <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
    <button onClick={() => api.post('/auth/register', { email, password })}>Create account</button>
  </div>;
}
