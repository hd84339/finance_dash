import { useAppContext } from '../context/AppContext';
import RoleSwitcher from '../components/RoleSwitcher';
import SummaryCard from '../components/SummaryCard';
import { LineChartComponent, PieChartComponent } from '../components/Chart';
import Filters from '../components/Filters';
import TransactionTable from '../components/TransactionTable';
import AddTransactionModal from '../components/AddTransactionModal';
import { CAT_COLORS } from '../data/mockData';

export default function Dashboard() {
  const { getStats, getMonthlyData, getCatData, txns, getFiltered, fmt } = useAppContext();
  const s = getStats();
  const md = getMonthlyData();
  const catData = getCatData();
  const filteredLength = getFiltered().length;

  const top = catData[0];
  const thisM = md[md.length - 1];
  const prevM = md[md.length - 2];
  
  const insights = [];
  if (top) insights.push({ color: '#E24B4A', text: <>Highest spend: <b>{top[0]}</b> at {fmt(top[1])}</> });
  if (thisM && prevM) {
    const diff = thisM.expense - prevM.expense;
    const pct = Math.abs(Math.round((diff / prevM.expense) * 100));
    insights.push({
      color: diff > 0 ? '#E24B4A' : '#639922',
      text: <>Expenses {diff > 0 ? 'up' : 'down'} <b>{pct}%</b> vs last month ({fmt(Math.abs(diff))} {diff > 0 ? 'more' : 'less'})</>
    });
  }
  if (thisM) insights.push({ color: '#378ADD', text: <>Net balance this month: <b>{fmt(thisM.balance)}</b></> });
  const avgExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / Math.max(1, catData.length);
  insights.push({ color: '#7F77DD', text: <>Avg transaction size: <b>{fmt(Math.round(avgExpense))}</b></> });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-.3px' }}>Finance Dashboard</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <RoleSwitcher />
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1.25rem' }}>
        <SummaryCard 
          title="Total Balance" 
          amount={s.balance} 
          type="balance"
          subtitle={s.balance >= 0 ? "You're in the green" : "Deficit balance"}
          color="#378ADD"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#378ADD" strokeWidth="2" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
        />
        <SummaryCard 
          title="Total Income" 
          amount={s.income} 
          type="income"
          subtitle={`${txns.filter(t => t.type === 'income').length} transactions`}
          color="#639922"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#639922" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>}
        />
        <SummaryCard 
          title="Total Expenses" 
          amount={s.expense} 
          type="expense"
          subtitle={`${txns.filter(t => t.type === 'expense').length} transactions`}
          color="#E24B4A"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E24B4A" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>}
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 340px)', gap: '12px', marginBottom: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>Monthly Overview</div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {['Income', 'Expenses', 'Balance'].map((l, i) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: ['#639922','#E24B4A','#378ADD'][i] }}></span>{l}
                </span>
              ))}
            </div>
          </div>
          <LineChartComponent data={md} />
        </div>
        <div className="card">
          <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '1rem' }}>Expense Breakdown</div>
          <PieChartComponent data={catData} />
          <div style={{ marginTop: '.875rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {catData.slice(0, 5).map(([cat, amt]) => (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: CAT_COLORS[cat] || '#888', flexShrink: 0 }}></span>{cat}
                </span>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{fmt(amt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 280px)', gap: '12px' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.875rem', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500 }}>Transactions <span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>{filteredLength} shown</span></div>
            <Filters />
          </div>
          <TransactionTable />
        </div>

        <div>
          <div className="card" style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '.875rem' }}>Insights</div>
            {insights.map((i, idx) => (
              <div key={idx} className="insight-card" style={{ borderLeftColor: i.color, background: `${i.color}11` }}>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{i.text}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '.875rem' }}>Savings Rate</div>
            {md.map(m => {
              const rate = s.income > 0 ? Math.max(0, Math.round((m.balance / (m.income || 1)) * 100)) : 0;
              return (
                <div key={m.label} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{m.label}</span>
                    <span className="mono" style={{ fontSize: '11px', fontWeight: 500, color: rate >= 20 ? '#3B6D11' : rate >= 10 ? '#BA7517' : '#A32D2D' }}>{rate}%</span>
                  </div>
                  <div style={{ height: '5px', background: 'var(--color-background-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, rate)}%`, background: rate >= 20 ? '#639922' : rate >= 10 ? '#BA7517' : '#E24B4A', borderRadius: '3px', transition: 'width .4s ease' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddTransactionModal />
    </div>
  );
}
