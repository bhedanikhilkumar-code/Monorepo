import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EventModal } from '../../components/EventModal';
import { SearchFilterPanel } from '../../components/SearchFilterPanel';

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]); const [q, setQ] = useState('');
  async function load(){
    const from='2026-01-01T00:00:00.000Z',to='2026-12-31T00:00:00.000Z';
    const res=await api.get('/events',{params:{from,to,q}}); setEvents(res.data.map((e:any)=>({id:e.id,title:e.title,start:e.startAt,end:e.endAt}))); }
  useEffect(()=>{load();},[q]);
  return <div className='p-4 space-y-4'>
    <SearchFilterPanel q={q} setQ={setQ}/>
    <EventModal onSave={async data=>{await api.post('/events',data); await load();}}/>
    <div className='bg-white p-4 rounded'><FullCalendar plugins={[dayGridPlugin,timeGridPlugin,listPlugin,interactionPlugin]} initialView='dayGridMonth' headerToolbar={{left:'prev,next today',center:'title',right:'dayGridMonth,timeGridWeek,timeGridDay,listWeek'}} events={events}/></div>
  </div>;
}
