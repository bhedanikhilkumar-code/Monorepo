import { useState } from 'react';import { api } from '../../api/client';
export default function ForgotPage(){const [email,setEmail]=useState('');return <div className='max-w-md mx-auto mt-20 bg-white p-6 rounded shadow'><input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Email'/><button onClick={()=>api.post('/auth/forgot-password',{email})}>Send reset</button></div>;}
