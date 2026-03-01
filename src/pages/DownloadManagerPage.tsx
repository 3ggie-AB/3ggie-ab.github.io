import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, CheckCircle2, HardDrive, ArrowLeft, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import BottomNav from '@/components/BottomNav';
import { fetchSurahs, downloadSurah, getAllDownloadStatus, isSurahFullyDownloaded } from '@/lib/api';
import { db, type Surah, type DownloadStatus } from '@/lib/db';
import { toast } from 'sonner';

const DownloadManagerPage = () => {
  const navigate = useNavigate();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [statusMap, setStatusMap] = useState<Record<number, DownloadStatus>>({});
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [dlPhase, setDlPhase] = useState('');
  const [dlDone, setDlDone] = useState(0);
  const [dlTotal, setDlTotal] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);
  const [allDone, setAllDone] = useState(0);

  const refreshStatus = useCallback(async () => {
    const statuses = await getAllDownloadStatus();
    const map: Record<number, DownloadStatus> = {};
    statuses.forEach((s) => (map[s.surahNomor] = s));
    setStatusMap(map);
  }, []);

  useEffect(() => {
    (async () => {
      const data = await fetchSurahs();
      setSurahs(data);
      await refreshStatus();
      setLoading(false);
    })();
  }, [refreshStatus]);

  const totalDownloaded = Object.values(statusMap).filter((s) => s.textDone && s.audioDone).length;
  const overallPercent = surahs.length > 0 ? Math.round((totalDownloaded / 114) * 100) : 0;

  const handleDownload = async (nomor: number) => {
    const done = await isSurahFullyDownloaded(nomor);
    if (done) {
      toast.info('Surat ini sudah terunduh sepenuhnya.');
      return;
    }
    setDownloadingId(nomor);
    setDlPhase('');
    setDlDone(0);
    setDlTotal(0);
    try {
      await downloadSurah(nomor, (phase, d, t) => {
        setDlPhase(phase);
        setDlDone(d);
        setDlTotal(t);
      });
      toast.success('Berhasil diunduh! ✅');
      await refreshStatus();
    } catch {
      toast.error('Gagal mengunduh.');
    }
    setDownloadingId(null);
  };

  const handleDownloadAll = async () => {
    if (downloadingAll) return;
    setDownloadingAll(true);
    setAllDone(0);
    toast('Mulai mengunduh semua data + audio...');
    try {
      for (let i = 0; i < surahs.length; i++) {
        const s = surahs[i];
        const done = await isSurahFullyDownloaded(s.nomor);
        if (!done) {
          setDownloadingId(s.nomor);
          await downloadSurah(s.nomor, (phase, d, t) => {
            setDlPhase(phase);
            setDlDone(d);
            setDlTotal(t);
          });
        }
        setAllDone(i + 1);
        await refreshStatus();
      }
      toast.success('Semua data berhasil diunduh! ✅');
    } catch {
      toast.error('Gagal mengunduh semua data.');
    }
    setDownloadingId(null);
    setDownloadingAll(false);
  };

  const handleClearAll = async () => {
    await db.audioCache.clear();
    await db.downloadStatus.clear();
    await refreshStatus();
    toast.success('Cache unduhan dihapus.');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <HardDrive className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Unduhan</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClearAll} title="Hapus cache">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {/* Overall Progress */}
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Progress Keseluruhan</p>
              <p className="text-xs text-muted-foreground">{totalDownloaded}/114 surat terunduh (teks + audio)</p>
            </div>
            <span className="text-2xl font-bold text-primary">{overallPercent}%</span>
          </div>
          <Progress value={overallPercent} className="h-3" />
          <Button
            className="w-full"
            onClick={handleDownloadAll}
            disabled={downloadingAll || overallPercent === 100}
          >
            {overallPercent === 100 ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" /> Semua Sudah Terunduh
              </>
            ) : downloadingAll ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Mengunduh... ({allDone}/114)
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" /> Unduh Semua
              </>
            )}
          </Button>
        </div>

        {/* Per-Surah List */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-card" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {surahs.map((surah) => {
              const st = statusMap[surah.nomor];
              const isDone = st?.textDone && st?.audioDone;
              const isDownloading = downloadingId === surah.nomor;
              const ayatProgress = isDownloading && dlTotal > 0 && dlPhase === 'audio'
                ? Math.round((dlDone / dlTotal) * 100)
                : isDone ? 100 : 0;

              return (
                <div
                  key={surah.nomor}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold text-secondary-foreground">
                    {surah.nomor}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground truncate">{surah.namaLatin}</span>
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      ) : isDownloading ? (
                        <span className="text-xs font-medium text-primary shrink-0">
                          {dlPhase === 'teks' ? 'Teks...' : `${ayatProgress}%`}
                        </span>
                      ) : null}
                    </div>
                    {isDownloading ? (
                      <Progress value={dlPhase === 'teks' ? 100 : ayatProgress} className="h-1.5 mt-1" />
                    ) : isDone ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-muted-foreground">Teks ✓</span>
                        <span className="text-[10px] text-muted-foreground">Audio ✓</span>
                        <span className="text-[10px] text-muted-foreground">· {surah.jumlahAyat} ayat</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">{surah.jumlahAyat} ayat · Belum diunduh</span>
                    )}
                  </div>

                  {!isDone && !isDownloading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => handleDownload(surah.nomor)}
                      disabled={downloadingAll}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default DownloadManagerPage;
