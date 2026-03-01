import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import OnlineIndicator from '@/components/OnlineIndicator';
import { getHistory, clearHistory, type HistoryEntry } from '@/lib/history';

const HistoryPage = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const timeAgo = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Baru saja';
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Riwayat</h1>
            <OnlineIndicator />
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleClear}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <History className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium">Belum ada riwayat</p>
            <p className="text-xs mt-1">Baca surah untuk melihat riwayat di sini</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((entry, i) => (
              <button
                key={`${entry.surahNomor}-${entry.timestamp}`}
                onClick={() => navigate(`/surah/${entry.surahNomor}`)}
                className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-3 text-left transition-all hover:bg-accent animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'backwards' }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                  {entry.surahNomor}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground">{entry.surahName}</span>
                  {entry.ayat && (
                    <span className="text-xs text-muted-foreground ml-2">Ayat {entry.ayat}</span>
                  )}
                  <p className="text-xs text-muted-foreground">{timeAgo(entry.timestamp)}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default HistoryPage;
