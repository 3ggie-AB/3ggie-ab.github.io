import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, RefreshCw, Download, Star, Wifi, WifiOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { fetchSurahs, downloadAllData } from '@/lib/api';
import { getShortcuts } from '@/lib/shortcuts';
import { toast } from 'sonner';
import type { Surah } from '@/lib/db';

const NEWS_SOURCES = [
  { id: 'islampos', name: 'Islampos', url: 'https://www.islampos.com/feed/', apiUrl: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.islampos.com/feed/' },
];

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
}

const SurahTab = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [dlProgress, setDlProgress] = useState(0);
  const [shortcuts, setShortcuts] = useState<number[]>([]);
  const navigate = useNavigate();

  const load = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);
    const data = await fetchSurahs(force);
    setSurahs(data);
    setShortcuts(getShortcuts());
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const onFocus = () => setShortcuts(getShortcuts());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const handleDownloadAll = async () => {
    if (downloading) return;
    setDownloading(true);
    setDlProgress(0);
    toast('Mulai mengunduh semua data...');
    try {
      await downloadAllData((done, total) => {
        setDlProgress(Math.round((done / total) * 100));
      });
      toast.success('Semua data berhasil disimpan! ✅');
    } catch {
      toast.error('Gagal mengunduh semua data.');
    }
    setDownloading(false);
  };

  const shortcutSurahs = surahs.filter((s) => shortcuts.includes(s.nomor));
  const filtered = surahs.filter((s) => {
    const q = search.toLowerCase();
    return s.namaLatin.toLowerCase().includes(q) || s.arti.toLowerCase().includes(q) || s.nomor.toString().includes(q);
  });

  return (
    <div>
      {/* Actions */}
      <div className="flex items-center gap-2 mb-3">
        <Button variant="outline" size="sm" onClick={handleDownloadAll} disabled={downloading} className="gap-1.5">
          <Download className={`h-3.5 w-3.5 ${downloading ? 'animate-pulse' : ''}`} />
          <span className="text-xs">Unduh Semua</span>
        </Button>
        <Button variant="outline" size="sm" onClick={() => load(true)} disabled={refreshing} className="gap-1.5">
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="text-xs">Refresh</span>
        </Button>
      </div>

      {downloading && (
        <div className="mb-4 space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Mengunduh data...</span>
            <span>{dlProgress}%</span>
          </div>
          <Progress value={dlProgress} className="h-2" />
        </div>
      )}

      {shortcutSurahs.length > 0 && !search && (
        <div className="mb-4 animate-fade-in">
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="h-3.5 w-3.5 text-muted-foreground fill-current" />
            <span className="text-xs font-medium text-muted-foreground">Pintasan</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shortcutSurahs.map((s) => (
              <button
                key={s.nomor}
                onClick={() => navigate(`/surah/${s.nomor}`)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left transition-all hover:bg-accent"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                  {s.nomor}
                </span>
                <div>
                  <span className="text-sm font-medium text-foreground">{s.namaLatin}</span>
                  <span className="block text-[10px] text-muted-foreground">{s.arti}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari surah..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 bg-card border-border" />
      </div>

      <p className="mb-3 text-xs text-muted-foreground">
        {filtered.length} surah {search && `· "${search}"`}
      </p>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-card" />
          ))}
        </div>
      ) : (
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
    </div>
  );
};

const NewsTab = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(NEWS_SOURCES[0].apiUrl);
        const json = await res.json();
        if (json.status === 'ok') {
          setNews(json.items.slice(0, 20).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: item.description?.replace(/<[^>]*>/g, '').slice(0, 120) || '',
            thumbnail: item.thumbnail || item.enclosure?.link || '',
          })));
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-card" />
        ))}
      </div>
    );
  }

  if (error || news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <WifiOff className="h-10 w-10 mb-3" />
        <p className="text-sm font-medium">Tidak bisa memuat berita</p>
        <p className="text-xs mt-1">Periksa koneksi internet Anda</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {news.map((item, i) => (
        <a
          key={i}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:bg-accent animate-slide-up"
          style={{ animationDelay: `${Math.min(i * 40, 300)}ms`, animationFillMode: 'backwards' }}
        >
          {item.thumbnail && (
            <img
              src={item.thumbnail}
              alt=""
              className="h-20 w-20 shrink-0 rounded-md object-cover bg-muted"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              {new Date(item.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
};

const Index = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Quran</h1>
          </div>
          <div className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-3.5 w-3.5 text-primary" /> : <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {isOnline ? (
          <Tabs defaultValue="surat">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="surat" className="flex-1">Surat</TabsTrigger>
              <TabsTrigger value="news" className="flex-1">Berita</TabsTrigger>
            </TabsList>
            <TabsContent value="surat"><SurahTab /></TabsContent>
            <TabsContent value="news"><NewsTab /></TabsContent>
          </Tabs>
        ) : (
          <SurahTab />
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
