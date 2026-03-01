import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyCache, setDailyCache } from '@/hooks/use-daily-cache';

const CACHE_KEY = 'cal_today';

interface CalData {
  tanggalMasehi: string;
  tanggalHijriah: string;
  hari: string;
}

export default function CalendarWidget() {
  const [data, setData] = useState<CalData | null>(getDailyCache<CalData>(CACHE_KEY));
  const [loading, setLoading] = useState(!data);

  useEffect(() => {
    if (data) return;
    (async () => {
      try {
        const res = await fetch('https://api.myquran.com/v3/cal/today');
        const json = await res.json();
        if (json.status) {
          const d: CalData = {
            tanggalMasehi: json.data?.tanggal?.masehi || '',
            tanggalHijriah: json.data?.tanggal?.hijriah || '',
            hari: json.data?.hari || '',
          };
          setData(d);
          setDailyCache(CACHE_KEY, d);
        }
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, [data]);

  if (loading) return <Skeleton className="h-20 w-full rounded-lg" />;
  if (!data) return null;

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex items-center gap-3 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{data.hari}</p>
          <p className="text-xs text-muted-foreground">{data.tanggalMasehi}</p>
          <p className="text-xs text-primary font-medium">{data.tanggalHijriah}</p>
        </div>
      </CardContent>
    </Card>
  );
}
