import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getBookings, getClients, updateBookingStatus, getSettings, saveSettings, AppSettings } from '../services/storageService';
import { Booking, Client, BookingStatus } from '../types';
import { SERVICES, ROOT_ADMIN_IDS } from '../constants';
import { Card, Badge, Button, Input, Label } from './UI';

export const AdminView: React.FC = () => {
  const [tab, setTab] = useState<'dashboard' | 'bookings' | 'clients' | 'settings'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(getSettings());
  const [adminIdsStr, setAdminIdsStr] = useState('');

  const refreshData = () => {
    setBookings(getBookings().reverse()); // Newest first
    setClients(getClients());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000); // Auto refresh every 5s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Init admin ids string from settings
    setAdminIdsStr(settings.additionalAdminIds.join(', '));
  }, []);

  const handleStatusChange = (id: string, status: BookingStatus) => {
    updateBookingStatus(id, status);
    refreshData();
  };

  const handleSaveSettings = () => {
    // Parse Admin IDs
    const ids = adminIdsStr
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    const newSettings = {
      ...settings,
      additionalAdminIds: ids
    };

    saveSettings(newSettings);
    setSettingsState(newSettings);
    alert('Настройки сохранены!');
  };

  // Stats logic
  const totalRevenue = bookings
    .filter(b => b.status === BookingStatus.COMPLETED && !b.isFreeWash)
    .reduce((acc, curr) => {
      const service = SERVICES.find(s => s.id === curr.serviceId);
      return acc + (service ? service.price : 0);
    }, 0);
  
  const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING).length;

  const chartData = [
    { name: 'Ожидает', value: bookings.filter(b => b.status === BookingStatus.PENDING).length },
    { name: 'Завершен', value: bookings.filter(b => b.status === BookingStatus.COMPLETED).length },
    { name: 'Отменен', value: bookings.filter(b => b.status === BookingStatus.CANCELLED).length },
  ];

  const tabLabels: Record<string, string> = {
    dashboard: 'Дашборд',
    bookings: 'Записи',
    clients: 'Клиенты',
    settings: 'Настройки'
  };

  return (
    <div className="pb-24">
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2">
        {['dashboard', 'bookings', 'clients', 'settings'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              tab === t ? 'bg-secondary text-white' : 'bg-surface text-slate-400'
            }`}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <div className="grid grid-cols-2 gap-4">
             <Card className="bg-gradient-to-br from-surface to-slate-900">
               <p className="text-slate-400 text-xs uppercase tracking-wider">Выручка</p>
               <h3 className="text-2xl font-bold text-green-400">{totalRevenue}₽</h3>
             </Card>
             <Card className="bg-gradient-to-br from-surface to-slate-900">
               <p className="text-slate-400 text-xs uppercase tracking-wider">Ожидают</p>
               <h3 className="text-2xl font-bold text-yellow-400">{pendingBookings}</h3>
             </Card>
          </div>

          <Card className="h-64 w-full">
            <h3 className="text-sm font-medium text-slate-400 mb-4">Статистика Заказов</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 12}} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc'}}
                  itemStyle={{color: '#f8fafc'}}
                  cursor={{fill: '#334155', opacity: 0.2}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : index === 1 ? '#4ade80' : '#f87171'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
          {bookings.map(booking => {
             const service = SERVICES.find(s => s.id === booking.serviceId);
             return (
               <Card key={booking.id} className="relative overflow-hidden">
                 {booking.isFreeWash && <div className="absolute top-0 right-0 bg-green-500 text-darker text-[10px] font-bold px-2 py-1 rounded-bl-lg">БЕСПЛАТНО</div>}
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h4 className="font-bold text-white">{service?.name || 'Неизвестная услуга'}</h4>
                     <p className="text-xs text-slate-400">{booking.date} в {booking.timeSlot}</p>
                   </div>
                   <Badge color={booking.status === BookingStatus.COMPLETED ? 'green' : booking.status === BookingStatus.PENDING ? 'yellow' : 'red'}>
                     {booking.status}
                   </Badge>
                 </div>
                 <div className="bg-darker/50 p-2 rounded-lg text-xs text-slate-300 mb-3 grid grid-cols-2 gap-2">
                   <div><span className="text-slate-500">Авто:</span> {booking.plateNumber}</div>
                   <div><span className="text-slate-500">Тел:</span> {booking.clientPhone}</div>
                 </div>
                 {booking.status === BookingStatus.PENDING && (
                   <div className="flex gap-2">
                     <Button 
                       variant="secondary" 
                       className="flex-1 !py-2 !text-xs bg-green-900/20 hover:bg-green-900/40 text-green-400 border-green-900" 
                       onClick={() => handleStatusChange(booking.id, BookingStatus.COMPLETED)}
                     >
                       Выполнено
                     </Button>
                     <Button 
                        variant="secondary" 
                        className="flex-1 !py-2 !text-xs bg-red-900/20 hover:bg-red-900/40 text-red-400 border-red-900"
                        onClick={() => handleStatusChange(booking.id, BookingStatus.CANCELLED)}
                      >
                       Отмена
                     </Button>
                   </div>
                 )}
               </Card>
             )
          })}
          {bookings.length === 0 && <p className="text-center text-slate-500 mt-10">Нет записей.</p>}
        </div>
      )}

      {tab === 'clients' && (
        <div className="space-y-3 animate-[fade-in_0.3s_ease-out]">
          {clients.map((client, idx) => (
            <Card key={idx} className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white">{client.name}</h4>
                <p className="text-xs text-slate-400">{client.phone} • {client.plateNumber}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{client.visits}</div>
                <div className="text-[10px] text-slate-500 uppercase">Посещений</div>
              </div>
            </Card>
          ))}
          {clients.length === 0 && <p className="text-center text-slate-500 mt-10">База клиентов пуста.</p>}
        </div>
      )}

      {tab === 'settings' && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
           <Card>
             <h3 className="font-bold text-white mb-4 text-primary">Настройка Автомойки</h3>
             <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label>Начало (Час)</Label>
                   <Input 
                      type="number" min="0" max="23"
                      value={settings.startHour}
                      onChange={(e) => setSettingsState({...settings, startHour: parseInt(e.target.value)})}
                   />
                 </div>
                 <div>
                   <Label>Конец (Час)</Label>
                   <Input 
                      type="number" min="0" max="23"
                      value={settings.endHour}
                      onChange={(e) => setSettingsState({...settings, endHour: parseInt(e.target.value)})}
                   />
                 </div>
               </div>

               <div>
                 <Label>Интервал слота (мин)</Label>
                 <Input 
                    type="number" min="1" step="1"
                    value={settings.slotDuration}
                    onChange={(e) => setSettingsState({...settings, slotDuration: parseInt(e.target.value) || 30})}
                    placeholder="Например: 15, 30, 45"
                 />
                 <p className="text-[10px] text-slate-500 mt-1">Время на одну машину (1 - 60 мин)</p>
               </div>

               <div>
                 <Label>Количество постов (Боксов)</Label>
                 <Input 
                    type="number" min="1"
                    value={settings.postsCount}
                    onChange={(e) => setSettingsState({...settings, postsCount: parseInt(e.target.value) || 1})}
                 />
                 <p className="text-[10px] text-slate-500 mt-1">Сколько машин можно мыть одновременно</p>
               </div>
             </div>
           </Card>

           <Card>
             <h3 className="font-bold text-white mb-4 text-secondary">Доступ и Интеграция</h3>
             
             <div className="space-y-4">
               <div>
                 <Label>Администраторы (Telegram ID)</Label>
                 <Input 
                    value={adminIdsStr}
                    onChange={(e) => setAdminIdsStr(e.target.value)}
                    placeholder="ID через запятую: 12345, 67890"
                 />
                 <p className="text-[10px] text-slate-500 mt-1">Ваш текущий ID: {window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 'Не определен'}</p>
                 <p className="text-[10px] text-slate-500">Супер-админы (вшиты): {ROOT_ADMIN_IDS.join(', ')}</p>
               </div>

               <div>
                 <Label>Bot Token</Label>
                 <Input 
                    value={settings.botToken}
                    onChange={(e) => setSettingsState({...settings, botToken: e.target.value})}
                    placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                 />
               </div>

               <div>
                 <Label>ID Канала (для уведомлений)</Label>
                 <Input 
                    value={settings.channelId}
                    onChange={(e) => setSettingsState({...settings, channelId: e.target.value})}
                    placeholder="@channelname или -100..."
                 />
               </div>
             </div>
           </Card>

           <div className="pt-2">
             <Button fullWidth onClick={handleSaveSettings}>Сохранить Все Настройки</Button>
           </div>
        </div>
      )}
    </div>
  );
};
