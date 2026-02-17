import { useState } from 'react';

export function EventModal({ onSave }: { onSave: (data: any) => void }) {
  const [form, setForm] = useState({ title: '', startDateTime: '', endDateTime: '', allDay: false });
  return <div className='bg-white p-4 rounded shadow space-y-2'>
    <h3 className='font-bold'>Create Event</h3>
    <input placeholder='Title' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
    <input type='datetime-local' onChange={e => setForm({ ...form, startDateTime: new Date(e.target.value).toISOString() })}/>
    <input type='datetime-local' onChange={e => setForm({ ...form, endDateTime: new Date(e.target.value).toISOString() })}/>
    <button onClick={() => onSave(form)}>Save</button>
  </div>;
}
