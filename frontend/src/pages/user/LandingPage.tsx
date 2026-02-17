import { Link } from 'react-router-dom';
export default function LandingPage(){return <div className='p-10'><h1 className='text-3xl font-bold'>Calendar App</h1><p>Production-ready date planner (2000-2099)</p><div className='space-x-2 mt-4'><Link to='/login'><button>Login</button></Link><Link to='/register'><button>Register</button></Link></div></div>;}
