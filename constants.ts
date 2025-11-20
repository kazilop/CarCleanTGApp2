import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  {
    id: 'srv_1',
    name: 'Экспресс Мойка',
    description: 'Быстрая мойка кузова, чистка колес и сушка.',
    price: 500,
    durationMinutes: 20,
    type: ServiceType.EXPRESS,
    imageUrl: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: 'srv_2',
    name: 'Стандарт Блеск',
    description: 'Мойка кузова, пылесос салона, мойка стекол и чернение резины.',
    price: 1200,
    durationMinutes: 45,
    type: ServiceType.STANDARD,
    imageUrl: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: 'srv_3',
    name: 'Премиум Детейлинг',
    description: 'Полная детальная мойка, ручной воск, глубокая чистка салона и уход за кожей.',
    price: 3500,
    durationMinutes: 90,
    type: ServiceType.PREMIUM,
    imageUrl: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: 'srv_4',
    name: 'Керамическая Защита',
    description: 'Коррекция ЛКП и нанесение керамического покрытия на 1 год.',
    price: 15000,
    durationMinutes: 240,
    type: ServiceType.CERAMIC,
    imageUrl: 'https://picsum.photos/400/300?random=4'
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