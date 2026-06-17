export interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // minutes
  price: number;
  description: string;
  icon: string;
}

export interface Stylist {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingData {
  name: string;
  email: string;
  phone: string;
  services: Service[];
  stylist: Stylist | null;
  date: string;
  time: string;
  notes: string;
}

export interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  options?: ChatOption[];
  component?: 'langSelect' | 'services' | 'stylists' | 'calendar' | 'timeslots' | 'otp' | 'summary' | 'confirmed';
  data?: any;
}

export interface ChatOption {
  label: string;
  value: string;
}

export type ConversationStep =
  | 'language'
  | 'greeting'
  | 'name'
  | 'service'
  | 'stylist'
  | 'date'
  | 'time'
  | 'email'
  | 'otp'
  | 'phone'
  | 'notes'
  | 'summary'
  | 'confirmed';

// Helper to compute totals from selected services
export const getTotalDuration = (services: Service[]): number =>
  services.reduce((sum, s) => sum + s.duration, 0);

export const getTotalPrice = (services: Service[]): number =>
  services.reduce((sum, s) => sum + s.price, 0);
