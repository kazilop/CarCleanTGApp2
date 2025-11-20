import React, { useEffect, useState } from 'react';
import { Booking, Client, BookingStatus } from '../types';
import { getUserBookings } from '../services/storageService';
import { SERVICES } from '../constants';
import { Card, Badge } from './UI';

interface UserHistoryProps {
  currentUser: Client | null;
}

export const UserHistory: React.FC<UserHistoryProps> = ({ currentUser }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (currentUser) {
      setBookings(getUserBookings(currentUser));
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 animate-spin rounded-full border-2 border-slate-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 animate-[fade-in_0.3s_ease-out]">
      <h1 className="text-2xl font-bold text-white mb-6">История записей</h1>
      
      <div className="space-y-4">
        {bookings.map(booking => {
          const service = SERVICES.find(s => s.id === booking.serviceId);
          return (
            <Card key={booking.id} className="relative overflow-hidden">
              {booking.isFreeWash && <div className="absolute top-0 right-0 bg-green-500 text-darker text-[10px] font-bold px-2 py-1 rounded-bl-lg">БЕСПЛАТНО</div>}
              
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-white">{service?.name || 'Неизвестная услуга'}</h4>
                  <p className="text-xs text-slate-400 mt-1">{booking.date} в {booking.timeSlot}</p>
                </div>
                <Badge color={booking.status === BookingStatus.COMPLETED ? 'green' : booking.status === BookingStatus.PENDING ? 'yellow' : 'red'}>
                  {booking.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-700/50">
                 <span className="text-slate-400">Авто: {booking.plateNumber}</span>
                 <span className="text-primary font-bold">{booking.isFreeWash ? '0' : service?.price}₽</span>
              </div>
            </Card>
          );
        })}
        
        {bookings.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Пока пусто</h3>
            <p className="text-slate-400 text-sm px-10">Здесь будут отображаться ваши записи. Запишитесь на первую мойку!</p>
          </div>
        )}
      </div>
    </div>
  );
};