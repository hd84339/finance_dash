import { useAppContext } from '../context/AppContext';

export default function SummaryCard({ title, amount, type, subtitle, icon, color }) {
  const { fmt } = useAppContext();
  
  const isBalance = type === 'balance';
  const amountColor = isBalance ? (amount >= 0 ? '#185FA5' : '#A32D2D') : (type === 'income' ? '#3B6D11' : '#A32D2D');
  const iconBg = isBalance ? '#E6F1FB' : (type === 'income' ? '#EAF3DE' : '#FCEBEB');
  
  return (
    <div className="card" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '8px' }}>
            {title}
          </div>
          <div className="mono" style={{ fontSize: '24px', fontWeight: 600, letterSpacing: '-.5px', color: amountColor }}>
            {fmt(amount)}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {subtitle}
          </div>
        </div>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {icon}
        </div>
      </div>
    </div>
  );
}
