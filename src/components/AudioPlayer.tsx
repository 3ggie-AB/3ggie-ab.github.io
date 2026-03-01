import { useState, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
  ayatNumber: number;
}

const AudioPlayer = ({ src, ayatNumber }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex items-center gap-1">
      <audio
        ref={audioRef}
        src={src}
        onEnded={() => setIsPlaying(false)}
        preload="none"
      />
      <Button variant="ghost" size="icon" onClick={toggle} className="h-8 w-8">
        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </Button>
      <Button variant="ghost" size="icon" onClick={restart} className="h-8 w-8">
        <RotateCcw className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default AudioPlayer;
