import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, ArrowRight } from 'lucide-react';
import { Message, BookingData, ConversationStep, Service, Stylist, TimeSlot, getTotalDuration, getTotalPrice } from '../types';
import { generateTimeSlots, formatTime, formatPrice } from '../data';
import { otpService, bookingService, catalogService } from '../services/api';
import ServiceCard from './ServiceCard';
import StylistCard from './StylistCard';
import CalendarPicker from './CalendarPicker';
import TimeSlotPicker from './TimeSlotPicker';
import OTPInput from './OTPInput';
import BookingSummary from './BookingSummary';
import ConfirmationCard from './ConfirmationCard';
import { SkeletonServiceCard, SkeletonCard, Spinner } from './LoadingSpinner';
import t, { Lang } from '../i18n';

const initialBooking: BookingData = {
  name: '', email: '', phone: '', services: [], stylist: null, date: '', time: '', notes: '',
};

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<ConversationStep>('language');
  const [booking, setBooking] = useState<BookingData>({ ...initialBooking });
  const [isTyping, setIsTyping] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookingId, setBookingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const [lang, setLang] = useState<Lang>('en');
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [stylistHolidayDates, setStylistHolidayDates] = useState<string[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [slotError, setSlotError] = useState('');
  const slotRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentBookingRef = useRef<BookingData>({ ...initialBooking });

  useEffect(() => {
    setCatalogLoading(true);
    Promise.all([
      catalogService.getServices().then(r => { if (r.success && r.data) setServices((r.data as any).data || r.data as Service[]); }),
      catalogService.getStylists().then(r => { if (r.success && r.data) setStylists((r.data as any).data || r.data as Stylist[]); }),
    ]).finally(() => setCatalogLoading(false));
  }, []);

  // Cleanup auto-refresh interval on unmount
  useEffect(() => {
    return () => { if (slotRefreshRef.current) clearInterval(slotRefreshRef.current); };
  }, []);

  const scrollToBottom = () => { setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100); };

  const addBotMessage = useCallback((content: string, component?: Message['component'], data?: any, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), type: 'bot', content, timestamp: new Date(), component, data }]);
      scrollToBottom();
    }, delay);
  }, []);

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString() + Math.random(), type: 'user', content, timestamp: new Date() }]);
    scrollToBottom();
  };

  // ── Init — show language selector ──
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    addBotMessage(t.langPrompt.en, 'langSelect', null, 500);
  }, [addBotMessage]);

  // ── Language selected → show greetings ──
  const handleLangSelect = async (chosen: Lang) => {
    setLang(chosen);
    addUserMessage(chosen === 'en' ? '🇬🇧 English' : '🇮🇳 मराठी');
    const greets = t.greetings[chosen];
    for (let i = 0; i < greets.length; i++) {
      await new Promise<void>(res => {
        setTimeout(() => {
          setMessages(prev => [...prev, { id: `greet-${i}`, type: 'bot', content: greets[i], timestamp: new Date() }]);
          scrollToBottom();
          res();
        }, (i + 1) * 700);
      });
    }
    setStep('name');
  };

  // ── Process text input ──
  const processInput = async (userInput: string) => {
    const trimmed = userInput.trim();
    if (!trimmed && step !== 'notes') return;

    switch (step) {
      case 'name': {
        if (trimmed.length < 2) { addBotMessage(t.nameShort[lang]); return; }
        addUserMessage(trimmed);
        setBooking(prev => ({ ...prev, name: trimmed }));
        setStep('service');
        addBotMessage(t.nameGreet[lang](trimmed), 'services');
        break;
      }
      case 'email': {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { addBotMessage(t.invalidEmail[lang]); return; }
        addUserMessage(trimmed);
        setBooking(prev => ({ ...prev, email: trimmed }));
        setIsLoading(true);
        const result = await otpService.send(trimmed, booking.name);
        setIsLoading(false);
        if (result.success) {
          setStep('otp');
          addBotMessage(t.otpSent[lang](trimmed), 'otp', { email: trimmed });
        } else {
          addBotMessage(`${result.message || t.otpFail[lang]}\n\n${lang === 'mr' ? 'कृपया पुन्हा प्रयत्न करा.' : 'Please try again or use a different email.'}`);
        }
        break;
      }
      case 'phone': {
        const phoneClean = trimmed.replace(/[\s\-\(\)]/g, '');
        if (phoneClean.length < 10 || !/^\+?\d+$/.test(phoneClean)) { addBotMessage(t.invalidPhone[lang]); return; }
        addUserMessage(trimmed);
        const updatedBooking = { ...booking, phone: trimmed, notes: '' };
        setBooking(updatedBooking);
        setStep('summary');
        addBotMessage(t.summary[lang], 'summary', updatedBooking);
        break;
      }
      default: break;
    }
    setInput('');
  };

  // ── Service toggle ──
  const handleServiceToggle = (service: Service) => {
    if (step !== 'service') return;
    setBooking(prev => {
      const exists = prev.services.find(s => s.id === service.id);
      return exists ? { ...prev, services: prev.services.filter(s => s.id !== service.id) } : { ...prev, services: [...prev.services, service] };
    });
  };

  const handleServicesDone = () => {
    if (booking.services.length === 0) return;
    const names = booking.services.map(s => `${s.icon} ${s.name}`).join('\n');
    addUserMessage(`${names}\n\n⏱ ${getTotalDuration(booking.services)} min · ${formatPrice(getTotalPrice(booking.services))}`);
    setStep('stylist');
    addBotMessage(t.servicesDone[lang](booking.services.length), 'stylists');
  };

  const handleStylistSelect = async (stylist: Stylist) => {
    if (step !== 'stylist') return;
    addUserMessage(`👤 ${stylist.name}`);
    setBooking(prev => ({ ...prev, stylist }));
    const hRes = await catalogService.getStylistHolidays(stylist.id);
    if (hRes.success && hRes.data) {
      const hd = (hRes.data as any).data || hRes.data;
      // Only full-day holidays disable the date in calendar; partial holidays are handled by time slots
      setStylistHolidayDates((hd as any[]).filter((h: any) => h.isFullDay).map((h: any) => h.date));
    } else { setStylistHolidayDates([]); }
    setStep('date');
    addBotMessage(t.stylistSelected[lang](stylist.name), 'calendar');
  };

  const handleDateSelect = async (date: string) => {
    if (step !== 'date') return;
    const dateObj = new Date(date + 'T00:00:00');
    const formatted = dateObj.toLocaleDateString(lang === 'mr' ? 'mr-IN' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    addUserMessage(`📅 ${formatted}`);
    setBooking(prev => {
      const updated = { ...prev, date };
      currentBookingRef.current = updated;
      return updated;
    });
    const totalDuration = getTotalDuration(booking.services);
    const result = await bookingService.getAvailability(date, booking.stylist?.id, totalDuration);
    if (result.success && result.data && (result.data as any).stylistOnHoliday) {
      const reason = (result.data as any).holidayReason;
      setBooking(prev => {
        const updated = { ...prev, date: '' };
        currentBookingRef.current = updated;
        return updated;
      });
      addBotMessage(t.holidayMsg[lang](booking.stylist?.name || '', formatted, reason), 'calendar');
      return;
    }
    let slots: TimeSlot[];
    if (result.success && result.data) { slots = (result.data as any).slots; } else { slots = generateTimeSlots(date); }
    setTimeSlots(slots);
    setSlotError('');
    setStep('time');
    addBotMessage(t.dateSelected[lang](totalDuration), 'timeslots', slots);

    // Start auto-refresh every second while user is picking a time
    if (slotRefreshRef.current) clearInterval(slotRefreshRef.current);
    slotRefreshRef.current = setInterval(async () => {
      const b = currentBookingRef.current;
      if (!b.date || !b.stylist) return;
      const dur = getTotalDuration(b.services);
      const r = await bookingService.getAvailability(b.date, b.stylist?.id, dur);
      if (r.success && r.data) {
        setTimeSlots((r.data as any).slots);
      }
    }, 1000);
  };

  const handleTimeSelect = (time: string) => {
    if (step !== 'time') return;
    // Stop auto-refresh once a time is selected
    if (slotRefreshRef.current) { clearInterval(slotRefreshRef.current); slotRefreshRef.current = null; }
    setSlotError('');
    addUserMessage(`🕐 ${formatTime(time)}`);
    setBooking(prev => {
      const updated = { ...prev, time };
      currentBookingRef.current = updated;
      return updated;
    });
    setStep('email');
    addBotMessage(t.askEmail[lang]);
  };

  const handleOTPVerify = async (enteredOtp: string) => {
    setIsLoading(true);
    const result = await otpService.verify(booking.email, enteredOtp);
    setIsLoading(false);
    if (result.success) { setOtpError(''); addUserMessage('✅ OTP Verified'); setStep('phone'); addBotMessage(t.otpVerified[lang]); }
    else { setOtpError(result.message || 'Invalid OTP'); }
  };

  const handleOTPResend = async () => {
    setIsLoading(true);
    const result = await otpService.resend(booking.email, booking.name);
    setIsLoading(false);
    if (result.success) { setOtpError(''); addBotMessage(t.otpResent[lang]); }
    else { addBotMessage(result.message || 'Failed'); }
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    if (booking.services.length > 0 && booking.stylist) {
      const result = await bookingService.create({
        name: booking.name, email: booking.email, phone: booking.phone,
        services: booking.services.map(s => ({ id: s.id, name: s.name, category: s.category, duration: s.duration, price: s.price, icon: s.icon })),
        stylist: { id: booking.stylist.id, name: booking.stylist.name, specialty: booking.stylist.specialty },
        date: booking.date, time: booking.time, notes: booking.notes,
      });
      setIsLoading(false);
      if (result.success && result.data) {
        const rd = result.data as any;
        const id = rd.data?.bookingId || rd.bookingId;
        setBookingId(id); setStep('confirmed'); addUserMessage('✅ Confirmed!');
        const emailSent = rd.data?.confirmationEmailSent || rd.confirmationEmailSent;
        addBotMessage(t.confirmed[lang](emailSent), 'confirmed', { booking, bookingId: id });
      } else {
        const rd = result.data as any;
        const isSlotTaken = rd?.slotTaken || (result as any)?.slotTaken;
        if (isSlotTaken) {
          // Slot was taken — go back to time selection with error
          setSlotError(`⚠️ Sorry! The slot at ${formatTime(booking.time)} was just booked by someone else. Please choose a different time.`);
          const totalDuration = getTotalDuration(booking.services);
          const avail = await bookingService.getAvailability(booking.date, booking.stylist?.id, totalDuration);
          let freshSlots: TimeSlot[];
          if (avail.success && avail.data) { freshSlots = (avail.data as any).slots; } else { freshSlots = generateTimeSlots(booking.date); }
          setTimeSlots(freshSlots);
          setBooking(prev => { const updated = { ...prev, time: '' }; currentBookingRef.current = updated; return updated; });
          setStep('time');
          addBotMessage(`⚠️ That time slot (${formatTime(booking.time)}) was just taken by another booking!\n\nPlease select a different available time slot.`, 'timeslots', freshSlots);
          // Restart auto-refresh
          if (slotRefreshRef.current) clearInterval(slotRefreshRef.current);
          slotRefreshRef.current = setInterval(async () => {
            const b = currentBookingRef.current;
            if (!b.date || !b.stylist) return;
            const dur = getTotalDuration(b.services);
            const r = await bookingService.getAvailability(b.date, b.stylist?.id, dur);
            if (r.success && r.data) setTimeSlots((r.data as any).slots);
          }, 1000);
        } else {
          addBotMessage(`${result.message || t.confirmFail[lang]}\n\n${lang === 'mr' ? 'कृपया पुन्हा प्रयत्न करा.' : 'Please try again.'}`);
        }
      }
    }
  };

  const handleStartOver = () => {
    if (slotRefreshRef.current) { clearInterval(slotRefreshRef.current); slotRefreshRef.current = null; }
    setMessages([]); setBooking({ ...initialBooking }); currentBookingRef.current = { ...initialBooking }; setStep('language'); setInput('');
    setOtpError(''); setSlotError(''); setTimeSlots([]); setStylistHolidayDates([]); setBookingId('');
    hasInitialized.current = false;
    // Re-show language selector
    setTimeout(() => {
      hasInitialized.current = true;
      addBotMessage(t.langPrompt.en, 'langSelect', null, 300);
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); processInput(input); };
  const showInput = ['name', 'email', 'phone'].includes(step);
  const ph = t.placeholders[lang];

  return (
    <div className="flex flex-col h-full bg-neutral-950">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3 }}
              className={`flex gap-2 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.type === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-600/20"><Bot className="w-4 h-4 text-black" /></div>
              )}
              <div className={`max-w-[85%] ${msg.type === 'user' ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black rounded-2xl rounded-br-md px-4 py-2.5 shadow-md' : 'space-y-3'}`}>
                {msg.type === 'user' ? (
                  <p className="text-sm whitespace-pre-wrap font-medium">{msg.content}</p>
                ) : (
                  <>
                    <div className="bg-neutral-900 rounded-2xl rounded-bl-md px-4 py-2.5 shadow-sm border border-neutral-800">
                      <p className="text-sm text-neutral-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>

                    {/* ── Language selector ── */}
                    {msg.component === 'langSelect' && step === 'language' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 mt-2">
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleLangSelect('en')}
                          className="flex-1 py-3 rounded-2xl bg-neutral-800 border-2 border-neutral-700 hover:border-yellow-500 shadow-sm text-center transition-all">
                          <span className="text-2xl block mb-1">🇬🇧</span>
                          <span className="text-sm font-semibold text-white">English</span>
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => handleLangSelect('mr')}
                          className="flex-1 py-3 rounded-2xl bg-neutral-800 border-2 border-neutral-700 hover:border-yellow-500 shadow-sm text-center transition-all">
                          <span className="text-2xl block mb-1">🇮🇳</span>
                          <span className="text-sm font-semibold text-white">मराठी</span>
                        </motion.button>
                      </motion.div>
                    )}

                    {/* ── Services ── */}
                    {msg.component === 'services' && step === 'service' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 mt-2">
                        {catalogLoading
                          ? Array.from({ length: 3 }).map((_, i) => <SkeletonServiceCard key={i} />)
                          : services.map(s => <ServiceCard key={s.id} service={s} selected={booking.services.some(sel => sel.id === s.id)} onToggle={handleServiceToggle} />)
                        }
                        {!catalogLoading && booking.services.length > 0 && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-500/10 border border-yellow-700/30 rounded-2xl p-3 space-y-2">
                            <div className="flex items-center justify-between text-xs font-medium text-yellow-400">
                              <span>{t.selectedCount[lang](booking.services.length)}</span>
                              <span>⏱ {getTotalDuration(booking.services)} min · {formatPrice(getTotalPrice(booking.services))}</span>
                            </div>
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleServicesDone}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold shadow-lg shadow-yellow-600/30 flex items-center justify-center gap-2">
                              {t.continueBtn[lang]} <ArrowRight className="w-4 h-4" />
                            </motion.button>
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {msg.component === 'stylists' && step === 'stylist' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2 mt-2">
                        {catalogLoading
                          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
                          : stylists.map(s => <StylistCard key={s.id} stylist={s} selected={booking.stylist?.id === s.id} onSelect={handleStylistSelect} />)
                        }
                      </motion.div>
                    )}

                    {msg.component === 'calendar' && step === 'date' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 rounded-2xl p-3 shadow-sm border border-neutral-800 mt-2">
                        <CalendarPicker selectedDate={booking.date} onSelect={handleDateSelect} disabledDates={stylistHolidayDates} />
                      </motion.div>
                    )}

                    {msg.component === 'timeslots' && step === 'time' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 rounded-2xl p-3 shadow-sm border border-neutral-800 mt-2">
                        {slotError && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="mb-3 px-3 py-2.5 rounded-xl bg-red-900/40 border border-red-600/50 text-red-300 text-xs font-medium flex items-start gap-2">
                            <span className="text-base leading-none">⚠️</span>
                            <span>{slotError}</span>
                          </motion.div>
                        )}
                        <TimeSlotPicker slots={timeSlots} selectedTime={booking.time} onSelect={handleTimeSelect} />
                      </motion.div>
                    )}

                    {msg.component === 'otp' && step === 'otp' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-neutral-900 rounded-2xl p-4 shadow-sm border border-neutral-800 mt-2">
                        <OTPInput email={booking.email} onVerify={handleOTPVerify} onResend={handleOTPResend} error={otpError} />
                      </motion.div>
                    )}

                    {msg.component === 'summary' && step === 'summary' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                        <BookingSummary booking={booking} onConfirm={handleConfirmBooking} onEdit={handleStartOver} />
                      </motion.div>
                    )}

                    {msg.component === 'confirmed' && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
                        <ConfirmationCard booking={booking} bookingId={msg.data?.bookingId || bookingId} />
                        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStartOver}
                          className="w-full mt-3 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold shadow-lg shadow-yellow-600/30">
                          {t.bookAnother[lang]}
                        </motion.button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
              {msg.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center flex-shrink-0 shadow-md"><User className="w-4 h-4 text-black" /></div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {(isTyping || isLoading) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-600/20"><Bot className="w-4 h-4 text-black" /></div>
              <div className="bg-neutral-900 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-neutral-800">
                <div className="flex gap-1.5">{[0, 1, 2].map(i => <motion.div key={i} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }} className="w-2 h-2 rounded-full bg-yellow-500" />)}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-neutral-800 bg-neutral-900 px-4 py-3">
        {showInput ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} disabled={isLoading}
              placeholder={step === 'name' ? ph.name : step === 'email' ? ph.email : step === 'phone' ? ph.phone : ph.default}
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent placeholder:text-neutral-500 disabled:opacity-50" />
            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-black flex items-center justify-center shadow-lg shadow-yellow-600/30 disabled:opacity-50">
              <Send className="w-5 h-5" />
            </motion.button>
          </form>
        ) : (
          <div className="flex items-center gap-2 text-neutral-500 text-sm justify-center py-2">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>
              {step === 'confirmed' ? t.bottomBar[lang].confirmed
                : step === 'language' ? t.bottomBar[lang].selectLang
                : isLoading ? t.bottomBar[lang].processing
                : step === 'service' ? t.bottomBar[lang].selectService
                : t.bottomBar[lang].selectOption}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
