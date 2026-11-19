import { AArrowDown, AArrowUp, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FONT_SCALE_MAX, FONT_SCALE_MIN, FONT_SCALE_STEP } from '@/lib/fontSize';

interface Props {
  scale: number;
  onChange: (scale: number) => void;
}

const FontSizeControl = ({ scale, onChange }: Props) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="icon" className="h-9 w-9" title="Ukuran teks" aria-label="Ukuran teks">
        <Type className="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="end" className="w-auto p-2">
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Perkecil teks"
          disabled={scale <= FONT_SCALE_MIN}
          onClick={() => onChange(scale - FONT_SCALE_STEP)}
        >
          <AArrowDown className="h-4 w-4" />
        </Button>
        <button
          className="w-14 text-center text-sm font-medium tabular-nums text-foreground"
          title="Kembalikan ke ukuran normal"
          onClick={() => onChange(1)}
        >
          {Math.round(scale * 100)}%
        </button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          aria-label="Perbesar teks"
          disabled={scale >= FONT_SCALE_MAX}
          onClick={() => onChange(scale + FONT_SCALE_STEP)}
        >
          <AArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </PopoverContent>
  </Popover>
);

export default FontSizeControl;
