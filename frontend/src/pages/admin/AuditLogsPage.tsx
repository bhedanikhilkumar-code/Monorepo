import { useEffect, useState } from 'react';import { api } from '../../api/client';
export default function AuditLogsPage(){const [logs,setLogs]=useState<any[]>([]);useEffect(()=>{api.get('/admin/audit-logs').then(r=>setLogs(r.data));},[]);return <div className='p-4 bg-white m-4 rounded shadow'>{logs.map(l=><div key={l.id}>{l.action} / {l.targetType} / {l.createdAt}</div>)}</div>;}
