import { Service, ServiceType } from './types';

export const SERVICES: Service[] = [
  {
    id: 'srv_1',
    name: 'Экспресс Мойка',
    description: 'Быстрая мойка кузова, чистка колес и сушка.',
    price: 500,
    durationMinutes: 20,
    type: ServiceType.EXPRESS,
    // Inline SVG: Blue gradient with Car Emoji
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22a%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%233b82f6%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%231d4ed8%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22url(%23a)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%22250%22%3E%F0%9F%9A%99%3C%2Ftext%3E%3C%2Fsvg%3E'
  },
  {
    id: 'srv_2',
    name: 'Стандарт Блеск',
    description: 'Мойка кузова, пылесос салона, мойка стекол и чернение резины.',
    price: 1200,
    durationMinutes: 45,
    type: ServiceType.STANDARD,
    // Inline SVG: Purple gradient with Sparkles Emoji
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22b%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%238b5cf6%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%236d28d9%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22url(%23b)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%22250%22%3E%E2%9C%A8%3C%2Ftext%3E%3C%2Fsvg%3E'
  },
  {
    id: 'srv_3',
    name: 'Премиум Детейлинг',
    description: 'Полная детальная мойка, ручной воск, глубокая чистка салона и уход за кожей.',
    price: 3500,
    durationMinutes: 90,
    type: ServiceType.PREMIUM,
    // Inline SVG: Dark/Gold gradient with Diamond Emoji
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22c%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%231e293b%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%230f172a%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22url(%23c)%22%2F%3E%3Ccircle%20cx%3D%22400%22%20cy%3D%22300%22%20r%3D%22160%22%20fill%3D%22none%22%20stroke%3D%22%23fbbf24%22%20stroke-width%3D%2210%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%22200%22%3E%F0%9F%92%8E%3C%2Ftext%3E%3C%2Fsvg%3E'
  },
  {
    id: 'srv_4',
    name: 'Керамическая Защита',
    description: 'Коррекция ЛКП и нанесение керамического покрытия на 1 год.',
    price: 15000,
    durationMinutes: 240,
    type: ServiceType.CERAMIC,
    // Inline SVG: Red gradient with Shield Emoji
    imageUrl: 'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22d%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23ef4444%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23991b1b%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22url(%23d)%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%22%20font-size%3D%22200%22%3E%F0%9F%9B%A1%EF%B8%8F%3C%2Ftext%3E%3C%2Fsvg%3E'
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