import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, SkipBack, Square, Timer, ChevronDown, ChevronUp, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Surah } from '@/lib/db';

interface QuranPlayerProps {
  surahs: Surah[];
}

const TIMER_OPTIONS = [
  { label: 'Tanpa Timer', value: 0 },
  { label: '15 Menit', value: 15 },
  { label: '30 Menit', value: 30 },
  { label: '1 Jam', value: 60 },
  { label: '2 Jam', value: 120 },
  { label: '3 Jam', value: 180 },
];

const QuranPlayer = ({ surahs }: QuranPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurahIdx, setCurrentSurahIdx] = useState(0);
  const [startSurah, setStartSurah] = useState(1);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [started, setStarted] = useState(false);

  const sortedSurahs = surahs.slice().sort((a, b) => a.nomor - b.nomor);
  const playlist = sortedSurahs.filter((s) => s.nomor >= startSurah);
  const currentSurah = playlist[currentSurahIdx];

  const getAudioSrc = (surah: Surah) => {
    return surah.audioFull?.['05'] || surah.audioFull?.['01'] || Object.values(surah.audioFull || {})[0] || '';
  };

  // Timer countdown
  useEffect(() => {
    if (timerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Timer expired — stop
            stopPlayback();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeRemaining]);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setTimerActive(false);
    setTimeRemaining(0);
    setStarted(false);
    setCurrentSurahIdx(0);
    setAudioProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const startPlayback = () => {
    if (playlist.length === 0) return;
    setStarted(true);
    setCurrentSurahIdx(0);
    setIsPlaying(true);
    if (timerMinutes > 0) {
      setTimeRemaining(timerMinutes * 60);
      setTimerActive(true);
    }
    // Audio will play via useEffect
  };

  // Play current surah audio when currentSurahIdx or started changes
  useEffect(() => {
    if (!started || !audioRef.current || !currentSurah) return;
    const src = getAudioSrc(currentSurah);
    if (!src) return;
    audioRef.current.src = src;
    audioRef.current.play().catch(() => {});
    setIsPlaying(true);
  }, [currentSurahIdx, started]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const nextSurah = () => {
    if (currentSurahIdx < playlist.length - 1) {
      setCurrentSurahIdx((prev) => prev + 1);
    } else {
      stopPlayback();
    }
  };

  const prevSurah = () => {
    if (currentSurahIdx > 0) {
      setCurrentSurahIdx((prev) => prev - 1);
    }
  };

  const handleEnded = () => {
    nextSurah();
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const { currentTime, duration } = audioRef.current;
    if (duration) setAudioProgress((currentTime / duration) * 100);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (surahs.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-border bg-card overflow-hidden animate-fade-in">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        preload="none"
      />

      {/* Collapsed header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">Murottal Player</span>
          {started && currentSurah && (
            <span className="text-xs text-muted-foreground">· {currentSurah.namaLatin}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {timerActive && timeRemaining > 0 && (
            <span className="text-xs font-mono text-primary">{formatTime(timeRemaining)}</span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>

      {/* Progress bar (always visible when playing) */}
      {started && <Progress value={audioProgress} className="h-1 rounded-none" />}

      {/* Expanded panel */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 space-y-4 animate-fade-in">
          {/* Settings (before starting) */}
          {!started && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">Mulai dari Surat</label>
                  <Select value={startSurah.toString()} onValueChange={(v) => setStartSurah(Number(v))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {sortedSurahs.map((s) => (
                        <SelectItem key={s.nomor} value={s.nomor.toString()}>
                          {s.nomor}. {s.namaLatin}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1">
                    <Timer className="h-3 w-3" /> Timer
                  </label>
                  <Select value={timerMinutes.toString()} onValueChange={(v) => setTimerMinutes(Number(v))}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIMER_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={startPlayback} className="w-full gap-2">
                <Play className="h-4 w-4" />
                Mulai Putar dari Surat {sortedSurahs.find((s) => s.nomor === startSurah)?.namaLatin}
              </Button>
            </div>
          )}

          {/* Player controls (after starting) */}
          {started && currentSurah && (
            <div className="space-y-3">
              {/* Now playing info */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Sedang Diputar</p>
                <p className="text-sm font-semibold text-foreground">{currentSurah.nomor}. {currentSurah.namaLatin}</p>
                <p className="arabic-text text-lg text-foreground">{currentSurah.nama}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Surat {currentSurahIdx + 1} dari {playlist.length}
                  {timerActive && ` · Sisa ${formatTime(timeRemaining)}`}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button variant="ghost" size="icon" onClick={prevSurah} disabled={currentSurahIdx === 0} className="h-10 w-10">
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button variant="default" size="icon" onClick={togglePlay} className="h-12 w-12 rounded-full">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={nextSurah} disabled={currentSurahIdx >= playlist.length - 1} className="h-10 w-10">
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={stopPlayback} className="h-10 w-10">
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuranPlayer;
