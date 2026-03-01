import { Wifi, WifiOff } from 'lucide-react';
import { useOnline } from '@/hooks/use-online';

const OnlineIndicator = () => {
  const isOnline = useOnline();

  return (
    <div className={`flex items-center justify-center gap-1.5 py-1 text-[10px] font-medium transition-colors ${
      isOnline ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
    }`}>
      {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
};

export default OnlineIndicator;
