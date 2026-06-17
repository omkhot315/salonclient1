import { motion } from 'framer-motion';
import { getNextDays } from '../data';
import { CalendarDays, Palmtree } from 'lucide-react';

interface Props { selectedDate: string; onSelect: (date: string) => void; disabledDates?: string[] }

export default function CalendarPicker({ selectedDate, onSelect, disabledDates = [] }: Props) {
  const days = getNextDays(7);
  const disabledSet = new Set(disabledDates);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-neutral-400 mb-2"><CalendarDays className="w-4 h-4" /><span className="text-xs font-medium">Select a Date (Next 7 Days)</span></div>
      {disabledDates.length > 0 && <div className="flex items-center gap-2 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"><Palmtree className="w-3.5 h-3.5" />Holiday dates are disabled</div>}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map(d => { const disabled = disabledSet.has(d.date); return (
          <motion.button key={d.date} whileHover={disabled ? {} : { scale: 1.05 }} whileTap={disabled ? {} : { scale: 0.95 }}
            onClick={() => !disabled && onSelect(d.date)} disabled={disabled}
            className={`rounded-xl p-2 text-center transition-all duration-200 relative ${disabled ? 'bg-red-500/10 text-red-400/50 cursor-not-allowed border border-red-500/20' : selectedDate === d.date ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-600/30' : 'bg-neutral-800 hover:bg-yellow-500/10 text-neutral-300 hover:text-yellow-400'}`}>
            <div className="text-[10px] font-medium uppercase tracking-wider opacity-70">{d.day}</div>
            <div className="text-sm font-bold mt-0.5">{d.label.split(' ')[1]}</div>
            <div className="text-[10px] opacity-70">{d.label.split(' ')[0]}</div>
            {disabled && <Palmtree className="w-3 h-3 mx-auto mt-0.5 opacity-70" />}
          </motion.button>); })}
      </div>
    </div>
  );
}
