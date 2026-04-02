import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CATS } from '../data/mockData';

export default function AddTransactionModal() {
  const { showModal, setShowModal, addTransaction } = useAppContext();
  const [form, setForm] = useState({ amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), type: 'income', desc: '' });

  if (!showModal) return null;

  const handleSubmit = () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0 || !form.date) {
      alert('Please fill in amount and date.');
      return;
    }
    addTransaction({
      amount: amt,
      category: form.category,
      date: form.date,
      type: form.type,
      desc: form.desc || form.category
    });
    setShowModal(false);
    setForm({ amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), type: 'income', desc: '' });
  };

  return (
    <div className="modal-bg" onClick={() => setShowModal(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '15px', fontWeight: 600 }}>Add Transaction</div>
          <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--color-text-secondary)', fontSize: '18px', lineHeight: 1 }}>✕</button>
        </div>
        
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input type="number" className="form-input" placeholder="0" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} min="1" />
        </div>
        
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
        </div>
        
        <div className="form-group">
          <label className="form-label">Type</label>
          <select className="form-input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Description</label>
          <input type="text" className="form-input" placeholder="Brief description…" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
        </div>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit}>Add Transaction</button>
        </div>
      </div>
    </div>
  );
}
