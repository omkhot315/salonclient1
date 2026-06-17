import { motion } from 'framer-motion';
import { TimeSlot } from '../types';
import { formatTime } from '../data';
import { Clock } from 'lucide-react';

interface Props { slots: TimeSlot[]; selectedTime: string; onSelect: (time: string) => void }

export default function TimeSlotPicker({ slots, selectedTime, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-neutral-400 mb-2"><Clock className="w-4 h-4" /><span className="text-xs font-medium">Select a Time</span></div>
      <div className="grid grid-cols-4 gap-1.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
        {slots.map(slot => (
          <motion.button key={slot.time} whileHover={slot.available ? { scale: 1.05 } : {}} whileTap={slot.available ? { scale: 0.95 } : {}}
            disabled={!slot.available} onClick={() => slot.available && onSelect(slot.time)}
            className={`rounded-xl py-2.5 px-2 text-xs font-medium transition-all duration-200 ${selectedTime === slot.time ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-600/30' : slot.available ? 'bg-neutral-800 hover:bg-yellow-500/10 text-neutral-300 hover:text-yellow-400' : 'bg-neutral-800/50 text-neutral-700 cursor-not-allowed line-through'}`}>
            {formatTime(slot.time)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
