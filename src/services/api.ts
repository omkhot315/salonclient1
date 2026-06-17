// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://salonserver1.onrender.com/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
        error: data.error,
        data: data, // pass full error body so callers can check slotTaken etc.
      } as any;
    }

    return {
      success: true,
      data,
      message: data.message,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// OTP Services
export const otpService = {
  // Send OTP to email
  send: async (email: string, name: string) => {
    return fetchAPI<{ devOtp?: string }>('/otp/send', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  },

  // Verify OTP
  verify: async (email: string, otp: string) => {
    return fetchAPI<{ verified: boolean; attemptsLeft?: number }>('/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Resend OTP
  resend: async (email: string, name: string) => {
    return fetchAPI<{ devOtp?: string }>('/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  },
};

// Booking Services
export interface BookingPayload {
  name: string;
  email: string;
  phone: string;
  services: {
    id: string;
    name: string;
    category: string;
    duration: number;
    price: number;
    icon: string;
  }[];
  stylist: {
    id: string;
    name: string;
    specialty: string;
  };
  date: string;
  time: string;
  notes?: string;
}

export interface BookingResponse {
  bookingId: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  price: number;
  confirmationEmailSent: boolean;
}

export const bookingService = {
  // Create a new booking
  create: async (booking: BookingPayload) => {
    return fetchAPI<{ data: BookingResponse }>('/booking/create', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  // Get booking by ID
  getById: async (bookingId: string) => {
    return fetchAPI(`/booking/${bookingId}`);
  },

  // Get bookings by email
  getByEmail: async (email: string) => {
    return fetchAPI(`/booking/email/${email}`);
  },

  // Cancel booking
  cancel: async (bookingId: string) => {
    return fetchAPI(`/booking/${bookingId}/cancel`, {
      method: 'PATCH',
    });
  },

  // Get availability for a date
  getAvailability: async (date: string, stylistId?: string, duration?: number) => {
    const params = new URLSearchParams();
    if (stylistId) params.append('stylistId', stylistId);
    if (duration) params.append('duration', duration.toString());
    // Send user's current time in HH:MM so server can filter past slots regardless of server timezone
    const now = new Date();
    params.append('clientDate', `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`);
    params.append('clientTime', `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI(`/booking/availability/${date}${query}`);
  },
};

// Catalog (public)
export const catalogService = {
  getServices: () => fetchAPI('/booking/services'),
  getStylists: () => fetchAPI('/booking/stylists'),
  getStylistHolidays: (stylistId: string) => fetchAPI(`/booking/stylist-holidays/${stylistId}`),
};

// Health check
export const healthCheck = async () => {
  return fetchAPI('/health');
};

export default {
  otp: otpService,
  booking: bookingService,
  catalog: catalogService,
  healthCheck,
};
