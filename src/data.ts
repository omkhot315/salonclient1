import { Service, Stylist, TimeSlot } from './types';

export const services: Service[] = [
  {
    id: 's1',
    name: 'Haircut & Styling',
    category: 'Hair',
    duration: 45,
    price: 699,
    description: 'Precision cut with wash, blow-dry & styling',
    icon: '✂️',
  },
  {
    id: 's2',
    name: 'Hair Coloring',
    category: 'Hair',
    duration: 120,
    price: 3499,
    description: 'Full color, highlights, or balayage',
    icon: '🎨',
  },
  {
    id: 's3',
    name: 'Keratin Treatment',
    category: 'Hair',
    duration: 150,
    price: 5999,
    description: 'Smoothing & frizz-free treatment',
    icon: '✨',
  },
  {
    id: 's4',
    name: 'Bridal Makeup',
    category: 'Makeup',
    duration: 90,
    price: 8999,
    description: 'Complete bridal look with trial session',
    icon: '👰',
  },
  {
    id: 's5',
    name: 'Classic Facial',
    category: 'Skin',
    duration: 60,
    price: 1999,
    description: 'Deep cleanse, exfoliate & hydrate',
    icon: '🧖',
  },
  {
    id: 's6',
    name: 'Manicure & Pedicure',
    category: 'Nails',
    duration: 75,
    price: 999,
    description: 'Nail care, shaping, polish & massage',
    icon: '💅',
  },
  {
    id: 's7',
    name: 'Full Body Massage',
    category: 'Spa',
    duration: 60,
    price: 2499,
    description: 'Relaxing Swedish or deep tissue massage',
    icon: '💆',
  },
  {
    id: 's8',
    name: 'Eyebrow Threading',
    category: 'Beauty',
    duration: 15,
    price: 199,
    description: 'Precise shaping with threading technique',
    icon: '🪡',
  },
];

export const stylists: Stylist[] = [
  {
    id: 'st1',
    name: 'Emma Richardson',
    specialty: 'Hair Styling & Coloring',
    image: 'https://images.pexels.com/photos/29062228/pexels-photo-29062228.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    rating: 4.9,
    experience: '8 years',
  },
  {
    id: 'st2',
    name: 'Sophia Martinez',
    specialty: 'Bridal & Makeup',
    image: 'https://images.pexels.com/photos/30886745/pexels-photo-30886745.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    rating: 4.8,
    experience: '6 years',
  },
  {
    id: 'st3',
    name: 'Olivia Chen',
    specialty: 'Skincare & Facials',
    image: 'https://images.pexels.com/photos/19679199/pexels-photo-19679199.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    rating: 4.7,
    experience: '5 years',
  },
  {
    id: 'st4',
    name: 'Isabella Jones',
    specialty: 'Nails & Spa',
    image: 'https://images.pexels.com/photos/29877719/pexels-photo-29877719.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    rating: 4.9,
    experience: '7 years',
  },
];

export const generateTimeSlots = (date: string): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();
  const selectedDate = new Date(date);
  const isToday = selectedDate.toDateString() === today.toDateString();

  for (let hour = 9; hour <= 19; hour++) {
    for (let min = 0; min < 60; min += 15) {
      if (hour === 19 && min > 0) break;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const available = isToday
        ? hour > today.getHours() || (hour === today.getHours() && min > today.getMinutes())
        : true;
      slots.push({ time: timeStr, available });
    }
  }
  return slots;
};

export const formatTime = (time: string): string => {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
};

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getNextDays = (count: number): { date: string; label: string; day: string }[] => {
  const days = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      label: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      day: dayNames[d.getDay()],
    });
  }
  return days;
};
