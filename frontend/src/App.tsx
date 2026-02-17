import { Link, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/user/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPage from './pages/auth/ForgotPage';
import ResetPage from './pages/auth/ResetPage';
import CalendarPage from './pages/user/CalendarPage';
import SettingsPage from './pages/user/SettingsPage';
import ImportExportPage from './pages/user/ImportExportPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import ModerationPage from './pages/admin/ModerationPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';

export default function App(){return <div><nav className='p-2 bg-slate-800 text-white space-x-2'>
  <Link to='/'>Home</Link><Link to='/calendar'>Calendar</Link><Link to='/settings'>Settings</Link><Link to='/import-export'>Import/Export</Link><Link to='/admin/login'>Admin</Link>
</nav><Routes>
  <Route path='/' element={<LandingPage/>}/><Route path='/login' element={<LoginPage/>}/><Route path='/register' element={<RegisterPage/>}/><Route path='/forgot' element={<ForgotPage/>}/><Route path='/reset' element={<ResetPage/>}/><Route path='/calendar' element={<CalendarPage/>}/><Route path='/settings' element={<SettingsPage/>}/><Route path='/import-export' element={<ImportExportPage/>}/>
  <Route path='/admin/login' element={<AdminLoginPage/>}/><Route path='/admin/dashboard' element={<DashboardPage/>}/><Route path='/admin/users' element={<UsersPage/>}/><Route path='/admin/moderation' element={<ModerationPage/>}/><Route path='/admin/audit-logs' element={<AuditLogsPage/>}/><Route path='/admin/system-settings' element={<SystemSettingsPage/>}/>
</Routes></div>;}
