import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, Share2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import OnlineIndicator from '@/components/OnlineIndicator';
import { JUZ_DATA, divideJuz, type JuzEntry } from '@/lib/juz';
import { fetchSurahs } from '@/lib/api';
import type { Surah } from '@/lib/db';
import { toast } from 'sonner';

const JuzPage = () => {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [totalJuz, setTotalJuz] = useState(30);
  const [startJuz, setStartJuz] = useState(1);
  const [totalPeople, setTotalPeople] = useState(6);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchSurahs().then(setSurahs);
  }, []);

  const getSurahName = (num: number) => surahs.find(s => s.nomor === num)?.namaLatin || `Surah ${num}`;

  const formatJuzRange = (juz: JuzEntry) => {
    return `${getSurahName(juz.start.surah)}:${juz.start.ayat} - ${getSurahName(juz.end.surah)}:${juz.end.ayat}`;
  };

  const divisions = divideJuz(
    Math.min(totalJuz, 30),
    Math.max(1, Math.min(startJuz, 30)),
    Math.max(1, totalPeople)
  );

  const handleCopyDivision = () => {
    const text = divisions.map(d =>
      `Orang ${d.person}: Juz ${d.juzList.join(', ')}`
    ).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast.success('Berhasil disalin!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = async () => {
    const text = `📖 Pembagian Juz Al-Quran\n${totalJuz} Juz untuk ${totalPeople} orang:\n\n` +
      divisions.map(d => `👤 Orang ${d.person}: Juz ${d.juzList.join(', ')}`).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Pembagian Juz Al-Quran', text });
      } catch { /* cancelled */ }
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Juz</h1>
            <OnlineIndicator />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        <Tabs defaultValue="list">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="list" className="flex-1">Daftar Juz</TabsTrigger>
            <TabsTrigger value="divide" className="flex-1">Bagi Juz</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-2">
              {JUZ_DATA.map((juz, i) => (
                <button
                  key={juz.juz}
                  onClick={() => navigate(`/surah/${juz.start.surah}`)}
                  className="flex w-full items-center gap-4 rounded-lg border border-border bg-card p-3 text-left transition-all hover:bg-accent animate-slide-up"
                  style={{ animationDelay: `${Math.min(i * 20, 300)}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-semibold text-secondary-foreground">
                    {juz.juz}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground">Juz {juz.juz}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatJuzRange(juz)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="divide">
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Pembagian Juz
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Total Juz</label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={totalJuz}
                      onChange={(e) => setTotalJuz(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Mulai Juz</label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={startJuz}
                      onChange={(e) => setStartJuz(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Jumlah Orang</label>
                    <Input
                      type="number"
                      min={1}
                      max={30}
                      value={totalPeople}
                      onChange={(e) => setTotalPeople(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleCopyDivision}>
                    {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                    {copied ? 'Disalin' : 'Salin'}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                    <Share2 className="h-3.5 w-3.5 mr-1" />
                    Bagikan
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {divisions.map((div) => (
                  <div
                    key={div.person}
                    className="rounded-lg border border-border bg-card p-3 animate-slide-up"
                    style={{ animationDelay: `${div.person * 30}ms`, animationFillMode: 'backwards' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {div.person}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Orang {div.person}</p>
                        <p className="text-xs text-muted-foreground">
                          Juz {div.juzList.join(', ')} ({div.juzList.length} juz)
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
};

export default JuzPage;
