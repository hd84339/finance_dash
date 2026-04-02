import { useAppContext } from '../context/AppContext';

export default function RoleSwitcher() {
  const { role, setRole, setShowModal, txns } = useAppContext();

  const handleExport = () => {
    const rows = [['Date', 'Description', 'Category', 'Amount', 'Type'], ...txns.map(t => [t.date, t.desc, t.category, t.amount, t.type])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 'var(--border-radius-md)', padding: '4px 10px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Role:</span>
        <button 
          className={`role-btn ${role === 'viewer' ? 'role-active' : ''}`} 
          onClick={() => setRole('viewer')}
          style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', border: 'none', background: role === 'viewer' ? 'var(--color-background-primary)' : 'transparent', color: role === 'viewer' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', transition: 'all .15s' }}>
          Viewer
        </button>
        <button 
          className={`role-btn ${role === 'admin' ? 'role-active' : ''}`} 
          onClick={() => setRole('admin')}
          style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', border: 'none', background: role === 'admin' ? 'var(--color-background-primary)' : 'transparent', color: role === 'admin' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', transition: 'all .15s' }}>
          Admin
        </button>
      </div>
      {role === 'admin' && (
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '16px', lineHeight: 1 }}>+</span> Add Transaction
        </button>
      )}
      <button className="btn-ghost" onClick={handleExport} style={{ fontSize: '12px' }}>Export CSV</button>
    </div>
  );
}
