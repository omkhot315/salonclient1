import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Scissors, Sparkles } from 'lucide-react';
import ChatAssistant from './components/ChatAssistant';
import LandingSection from './components/LandingSection';
import AdminDashboard from './admin/AdminDashboard';

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => { const c = () => setIsAdmin(window.location.hash === '#/admin'); c(); window.addEventListener('hashchange', c); return () => window.removeEventListener('hashchange', c); }, []);
  if (isAdmin) return <AdminDashboard />;
  const handleBookNow = () => { setChatOpen(true); setHasInteracted(true); };

  return (
    <div className="relative min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <LandingSection onBookNow={handleBookNow} />

      <AnimatePresence>
        {!chatOpen && (
          <motion.button initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleBookNow}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 text-black flex items-center justify-center shadow-2xl shadow-yellow-600/40 hover:shadow-yellow-500/50 transition-shadow group">
            <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
            {!hasInteracted && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} className="absolute -top-2 -right-2">
                <span className="relative flex h-5 w-5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" /><span className="relative inline-flex rounded-full h-5 w-5 bg-yellow-500 text-black text-[10px] font-bold items-center justify-center">1</span></span>
              </motion.div>
            )}
            {!hasInteracted && (
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 3 }}
                className="absolute right-20 bg-black text-yellow-400 text-xs font-medium px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-yellow-700/50">
                ✨ Book with AI Assistant!
                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-yellow-700/50" />
              </motion.div>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setChatOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
            <motion.div initial={{ opacity: 0, y: 100, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-[420px] h-[100dvh] md:h-[680px] md:rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-yellow-700/30 flex flex-col bg-neutral-950">
              <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-yellow-700/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-600/30"><Scissors className="w-5 h-5 text-black" /></div>
                  <div>
                    <h3 className="text-yellow-400 font-bold text-sm flex items-center gap-1.5">GlowUp AI Assistant <Sparkles className="w-3.5 h-3.5" /></h3>
                    <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-neutral-400 text-xs">Online • Ready to help</span></div>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-neutral-300"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 overflow-hidden"><ChatAssistant /></div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
