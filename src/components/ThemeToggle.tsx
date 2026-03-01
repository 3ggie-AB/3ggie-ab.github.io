import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('quran-theme');
    const isDark = saved !== 'light';
    setDark(isDark);
    applyMode(isDark);
  }, []);

  const applyMode = (isDark: boolean) => {
    const html = document.documentElement;
    html.classList.remove('dark', 'color-mode');
    if (isDark) html.classList.add('dark');
  };

  const toggle = () => {
    const next = !dark;
    setDark(next);
    applyMode(next);
    localStorage.setItem('quran-theme', next ? 'dark' : 'light');
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9">
      {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
};

export default ThemeToggle;
