import { createContext, useContext, useState } from 'react';
import { api } from '../api/client';

type User = { id: string; email: string; role: 'USER' | 'ADMIN' } | null;
const Ctx = createContext<any>(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setToken] = useState<string>('');
  const [user, setUser] = useState<User>(null);
  async function login(email: string, password: string, admin = false) {
    const url = admin ? '/admin/login' : '/auth/login';
    const res = await api.post(url, { email, password });
    setToken(res.data.accessToken);
    api.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
    if (!admin) {
      const me = await api.get('/auth/me'); setUser(me.data);
    } else setUser({ id: 'admin', email, role: 'ADMIN' });
  }
  return <Ctx.Provider value={{ accessToken, user, login }}>{children}</Ctx.Provider>;
}
