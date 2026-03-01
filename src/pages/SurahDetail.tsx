import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, BookOpen, RefreshCw, Star } from 'lucide-react';
import { addHistory } from '@/lib/history';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import SurahAudioPlayer from '@/components/SurahAudioPlayer';
import ThemeToggle from '@/components/ThemeToggle';
import { fetchAyats, fetchSurahs, fetchTafsir } from '@/lib/api';
import { isShortcut, addShortcut, removeShortcut } from '@/lib/shortcuts';
import { toast } from 'sonner';
import type { Surah, Ayat, Tafsir } from '@/lib/db';

const SurahDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const surahId = parseInt(id || '1');

  const [surah, setSurah] = useState<Surah | null>(null);
  const [ayats, setAyats] = useState<Ayat[]>([]);
  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [openTafsir, setOpenTafsir] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFav, setIsFav] = useState(false);

  const load = async (force = false) => {
    if (force) setRefreshing(true);
    else setLoading(true);

    const [surahs, ayatData] = await Promise.all([
      fetchSurahs(false),
      fetchAyats(surahId, force),
    ]);

    setSurah(surahs.find((s) => s.nomor === surahId) || null);
    setAyats(ayatData);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    load();
    setIsFav(isShortcut(surahId));
  }, [surahId]);

  // Track history when surah loads
  useEffect(() => {
    if (surah) {
      addHistory({ surahNomor: surah.nomor, surahName: surah.namaLatin });
    }
  }, [surah]);

  const toggleShortcut = () => {
    if (isFav) {
      removeShortcut(surahId);
      setIsFav(false);
      toast('Shortcut dihapus');
    } else {
      addShortcut(surahId);
      setIsFav(true);
      toast('Shortcut ditambahkan');
    }
  };

  const loadTafsir = async (ayatNum: number) => {
    if (openTafsir === ayatNum) {
      setOpenTafsir(null);
      return;
    }
    if (tafsirs.length === 0) {
      const data = await fetchTafsir(surahId);
      setTafsirs(data);
    }
    setOpenTafsir(ayatNum);
  };

  const filtered = ayats.filter((a) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.nomorAyat.toString().includes(q) ||
      a.teksIndonesia.toLowerCase().includes(q) ||
      a.teksLatin.toLowerCase().includes(q)
    );
  });

  const getTafsirForAyat = (num: number) => tafsirs.find((t) => t.nomorAyat === num);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight">
                {surah?.namaLatin || `Surah ${surahId}`}
              </h1>
              {surah && (
                <p className="text-xs text-muted-foreground">{surah.arti} · {surah.jumlahAyat} ayat</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={isFav ? 'secondary' : 'ghost'}
              size="icon"
              className="h-9 w-9"
              onClick={toggleShortcut}
            >
              <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => load(true)} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Full Surah Audio Player */}
        {surah?.audioFull && (
          <SurahAudioPlayer audioFull={surah.audioFull} surahName={surah.namaLatin} />
        )}

        {/* Bismillah */}
        {surah && surahId !== 1 && surahId !== 9 && (
          <p className="arabic-text mb-6 text-center text-2xl text-foreground">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari ayat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-card" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((ayat, i) => (
              <div
                key={ayat.nomorAyat}
                className="rounded-lg border border-border bg-card p-4 animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 20, 200)}ms`, animationFillMode: 'backwards' }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                    {ayat.nomorAyat}
                  </span>
                  <div className="flex items-center gap-1">
                    {ayat.audio?.['05'] && <AudioPlayer src={ayat.audio['05']} ayatNumber={ayat.nomorAyat} />}
                    <Button
                      variant={openTafsir === ayat.nomorAyat ? 'secondary' : 'ghost'}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => loadTafsir(ayat.nomorAyat)}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="arabic-text mb-3 text-right text-2xl leading-loose text-foreground">
                  {ayat.teksArab}
                </p>
                <p className="mb-2 text-sm italic text-muted-foreground">{ayat.teksLatin}</p>
                <p className="text-sm text-foreground/80">{ayat.teksIndonesia}</p>

                {openTafsir === ayat.nomorAyat && (
                  <div className="mt-3 rounded-md bg-secondary p-3 animate-scale-in">
                    <p className="mb-1 text-xs font-semibold text-secondary-foreground">Tafsir</p>
                    <p className="text-sm text-secondary-foreground/80 leading-relaxed">
                      {getTafsirForAyat(ayat.nomorAyat)?.teks || 'Memuat tafsir...'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between pb-8">
          <Button
            variant="outline"
            size="sm"
            disabled={surahId <= 1}
            onClick={() => navigate(`/surah/${surahId - 1}`)}
          >
            ← Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={surahId >= 114}
            onClick={() => navigate(`/surah/${surahId + 1}`)}
          >
            Selanjutnya →
          </Button>
        </div>
      </main>
    </div>
  );
};

export default SurahDetail;
