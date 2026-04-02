import { useAppContext } from '../context/AppContext';
import { CAT_COLORS } from '../data/mockData';

export default function TransactionTable() {
  const { getFiltered, sortBy, sortDir, setSortBy, setSortDir, fmt, fmtDate } = useAppContext();
  const filtered = getFiltered();

  const handleSort = (k) => {
    if (sortBy === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortBy(k); setSortDir('desc'); }
  };

  const headers = [
    { key: 'date', label: 'Date' }, { key: 'desc', label: 'Description' },
    { key: 'category', label: 'Category' }, { key: 'amount', label: 'Amount' },
    { key: 'type', label: 'Type' }
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
            {headers.map(({ key, label }) => (
              <th key={key} onClick={() => handleSort(key)}
                  style={{ textAlign: 'left', padding: '6px 8px', fontSize: '11px', fontWeight: 500, color: 'var(--color-text-secondary)', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                {label}{sortBy === key ? <span style={{ color: 'var(--color-text-primary)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span> : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)', fontSize: '13px' }}>No transactions found</td></tr>
          ) : filtered.map(t => (
            <tr key={t.id} style={{ borderBottom: '0.5px solid var(--color-border-tertiary)', transition: 'background .1s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-background-secondary)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '8px 8px', fontSize: '12px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{fmtDate(t.date)}</td>
              <td style={{ padding: '8px 8px', fontSize: '13px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.desc}</td>
              <td style={{ padding: '8px 8px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: CAT_COLORS[t.category] || '#888' }}></span>{t.category}
                </span>
              </td>
              <td style={{ padding: '8px 8px', fontSize: '13px', fontWeight: 500 }} className="mono">
                <span style={{ color: t.type === 'income' ? '#3B6D11' : '#A32D2D' }}>{t.type === 'income' ? '+' : '-'}{fmt(t.amount)}</span>
              </td>
              <td style={{ padding: '8px 8px' }}><span className={`badge badge-${t.type}`}>{t.type}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
