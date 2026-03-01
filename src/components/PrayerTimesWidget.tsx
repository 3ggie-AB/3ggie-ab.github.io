import { useState, useEffect, useMemo } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getDailyCache, setDailyCache } from '@/hooks/use-daily-cache';

const PRAYERS = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'] as const;
const LABELS: Record<string, string> = { subuh: 'Subuh', dzuhur: 'Dzuhur', ashar: 'Ashar', maghrib: 'Maghrib', isya: 'Isya' };

interface PrayerData {
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getCacheKey(city: string) {
  return `prayer_${city}`;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function nowMinutes(): number {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function formatCountdown(mins: number): string {
  if (mins <= 0) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}j ${m}m lagi`;
  return `${m}m lagi`;
}

export default function PrayerTimesWidget() {
  const city = 'jakarta';
  const cacheKey = getCacheKey(city);
  const [data, setData] = useState<PrayerData | null>(getDailyCache<PrayerData>(cacheKey));
  const [loading, setLoading] = useState(!data);
  const [now, setNow] = useState(nowMinutes());

  useEffect(() => {
    if (data) return;
    (async () => {
      try {
        const res = await fetch(`https://api.myquran.com/v3/sholat/${city}/${getToday()}`);
        const json = await res.json();
        if (json.status && json.data) {
          const d: PrayerData = {
            subuh: json.data.subuh || '',
            dzuhur: json.data.dzuhur || '',
            ashar: json.data.ashar || '',
            maghrib: json.data.maghrib || '',
            isya: json.data.isya || '',
          };
          setData(d);
          setDailyCache(cacheKey, d);
        }
      } catch { /* silent */ }
      setLoading(false);
    })();
  }, [data, cacheKey]);

  // Update "now" every 30s for countdown
  useEffect(() => {
    const interval = setInterval(() => setNow(nowMinutes()), 30000);
    return () => clearInterval(interval);
  }, []);

  const nextPrayer = useMemo(() => {
    if (!data) return null;
    for (const p of PRAYERS) {
      const mins = timeToMinutes(data[p]);
      if (mins > now) return { name: p, diff: mins - now };
    }
    return null;
  }, [data, now]);

  if (loading) return <Skeleton className="h-40 w-full rounded-lg" />;
  if (!data) return null;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Waktu Sholat</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="text-xs capitalize">{city}</span>
          </div>
        </div>

        {nextPrayer && (
          <div className="mb-3 rounded-md bg-primary/10 px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Sholat berikutnya</p>
            <p className="text-sm font-bold text-primary">{LABELS[nextPrayer.name]} — {formatCountdown(nextPrayer.diff)}</p>
          </div>
        )}

        <div className="grid grid-cols-5 gap-1">
          {PRAYERS.map((p) => {
            const isNext = nextPrayer?.name === p;
            return (
              <div
                key={p}
                className={`flex flex-col items-center rounded-md py-2 ${isNext ? 'bg-primary/10' : ''}`}
              >
                <span className={`text-[10px] font-medium ${isNext ? 'text-primary' : 'text-muted-foreground'}`}>
                  {LABELS[p]}
                </span>
                <span className={`text-xs font-semibold mt-0.5 ${isNext ? 'text-primary' : 'text-foreground'}`}>
                  {data[p]}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
