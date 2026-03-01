import { useState, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SurahAudioPlayerProps {
  audioFull: Record<string, string>;
  surahName: string;
}

const SurahAudioPlayer = ({ audioFull, surahName }: SurahAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioSrc = audioFull?.['05'] || audioFull?.['01'] || Object.values(audioFull || {})[0];

  if (!audioSrc) return null;

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-3 mb-4">
      <audio
        ref={audioRef}
        src={audioSrc}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={stop} className="h-9 w-9">
        <Square className="h-3.5 w-3.5" />
      </Button>
      <span className="text-sm text-muted-foreground truncate">
        {isPlaying ? `Memutar ${surahName}...` : `Putar Surat ${surahName}`}
      </span>
    </div>
  );
};

export default SurahAudioPlayer;
