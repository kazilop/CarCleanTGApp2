import React, { useState, useMemo, useEffect } from 'react';
import { SERVICES, LOYALTY_THRESHOLD } from '../constants';
import { Service, Booking, Client, BookingStatus } from '../types';
import { saveBooking, saveClient, incrementVisits, getSettings, getBookings } from '../services/storageService';
import { Button, Card, Badge, Input, Label } from './UI';

interface UserViewProps {
  currentUser: Client | null;
  setCurrentUser: (user: Client) => void;
  onBookingComplete: () => void;
}

export const UserView: React.FC<UserViewProps> = ({ currentUser, setCurrentUser, onBookingComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [settings, setSettings] = useState(getSettings());
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setPlate(currentUser.plateNumber);
    }
    setSettings(getSettings());
  }, [currentUser]);

  // Generate Time Slots based on Dynamic Admin Settings
  const timeSlots = useMemo(() => {
    const slots = [];
    const startTimeMinutes = settings.startHour * 60;
    const endTimeMinutes = settings.endHour * 60;
    const duration = settings.slotDuration || 30; // Default to 30 if missing

    // Get all existing bookings for the selected date
    const existingBookings = getBookings().filter(b => 
      b.date === selectedDate && 
      b.status !== BookingStatus.CANCELLED
    );

    for (let current = startTimeMinutes; current < endTimeMinutes; current += duration) {
      const hours = Math.floor(current / 60);
      const minutes = current % 60;
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Count how many active bookings exist for this time slot
      const bookingsAtThisTime = existingBookings.filter(b => b.timeSlot === timeString).length;
      
      // It's available if current bookings < max posts count
      const isAvailable = bookingsAtThisTime < (settings.postsCount || 1);

      if (isAvailable) {
        slots.push(timeString);
      }
    }
    return slots;
  }, [settings, selectedDate]);

  const handleBooking = () => {
    if (!selectedService || !selectedTime || !currentUser) return;

    // Update client info if changed during booking
    const updatedClient = {
        ...currentUser,
        phone,
        plateNumber: plate,
        name
    };
    
    // Check loyalty
    const isFreeWash = (currentUser.visits + 1) % LOYALTY_THRESHOLD === 0;

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      tgId: currentUser.tgId,
      serviceId: selectedService.id,
      date: selectedDate,
      timeSlot: selectedTime,
      clientPhone: phone,
      plateNumber: plate,
      status: BookingStatus.PENDING,
      isFreeWash,
      createdAt: Date.now()
    };

    saveBooking(newBooking);
    saveClient(updatedClient); 
    incrementVisits(updatedClient);
    
    setCurrentUser({...updatedClient, visits: updatedClient.visits + 1});
    onBookingComplete();
  };

  // Determine if current wash is free
  const potentialFreeWash = currentUser && (currentUser.visits + 1) % LOYALTY_THRESHOLD === 0;
  const washesUntilFree = currentUser ? LOYALTY_THRESHOLD - (currentUser.visits % LOYALTY_THRESHOLD) : LOYALTY_THRESHOLD;

  return (
    <div className="pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Запись на мойку</h1>
        <p className="text-slate-400">Привет, {currentUser?.name || 'Друг'}!</p>
      </div>

      {/* Loyalty Banner */}
      {currentUser && (
        <div className="mb-8 bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/20 blur-2xl rounded-full"></div>
          <div>
            <p className="text-sm text-blue-300 font-medium">Статус Лояльности</p>
            <h3 className="text-lg font-bold text-white">{currentUser.visits} Посещений</h3>
          </div>
          <div className="text-right z-10">
            {potentialFreeWash ? (
              <Badge color="green">ЭТА МОЙКА БЕСПЛАТНО!</Badge>
            ) : (
              <span className="text-sm text-slate-300">Ещё {washesUntilFree} до бесплатной мойки</span>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 animate-[fade-in_0.3s_ease-out]">
          {SERVICES.map((service) => (
            <Card 
              key={service.id} 
              className={`cursor-pointer transition-all hover:border-primary ${selectedService?.id === service.id ? 'ring-2 ring-primary border-transparent' : ''}`}
            >
              <div className="flex gap-4" onClick={() => setSelectedService(service)}>
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800">
                   <img 
                      src={service.imageUrl} 
                      alt={service.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-slate-700 text-xs text-slate-400">Нет фото</div>';
                      }}
                   />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white">{service.name}</h3>
                    <span className="text-primary font-bold">{service.price}₽</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{service.description}</p>
                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {service.durationMinutes} мин
                  </div>
                </div>
              </div>
            </Card>
          ))}
          <Button 
            fullWidth 
            disabled={!selectedService} 
            onClick={() => setStep(2)}
            className={!selectedService ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Выбрать время
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <div>
            <Label>Выберите дату</Label>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div>
            <Label>Доступное время ({settings.postsCount} бокс(а))</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {timeSlots.length > 0 ? timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
                    selectedTime === time 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'bg-surface text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {time}
                </button>
              )) : (
                 <p className="col-span-4 text-center text-slate-500 py-4 text-sm">Нет свободного времени на эту дату.</p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Назад</Button>
            <Button 
              variant="primary" 
              onClick={() => setStep(3)} 
              disabled={!selectedTime}
              className={`flex-1 ${!selectedTime ? 'opacity-50' : ''}`}
            >
              Далее
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-[fade-in_0.3s_ease-out]">
          <Card>
            <h3 className="font-bold text-white mb-4 border-b border-slate-700 pb-2">Ваш заказ</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-400">Услуга:</span> <span className="text-white">{selectedService?.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Дата:</span> <span className="text-white">{selectedDate}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Время:</span> <span className="text-white">{selectedTime}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-700 mt-2">
                <span className="text-slate-400">Итого:</span> 
                <span className={`font-bold ${potentialFreeWash ? 'text-green-400 line-through' : 'text-primary'}`}>
                  {selectedService?.price}₽
                </span>
              </div>
              {potentialFreeWash && (
                <div className="flex justify-end">
                  <span className="text-green-400 font-bold">БЕСПЛАТНО (Акция)</span>
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-4">
            <div>
              <Label>Ваше имя</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Иван" />
            </div>
            <div>
              <Label>Номер телефона</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="555-0000" type="tel" />
            </div>
            <div>
              <Label>Номер машины</Label>
              <Input value={plate} onChange={(e) => setPlate(e.target.value)} placeholder="А777АА" className="uppercase" />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Назад</Button>
            <Button 
              variant="primary" 
              onClick={handleBooking} 
              disabled={!name || !phone || !plate}
              className={`flex-1 ${(!name || !phone || !plate) ? 'opacity-50' : ''}`}
            >
              Подтвердить
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};