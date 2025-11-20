import React, { useState, useEffect } from 'react';
import { Client } from '../types';
import { saveClient } from '../services/storageService';
import { LOYALTY_THRESHOLD } from '../constants';
import { Card, Button, Input, Label } from './UI';

interface UserProfileProps {
  currentUser: Client | null;
  setCurrentUser: (user: Client) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ currentUser, setCurrentUser }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setPhone(currentUser.phone);
      setPlate(currentUser.plateNumber);
    }
  }, [currentUser]);

  const handleSave = () => {
    if (!currentUser) return;

    const updatedClient: Client = {
      ...currentUser,
      name,
      phone,
      plateNumber: plate,
    };

    saveClient(updatedClient);
    setCurrentUser(updatedClient);
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="pb-24 flex items-center justify-center h-[60vh]">
        <div className="text-slate-400">Загрузка профиля...</div>
      </div>
    );
  }

  const progressPercent = Math.min(((currentUser.visits % LOYALTY_THRESHOLD) / LOYALTY_THRESHOLD) * 100, 100);
  const washesLeft = LOYALTY_THRESHOLD - (currentUser.visits % LOYALTY_THRESHOLD);
  const isProfileComplete = currentUser.phone && currentUser.plateNumber;

  return (
    <div className="pb-24 animate-[fade-in_0.3s_ease-out]">
      <h1 className="text-2xl font-bold text-white mb-6">Мой Профиль</h1>

      {/* Avatar & Name */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
          {currentUser.username ? (
             <img 
               src={`https://t.me/i/userpic/320/${currentUser.username}.jpg`} 
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none'; 
                 (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
               }}
               className="w-full h-full rounded-full object-cover"
               alt="avatar"
             />
          ) : null}
          {/* Fallback avatar */}
          <div className={`w-full h-full rounded-full bg-surface flex items-center justify-center text-3xl ${currentUser.username ? 'hidden' : ''}`}>
            🤖
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{currentUser.name}</h2>
          <p className="text-slate-400">{currentUser.isVIP ? 'VIP Клиент' : 'Уважаемый клиент'}</p>
        </div>
      </div>

      {/* Loyalty Card */}
      <div className="mb-6 relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-surface rounded-2xl p-6 border border-slate-700">
           <div className="flex justify-between items-end mb-4">
             <div>
               <p className="text-sm text-slate-400 mb-1">TurboClean Loyalty</p>
               <h3 className="text-3xl font-bold text-white">{currentUser.visits} <span className="text-base font-normal text-slate-500">моек</span></h3>
             </div>
             <div className="text-right">
                <div className="text-2xl font-bold text-primary">{washesLeft}</div>
                <div className="text-[10px] text-slate-500">до бесплатной</div>
             </div>
           </div>
           
           {/* Progress Bar */}
           <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
             <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
             ></div>
           </div>
           <div className="mt-2 text-xs text-slate-400 text-center">
              Каждая 10-я мойка — в подарок!
           </div>
        </div>
      </div>

      {!isProfileComplete && !isEditing && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 text-yellow-200 text-sm flex gap-3 items-start">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
             Пожалуйста, заполните номер телефона и номер машины для записи.
             <button onClick={() => setIsEditing(true)} className="block mt-1 font-bold underline">Заполнить сейчас</button>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <Card>
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-white">Личные данные</h3>
           <button onClick={() => setIsEditing(!isEditing)} className="text-primary text-sm font-medium hover:text-blue-400">
             {isEditing ? 'Отмена' : 'Изменить'}
           </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label>Имя (как к вам обращаться)</Label>
            <Input disabled={!isEditing} value={name} onChange={e => setName(e.target.value)} className={!isEditing ? 'text-slate-400 border-transparent bg-transparent px-0' : ''} />
          </div>
          <div>
            <Label>Телефон для связи</Label>
            <Input 
              disabled={!isEditing} 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder={isEditing ? "+7 (999) 000-00-00" : "Не указан"}
              className={!isEditing ? 'text-slate-500 border-transparent bg-transparent px-0' : ''} 
            />
          </div>
          <div>
            <Label>Номер машины</Label>
            <Input 
              disabled={!isEditing} 
              value={plate} 
              onChange={e => setPlate(e.target.value)} 
              placeholder={isEditing ? "А 777 АА 777" : "Не указан"}
              className={!isEditing ? 'text-slate-400 border-transparent bg-transparent px-0' : 'uppercase'} 
            />
          </div>
          
          {isEditing && (
            <Button fullWidth onClick={handleSave}>Сохранить изменения</Button>
          )}
        </div>
      </Card>
    </div>
  );
};