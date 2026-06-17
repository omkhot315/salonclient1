import { motion } from 'framer-motion';
import { Sparkles, Star, Clock, Shield, Award, ChevronRight, Scissors, Heart } from 'lucide-react';

interface Props { onBookNow: () => void }

export default function LandingSection({ onBookNow }: Props) {
  const features = [
    { icon: Sparkles, title: 'AI-Powered Booking', desc: 'Chat with our AI assistant — no forms needed', bg: 'bg-yellow-900/20' },
    { icon: Shield, title: 'Email Verified', desc: 'Secure OTP verification for your safety', bg: 'bg-yellow-900/20' },
    { icon: Clock, title: 'Instant Confirmation', desc: 'Get booking confirmation email immediately', bg: 'bg-yellow-900/20' },
    { icon: Award, title: 'Expert Stylists', desc: 'Handpicked professionals for the best results', bg: 'bg-yellow-900/20' },
  ];
  const stats = [
    { value: '15K+', label: 'Happy Clients' }, { value: '4.9', label: 'Average Rating' },
    { value: '50+', label: 'Expert Stylists' }, { value: '8', label: 'Years of Excellence' },
  ];
  const testimonials = [
    { name: 'Sarah M.', text: 'The AI booking was so easy! No hassle, just chat and done.', rating: 5 },
    { name: 'Emily R.', text: 'Love the instant confirmation. Best salon experience ever!', rating: 5 },
    { name: 'Jessica L.', text: "Emma's coloring skills are unmatched. Will definitely be back!", rating: 5 },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-yellow-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-lg shadow-yellow-600/30"><Scissors className="w-5 h-5 text-black" /></div>
            <span className="text-xl font-bold text-yellow-400" style={{ fontFamily: 'Playfair Display, serif' }}>GlowUp</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-yellow-400 transition-colors">Features</a>
            <a href="#services" className="hover:text-yellow-400 transition-colors">Services</a>
            <a href="#reviews" className="hover:text-yellow-400 transition-colors">Reviews</a>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBookNow}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold shadow-lg shadow-yellow-600/30 hover:shadow-xl transition-shadow">Book Now</motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-600/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-500/10 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-xs font-semibold border border-yellow-600/30">
                <Sparkles className="w-3.5 h-3.5" /> AI-Powered Salon Booking
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                Book Your{' '}<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Perfect Look</span>{' '}with AI
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed max-w-lg">Skip the forms! Chat with our AI assistant to book salon appointments instantly. Email verification & instant confirmation included.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBookNow}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg shadow-xl shadow-yellow-600/30 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Start AI Booking <ChevronRight className="w-5 h-5" />
              </motion.button>
              <div className="grid grid-cols-4 gap-4 pt-6 border-t border-neutral-800">
                {stats.map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-400">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="relative hidden md:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-yellow-700/20">
                <img src="https://content.jdmagicbox.com/v2/comp/mumbai/b7/022pxx22.xx22.221209142228.r7b7/catalogue/looks-unisex-salon-warden-road-mumbai-salons-4mr4en7hod.jpg" alt="GlowUp Salon" className="w-full h-[500px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                    className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 border border-yellow-700/30">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center"><Heart className="w-5 h-5 text-black fill-black" /></div>
                    <div>
                      <p className="text-sm font-bold text-white">Trusted by 15,000+ clients</p>
                      <div className="flex items-center gap-1 mt-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}<span className="text-xs text-neutral-400 ml-1">4.9 rating</span></div>
                    </div>
                  </motion.div>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-neutral-900 rounded-2xl p-3 shadow-xl border border-yellow-700/30">
                <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-400" /></div><div><p className="text-xs font-bold text-white">Verified</p><p className="text-[10px] text-neutral-500">OTP Protected</p></div></div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Why Choose{' '}<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">GlowUp</span></h2>
            <p className="text-neutral-500 mt-3 max-w-lg mx-auto">Experience the future of salon booking with our intelligent AI assistant</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-yellow-700/40 hover:shadow-xl hover:shadow-yellow-600/5 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 border border-yellow-700/20`}><f.icon className="w-6 h-6 text-yellow-400" /></div>
                <h3 className="font-bold text-white mb-1">{f.title}</h3><p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Our{' '}<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Services</span></h2>
            <p className="text-neutral-500 mt-3">Premium beauty services for every need</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '✂️', name: 'Hair Care', price: 'From ₹99', items: ['Haircut', 'Hair Coloring', 'Hair Spa', 'Keratin'] },
              { icon: '🧔', name: 'Grooming', price: 'From ₹149', items: ['Beard Trim', 'Shaving', 'Hair Styling'] },
              { icon: '🧴', name: 'Skin Care', price: 'From ₹599', items: ['Facial', 'Cleanup', 'Detan Treatment'] },
              { icon: '💅', name: 'Nails & Spa', price: 'From ₹399', items: ['Manicure', 'Pedicure', 'Head Massage'] },
            ].map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800 hover:border-yellow-700/40 hover:shadow-xl hover:shadow-yellow-600/5 transition-all duration-300 cursor-pointer group" onClick={onBookNow}>
                <div className="text-4xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-white mb-1">{s.name}</h3>
                <p className="text-sm font-semibold text-yellow-400 mb-3">{s.price}</p>
                <ul className="space-y-1">{s.items.map(item => <li key={item} className="text-xs text-neutral-500 flex items-center gap-1"><div className="w-1 h-1 rounded-full bg-yellow-600" />{item}</li>)}</ul>
                <div className="mt-4 text-xs font-semibold text-yellow-400 flex items-center gap-1 group-hover:gap-2 transition-all">Book Now <ChevronRight className="w-3 h-3" /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Client{' '}<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Reviews</span></h2>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((tm, i) => (
              <motion.div key={tm.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-neutral-900 rounded-2xl p-6 border border-neutral-800">
                <div className="flex gap-0.5 mb-3">{[...Array(tm.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                <p className="text-sm text-neutral-400 leading-relaxed italic">"{tm.text}"</p>
                <p className="text-sm font-bold text-white mt-3">{tm.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/10 rounded-3xl p-10 text-center relative overflow-hidden border border-yellow-700/30">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://content.jdmagicbox.com/v2/comp/mumbai/b7/022pxx22.xx22.221209142228.r7b7/catalogue/looks-unisex-salon-warden-road-mumbai-salons-4mr4en7hod.jpg')] bg-cover bg-center opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ready for Your <span className="text-yellow-400">Glow-Up</span>?</h2>
              <p className="text-neutral-400 mb-8 max-w-md mx-auto">Book your appointment now with our AI assistant. It takes less than 2 minutes!</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBookNow}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-lg shadow-xl shadow-yellow-600/30 hover:shadow-2xl transition-all">✨ Start Booking Now</motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Google Map + Location */}
      <section className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Find{' '}<span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">Us</span></h2>
            <p className="text-neutral-500 mt-3">Visit our salon for the best grooming experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Map */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl overflow-hidden border border-neutral-800 h-[300px] md:h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2!2d73.8567!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEzLjQiTiA3M8KwNTEnMjQuMSJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)' }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                title="GlowUp Salon Location"
              />
            </motion.div>

            {/* Location Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-neutral-900 rounded-2xl p-8 border border-neutral-800 flex flex-col justify-center space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>GlowUp Salon</h3>
                <p className="text-neutral-400 leading-relaxed">123 Beauty Lane, Downtown<br />Pune, Maharashtra 411001<br />India</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-700/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <div><p className="text-xs text-neutral-500">Phone</p><p className="text-sm text-white font-medium">+91 98765 43210</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-700/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div><p className="text-xs text-neutral-500">Email</p><p className="text-sm text-white font-medium">hello@glowupsalon.com</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-700/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div><p className="text-xs text-neutral-500">Working Hours</p><p className="text-sm text-white font-medium">Mon - Sun: 9:00 AM - 7:00 PM</p></div>
                </div>
              </div>

              <a href="https://maps.google.com/?q=18.5204,73.8567" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-sm shadow-lg shadow-yellow-600/30 hover:shadow-xl transition-all w-fit">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Get Directions
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-neutral-800 text-neutral-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8">
            {/* Top row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center"><Scissors className="w-4 h-4 text-black" /></div>
                <span className="text-lg font-bold text-yellow-400" style={{ fontFamily: 'Playfair Display, serif' }}>GlowUp</span>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-yellow-600 hover:bg-yellow-500/10 transition-all group" aria-label="Instagram">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-yellow-600 hover:bg-yellow-500/10 transition-all group" aria-label="Facebook">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-yellow-600 hover:bg-yellow-500/10 transition-all group" aria-label="X (Twitter)">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-yellow-600 hover:bg-yellow-500/10 transition-all group" aria-label="YouTube">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-yellow-600 hover:bg-yellow-500/10 transition-all group" aria-label="WhatsApp">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                <a href="https://maps.google.com/?q=18.5204,73.8567" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-yellow-600 hover:bg-yellow-500/10 transition-all group" aria-label="Google Maps">
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-yellow-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-800">
              <p className="text-sm text-neutral-600">© 2026 GlowUp Salon. All rights reserved.</p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-yellow-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-yellow-400 transition-colors">Contact</a>
                <a href="#/admin" className="hover:text-yellow-400 transition-colors">Admin</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
