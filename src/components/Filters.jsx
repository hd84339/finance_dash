import { useAppContext } from '../context/AppContext';

export default function Filters() {
  const { filter, setFilter, search, setSearch } = useAppContext();

  return (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
      <input 
        type="text" 
        placeholder="Search…" 
        value={search} 
        onChange={(e) => setSearch(e.target.value)} 
        style={{ width: '140px' }} 
      />
      <div style={{ display: 'flex', gap: '4px' }}>
        {['all', 'income', 'expense'].map(f => (
          <button 
            key={f}
            className={`btn-ghost ${filter === f ? 'active' : ''}`} 
            onClick={() => setFilter(f)}
            style={{ fontSize: '11px', padding: '5px 10px', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
