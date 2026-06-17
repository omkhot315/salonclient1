const API = import.meta.env.VITE_API_URL || 'https://salonserver1.onrender.com/api';

async function adminFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; message?: string; pagination?: any }> {
  try {
    const res = await fetch(`${API}${endpoint}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message };
    return { success: true, data: json.data, message: json.message, pagination: json.pagination };
  } catch {
    return { success: false, message: 'Network error' };
  }
}

export const adminApi = {
  stats: () => adminFetch('/admin/stats'),
  bookings: (params: Record<string, string> = {}) => {
    const q = new URLSearchParams(params).toString();
    return adminFetch(`/admin/bookings${q ? `?${q}` : ''}`);
  },
  todayBookings: (stylist?: string) => {
    const q = stylist && stylist !== 'all' ? `?stylist=${encodeURIComponent(stylist)}` : '';
    return adminFetch(`/admin/bookings/today${q}`);
  },
  updateStatus: (bookingId: string, status: string) =>
    adminFetch(`/admin/bookings/${bookingId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteBooking: (bookingId: string) =>
    adminFetch(`/admin/bookings/${bookingId}`, { method: 'DELETE' }),

  // Holidays
  getHolidays: (stylistId?: string) => adminFetch(`/admin/holidays${stylistId ? `?stylistId=${stylistId}` : ''}`),
  addHolidays: (stylistId: string, stylistName: string, dates: string[], reason: string, fromTime?: string, toTime?: string) =>
    adminFetch('/admin/holidays', { method: 'POST', body: JSON.stringify({ stylistId, stylistName, dates, reason, fromTime: fromTime || '', toTime: toTime || '' }) }),
  removeHoliday: (id: string) => adminFetch(`/admin/holidays/${id}`, { method: 'DELETE' }),

  // Services CRUD
  getServices: () => adminFetch('/admin/services'),
  addService: (data: any) => adminFetch('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id: string, data: any) => adminFetch(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id: string) => adminFetch(`/admin/services/${id}`, { method: 'DELETE' }),

  // Stylists CRUD
  getStylists: () => adminFetch('/admin/stylists'),
  addStylist: (data: any) => adminFetch('/admin/stylists', { method: 'POST', body: JSON.stringify(data) }),
  updateStylist: (id: string, data: any) => adminFetch(`/admin/stylists/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStylist: (id: string) => adminFetch(`/admin/stylists/${id}`, { method: 'DELETE' }),
};
