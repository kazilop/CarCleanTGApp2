import React, { useState, useEffect } from 'react';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { UserHistory } from './components/UserHistory';
import { UserProfile } from './components/UserProfile';
import { seedData, getClientByTgId, saveClient, isAdmin } from './services/storageService';
import { Client, ViewState } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [currentUser, setCurrentUser] = useState<Client | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [secretCounter, setSecretCounter] = useState(0);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);

  useEffect(() => {
    seedData();

    // Initialize Telegram Mini App Logic
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser) {
        // Real Telegram User
        const existingClient = getClientByTgId(tgUser.id);
        
        // Check admin access using dynamic list from storage + hardcoded list
        setHasAdminAccess(isAdmin(tgUser.id));

        if (existingClient) {
          setCurrentUser(existingClient);
        } else {
          // New User Registration
          const newClient: Client = {
            tgId: tgUser.id,
            username: tgUser.username,
            name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
            phone: '', // Will ask in Profile
            plateNumber: '', // Will ask in Profile
            visits: 0,
            isVIP: false
          };
          saveClient(newClient);
          setCurrentUser(newClient);
        }
      } else {
        // Fallback for Development (Browser) - Demo User
        console.log("Running in browser mode (no Telegram data)");
        // Simulate a logged in user for dev experience
        const devUser = getClientByTgId(12345); 
        if (devUser) setCurrentUser(devUser);
        setHasAdminAccess(true); // Allow admin in dev mode
      }
    }
    setIsInitialized(true);
  }, []);

  const handleBookingComplete = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      setView(ViewState.HOME);
    }, 3000);
  };

  const handleSecretClick = () => {
    // Secret backdoor for testing on devices without defined admin ID
    setSecretCounter(prev => prev + 1);
    if (secretCounter + 1 >= 5) {
      setHasAdminAccess(true);
      alert("Режим разработчика активирован");
    }
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-darker flex items-center justify-center text-white">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-darker text-slate-200 font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-darker/80 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={handleSecretClick}>
           <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
             T
           </div>
           <span className="font-bold text-lg tracking-tight text-white">Turbo<span className="text-primary">Clean</span></span>
        </div>
        
        {/* Role Switcher - Visible only to Admins */}
        {hasAdminAccess && (
          <button 
            onClick={() => setView(view === ViewState.ADMIN_DASHBOARD ? ViewState.HOME : ViewState.ADMIN_DASHBOARD)}
            className="text-xs bg-surface border border-slate-700 px-2 py-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            {view === ViewState.ADMIN_DASHBOARD ? 'Клиент' : 'Админка'}
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-md mx-auto relative min-h-[80vh]">
        {view === ViewState.ADMIN_DASHBOARD && hasAdminAccess ? <AdminView /> : (
          <>
             {view === ViewState.HOME && (
                <UserView 
                  currentUser={currentUser} 
                  setCurrentUser={setCurrentUser}
                  onBookingComplete={handleBookingComplete}
                />
             )}
             {view === ViewState.BOOKING && <UserHistory currentUser={currentUser} />}
             {view === ViewState.PROFILE && <UserProfile currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          </>
        )}
      </main>

      {/* Bottom Navigation (Only for User) */}
      {view !== ViewState.ADMIN_DASHBOARD && (
        <nav className="fixed bottom-0 left-0 w-full bg-surface/90 backdrop-blur-lg border-t border-slate-800 pb-safe pt-2 z-40">
          <div className="flex justify-around items-center max-w-md mx-auto h-14">
            <button 
              onClick={() => setView(ViewState.HOME)} 
              className={`flex flex-col items-center gap-1 transition-colors ${view === ViewState.HOME ? 'text-primary' : 'text-slate-500'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span className="text-[10px] font-medium">Главная</span>
            </button>
            <button 
              onClick={() => setView(ViewState.BOOKING)}
              className={`flex flex-col items-center gap-1 transition-colors ${view === ViewState.BOOKING ? 'text-primary' : 'text-slate-500'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span className="text-[10px] font-medium">История</span>
            </button>
            <button 
              onClick={() => setView(ViewState.PROFILE)}
              className={`flex flex-col items-center gap-1 transition-colors ${view === ViewState.PROFILE ? 'text-primary' : 'text-slate-500'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-[10px] font-medium">Профиль</span>
            </button>
          </div>
        </nav>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]">
          <div className="bg-surface border border-slate-700 p-6 rounded-2xl w-full max-w-sm text-center shadow-2xl transform scale-100 animate-[scale-up_0.3s_ease-out]">
            <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Запись подтверждена!</h2>
            <p className="text-slate-400 mb-6">Мы забронировали для вас слот. Ждем вас!</p>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
