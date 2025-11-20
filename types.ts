export enum ServiceType {
  EXPRESS = 'Экспресс',
  STANDARD = 'Стандарт',
  PREMIUM = 'Премиум',
  CERAMIC = 'Керамика'
}

export enum BookingStatus {
  PENDING = 'Ожидает',
  COMPLETED = 'Завершен',
  CANCELLED = 'Отменен'
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  type: ServiceType;
  imageUrl: string;
}

export interface Client {
  tgId?: number; // Unique Telegram User ID
  username?: string;
  phone: string;
  name: string;
  plateNumber: string;
  visits: number;
  isVIP: boolean;
}

export interface Booking {
  id: string;
  tgId?: number; // Link to Telegram User
  serviceId: string;
  date: string; // ISO Date string YYYY-MM-DD
  timeSlot: string; // HH:mm
  clientPhone: string;
  plateNumber: string;
  status: BookingStatus;
  isFreeWash: boolean;
  createdAt: number;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  BOOKING = 'BOOKING',
  PROFILE = 'PROFILE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  ADMIN_BOOKINGS = 'ADMIN_BOOKINGS',
  ADMIN_CLIENTS = 'ADMIN_CLIENTS'
}

// Extend Window interface for Telegram
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      }
    }
  }
}