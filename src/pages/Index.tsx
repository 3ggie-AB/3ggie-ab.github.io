import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchSurahs } from '@/lib/api';
import type { Surah } from '@/lib/db';

const Index = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const load = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    const data = await fetchSurahs(force);
    setSurahs(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = surahs.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.namaLatin.toLowerCase().includes(q) ||
      s.arti.toLowerCase().includes(q) ||
      s.nomor.toString().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Quran</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => load(true)}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari surah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {/* Stats */}
        <p className="mb-3 text-xs text-muted-foreground">
          {filtered.length} surah {search && `· "${search}"`}
        </p>

        {/* Loading */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-card" />
            ))}
          </div>
        ) : (
          /* Surah List */
          <div className="space-y-2">
            {filtered.map((surah, i) => (
              <button
                key={surah.nomor}
                onClick={() => navigate(`/surah/${surah.nomor}`)}
                className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-3 text-left transition-all hover:bg-accent animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'backwards' }}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                  {surah.nomor}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-foreground truncate">{surah.namaLatin}</span>
                    <span className="arabic-text text-lg text-foreground shrink-0">{surah.nama}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{surah.arti}</span>
                    <span>·</span>
                    <span>{surah.jumlahAyat} ayat</span>
                    <span>·</span>
                    <span>{surah.tempatTurun}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
