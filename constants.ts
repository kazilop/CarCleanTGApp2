import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  {
    id: 'srv_1',
    name: 'Экспресс Мойка',
    description: 'Быстрая мойка кузова, чистка колес и сушка.',
    price: 500,
    durationMinutes: 20,
    type: ServiceType.EXPRESS,
    // Image: Classic/Old School Car
    imageUrl: 'https://images.unsplash.com/photo-1532751203331-537820440239?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv_2',
    name: 'Стандарт Блеск',
    description: 'Мойка кузова, пылесос салона, мойка стекол и чернение резины.',
    price: 1200,
    durationMinutes: 45,
    type: ServiceType.STANDARD,
    // Image: Standard Modern Car Washing
    imageUrl: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv_3',
    name: 'Премиум Детейлинг',
    description: 'Полная детальная мойка, ручной воск, глубокая чистка салона и уход за кожей.',
    price: 3500,
    durationMinutes: 90,
    type: ServiceType.PREMIUM,
    // Image: Luxury Detailing (Black Shiny Car)
    imageUrl: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'srv_4',
    name: 'Керамическая Защита',
    description: 'Коррекция ЛКП и нанесение керамического покрытия на 1 год.',
    price: 15000,
    durationMinutes: 240,
    type: ServiceType.CERAMIC,
    // Image: Supercar/High-end (Ceramic Coating vibe)
    imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80'
  }
];

export const LOYALTY_THRESHOLD = 10; // Every 10th wash is free

// Hardcoded Root Admins (Cannot be removed via UI)
export const ROOT_ADMIN_IDS = [
  207940967
];

// Configuration Defaults
export const DEFAULT_BOT_TOKEN = '8544796327:AAHCj2YuQXfWEBqQShUvpBsGrf0ytxrC-dQ';

// ВНИМАНИЕ: Впишите сюда ID вашего канала (например '@my_wash_channel' или '-100123456789')
export const DEFAULT_CHANNEL_ID = '-1003436456779';