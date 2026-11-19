import React from 'react';
import { Bet, BetType } from '@/lib/roulette/types';
import { RED_NUMBERS, getCoveredNumbers, getBetPayoutMultiplier } from '@/lib/roulette/constants';
import { soundManager } from '@/lib/roulette/audio';

interface RouletteTableProps {
  bets: Bet[];
  selectedChip: number;
  onAddBet: (bet: Bet) => void;
  onRemoveBet: (betId: string) => void;
  disabled?: boolean;
  hoveredBetNumbers: number[] | null;
  onHoverBetNumbers: (numbers: number[] | null) => void;
}

export const RouletteTable: React.FC<RouletteTableProps> = ({
  bets,
  selectedChip,
  onAddBet,
  onRemoveBet,
  disabled = false,
  hoveredBetNumbers,
  onHoverBetNumbers,
}) => {
  const getBet = (type: BetType, target?: number) => {
    const id = target !== undefined ? `${type}_${target}` : type;
    return bets.find((b) => b.id === id);
  };

  const handleCellClick = (type: BetType, label: string, target?: number) => {
    if (disabled) return;
    const id = target !== undefined ? `${type}_${target}` : type;
    const existing = bets.find((b) => b.id === id);

    soundManager.playChip();

    const covered = getCoveredNumbers(type, target);
    const multiplier = getBetPayoutMultiplier(type);

    if (existing) {
      onAddBet({
        ...existing,
        amount: existing.amount + selectedChip,
      });
    } else {
      onAddBet({
        id,
        type,
        target,
        amount: selectedChip,
        payoutMultiplier: multiplier,
        label,
        coveredNumbers: covered,
      });
    }
  };

  const handleContextMenu = (e: React.MouseEvent, type: BetType, target?: number) => {
    e.preventDefault();
    if (disabled) return;
    const id = target !== undefined ? `${type}_${target}` : type;
    onRemoveBet(id);
  };

  // 3 Rows of numbers:
  // Row 3: 3, 6, 9 ... 36
  // Row 2: 2, 5, 8 ... 35
  // Row 1: 1, 4, 7 ... 34
  const row3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
  const row2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
  const row1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];

  // Helper chip badge component
  const ChipBadge: React.FC<{ amount: number }> = ({ amount }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 text-stone-950 font-black text-[10px] sm:text-xs flex items-center justify-center border-2 border-stone-900 shadow-md animate-in zoom-in-75">
        ${amount > 999 ? `${(amount / 1000).toFixed(0)}k` : amount}
      </div>
    </div>
  );

  const renderNumberCell = (num: number) => {
    const isRed = RED_NUMBERS.has(num);
    const bet = getBet('straight', num);
    const isHovered = hoveredBetNumbers?.includes(num);

    return (
      <button
        key={num}
        type="button"
        disabled={disabled}
        onClick={() => handleCellClick('straight', `#${num}`, num)}
        onContextMenu={(e) => handleContextMenu(e, 'straight', num)}
        onMouseEnter={() => onHoverBetNumbers([num])}
        onMouseLeave={() => onHoverBetNumbers(null)}
        className={`relative h-11 sm:h-12 border border-emerald-900/60 font-bold text-sm sm:text-base flex items-center justify-center transition-all select-none ${
          isRed ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-stone-900 hover:bg-stone-800 text-white'
        } ${isHovered ? 'ring-2 ring-amber-300 brightness-125 z-10' : ''}`}
      >
        <span className="z-10">{num}</span>
        {bet && <ChipBadge amount={bet.amount} />}
      </button>
    );
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="min-w-[620px] max-w-4xl mx-auto bg-emerald-950/80 p-3 sm:p-4 rounded-2xl border-2 border-emerald-800 shadow-2xl backdrop-blur-md">
        {/* Main Grid: Zero on left, 3x12 numbers, column bets on right */}
        <div className="grid grid-cols-[54px_repeat(12,1fr)_56px] gap-1">
          {/* Zero (spans 3 rows) */}
          {(() => {
            const bet0 = getBet('straight', 0);
            const isHovered = hoveredBetNumbers?.includes(0);
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('straight', '#0', 0)}
                onContextMenu={(e) => handleContextMenu(e, 'straight', 0)}
                onMouseEnter={() => onHoverBetNumbers([0])}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className={`row-span-3 relative rounded-l-lg bg-emerald-600 hover:bg-emerald-500 border border-emerald-800 text-white font-black text-xl flex items-center justify-center transition-all select-none ${
                  isHovered ? 'ring-2 ring-amber-300 brightness-125 z-10' : ''
                }`}
              >
                <span>0</span>
                {bet0 && <ChipBadge amount={bet0.amount} />}
              </button>
            );
          })()}

          {/* Row 3 (3, 6, 9... 36) */}
          {row3.map(renderNumberCell)}
          {/* Col 3 bet */}
          {(() => {
            const bet = getBet('col3');
            const covered = getCoveredNumbers('col3');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('col3', '2:1 (Baris 3)')}
                onContextMenu={(e) => handleContextMenu(e, 'col3')}
                onMouseEnter={() => onHoverBetNumbers(covered)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative rounded-r-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-xs sm:text-sm font-semibold text-emerald-200 flex items-center justify-center"
              >
                <span>2:1</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* Row 2 (2, 5, 8... 35) */}
          {row2.map(renderNumberCell)}
          {/* Col 2 bet */}
          {(() => {
            const bet = getBet('col2');
            const covered = getCoveredNumbers('col2');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('col2', '2:1 (Baris 2)')}
                onContextMenu={(e) => handleContextMenu(e, 'col2')}
                onMouseEnter={() => onHoverBetNumbers(covered)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative rounded-r-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-xs sm:text-sm font-semibold text-emerald-200 flex items-center justify-center"
              >
                <span>2:1</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* Row 1 (1, 4, 7... 34) */}
          {row1.map(renderNumberCell)}
          {/* Col 1 bet */}
          {(() => {
            const bet = getBet('col1');
            const covered = getCoveredNumbers('col1');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('col1', '2:1 (Baris 1)')}
                onContextMenu={(e) => handleContextMenu(e, 'col1')}
                onMouseEnter={() => onHoverBetNumbers(covered)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative rounded-r-lg bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700/60 text-xs sm:text-sm font-semibold text-emerald-200 flex items-center justify-center"
              >
                <span>2:1</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}
        </div>

        {/* Dozen Bets (1st 12, 2nd 12, 3rd 12) */}
        <div className="grid grid-cols-[54px_repeat(3,1fr)_56px] gap-1 mt-1">
          <div /> {/* Spacer for Zero */}
          {(() => {
            const bet = getBet('dozen1');
            const cov = getCoveredNumbers('dozen1');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('dozen1', '1st 12 (1-12)')}
                onContextMenu={(e) => handleContextMenu(e, 'dozen1')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700 text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center rounded-md"
              >
                <span>1st 12 (1 - 12)</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}
          {(() => {
            const bet = getBet('dozen2');
            const cov = getCoveredNumbers('dozen2');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('dozen2', '2nd 12 (13-24)')}
                onContextMenu={(e) => handleContextMenu(e, 'dozen2')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700 text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center rounded-md"
              >
                <span>2nd 12 (13 - 24)</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}
          {(() => {
            const bet = getBet('dozen3');
            const cov = getCoveredNumbers('dozen3');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('dozen3', '3rd 12 (25-36)')}
                onContextMenu={(e) => handleContextMenu(e, 'dozen3')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-700 text-xs sm:text-sm font-bold text-amber-300 flex items-center justify-center rounded-md"
              >
                <span>3rd 12 (25 - 36)</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}
          <div /> {/* Spacer for Column bets */}
        </div>

        {/* Outside Bets (1-18, EVEN, RED, BLACK, ODD, 19-36) */}
        <div className="grid grid-cols-[54px_repeat(6,1fr)_56px] gap-1 mt-1">
          <div /> {/* Spacer for Zero */}
          {/* Low (1-18) */}
          {(() => {
            const bet = getBet('low');
            const cov = getCoveredNumbers('low');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('low', '1-18 (Low)')}
                onContextMenu={(e) => handleContextMenu(e, 'low')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700 text-xs font-bold text-white flex items-center justify-center rounded-md"
              >
                <span>1 - 18</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* EVEN */}
          {(() => {
            const bet = getBet('even');
            const cov = getCoveredNumbers('even');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('even', 'EVEN (Genap)')}
                onContextMenu={(e) => handleContextMenu(e, 'even')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700 text-xs font-bold text-white flex items-center justify-center rounded-md"
              >
                <span>EVEN</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* RED */}
          {(() => {
            const bet = getBet('red');
            const cov = getCoveredNumbers('red');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('red', 'RED (Merah)')}
                onContextMenu={(e) => handleContextMenu(e, 'red')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-red-700 hover:bg-red-600 border border-red-500 text-xs font-black text-white flex items-center justify-center rounded-md gap-1"
              >
                <div className="w-3.5 h-3.5 rotate-45 bg-red-400 border border-white" />
                <span>RED</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* BLACK */}
          {(() => {
            const bet = getBet('black');
            const cov = getCoveredNumbers('black');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('black', 'BLACK (Hitam)')}
                onContextMenu={(e) => handleContextMenu(e, 'black')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-stone-900 hover:bg-stone-800 border border-stone-600 text-xs font-black text-white flex items-center justify-center rounded-md gap-1"
              >
                <div className="w-3.5 h-3.5 rotate-45 bg-stone-700 border border-stone-400" />
                <span>BLACK</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* ODD */}
          {(() => {
            const bet = getBet('odd');
            const cov = getCoveredNumbers('odd');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('odd', 'ODD (Ganjil)')}
                onContextMenu={(e) => handleContextMenu(e, 'odd')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700 text-xs font-bold text-white flex items-center justify-center rounded-md"
              >
                <span>ODD</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          {/* High (19-36) */}
          {(() => {
            const bet = getBet('high');
            const cov = getCoveredNumbers('high');
            return (
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleCellClick('high', '19-36 (High)')}
                onContextMenu={(e) => handleContextMenu(e, 'high')}
                onMouseEnter={() => onHoverBetNumbers(cov)}
                onMouseLeave={() => onHoverBetNumbers(null)}
                className="relative h-10 bg-emerald-900/70 hover:bg-emerald-800 border border-emerald-700 text-xs font-bold text-white flex items-center justify-center rounded-md"
              >
                <span>19 - 36</span>
                {bet && <ChipBadge amount={bet.amount} />}
              </button>
            );
          })()}

          <div /> {/* Spacer for Column bets */}
        </div>

        <div className="mt-2 text-[11px] text-emerald-400/80 flex items-center justify-between px-1">
          <span>* Klik sel untuk tambah chip (${selectedChip}). Klik kanan untuk hapus taruhan.</span>
          <span>Payout: Straight 35:1 | Dozen/Col 2:1 | Outside 1:1</span>
        </div>
      </div>
    </div>
  );
};
