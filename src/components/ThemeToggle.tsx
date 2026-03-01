import { useState, useEffect } from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Mode = 'dark' | 'light' | 'color';

const ThemeToggle = () => {
  const [mode, setMode] = useState<Mode>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('quran-theme') as Mode | null;
    if (saved) {
      setMode(saved);
      applyMode(saved);
    }
  }, []);

  const applyMode = (m: Mode) => {
    const html = document.documentElement;
    html.classList.remove('dark', 'color-mode');
    if (m === 'dark') html.classList.add('dark');
    if (m === 'light') { /* default */ }
    if (m === 'color') {
      html.classList.add('dark', 'color-mode');
    }
  };

  const cycle = () => {
    const next: Mode = mode === 'dark' ? 'light' : mode === 'light' ? 'color' : 'dark';
    setMode(next);
    applyMode(next);
    localStorage.setItem('quran-theme', next);
  };

  return (
    <Button variant="ghost" size="icon" onClick={cycle} className="h-9 w-9">
      {mode === 'dark' && <Moon className="h-4 w-4" />}
      {mode === 'light' && <Sun className="h-4 w-4" />}
      {mode === 'color' && <Palette className="h-4 w-4" />}
    </Button>
  );
};

export default ThemeToggle;
