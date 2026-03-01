import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, WifiOff, Newspaper } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import OnlineIndicator from '@/components/OnlineIndicator';
import { useOnline } from '@/hooks/use-online';
import { useOnline } from '@/hooks/use-online';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  thumbnail: string;
}

const Index = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isOnline = useOnline();
  const navigate = useNavigate();

  // Redirect to Al-Quran when offline
  useEffect(() => {
    if (!isOnline) {
      navigate('/quran', { replace: true });
    }
  }, [isOnline, navigate]);

  useEffect(() => {
    if (!isOnline) { setLoading(false); setError(true); return; }
    const fetchNews = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.islampos.com/feed/');
        const json = await res.json();
        if (json.status === 'ok') {
          setNews(json.items.slice(0, 20).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            description: item.description?.replace(/<[^>]*>/g, '').slice(0, 120) || '',
            thumbnail: item.thumbnail || item.enclosure?.link || '',
          })));
        } else setError(true);
      } catch { setError(true); }
      setLoading(false);
    };
    fetchNews();
  }, [isOnline]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <OnlineIndicator />
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Beranda</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        <div className="flex items-center gap-1.5 mb-4">
          <Newspaper className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Berita Islam</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-card" />
            ))}
          </div>
        ) : error || news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <WifiOff className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium">Tidak bisa memuat berita</p>
            <p className="text-xs mt-1">Periksa koneksi internet Anda</p>
          </div>
        ) : (
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
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default Index;
