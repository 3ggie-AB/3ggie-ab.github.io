import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Puzzle, History, Wifi, WifiOff } from 'lucide-react';
import { useOnline } from '@/hooks/use-online';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isOnline = useOnline();

  const allItems = [
    { icon: Home, label: 'Beranda', path: '/', onlineOnly: true },
    { icon: BookOpen, label: 'Al-Quran', path: '/quran', onlineOnly: false },
    { icon: History, label: 'Riwayat', path: '/history', onlineOnly: false },
    { icon: Puzzle, label: 'Plugin', path: '/plugin', onlineOnly: false },
  ];

  const items = allItems.filter(item => isOnline || !item.onlineOnly);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-lg">
      {/* Online/Offline indicator */}
      <div className={`flex items-center justify-center gap-1.5 py-1 text-[10px] font-medium transition-colors ${
        isOnline ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
      }`}>
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span>{isOnline ? 'Online' : 'Offline'}</span>
      </div>
      <div className="mx-auto flex max-w-2xl items-center justify-around px-4 py-2">
        {items.map((item) => {
          const active = location.pathname === item.path || 
            (item.path === '/quran' && location.pathname.startsWith('/surah'));
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
