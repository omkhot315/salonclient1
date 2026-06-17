import { motion } from 'framer-motion';
import { BookingData, getTotalDuration, getTotalPrice } from '../types';
import { formatTime, formatPrice } from '../data';
import { CheckCircle2, CalendarDays, Clock, MapPin, Mail, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';

// ── Download receipt as real PDF ──
const downloadReceipt = (booking: BookingData, bookingId: string) => {
  const dateObj = new Date(booking.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const time = formatTime(booking.time);
  const totalDuration = getTotalDuration(booking.services);
  const totalPrice = getTotalPrice(booking.services);

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  let y = 0;

  // ── Header band ──
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, W, 44, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('GlowUp Salon', W / 2, 18, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Your Beauty Destination', W / 2, 26, { align: 'center' });
  doc.setFontSize(9);
  doc.text('BOOKING RECEIPT', W / 2, 38, { align: 'center' });

  y = 56;

  // ── Booking ID badge ──
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(60, y - 6, W - 120, 20, 4, 4, 'F');
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(60, y - 6, W - 120, 20, 4, 4, 'S');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14);
  doc.setFont('helvetica', 'normal');
  doc.text('BOOKING ID', W / 2, y + 1, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('courier', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(bookingId, W / 2, y + 10, { align: 'center' });
  y += 28;

  // ── Confirmed badge ──
  doc.setFillColor(220, 252, 231);
  doc.roundedRect(20, y - 5, W - 40, 12, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(22, 101, 52);
  doc.text('CONFIRMED', W / 2, y + 3, { align: 'center' });
  y += 20;

  // ── Helper: section title ──
  const sectionTitle = (title: string) => {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 114, 128);
    doc.text(title, 24, y);
    y += 2;
    doc.setDrawColor(229, 231, 235);
    doc.line(24, y, W - 24, y);
    y += 7;
  };

  // ── Helper: row ──
  const row = (label: string, value: string) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(label, 28, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text(value, W - 28, y, { align: 'right' });
    y += 7;
  };

  // ── Customer Info ──
  sectionTitle('CUSTOMER INFORMATION');
  row('Name', booking.name);
  row('Email', booking.email);
  row('Phone', booking.phone);
  y += 4;

  // ── Services (multi) ──
  sectionTitle(`SERVICES (${booking.services.length})`);
  booking.services.forEach((s) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    doc.text(`${s.name}`, 28, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text(`Rs.${s.price.toLocaleString('en-IN')}  (${s.duration} min)`, W - 28, y, { align: 'right' });
    y += 7;
  });
  y += 4;

  // ── Appointment ──
  sectionTitle('APPOINTMENT');
  row('Stylist', booking.stylist?.name || '');
  row('Date', formattedDate);
  row('Time', time);
  row('Total Duration', `${totalDuration} minutes`);
  y += 4;

  // ── Notes ──
  if (booking.notes) {
    sectionTitle('SPECIAL NOTES');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    doc.text(booking.notes, 28, y, { maxWidth: W - 56 });
    y += 10;
  }

  // ── Price box ──
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(20, y, W - 40, 22, 4, 4, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL AMOUNT', W / 2, y + 8, { align: 'center' });
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs.${totalPrice.toLocaleString('en-IN')}`, W / 2, y + 18, { align: 'center' });
  y += 32;

  // ── Location ──
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(20, y, W - 40, 28, 4, 4, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175);
  doc.text('SALON LOCATION', 28, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(59, 130, 246);
  doc.text('GlowUp Salon', 28, y + 15);
  doc.text('123 Beauty Lane, Downtown, City, State 12345', 28, y + 21);
  doc.text('Phone: (555) 123-4567', 28, y + 27);
  y += 36;

  // ── Important ──
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(20, y, W - 40, 24, 4, 4, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('IMPORTANT', 28, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(127, 29, 29);
  doc.text('Please arrive 10 minutes before your appointment', 28, y + 13);
  doc.text('Cancel or reschedule at least 24 hours in advance', 28, y + 18);
  doc.text('Bring this receipt for reference', 28, y + 23);
  y += 32;

  // ── Footer ──
  doc.setDrawColor(229, 231, 235);
  doc.line(20, y, W - 20, y);
  y += 8;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('© 2026 GlowUp Salon. All rights reserved.', W / 2, y, { align: 'center' });
  doc.text('Thank you for choosing us!', W / 2, y + 5, { align: 'center' });

  doc.save(`GlowUp-Receipt-${bookingId}.pdf`);
};

// ── Component ──
interface Props {
  booking: BookingData;
  bookingId: string;
}

export default function ConfirmationCard({ booking, bookingId }: Props) {
  const [showConfetti, setShowConfetti] = useState(true);
  const totalDuration = getTotalDuration(booking.services);
  const totalPrice = getTotalPrice(booking.services);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const dateObj = new Date(booking.date + 'T00:00:00');
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
                y: -20, rotate: 0, scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 20, rotate: Math.random() * 720 - 360 }}
              transition={{ duration: Math.random() * 2 + 2, delay: Math.random() * 1, ease: 'easeIn' }}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: ['#eab308', '#facc15', '#fef08a', '#ca8a04', '#a16207', '#fbbf24'][Math.floor(Math.random() * 6)] }}
            />
          ))}
        </div>
      )}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="bg-neutral-900 rounded-2xl p-5 border border-yellow-700/30 text-center space-y-3"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
          <CheckCircle2 className="w-14 h-14 text-yellow-400 mx-auto" />
        </motion.div>

        <div>
          <h3 className="text-lg font-bold text-white">Booking Confirmed! 🎉</h3>
          <p className="text-xs text-neutral-400 mt-1">Booking ID: <span className="font-mono font-bold text-yellow-400">{bookingId}</span></p>
        </div>

        {/* Services list */}
        <div className="bg-neutral-800 rounded-xl p-4 space-y-2.5 text-left">
          {booking.services.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span className="font-medium text-neutral-200">{s.icon} {s.name}</span>
              <span className="text-xs text-yellow-400 font-semibold">{formatPrice(s.price)} · {s.duration}m</span>
            </div>
          ))}
          <div className="border-t border-neutral-700 pt-2 flex items-center justify-between text-sm font-bold">
            <span className="text-white">Total</span>
            <span className="text-yellow-400">{formatPrice(totalPrice)} · {totalDuration} min</span>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-xl p-4 space-y-2 text-left">
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <CalendarDays className="w-4 h-4 text-yellow-500" />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <Clock className="w-4 h-4 text-yellow-500" />
            {formatTime(booking.time)}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-300">
            <MapPin className="w-4 h-4 text-yellow-500" />
            GlowUp Salon, Downtown
          </div>
        </div>

        <div className="flex items-center gap-2 bg-yellow-500/10 rounded-xl p-3 border border-yellow-700/30">
          <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <p className="text-xs text-yellow-300/80">
            Confirmation email sent to <span className="font-semibold text-yellow-400">{booking.email}</span>
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => downloadReceipt(booking, bookingId)}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-600/30 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Receipt (PDF)
        </motion.button>
      </motion.div>
    </div>
  );
}
