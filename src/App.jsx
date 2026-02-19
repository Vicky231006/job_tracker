import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  MapPin,
  XCircle,
  LayoutGrid,
  List,
  BarChart3,
  Trash2,
  Edit2,
  ExternalLink,
  Zap,
  TrendingUp,
  Target,
  Trophy,
  ChevronDown,
  Moon,
  Sun,
  Link as LinkIcon,
  Calendar,
  Building2,
  ArrowUpDown
} from 'lucide-react';

// --- Constants & Modern Stages ---

const STAGES = [
  { id: 'wishlist', label: 'Wishlist', color: 'from-slate-400 to-slate-500', bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400' },
  { id: 'applied', label: 'Applied', color: 'from-blue-500 to-cyan-400', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  { id: 'interview', label: 'Interviewing', color: 'from-violet-500 to-purple-500', bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400' },
  { id: 'offer', label: 'Offer', color: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400' },
  { id: 'rejected', label: 'Closed', color: 'from-rose-500 to-orange-400', bg: 'bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400' },
];

const INITIAL_DATA = [
  {
    id: '1',
    company: 'Apple',
    role: 'Product Designer',
    location: 'Cupertino (Remote)',
    salary: '45 LPA',
    status: 'interview',
    appliedDate: '2023-11-01',
    url: 'https://apple.com/careers',
    notes: 'Prepare portfolio for the design critique.',
  },
  {
    id: '2',
    company: 'Linear',
    role: 'Frontend Engineer',
    location: 'Remote',
    salary: '28 LPA',
    status: 'applied',
    appliedDate: '2023-11-02',
    url: 'https://linear.app/jobs',
    notes: 'Love their UI. Referral from internal dev.',
  }
];

// --- High-End UI Components ---

const SolidCard = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`border border-slate-200 dark:border-slate-800 shadow-sm rounded-3xl transition-all duration-300 bg-white dark:bg-slate-900 ${className}`}
  >
    {children}
  </div>
);

// Sidebar Icon Button matching your reference images
const IconButton = ({ icon: Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-3.5 rounded-2xl transition-all duration-300 ${active
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950 scale-105'
      : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
  >
    <Icon size={22} />
  </button>
);

export default function App() {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('trackflow-jobs-v3');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('trackflow-theme');
    return savedTheme === 'dark';
  });

  const [view, setView] = useState('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const [formData, setFormData] = useState({
    company: '', role: '', location: '', salary: '', status: 'wishlist', url: '', notes: '',
    appliedDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    localStorage.setItem('trackflow-jobs-v3', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('trackflow-theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const filteredJobs = useMemo(() => {
    let result = jobs.filter(job =>
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortConfig.key) {
      result.sort((a, b) => {
        // Handle potentially missing values safely
        const aValue = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : '';
        const bValue = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return result;
  }, [jobs, searchQuery, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAddEdit = (e) => {
    e.preventDefault();
    if (editingJob) {
      setJobs(jobs.map(j => j.id === editingJob.id ? { ...formData, id: j.id } : j));
    } else {
      const newJob = { ...formData, id: Math.random().toString(36).substr(2, 9) };
      setJobs([newJob, ...jobs]);
    }
    closeModal();
  };

  const openModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        company: '', role: '', location: '', salary: '', status: 'wishlist', url: '', notes: '',
        appliedDate: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const updateStatus = (id, newStatus) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: newStatus } : j));
  };

  const KanbanBoard = () => (
    <div className="flex gap-8 overflow-x-auto pb-12 pt-4 px-2 no-scrollbar">
      {STAGES.map(stage => (
        <div key={stage.id} className="flex-shrink-0 w-80">
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${stage.color}`} />
              <h3 className="font-black text-slate-800 dark:text-slate-100 uppercase tracking-[0.2em] text-[10px]">{stage.label}</h3>
              <span className="text-[10px] font-black bg-white dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {filteredJobs.filter(j => j.status === stage.id).length}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {filteredJobs.filter(j => j.status === stage.id).map(job => (
              <SolidCard key={job.id} onClick={() => openModal(job)} className="p-6 group cursor-pointer relative overflow-hidden hover:shadow-xl dark:hover:shadow-indigo-900/10 transition-all">
                <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-gradient-to-br ${stage.color} opacity-5 rounded-full transition-transform group-hover:scale-150`} />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stage.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                      {job.company[0]}
                    </div>
                    <div className="flex gap-2 opacity-100 transition-all">
                      <button onClick={(e) => { e.stopPropagation(); openModal(job); }} className="p-2 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setJobs(jobs.filter(j => j.id !== job.id)); }} className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl text-rose-500 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 shadow-sm">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-slate-50 text-lg leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.role}</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-sm mb-5">{job.company}</p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                      <MapPin size={10} /> {job.location || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tight">
                      <Calendar size={10} /> {job.appliedDate}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                    <select
                      value={job.status}
                      onChange={(e) => updateStatus(job.id, e.target.value)}
                      className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 focus:ring-0 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      {STAGES.map(s => <option key={s.id} value={s.id} className="dark:bg-slate-900">{s.label}</option>)}
                    </select>
                    {job.url && (
                      <a href={job.url} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-inner transition-all">
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </SolidCard>
            ))}
            <button
              onClick={() => { setFormData({ ...formData, status: stage.id }); setIsModalOpen(true); }}
              className="w-full py-5 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] text-slate-400 dark:text-slate-500 flex items-center justify-center gap-3 hover:border-indigo-400 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 transition-all text-[11px] font-black uppercase tracking-widest"
            >
              <Plus size={18} strokeWidth={3} /> Add to {stage.label}
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const AnalyticsView = () => {
    const stats = STAGES.map(stage => ({
      label: stage.label,
      count: jobs.filter(j => j.status === stage.id).length,
      gradient: stage.color
    }));
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SolidCard className="p-8 col-span-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-slate-50 mb-10">Application Pipeline</h3>
          <div className="space-y-8">
            {stats.map(stat => (
              <div key={stat.label}>
                <div className="flex justify-between items-end mb-3">
                  <span className="font-black text-slate-400 uppercase tracking-widest text-[10px]">{stat.label}</span>
                  <span className="font-black text-2xl text-slate-900 dark:text-slate-100">{stat.count}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl h-5 overflow-hidden shadow-inner p-1">
                  <div
                    className={`h-full rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg transition-all duration-1000`}
                    style={{ width: `${(stat.count / Math.max(jobs.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </SolidCard>
        <div className="space-y-8">
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-[32px] text-center flex flex-col items-center shadow-xl">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mb-4 border border-white/20 shadow-xl">
              <Trophy size={32} />
            </div>
            <div className="text-6xl font-black mb-1 tracking-tighter">{jobs.length}</div>
            <div className="text-indigo-100 font-black uppercase tracking-[0.2em] text-[10px] opacity-80">Total Opportunities</div>
          </div>
          <div className="p-8 flex items-center gap-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[32px] shadow-lg">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Target size={30} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black opacity-80 tracking-widest mb-1">Success Goal</p>
              <h4 className="text-2xl font-black tracking-tight">Get  a  Job</h4>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 selection:bg-indigo-100 dark:selection:bg-indigo-900/50 relative overflow-hidden ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>

      {/* Sidebar - Solid palette restoration matching reference image_1e05e0.png / image_1e0583.png */}
      <aside className="fixed left-6 top-6 bottom-6 w-24 z-50 hidden md:block">
        <div className="w-full h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-[44px] flex flex-col items-center py-10 gap-10">

          {/* Logo */}
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-300 dark:shadow-indigo-900/40 transition-transform active:scale-95">
            <Zap size={28} fill="white" />
          </div>

          {/* Nav Icons */}
          <div className="flex flex-col gap-6 mt-4">
            <IconButton icon={LayoutGrid} active={view === 'board'} onClick={() => setView('board')} />
            <IconButton icon={List} active={view === 'list'} onClick={() => setView('list')} />
            <IconButton icon={BarChart3} active={view === 'analytics'} onClick={() => setView('analytics')} />
          </div>

          {/* Actions */}
          <div className="mt-auto flex flex-col gap-8 items-center">

            {/* Theme Toggle - Solid contrast fix */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md"
            >
              {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* User Avatar */}
            <div className="w-12 h-12 rounded-full border-2 border-indigo-100 dark:border-slate-700 p-0.5 shadow-md cursor-pointer hover:scale-105 transition-transform">
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-[10px] font-black text-white uppercase tracking-tighter">
                ME
              </div>
            </div>

          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="md:pl-36 px-8 md:pr-10 py-10 pb-32 min-h-screen">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-indigo-500 dark:text-indigo-400 mb-2 block">Application Hub</span>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-slate-50 tracking-tighter">Track<span className="text-indigo-600">Flow.</span></h1>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Quick Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/10 focus:border-indigo-500 outline-none w-full md:w-80 transition-all font-bold text-slate-700 dark:text-slate-100 shadow-sm"
              />
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-3 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 text-white px-8 py-4.5 rounded-3xl font-black shadow-2xl transition-all active:scale-95 w-full md:w-auto justify-center"
            >
              <Plus size={20} strokeWidth={3} />
              <span className="uppercase tracking-widest text-[11px]">New Job</span>
            </button>
          </div>
        </header>

        {view === 'board' && <KanbanBoard />}
        {view === 'analytics' && <AnalyticsView />}
        {view === 'list' && (
          <SolidCard className="overflow-hidden shadow-xl">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Application Ledger</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 bg-slate-50 dark:bg-slate-950/30">
                  <tr>
                    <th className="px-10 py-7 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group" onClick={() => handleSort('company')}>
                      <div className="flex items-center gap-2">
                        Role & Company
                        {sortConfig.key === 'company' && <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'rotate-0' : 'rotate-180'} />}
                      </div>
                    </th>
                    <th className="px-10 py-7 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => handleSort('status')}>
                      <div className="flex items-center gap-2">
                        Status
                        {sortConfig.key === 'status' && <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'rotate-0' : 'rotate-180'} />}
                      </div>
                    </th>
                    <th className="px-10 py-7 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => handleSort('salary')}>
                      <div className="flex items-center gap-2">
                        Salary
                        {sortConfig.key === 'salary' && <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'rotate-0' : 'rotate-180'} />}
                      </div>
                    </th>
                    <th className="px-10 py-7 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => handleSort('url')}>
                      <div className="flex items-center gap-2">
                        Job Site
                        {sortConfig.key === 'url' && <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'rotate-0' : 'rotate-180'} />}
                      </div>
                    </th>
                    <th className="px-10 py-7 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" onClick={() => handleSort('appliedDate')}>
                      <div className="flex items-center gap-2">
                        Date
                        {sortConfig.key === 'appliedDate' && <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'rotate-0' : 'rotate-180'} />}
                      </div>
                    </th>
                    <th className="px-10 py-7 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredJobs.map(job => (
                    <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-10 py-7">
                        <div className="font-black text-slate-900 dark:text-slate-50">{job.role}</div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-tight">{job.company}</div>
                      </td>
                      <td className="px-10 py-7">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${STAGES.find(s => s.id === job.status).bg} ${STAGES.find(s => s.id === job.status).text}`}>
                          {STAGES.find(s => s.id === job.status).label}
                        </span>
                      </td>
                      <td className="px-10 py-7 text-sm font-bold text-slate-500 dark:text-slate-400">{job.salary || '-'}</td>
                      <td className="px-10 py-7">
                        {job.url ? (
                          <a href={job.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline group">
                            <span className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center transition-colors group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50">
                              <ExternalLink size={12} />
                            </span>
                          </a>
                        ) : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="px-10 py-7 text-sm font-bold text-slate-500 dark:text-slate-400">{job.appliedDate}</td>
                      <td className="px-10 py-7 text-right flex justify-end gap-4">
                        <button onClick={() => openModal(job)} className="p-2 text-slate-400 hover:text-indigo-600"><Edit2 size={18} /></button>
                        <button onClick={() => setJobs(jobs.filter(j => j.id !== job.id))} className="text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SolidCard>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 left-6 right-6 md:hidden z-50">
        <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl p-2 flex justify-between items-center px-6">
          <div className="flex gap-2">
            <IconButton icon={LayoutGrid} active={view === 'board'} onClick={() => setView('board')} />
            <IconButton icon={List} active={view === 'list'} onClick={() => setView('list')} />
            <IconButton icon={BarChart3} active={view === 'analytics'} onClick={() => setView('analytics')} />
          </div>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2"></div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all font-bold"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* --- REFRESHED SOLID MODAL (FIXED COLORS) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B1120] rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="px-12 py-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 sticky top-0 z-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                {editingJob ? 'Edit Application' : 'Capture Opportunity'}
              </h2>
              <button onClick={closeModal} className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                <XCircle size={28} />
              </button>
            </div>

            <form onSubmit={handleAddEdit} className="p-12 space-y-8">
              <div className="grid grid-cols-2 gap-x-10 gap-y-8">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="text" placeholder="e.g. Acme Corp" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300" />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Job Title</label>
                  <input required type="text" placeholder="e.g. Frontend Lead" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-7 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Location (Remote/Onsite)</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="text" placeholder="e.g. New York / Remote" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300" />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Applied Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input required type="date" value={formData.appliedDate} onChange={e => setFormData({ ...formData, appliedDate: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-all" />
                  </div>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Salary / Compensation</label>
                  <input type="text" placeholder="e.g. 18 LPA" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })}
                    className="w-full px-7 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300" />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Company / Job Link (URL)</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="url" placeholder="https://careers.google.com/..." value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 transition-all placeholder:text-slate-300" />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-3 ml-1">Pipeline Stage</label>
                  <div className="relative">
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-7 py-5 bg-slate-50 dark:bg-[#020617] border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 outline-none font-bold text-slate-900 dark:text-slate-100 appearance-none cursor-pointer transition-all">
                      {STAGES.map(s => <option key={s.id} value={s.id} className="dark:bg-slate-900">{s.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-7 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
                  </div>
                </div>
              </div>

              <div className="pt-10 flex flex-col md:flex-row gap-6">
                <button type="button" onClick={closeModal} className="flex-1 py-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-black uppercase tracking-[0.2em] text-xs transition-colors">
                  Discard Changes
                </button>
                <button type="submit" className="flex-[2] px-10 py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95">
                  {editingJob ? 'Sync Updates' : 'Launch Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}