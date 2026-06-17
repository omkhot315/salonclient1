import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookingData, getTotalDuration, getTotalPrice } from '../types';
import { formatTime, formatPrice } from '../data';
import { User, Mail, Phone, Scissors, UserCheck, CalendarDays, Clock, DollarSign, FileText } from 'lucide-react';
import { Spinner } from './LoadingSpinner';

interface Props { booking: BookingData; onConfirm: () => void; onEdit: () => void }

export default function BookingSummary({ booking, onConfirm, onEdit }: Props) {
  const [confirming, setConfirming] = useState(false);
  const dateObj = new Date(booking.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const totalDuration = getTotalDuration(booking.services);
  const totalPrice = getTotalPrice(booking.services);

  const handleConfirm = async () => {
    setConfirming(true);
    try { await onConfirm(); } finally { setConfirming(false); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-neutral-900 rounded-2xl p-4 space-y-3 border border-yellow-700/30">
        <h4 className="font-semibold text-yellow-400 text-sm flex items-center gap-2">📋 Booking Summary</h4>
        {[
          { icon: User, label: 'Name', value: booking.name },
          { icon: Mail, label: 'Email', value: booking.email },
          { icon: Phone, label: 'Phone', value: booking.phone },
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-start gap-3">
            <item.icon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0"><span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">{item.label}</span><p className="text-sm text-neutral-200 font-medium truncate">{item.value}</p></div>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex items-start gap-3">
          <Scissors className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 w-full"><span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Services ({booking.services.length})</span>
            <div className="space-y-1 mt-1">{booking.services.map(s => <div key={s.id} className="flex items-center justify-between text-sm"><span className="text-neutral-200 font-medium">{s.icon} {s.name}</span><span className="text-yellow-400 font-semibold text-xs">{formatPrice(s.price)} · {s.duration}m</span></div>)}</div>
          </div>
        </motion.div>
        {[
          { icon: UserCheck, label: 'Stylist', value: booking.stylist?.name || '' },
          { icon: CalendarDays, label: 'Date', value: formattedDate },
          { icon: Clock, label: 'Time', value: formatTime(booking.time) },
          { icon: Clock, label: 'Total Duration', value: `${totalDuration} minutes` },
          { icon: DollarSign, label: 'Total Price', value: formatPrice(totalPrice) },
          ...(booking.notes ? [{ icon: FileText, label: 'Notes', value: booking.notes }] : []),
        ].map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="flex items-start gap-3">
            <item.icon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0"><span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">{item.label}</span><p className="text-sm text-neutral-200 font-medium truncate">{item.value}</p></div>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-2">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onEdit} disabled={confirming}
          className="flex-1 py-2.5 rounded-xl border-2 border-neutral-700 text-neutral-300 text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50">
          Start Over
        </motion.button>
        <motion.button whileHover={confirming ? {} : { scale: 1.02 }} whileTap={confirming ? {} : { scale: 0.98 }}
          onClick={handleConfirm} disabled={confirming}
          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold shadow-lg shadow-yellow-600/30 transition-all disabled:opacity-80 flex items-center justify-center gap-2">
          {confirming ? (
            <><Spinner className="w-4 h-4 text-black" /> Confirming…</>
          ) : (
            '✅ Confirm Booking'
          )}
        </motion.button>
      </div>
    </div>
  );
}
