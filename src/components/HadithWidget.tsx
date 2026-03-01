import { useState, useEffect } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyCache, setDailyCache } from '@/hooks/use-daily-cache';

const CACHE_KEY = 'hadith_daily';

interface HadithData {
  kitab: string;
  nomor: string;
  teks: string;
}

async function fetchHadith(): Promise<HadithData | null> {
  try {
    const res = await fetch('https://api.myquran.com/v3/hadis/enc/random');
    const json = await res.json();
    if (json.status) {
      return {
        kitab: json.data?.kitab || '',
        nomor: json.data?.nomor || '',
        teks: json.data?.teks?.replace(/<[^>]*>/g, '') || '',
      };
    }
  } catch { /* silent */ }
  return null;
}

export default function HadithWidget() {
  const [data, setData] = useState<HadithData | null>(getDailyCache<HadithData>(CACHE_KEY));
  const [loading, setLoading] = useState(!data);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (data) return;
    (async () => {
      const d = await fetchHadith();
      if (d) { setData(d); setDailyCache(CACHE_KEY, d); }
      setLoading(false);
    })();
  }, [data]);

  const handleRefresh = async () => {
    setRefreshing(true);
    const d = await fetchHadith();
    if (d) { setData(d); setDailyCache(CACHE_KEY, d); }
    setRefreshing(false);
  };

  if (loading) return <Skeleton className="h-32 w-full rounded-lg" />;
  if (!data) return null;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Hadis Harian</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mb-1.5">
          {data.kitab} — No. {data.nomor}
        </p>
        <p className="text-sm text-foreground leading-relaxed line-clamp-6">{data.teks}</p>
      </CardContent>
    </Card>
  );
}
