export function SearchFilterPanel({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return <div className='bg-white p-4 rounded shadow'><input placeholder='Search title/description/location' value={q} onChange={e => setQ(e.target.value)} /></div>;
}
