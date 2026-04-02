import { createContext, useContext, useState, useEffect } from 'react';
import { initTxns } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [txns, setTxns] = useState(() => {
    const saved = localStorage.getItem('fin_txns');
    return saved ? JSON.parse(saved) : initTxns;
  });
  const [role, setRole] = useState('viewer');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [showModal, setShowModal] = useState(false);
  const [nextId, setNextId] = useState(24);

  useEffect(() => {
    localStorage.setItem('fin_txns', JSON.stringify(txns));
    const maxId = txns.reduce((max, t) => Math.max(max, t.id), 0);
    if (maxId >= nextId) setNextId(maxId + 1);
  }, [txns]);

  const addTransaction = (txn) => {
    setTxns(prev => [...prev, { id: nextId, ...txn }]);
    setNextId(prev => prev + 1);
  };

  const getStats = () => {
    const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  };

  const getMonthlyData = () => {
    const months = {};
    txns.forEach(t => {
      const m = t.date.slice(0, 7);
      if (!months[m]) months[m] = { income: 0, expense: 0 };
      months[m][t.type] += t.amount;
    });
    return Object.entries(months)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([m, v]) => ({
        label: new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        ...v,
        balance: v.income - v.expense
      }));
  };

  const getCatData = () => {
    const cats = {};
    txns.filter(t => t.type === 'expense').forEach(t => {
      cats[t.category] = (cats[t.category] || 0) + t.amount;
    });
    return Object.entries(cats).sort((a, b) => b[1] - a[1]);
  };

  const getFiltered = () => {
    let list = [...txns];
    if (filter !== 'all') list = list.filter(t => t.type === filter);
    if (search) {
      list = list.filter(t => 
        t.category.toLowerCase().includes(search.toLowerCase()) || 
        t.desc.toLowerCase().includes(search.toLowerCase())
      );
    }
    list.sort((a, b) => {
      let va = a[sortBy], vb = b[sortBy];
      if (sortBy === 'amount') { va = +va; vb = +vb; }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  };

  const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const value = {
    txns, role, filter, search, sortBy, sortDir, showModal,
    setRole, setFilter, setSearch, setSortBy, setSortDir, setShowModal,
    addTransaction, getStats, getMonthlyData, getCatData, getFiltered,
    fmt, fmtDate
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);
