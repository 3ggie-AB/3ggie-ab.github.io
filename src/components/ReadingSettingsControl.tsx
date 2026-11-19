import { SlidersHorizontal, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  type ReadingTheme,
  type ReadingPreferences,
  THEME_CLASSES,
} from '@/lib/readingPreferences';

interface Props {
  preferences: ReadingPreferences;
  onUpdate: (patch: Partial<ReadingPreferences>) => void;
}

const THEME_OPTIONS: { key: ReadingTheme; label: string; previewBg: string; previewText: string }[] = [
  { key: 'default', label: 'Bawaan', previewBg: 'bg-zinc-800', previewText: 'text-zinc-200' },
  { key: 'sepia', label: 'Sepia', previewBg: 'bg-[#ebdcb9]', previewText: 'text-[#433422]' },
  { key: 'emerald', label: 'Emerald', previewBg: 'bg-[#104e38]', previewText: 'text-emerald-100' },
  { key: 'midnight', label: 'Midnight', previewBg: 'bg-black border border-zinc-700', previewText: 'text-white' },
];

export const ReadingSettingsControl = ({ preferences, onUpdate }: Props) => {
  const { showLatin, showTranslation, theme } = preferences;

  const setPreset = (latin: boolean, translation: boolean) => {
    onUpdate({ showLatin: latin, showTranslation: translation });
  };

  const isPresetActive = (latin: boolean, translation: boolean) =>
    showLatin === latin && showTranslation === translation;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
          title="Pengaturan Tampilan & Tema Bacaan"
          aria-label="Pengaturan Tampilan Bacaan"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-3 space-y-3.5 text-sm shadow-xl">
        {/* Header Title */}
        <div className="flex items-center justify-between pb-1 border-b border-border">
          <span className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
            Tampilan Bacaan
          </span>
          <span className="text-[11px] text-muted-foreground">Preferensi</span>
        </div>

        {/* Quick Mode Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">
            Mode Cepat
          </label>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <Button
              variant={isPresetActive(true, true) ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs font-medium justify-center"
              onClick={() => setPreset(true, true)}
            >
              Lengkap
            </Button>
            <Button
              variant={isPresetActive(false, false) ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs font-medium justify-center"
              onClick={() => setPreset(false, false)}
            >
              Hanya Arab
            </Button>
            <Button
              variant={isPresetActive(true, false) ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs font-medium justify-center"
              onClick={() => setPreset(true, false)}
            >
              Arab + Latin
            </Button>
            <Button
              variant={isPresetActive(false, true) ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs font-medium justify-center"
              onClick={() => setPreset(false, true)}
            >
              Arab + Arti
            </Button>
          </div>
        </div>

        {/* Individual Toggles */}
        <div className="space-y-2 pt-1 border-t border-border">
          <div className="flex items-center justify-between py-0.5">
            <Label htmlFor="toggle-latin" className="text-xs cursor-pointer font-medium flex flex-col">
              <span>Bacaan Bantu (Latin)</span>
              <span className="text-[10px] text-muted-foreground font-normal">Cara pengucapan bunyi</span>
            </Label>
            <Switch
              id="toggle-latin"
              checked={showLatin}
              onCheckedChange={(checked) => onUpdate({ showLatin: checked })}
            />
          </div>

          <div className="flex items-center justify-between py-0.5">
            <Label htmlFor="toggle-trans" className="text-xs cursor-pointer font-medium flex flex-col">
              <span>Artinya (Terjemahan)</span>
              <span className="text-[10px] text-muted-foreground font-normal">Makna dalam bahasa Indonesia</span>
            </Label>
            <Switch
              id="toggle-trans"
              checked={showTranslation}
              onCheckedChange={(checked) => onUpdate({ showTranslation: checked })}
            />
          </div>
        </div>

        {/* Custom Theme Selector */}
        <div className="space-y-1.5 pt-1 border-t border-border">
          <label className="text-[11px] font-semibold text-muted-foreground uppercase">
            Tema Bacaan
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onUpdate({ theme: opt.key })}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md border text-xs font-medium transition-all ${
                    active
                      ? 'border-primary ring-1 ring-primary font-semibold'
                      : 'border-border hover:bg-accent/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded-full ${opt.previewBg}`} />
                    <span>{opt.label}</span>
                  </div>
                  {active && <Check className="h-3 w-3 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ReadingSettingsControl;
