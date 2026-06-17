import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, RotateCcw } from 'lucide-react';

interface Props { email: string; onVerify: (otp: string) => void; onResend: () => void; error: string }

export default function OTPInput({ email, onVerify, onResend, error }: Props) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);
  useEffect(() => { if (timer > 0) { const i = setInterval(() => setTimer(t => t - 1), 1000); return () => clearInterval(i); } }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const n = [...otp]; n[index] = value; setOtp(n);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (n.every(d => d !== '')) onVerify(n.join(''));
  };
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => { if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus(); };
  const handleResend = () => { setOtp(['', '', '', '', '', '']); setTimer(30); onResend(); inputRefs.current[0]?.focus(); };
  const maskedEmail = email.replace(/(.{2})(.*)(@)/, (_, a, b, c) => a + '*'.repeat(b.length) + c);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-yellow-400"><ShieldCheck className="w-5 h-5" /><span className="text-sm font-medium">Email Verification</span></div>
      <p className="text-xs text-neutral-400">We've sent a 6-digit OTP to <span className="font-semibold text-neutral-200">{maskedEmail}</span></p>
      <div className="flex gap-2 justify-center">
        {otp.map((digit, i) => (
          <motion.input key={i} ref={el => { inputRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`w-10 h-12 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-neutral-800 ${error ? 'border-red-500 text-red-400 animate-pulse' : digit ? 'border-yellow-500 text-yellow-400' : 'border-neutral-700 text-white focus:border-yellow-500'}`} />
        ))}
      </div>
      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 text-center">{error}</motion.p>}
      <div className="text-center">
        {timer > 0 ? <p className="text-xs text-neutral-500">Resend OTP in <span className="font-semibold text-yellow-400">{timer}s</span></p>
          : <button onClick={handleResend} className="flex items-center gap-1 mx-auto text-xs font-medium text-yellow-400 hover:text-yellow-300 transition-colors"><RotateCcw className="w-3 h-3" />Resend OTP</button>}
      </div>
    </div>
  );
}
