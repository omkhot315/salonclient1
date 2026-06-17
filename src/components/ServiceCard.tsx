import { motion } from 'framer-motion';
import { Service } from '../types';
import { Clock } from 'lucide-react';
import { formatPrice } from '../data';

interface Props { service: Service; selected: boolean; onToggle: (service: Service) => void }

export default function ServiceCard({ service, selected, onToggle }: Props) {
  return (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onToggle(service)}
      className={`w-full text-left rounded-2xl p-4 border-2 transition-all duration-300 ${selected ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-600/10' : 'border-neutral-800 bg-neutral-900 hover:border-yellow-700/50 hover:shadow-md'}`}>
      <div className="flex items-start gap-3">
        <div className="text-3xl">{service.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm">{service.name}</h4>
          <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{service.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-neutral-400"><Clock className="w-3 h-3" /> {service.duration} min</span>
            <span className="text-xs font-semibold text-yellow-400">{formatPrice(service.price)}</span>
          </div>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${selected ? 'bg-yellow-500 border-yellow-500' : 'border-neutral-600 bg-transparent'}`}>
          {selected && <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></motion.svg>}
        </div>
      </div>
    </motion.button>
  );
}
