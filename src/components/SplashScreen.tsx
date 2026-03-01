import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const [phase, setPhase] = useState<'in' | 'out'>('in');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const steps = [
      { delay: 100, value: 10 },
      { delay: 300, value: 25 },
      { delay: 600, value: 45 },
      { delay: 900, value: 65 },
      { delay: 1200, value: 80 },
      { delay: 1500, value: 95 },
      { delay: 1700, value: 100 },
    ];

    const timers = steps.map(({ delay, value }) =>
      setTimeout(() => setProgress(value), delay)
    );

    const showTimer = setTimeout(() => setPhase('out'), 1800);
    const doneTimer = setTimeout(() => onFinish(), 2400);

    return () => {
      timers.forEach(clearTimeout);
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

        <div className="mt-4 w-48 flex flex-col items-center gap-2">
          <Progress value={progress} className="h-2 w-full" />
          <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
