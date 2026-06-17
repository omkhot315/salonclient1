import { useState } from 'react';
import { motion } from 'framer-motion';
import { Stylist } from '../types';
import { Star, Scissors } from 'lucide-react';

interface Props { stylist: Stylist; selected: boolean; onSelect: (stylist: Stylist) => void }

export default function StylistCard({ stylist, selected, onSelect }: Props) {
  const [imgError, setImgError] = useState(!stylist.image);
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => onSelect(stylist)}
      className={`w-full text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 ${selected ? 'border-yellow-500 shadow-lg shadow-yellow-600/20' : 'border-neutral-800 hover:border-yellow-700/50 hover:shadow-md'}`}>
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-neutral-800 via-neutral-900 to-neutral-800">
        {!imgError ? (
          <img src={stylist.image} alt={stylist.name} className="w-full h-full object-cover" loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-yellow-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 border border-yellow-700/30"><Scissors className="h-6 w-6" /></div>
              <span className="text-[11px] font-semibold tracking-wide">Salon Stylist</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-2 left-3 right-3"><h4 className="font-semibold text-white text-sm truncate">{stylist.name}</h4></div>
        {selected && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </motion.div>
        )}
      </div>
      <div className="p-3 bg-neutral-900">
        <p className="text-xs text-neutral-500">{stylist.specialty}</p>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><span className="text-xs font-medium text-neutral-300">{stylist.rating}</span></div>
          <span className="text-xs text-neutral-600">{stylist.experience}</span>
        </div>
      </div>
    </motion.button>
  );
}
