import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, TrendingUp, IndianRupee, Scissors, RefreshCw, Search,
  ChevronLeft, ChevronRight, Clock, Trash2, Filter, BarChart3, Star, Palmtree, Plus, X, Edit2, Save, Eye,
} from 'lucide-react';
import { adminApi } from './api';
import { SkeletonStatCard, SkeletonTableRow, AdminLoadingSpinner } from '../components/LoadingSpinner';

// ── Types ──
interface Booking { bookingId: string; customer: { name: string; email: string; phone: string }; services: { name: string; price: number; duration: number; icon: string }[]; stylist: { name: string }; appointment: { date: string; time: string }; notes: string; status: string; totalPrice: number; totalDuration: number; formattedDate: string; formattedTime: string; createdAt: string; }
interface Stats { totalBookings: number; todayBookings: number; weekBookings: number; monthBookings: number; confirmedToday: number; cancelledTotal: number; completedTotal: number; totalRevenue: number; monthRevenue: number; todayRevenue: number; popularServices: { _id: string; count: number; icon: string }[]; }
interface Holiday { _id: string; stylistId: string; stylistName: string; date: string; reason: string; fromTime: string; toTime: string; isFullDay: boolean; }
interface SvcItem { _id: string; name: string; category: string; duration: number; price: number; description: string; icon: string; active: boolean; }
interface StyItem { _id: string; name: string; specialty: string; image: string; rating: number; experience: string; active: boolean; }

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const statusColors: Record<string, string> = { confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', 'not-arrived': 'bg-yellow-100 text-yellow-700', pending: 'bg-gray-100 text-gray-700' };
type Tab = 'dashboard' | 'today' | 'bookings' | 'services' | 'stylists';

// ── Predefined service names with icons ──
const servicePresets: { name: string; icon: string; category: string }[] = [
  { name: 'Haircut', icon: '✂️', category: 'Hair' },
  { name: 'Beard Trim', icon: '🧔', category: 'Grooming' },
  { name: 'Shaving', icon: '🪒', category: 'Grooming' },
  { name: 'Hair Wash', icon: '🚿', category: 'Hair' },
  { name: 'Hair Styling', icon: '💇', category: 'Hair' },
  { name: 'Hair Coloring', icon: '🎨', category: 'Hair' },
  { name: 'Hair Spa', icon: '🧖', category: 'Hair' },
  { name: 'Head Massage', icon: '💆', category: 'Spa' },
  { name: 'Facial', icon: '🧴', category: 'Skin' },
  { name: 'Cleanup', icon: '🧹', category: 'Skin' },
  { name: 'Detan Treatment', icon: '🌿', category: 'Skin' },
  { name: 'Keratin Treatment', icon: '✨', category: 'Hair' },
  { name: 'Straightening', icon: '🔥', category: 'Hair' },
  { name: 'Manicure', icon: '💅', category: 'Nails' },
  { name: 'Pedicure', icon: '🦶', category: 'Nails' },
];

// ── Inline form defaults ──
const emptySvc = { name: '', category: '', duration: '', price: '', description: '', icon: '✨', active: true };
const emptySty = { name: '', specialty: '', image: '', rating: 5.0, experience: '', active: true };

// ── Reusable input (defined OUTSIDE component to prevent remount on every render) ──
const Inp = ({ label, value, onChange, type = 'text', placeholder = '' }: { label: string; value: any; onChange: (v: any) => void; type?: string; placeholder?: string }) => (
  <div>
    <label className="text-[11px] font-medium text-slate-500 uppercase">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => {
        if (type === 'number') {
          const val = e.target.value;
          onChange(val === '' ? '' : Number(val));
          return;
        }
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
    />
  </div>
);

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStylist, setFilterStylist] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [todayStylist, setTodayStylist] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [todayLoading, setTodayLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [stylistsLoading, setStylistsLoading] = useState(false);
  const [holidaysLoading, setHolidaysLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // Holidays
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [holidayDates, setHolidayDates] = useState<string[]>([]);
  const [holidayReason, setHolidayReason] = useState('');
  const [holidayFromTime, setHolidayFromTime] = useState('');
  const [holidayToTime, setHolidayToTime] = useState('');
  const [holidayMsg, setHolidayMsg] = useState('');
  // Services & Stylists
  const [svcList, setSvcList] = useState<SvcItem[]>([]);
  const [styList, setStyList] = useState<StyItem[]>([]);
  const [svcForm, setSvcForm] = useState<any>({ ...emptySvc });
  const [styForm, setStyForm] = useState<any>({ ...emptySty });
  const [editSvcId, setEditSvcId] = useState<string | null>(null);
  const [editStyId, setEditStyId] = useState<string | null>(null);
  const [selStylistId, setSelStylistId] = useState<string>('');

  const refresh = () => setRefreshKey(k => k + 1);
  const fmtTime = (t: string) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };

  // ── Data fetching ──
  useEffect(() => { setStatsLoading(true); adminApi.stats().then(r => { if (r.success) setStats(r.data as Stats); }).finally(() => setStatsLoading(false)); }, [refreshKey]);
  useEffect(() => { if (tab === 'today' || tab === 'dashboard') { setTodayLoading(true); adminApi.todayBookings(todayStylist).then(r => { if (r.success) setTodayBookings(r.data as Booking[]); }).finally(() => setTodayLoading(false)); } }, [tab, refreshKey, todayStylist]);
  useEffect(() => { if (tab === 'services') { setServicesLoading(true); adminApi.getServices().then(r => { if (r.success) setSvcList(r.data as SvcItem[]); }).finally(() => setServicesLoading(false)); } }, [tab, refreshKey]);
  // Always load stylists so the filter dropdown works on all tabs
  useEffect(() => {
    setStylistsLoading(true);
    adminApi.getStylists().then(r => { if (r.success) { setStyList(r.data as StyItem[]); if (!selStylistId && (r.data as StyItem[]).length) setSelStylistId((r.data as StyItem[])[0]._id); } }).finally(() => setStylistsLoading(false));
  }, [refreshKey]);
  useEffect(() => {
    if (tab === 'stylists') {
      setHolidaysLoading(true);
      adminApi.getHolidays().then(r => { if (r.success) setHolidays(r.data as Holiday[]); }).finally(() => setHolidaysLoading(false));
    }
  }, [tab, refreshKey]);

  const fetchBookings = useCallback(async (page = 1) => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '15' };
    if (filterStatus !== 'all') params.status = filterStatus;
    if (filterStylist !== 'all') params.stylist = filterStylist;
    if (filterDate) params.date = filterDate;
    if (search) params.search = search;
    const res = await adminApi.bookings(params);
    if (res.success) { setAllBookings(res.data as Booking[]); setPagination(res.pagination); }
    setLoading(false);
  }, [filterStatus, filterStylist, filterDate, search]);
  useEffect(() => { if (tab === 'bookings') fetchBookings(); }, [tab, fetchBookings, refreshKey]);

  // ── Handlers ──
  const handleStatusChange = async (id: string, status: string) => { await adminApi.updateStatus(id, status); refresh(); };
  const handleDelete = async (id: string) => { if (!confirm(`Delete ${id}?`)) return; await adminApi.deleteBooking(id); refresh(); };

  // Service CRUD
  const handleSvcSave = async () => {
    if (!svcForm.name || !svcForm.category) return;

    const payload = {
      ...svcForm,
      duration: Number(svcForm.duration),
      price: Number(svcForm.price),
    };

    if (!payload.duration || payload.duration <= 0 || !payload.price || payload.price < 0) {
      alert('Please enter a valid duration and price');
      return;
    }

    if (editSvcId) await adminApi.updateService(editSvcId, payload);
    else await adminApi.addService(payload);
    setSvcForm({ ...emptySvc }); setEditSvcId(null); refresh();
  };
  const handleSvcEdit = (s: SvcItem) => { setSvcForm({ name: s.name, category: s.category, duration: s.duration, price: s.price, description: s.description, icon: s.icon, active: s.active }); setEditSvcId(s._id); };
  const handleSvcDelete = async (id: string) => { if (!confirm('Delete this service?')) return; await adminApi.deleteService(id); refresh(); };

  // Stylist CRUD
  const handleStySave = async () => {
    if (!styForm.name) return;
    const payload = { ...styForm, rating: Number(styForm.rating) || 5 };
    if (editStyId) await adminApi.updateStylist(editStyId, payload);
    else await adminApi.addStylist(payload);
    setStyForm({ ...emptySty }); setEditStyId(null); refresh();
  };
  const handleStyEdit = (s: StyItem) => { setStyForm({ name: s.name, specialty: s.specialty, image: s.image, rating: s.rating, experience: s.experience, active: s.active }); setEditStyId(s._id); };
  const handleStyDelete = async (id: string) => { if (!confirm('Delete this stylist?')) return; await adminApi.deleteStylist(id); refresh(); };

  // Holiday
  const toggleHD = (d: string) => setHolidayDates(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  const handleAddHolidays = async () => {
    if (!holidayDates.length || !selStylistId) return;
    if (holidayFromTime && holidayToTime && holidayFromTime >= holidayToTime) {
      setHolidayMsg('⚠️ "From" time must be before "To" time'); return;
    }
    const sty = styList.find(s => s._id === selStylistId);
    await adminApi.addHolidays(selStylistId, sty?.name || '', holidayDates, holidayReason, holidayFromTime, holidayToTime);
    setHolidayDates([]); setHolidayReason(''); setHolidayFromTime(''); setHolidayToTime('');
    setHolidayMsg('Holidays added!'); refresh();
    setTimeout(() => setHolidayMsg(''), 3000);
  };

  const next30 = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split('T')[0]; });
  const dayLabel = (iso: string) => { const d = new Date(iso + 'T00:00:00'); return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), date: d.getDate(), month: d.toLocaleDateString('en-US', { month: 'short' }) }; };
  const tabLabels: Record<Tab, string> = { dashboard: 'Dashboard', today: "Today's", bookings: 'Bookings', services: 'Services', stylists: 'Stylists' };



  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Inter, sans-serif' }}>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-6 py-2 sm:py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"><Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 hidden sm:block" style={{ fontFamily: 'Playfair Display, serif' }}>GlowUp Admin</h1>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={refresh} className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 text-slate-500"><RefreshCw className="w-4 h-4" /></button>
              <a href="#/" className="px-2 sm:px-3 py-1.5 rounded-lg hover:bg-amber-50 text-amber-600 text-xs sm:text-sm font-medium">← Site</a>
            </div>
          </div>
          <nav className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 mt-2 overflow-x-auto">
            {(['dashboard', 'today', 'bookings', 'services', 'stylists'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${tab === t ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-800'}`}>{tabLabels[t]}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <AnimatePresence mode="wait">

          {/* ═══ DASHBOARD ═══ */}
          {tab === 'dashboard' && (statsLoading || stats) && (
            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {statsLoading
                  ? Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
                  : [
                      { label: "Today's Bookings", value: stats!.todayBookings, icon: CalendarDays, color: 'text-blue-600 bg-blue-50' },
                      { label: "Today's Revenue", value: fmt(stats!.todayRevenue), icon: IndianRupee, color: 'text-green-600 bg-green-50' },
                      { label: 'This Month', value: stats!.monthBookings, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
                      { label: 'Month Revenue', value: fmt(stats!.monthRevenue), icon: IndianRupee, color: 'text-amber-600 bg-amber-50' },
                    ].map((s, i) => (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                          <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">{s.label}</span>
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon className="w-4 h-4" /></div>
                        </div>
                        <p className="text-xl sm:text-2xl font-bold text-slate-900">{s.value}</p>
                      </motion.div>
                    ))
                }
              </div>
              {statsLoading ? (
                <div className="grid lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded-full w-1/3" />
                      {Array.from({ length: 4 }).map((_, j) => <div key={j} className="h-3 bg-slate-100 rounded-full" />)}
                    </div>
                  ))}
                </div>
              ) : (
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-500" /> All Time</h3>
                  {[{ l: 'Total Bookings', v: stats!.totalBookings }, { l: 'Completed', v: stats!.completedTotal }, { l: 'Cancelled', v: stats!.cancelledTotal }, { l: 'Total Revenue', v: fmt(stats!.totalRevenue) }].map(r => (<div key={r.l} className="flex justify-between text-sm"><span className="text-slate-500">{r.l}</span><span className="font-semibold text-slate-800">{r.v}</span></div>))}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Star className="w-4 h-4 text-amber-500" /> Popular Services</h3>
                  {stats!.popularServices.map(s => (<div key={s._id} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><span>{s.icon}</span><span className="text-slate-700">{s._id}</span></span><span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">{s.count}</span></div>))}
                  {!stats!.popularServices.length && <p className="text-sm text-slate-400">No data yet</p>}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-3">
                  <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Clock className="w-4 h-4 text-amber-500" /> Upcoming Today</h3>
                  {todayLoading ? <AdminLoadingSpinner label="Loading today's schedule…" /> : (
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {todayBookings.filter(b => b.status === 'confirmed').slice(0, 6).map(b => (<div key={b.bookingId} className="flex items-center justify-between p-2 bg-slate-50 rounded-xl text-sm"><div><p className="font-medium text-slate-800">{b.customer.name}</p><p className="text-xs text-slate-500">{b.services.map(s => s.name).join(', ')}</p></div><span className="text-xs font-semibold text-amber-600">{fmtTime(b.appointment.time)}</span></div>))}
                    {!todayBookings.filter(b => b.status === 'confirmed').length && <p className="text-sm text-slate-400">No upcoming</p>}
                  </div>
                  )}
                </div>
              </div>
              )}
            </motion.div>
          )}

          {/* ═══ TODAY ═══ */}
          {tab === 'today' && (() => {
            // Group today's bookings by stylist
            const stylistNames = [...new Set(todayBookings.map(b => b.stylist.name))].sort();
            const grouped = todayStylist === 'all' ? stylistNames : stylistNames.filter(n => n === todayStylist);

            return (
            <motion.div key="today" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">Today's Bookings ({todayBookings.length})</h2>
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-slate-400" />
                  <select value={todayStylist} onChange={e => setTodayStylist(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                    <option value="all">All Stylists</option>
                    {styList.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              {todayLoading ? <AdminLoadingSpinner label="Loading today's bookings…" /> : !todayBookings.length ? <div className="bg-white rounded-2xl p-12 text-center border"><CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" /><p className="text-slate-500">No bookings today{todayStylist !== 'all' ? ` for ${todayStylist}` : ''}</p></div> : (
                <div className="space-y-6">
                  {grouped.map(stylistName => {
                    const styBookings = todayBookings.filter(b => b.stylist.name === stylistName);
                    if (!styBookings.length) return null;
                    const styInfo = styList.find(s => s.name === stylistName);
                    return (
                      <div key={stylistName} className="space-y-3">
                        {/* Stylist header */}
                        <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                          {styInfo?.image ? (
                            <img src={styInfo.image} alt={stylistName} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center"><Scissors className="w-4 h-4 text-amber-600" /></div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-800">{stylistName}</p>
                            {styInfo && <p className="text-[11px] text-slate-500">{styInfo.specialty}</p>}
                          </div>
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">{styBookings.length} booking{styBookings.length > 1 ? 's' : ''}</span>
                        </div>

                        {/* Bookings for this stylist */}
                        {styBookings.map(b => (
                          <div key={b.bookingId} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm ml-4 sm:ml-6 border-l-4 border-l-amber-400">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-[11px] text-slate-400">{b.bookingId}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${statusColors[b.status]}`}>{b.status}</span></div>
                                <p className="font-semibold text-slate-900">{b.customer.name}</p>
                                <p className="text-xs text-slate-500">{b.customer.email} · {b.customer.phone}</p>
                                <div className="flex flex-wrap gap-1 mt-2">{b.services.map(s => <span key={s.name} className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{s.icon} {s.name}</span>)}</div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <p className="text-sm font-bold text-amber-600">{fmtTime(b.appointment.time)}</p>
                                <p className="text-xs text-slate-500">{b.totalDuration}m · {fmt(b.totalPrice)}</p>
                                <div className="flex gap-1 items-center">
                                  <button onClick={() => setSelectedBooking(b)} className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100" title="View details">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {b.status === 'confirmed' && <>
                                    <button onClick={() => handleStatusChange(b.bookingId, 'completed')} className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-medium">✓ Done</button>
                                    <button onClick={() => handleStatusChange(b.bookingId, 'cancelled')} className="px-2 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-medium">Cancel</button>
                                  </>}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
            );
          })()}

          {/* ═══ BOOKINGS ═══ */}
          {tab === 'bookings' && (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchBookings()} className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" /></div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm"><option value="all">All Status</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="not-arrived">Not Arrived</option></select>
                  <select value={filterStylist} onChange={e => setFilterStylist(e.target.value)} className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm">
                    <option value="all">All Stylists</option>
                    {styList.map(s => <option key={s._id} value={s.name}>{s.name}</option>)}
                  </select>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    title="Filter by booking date"
                  />
                  <button onClick={() => fetchBookings()} className="px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-medium">Go</button>
                  <button
                    onClick={() => { setSearch(''); setFilterStatus('all'); setFilterStylist('all'); setFilterDate(''); fetchBookings(1); }}
                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b"><tr>{['ID','Customer','Stylist','Services','Date/Time','Amount','Status',''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                      <tbody>{Array.from({ length: 8 }).map((_, i) => <SkeletonTableRow key={i} cols={8} />)}</tbody>
                    </table>
                  </div>
                ) : !allBookings.length ? <div className="p-12 text-center text-slate-400">No bookings</div> : (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b"><tr>{['ID','Customer','Stylist','Services','Date/Time','Amount','Status',''].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-slate-50">{allBookings.map(b => (
                          <tr key={b.bookingId} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{b.bookingId}</td>
                            <td className="px-4 py-3"><p className="font-medium text-slate-800">{b.customer.name}</p><p className="text-xs text-slate-400">{b.customer.email}</p></td>
                            <td className="px-4 py-3"><span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">✂️ {b.stylist.name}</span></td>
                            <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{b.services.map(s => <span key={s.name} className="text-[11px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{s.icon} {s.name}</span>)}</div></td>
                            <td className="px-4 py-3 text-xs text-slate-600"><p>{b.formattedDate}</p><p className="font-semibold">{b.formattedTime}</p></td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{fmt(b.totalPrice)}</td>
                            <td className="px-4 py-3"><select value={b.status} onChange={e => handleStatusChange(b.bookingId, e.target.value)} className={`px-2 py-1 rounded-lg text-xs font-semibold border-0 ${statusColors[b.status]}`}><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="not-arrived">Not Arrived</option></select></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                <button onClick={() => setSelectedBooking(b)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="View details"><Eye className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(b.bookingId)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                    <div className="md:hidden divide-y divide-slate-100">{allBookings.map(b => (
                      <div key={b.bookingId} className="p-4 space-y-2">
                        <div className="flex justify-between"><span className="font-mono text-[11px] text-slate-400">{b.bookingId}</span><select value={b.status} onChange={e => handleStatusChange(b.bookingId, e.target.value)} className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold border-0 ${statusColors[b.status]}`}><option value="confirmed">Confirmed</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="not-arrived">Not Arrived</option></select></div>
                        <p className="font-semibold text-sm">{b.customer.name}</p>
                        <p className="text-xs text-slate-500">✂️ Stylist: <span className="font-semibold text-slate-700">{b.stylist.name}</span></p>
                        <div className="flex flex-wrap gap-1">{b.services.map(s => <span key={s.name} className="text-[11px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">{s.icon} {s.name}</span>)}</div>
                        <div className="flex justify-between text-xs"><span>{b.formattedDate} · <strong>{b.formattedTime}</strong></span><span className="font-bold">{fmt(b.totalPrice)}</span></div>
                        <div className="flex justify-end">
                          <button onClick={() => setSelectedBooking(b)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="View details"><Eye className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}</div>
                  </>
                )}
                {pagination.pages > 1 && <div className="flex items-center justify-between px-4 py-3 border-t"><p className="text-xs text-slate-500">{allBookings.length} of {pagination.total}</p><div className="flex gap-1"><button disabled={pagination.page<=1} onClick={()=>fetchBookings(pagination.page-1)} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button><span className="px-3 py-1 text-sm font-medium">{pagination.page}/{pagination.pages}</span><button disabled={pagination.page>=pagination.pages} onClick={()=>fetchBookings(pagination.page+1)} className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button></div></div>}
              </div>
            </motion.div>
          )}

          {/* ═══ SERVICES ═══ */}
          {tab === 'services' && (
            <motion.div key="svc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Add / Edit form */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-500" /> {editSvcId ? 'Edit Service' : 'Add New Service'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {/* Service name dropdown with icon auto-fill */}
                  <div>
                    <label className="text-[11px] font-medium text-slate-500 uppercase">Service Name *</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">{svcForm.icon}</span>
                      <select value={svcForm.name}
                        onChange={e => {
                          const preset = servicePresets.find(p => p.name === e.target.value);
                          setSvcForm({
                            ...svcForm,
                            name: e.target.value,
                            icon: preset?.icon || svcForm.icon,
                            category: preset?.category || svcForm.category,
                          });
                        }}
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none">
                        <option value="">— Select Service —</option>
                        {servicePresets.map(p => (
                          <option key={p.name} value={p.name}>{p.icon} {p.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <Inp label="Category" value={svcForm.category} onChange={(v: string) => setSvcForm({ ...svcForm, category: v })} placeholder="Auto-filled" />
                  <Inp label="Duration (min)" value={svcForm.duration} onChange={(v: number) => setSvcForm({ ...svcForm, duration: v })} type="number" />
                  <Inp label="Price (₹)" value={svcForm.price} onChange={(v: number) => setSvcForm({ ...svcForm, price: v })} type="number" />
                  <Inp label="Description" value={svcForm.description} onChange={(v: string) => setSvcForm({ ...svcForm, description: v })} placeholder="Optional" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSvcSave} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600"><Save className="w-4 h-4" />{editSvcId ? 'Update' : 'Add Service'}</button>
                  {editSvcId && <button onClick={() => { setSvcForm({ ...emptySvc }); setEditSvcId(null); }} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">Cancel</button>}
                </div>
              </div>

              {/* List */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {servicesLoading ? <AdminLoadingSpinner label="Loading services…" /> : (
                <div className="divide-y divide-slate-100">
                  {svcList.map(s => (
                    <div key={s._id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">{s.icon}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">{s.name} {!s.active && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Inactive</span>}</p>
                          <p className="text-xs text-slate-500">{s.category} · {s.duration}m · {fmt(s.price)}</p>
                          {s.description && <p className="text-xs text-slate-400 truncate">{s.description}</p>}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => handleSvcEdit(s)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleSvcDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {!svcList.length && <div className="p-12 text-center text-slate-400">No services yet. Add one above.</div>}
                </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ STYLISTS ═══ */}
          {tab === 'stylists' && (
            <motion.div key="sty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Add / Edit form */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-500" /> {editStyId ? 'Edit Stylist' : 'Add New Stylist'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  <Inp label="Name *" value={styForm.name} onChange={(v: string) => setStyForm({ ...styForm, name: v })} placeholder="Emma" />
                  <Inp label="Specialty" value={styForm.specialty} onChange={(v: string) => setStyForm({ ...styForm, specialty: v })} placeholder="Hair Styling" />
                  <Inp label="Experience" value={styForm.experience} onChange={(v: string) => setStyForm({ ...styForm, experience: v })} placeholder="5 years" />
                  <Inp label="Rating" value={styForm.rating} onChange={(v: number) => setStyForm({ ...styForm, rating: v })} type="number" />
                  <Inp label="Image URL" value={styForm.image} onChange={(v: string) => setStyForm({ ...styForm, image: v })} placeholder="https://…" />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleStySave} className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600"><Save className="w-4 h-4" />{editStyId ? 'Update' : 'Add Stylist'}</button>
                  {editStyId && <button onClick={() => { setStyForm({ ...emptySty }); setEditStyId(null); }} className="px-4 py-2 border border-slate-200 rounded-xl text-sm text-slate-600">Cancel</button>}
                </div>
              </div>

              {/* Stylist list */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                {stylistsLoading ? <AdminLoadingSpinner label="Loading stylists…" /> : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                  {styList.map(s => (
                    <div key={s._id} className="p-4 space-y-2">
                      {s.image ? (
                        <img
                          src={s.image}
                          alt={s.name}
                          className="w-full h-28 object-cover rounded-xl"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const next = target.nextElementSibling as HTMLElement | null;
                            if (next) next.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-28 rounded-xl bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 items-center justify-center flex-col gap-2 text-amber-700"
                        style={{ display: s.image ? 'none' : 'flex' }}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                          <Scissors className="h-6 w-6" />
                        </div>
                        <span className="text-[11px] font-semibold tracking-wide">Salon Stylist</span>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm flex items-center gap-2">{s.name} {!s.active && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">Inactive</span>}</p>
                      <p className="text-xs text-slate-500">{s.specialty} · {s.experience}</p>
                      <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /><span className="text-xs text-slate-600">{s.rating}</span></div>
                      <div className="flex gap-1">
                        <button onClick={() => handleStyEdit(s)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleStyDelete(s._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                  {!styList.length && <div className="col-span-4 p-12 text-center text-slate-400">No stylists yet</div>}
                </div>
                )}
              </div>

              {/* Holidays */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Palmtree className="w-4 h-4 text-green-500" /> Manage Holidays</h3>
                {styList.length > 0 && (
                  <>
                    <select value={selStylistId} onChange={e => { setSelStylistId(e.target.value); setHolidayDates([]); }} className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm">
                      {styList.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    <div className="grid grid-cols-5 sm:grid-cols-7 lg:grid-cols-10 gap-1.5">
                      {next30.map(d => { const lbl = dayLabel(d); const sel = holidayDates.includes(d); const already = holidays.some(h => h.stylistId === selStylistId && h.date.split('T')[0] === d); return (
                        <button key={d} onClick={() => !already && toggleHD(d)} disabled={already} className={`rounded-xl p-1.5 text-center text-xs transition-all ${already ? 'bg-green-100 text-green-700 cursor-not-allowed ring-2 ring-green-300' : sel ? 'bg-red-500 text-white shadow-lg' : 'bg-slate-50 text-slate-700 hover:bg-red-50'}`}>
                          <div className="text-[10px] font-medium uppercase opacity-70">{lbl.day}</div>
                          <div className="text-sm font-bold">{lbl.date}</div>
                          <div className="text-[10px] opacity-70">{lbl.month}</div>
                          {already && <Palmtree className="w-3 h-3 mx-auto mt-0.5" />}
                        </button>); })}
                    </div>
                    {holidayDates.length > 0 && <div className="space-y-3">
                      <div className="flex flex-wrap gap-1.5">{holidayDates.map(d => <span key={d} className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-lg text-xs font-medium">{new Date(d+'T00:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}<button onClick={()=>toggleHD(d)}><X className="w-3 h-3"/></button></span>)}</div>
                      <input type="text" placeholder="Reason (optional)" value={holidayReason} onChange={e => setHolidayReason(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" />

                      {/* Time range — leave empty for full day */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                        <p className="text-[11px] font-medium text-slate-500 uppercase">Time Range (leave empty for full day holiday)</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] text-slate-400">From</label>
                            <select value={holidayFromTime} onChange={e => setHolidayFromTime(e.target.value)} className="w-full mt-0.5 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm">
                              <option value="">-- Full Day --</option>
                              {Array.from({ length: 41 }, (_, i) => { const h = 9 + Math.floor(i / 4); const m = (i % 4) * 15; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }).map(t => <option key={t} value={t}>{(() => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; })()}</option>)}
                            </select>
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] text-slate-400">To</label>
                            <select value={holidayToTime} onChange={e => setHolidayToTime(e.target.value)} className="w-full mt-0.5 px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-sm">
                              <option value="">-- Full Day --</option>
                              {Array.from({ length: 41 }, (_, i) => { const h = 9 + Math.floor(i / 4); const m = (i % 4) * 15; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`; }).map(t => <option key={t} value={t}>{(() => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; })()}</option>)}
                            </select>
                          </div>
                        </div>
                        {holidayFromTime && holidayToTime && <p className="text-xs text-amber-600">⏰ Stylist unavailable from {holidayFromTime} to {holidayToTime} — other slots will remain bookable</p>}
                        {!holidayFromTime && !holidayToTime && <p className="text-xs text-red-500">🏖️ Full day holiday — entire day will be blocked</p>}
                      </div>

                      <button onClick={handleAddHolidays} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">
                        <Plus className="w-4 h-4" />
                        {holidayFromTime && holidayToTime
                          ? `Block ${holidayFromTime}–${holidayToTime} for ${holidayDates.length} Day${holidayDates.length > 1 ? 's' : ''}`
                          : `Mark ${holidayDates.length} Day${holidayDates.length > 1 ? 's' : ''} as Full Holiday`}
                      </button>
                    </div>}
                    {holidayMsg && <p className="text-sm text-green-600 font-medium">{holidayMsg}</p>}
                    {/* Holiday list */}
                    {holidaysLoading ? <AdminLoadingSpinner label="Loading holidays…" /> : holidays.filter(h => h.stylistId === selStylistId).length > 0 && <div className="space-y-2 mt-4">{holidays.filter(h => h.stylistId === selStylistId).map(h => (
                      <div key={h._id} className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Palmtree className="w-5 h-5 text-green-500" />
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{new Date(h.date).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${h.isFullDay ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                                {h.isFullDay ? '🏖️ Full Day' : `⏰ ${h.fromTime} – ${h.toTime}`}
                              </span>
                              {h.reason && <span className="text-xs text-slate-500">{h.reason}</span>}
                            </div>
                          </div>
                        </div>
                        <button onClick={() => adminApi.removeHoliday(h._id).then(refresh)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}</div>}
                  </>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* ═══ BOOKING DETAILS MODAL ═══ */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-center justify-center" onClick={() => setSelectedBooking(null)}>
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} transition={{ duration: 0.2 }}
                className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Customer Full Details</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedBooking.bookingId}</p>
                  </div>
                  <button onClick={() => setSelectedBooking(null)} className="w-9 h-9 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Customer</p>
                      <div className="space-y-1.5 text-sm">
                        <p><span className="text-slate-500">Name:</span> <span className="font-semibold text-slate-800">{selectedBooking.customer.name}</span></p>
                        <p><span className="text-slate-500">Email:</span> <span className="font-semibold text-slate-800 break-all">{selectedBooking.customer.email}</span></p>
                        <p><span className="text-slate-500">Phone:</span> <span className="font-semibold text-slate-800">{selectedBooking.customer.phone}</span></p>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Appointment</p>
                      <div className="space-y-1.5 text-sm">
                        <p><span className="text-slate-500">Stylist:</span> <span className="font-semibold text-slate-800">{selectedBooking.stylist.name}</span></p>
                        <p><span className="text-slate-500">Date:</span> <span className="font-semibold text-slate-800">{selectedBooking.formattedDate}</span></p>
                        <p><span className="text-slate-500">Time:</span> <span className="font-semibold text-slate-800">{selectedBooking.formattedTime}</span></p>
                        <p><span className="text-slate-500">Status:</span> <span className={`inline-flex ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${statusColors[selectedBooking.status]}`}>{selectedBooking.status}</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 p-4">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-3">Booked Services</p>
                    <div className="space-y-2">
                      {selectedBooking.services.map((s) => (
                        <div key={`${selectedBooking.bookingId}-${s.name}`} className="flex items-center justify-between bg-amber-50 rounded-xl px-3 py-2">
                          <span className="text-sm font-medium text-slate-800">{s.icon} {s.name}</span>
                          <span className="text-xs font-semibold text-amber-700">{fmt(s.price)} · {s.duration} min</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Totals</p>
                      <div className="space-y-1.5 text-sm">
                        <p><span className="text-slate-500">Duration:</span> <span className="font-semibold text-slate-800">{selectedBooking.totalDuration} min</span></p>
                        <p><span className="text-slate-500">Amount:</span> <span className="font-semibold text-slate-800">{fmt(selectedBooking.totalPrice)}</span></p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Notes</p>
                      <p className="text-sm text-slate-700">{selectedBooking.notes || 'No special notes'}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-2">Created</p>
                    <p className="text-sm text-slate-700">{new Date(selectedBooking.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
