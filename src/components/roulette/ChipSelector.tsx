import React from 'react';
import { CHIP_CONFIGS } from '@/lib/roulette/constants';
import { RotateCcw, Trash2, ArrowUpRight, DollarSign } from 'lucide-react';
import { soundManager } from '@/lib/roulette/audio';

interface ChipSelectorProps {
  selectedChip: number;
  onSelectChip: (value: number) => void;
  onClearBets: () => void;
  onDoubleBets: () => void;
  onRepeatBets: () => void;
  canRepeat: boolean;
  hasActiveBets: boolean;
  disabled?: boolean;
}

export const ChipSelector: React.FC<ChipSelectorProps> = ({
  selectedChip,
  onSelectChip,
  onClearBets,
  onDoubleBets,
  onRepeatBets,
  canRepeat,
  hasActiveBets,
  disabled = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-stone-900/90 rounded-2xl border border-stone-800 shadow-xl backdrop-blur-md">
      {/* Chips List */}
      <div className="flex items-center gap-2 overflow-x-auto py-1">
        <span className="text-xs font-semibold text-stone-400 mr-1 hidden sm:inline">Pilih Chip:</span>
        {CHIP_CONFIGS.map((chip) => {
          const isSelected = selectedChip === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              disabled={disabled}
              onClick={() => {
                soundManager.playChip();
                onSelectChip(chip.value);
              }}
              className={`relative group flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all transform active:scale-95 ${
                chip.color
              } ${chip.border} ${chip.textColor} ${
                isSelected
                  ? 'ring-4 ring-amber-400 shadow-lg scale-110 z-10'
                  : 'opacity-85 hover:opacity-100 hover:scale-105'
              }`}
            >
              {/* Inner dashed ring to mimic real casino poker chips */}
              <div className="absolute inset-1 rounded-full border border-dashed border-white/40 pointer-events-none" />
              <span className="font-black text-xs sm:text-sm tracking-tight">${chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Bet Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          disabled={disabled || !hasActiveBets}
          onClick={onDoubleBets}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border border-stone-700 transition-colors shadow-sm"
          title="Lipat gandakan nilai semua taruhan saat ini"
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          <span>2x Lipat</span>
        </button>

        <button
          type="button"
          disabled={disabled || !canRepeat}
          onClick={onRepeatBets}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-200 border border-stone-700 transition-colors shadow-sm"
          title="Ulangi taruhan putaran sebelumnya"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span>Ulangi</span>
        </button>

        <button
          type="button"
          disabled={disabled || !hasActiveBets}
          onClick={onClearBets}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/60 hover:bg-red-900/80 disabled:opacity-40 text-red-300 border border-red-800/60 transition-colors shadow-sm"
          title="Hapus semua taruhan di meja"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
};
