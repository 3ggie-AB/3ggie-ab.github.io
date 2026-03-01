import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase('out'), 1800);
    const doneTimer = setTimeout(() => onFinish(), 2400);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        phase === 'out' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
          <BookOpen className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Quran</h1>
        <p className="text-sm text-muted-foreground">Baca, Dengar, Pahami</p>
      </div>
    </div>
  );
};

export default SplashScreen;
