import { Booking, Client, BookingStatus } from '../types';
import { ROOT_ADMIN_IDS, DEFAULT_BOT_TOKEN, DEFAULT_CHANNEL_ID } from '../constants';

const KEYS = {
  BOOKINGS: 'turboclean_bookings',
  CLIENTS: 'turboclean_clients',
  SETTINGS: 'turboclean_settings'
};

export interface AppSettings {
  startHour: number;
  endHour: number;
  slotDuration: number; // in minutes
  postsCount: number; // how many cars can be washed simultaneously
  additionalAdminIds: number[]; // IDs added via UI
  botToken: string;
  channelId: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  startHour: 9,
  endHour: 21,
  slotDuration: 30,
  postsCount: 2, // Default 2 washing bays
  additionalAdminIds: [],
  botToken: DEFAULT_BOT_TOKEN, // Loaded from constants.ts
  channelId: DEFAULT_CHANNEL_ID // Loaded from constants.ts
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  if (!data) return DEFAULT_SETTINGS;
  
  const parsed = JSON.parse(data);
  // Merge with default to ensure new fields exist if local storage is old
  // Also helps if constants changed and we want to enforce them on fresh reload if needed,
  // but usually we prioritize what's in storage so admin can change it at runtime.
  // To force update defaults, we would need a version migration, but for now:
  return { ...DEFAULT_SETTINGS, ...parsed };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(KEYS.BOOKINGS);
  return data ? JSON.parse(data) : [];
};

export const getUserBookings = (client: Client): Booking[] => {
  const allBookings = getBookings();
  // Sort by newest first
  return allBookings
    .filter(b => {
      // Match by Telegram ID if available, otherwise fallback to phone
      if (client.tgId && b.tgId === client.tgId) return true;
      return b.clientPhone === client.phone;
    })
    .sort((a, b) => b.createdAt - a.createdAt);
};

// Deprecated: kept for compatibility if needed, but getUserBookings is preferred
export const getBookingsByPhone = (phone: string): Booking[] => {
  const allBookings = getBookings();
  return allBookings
    .filter(b => b.clientPhone === phone)
    .sort((a, b) => b.createdAt - a.createdAt);
};

export const saveBooking = (booking: Booking): void => {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
};

export const updateBookingStatus = (id: string, status: BookingStatus): void => {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  }
};

export const getClients = (): Client[] => {
  const data = localStorage.getItem(KEYS.CLIENTS);
  return data ? JSON.parse(data) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  
  // Try to find by TgId first, then by Phone
  let index = -1;
  
  if (client.tgId) {
    index = clients.findIndex(c => c.tgId === client.tgId);
  }
  
  if (index === -1) {
    index = clients.findIndex(c => c.phone === client.phone);
  }
  
  if (index !== -1) {
    // Merge existing data with new data (preserve visits/vip)
    clients[index] = { ...clients[index], ...client };
  } else {
    clients.push(client);
  }
  localStorage.setItem(KEYS.CLIENTS, JSON.stringify(clients));
};

export const getClientByTgId = (tgId: number): Client | undefined => {
  const clients = getClients();
  return clients.find(c => c.tgId === tgId);
};

export const getClientByPhone = (phone: string): Client | undefined => {
  const clients = getClients();
  return clients.find(c => c.phone === phone);
};

export const incrementVisits = (client: Client): void => {
  const clients = getClients();
  let foundClient: Client | undefined;

  if (client.tgId) {
    foundClient = clients.find(c => c.tgId === client.tgId);
  } else {
    foundClient = clients.find(c => c.phone === client.phone);
  }

  if (foundClient) {
    foundClient.visits += 1;
    saveClient(foundClient);
  }
};

export const isAdmin = (tgId?: number): boolean => {
  if (!tgId) return false;
  if (ROOT_ADMIN_IDS.includes(tgId)) return true;
  
  const settings = getSettings();
  return settings.additionalAdminIds.includes(tgId);
};

// Seeding initial data for demo purposes
export const seedData = () => {
  if (!localStorage.getItem(KEYS.CLIENTS)) {
    const dummyClients: Client[] = [
      { tgId: 12345, name: 'Демо Пользователь', phone: '555-0101', plateNumber: 'А777АА', visits: 9, isVIP: false }, 
      { name: 'Иван Иванов', phone: '555-0102', plateNumber: 'В555ВВ', visits: 2, isVIP: true },
    ];
    localStorage.setItem(KEYS.CLIENTS, JSON.stringify(dummyClients));
  }
};