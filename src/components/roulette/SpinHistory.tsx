import React from 'react';
import { SpinRecord } from '@/lib/roulette/types';
import { RED_NUMBERS } from '@/lib/roulette/constants';
import { History, Trash2 } from 'lucide-react';

interface SpinHistoryProps {
  spins: SpinRecord[];
  onClearHistory: () => void;
}

export const SpinHistory: React.FC<SpinHistoryProps> = ({ spins, onClearHistory }) => {
  // Recent 12 numbers for top ticker
  const recentSpins = spins.slice(0, 16);

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-stone-800">
        <h3 className="text-sm font-bold text-stone-200 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>Riwayat Putaran ({spins.length})</span>
        </h3>
        {spins.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[11px] font-semibold text-stone-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Reset Riwayat</span>
          </button>
        )}
      </div>

      {/* Top Ticker Badges */}
      <div className="pt-3 pb-2">
        <span className="text-[11px] font-medium text-stone-400 block mb-1.5">Angka Terbaru (Kiri = Paling Baru):</span>
        {recentSpins.length === 0 ? (
          <p className="text-xs text-stone-400 italic">Belum ada putaran dalam sesi ini.</p>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {recentSpins.map((s, idx) => {
              const isZero = s.winningNumber === 0;
              const isRed = RED_NUMBERS.has(s.winningNumber);
              return (
                <div
                  key={s.id}
                  className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full text-xs font-black text-white shadow-md transition-all ${
                    idx === 0 ? 'ring-2 ring-amber-400 scale-105' : 'opacity-85'
                  } ${
                    isZero
                      ? 'bg-emerald-600'
                      : isRed
                      ? 'bg-red-600'
                      : 'bg-stone-950 border border-stone-700'
                  }`}
                  title={`Putaran #${s.spinNumber}: ${s.winningNumber}`}
                >
                  {s.winningNumber}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Table */}
      {spins.length > 0 && (
        <div className="mt-2 max-h-56 overflow-y-auto rounded-xl border border-stone-800/80">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-stone-950 text-stone-400 sticky top-0 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Angka</th>
                <th className="py-2 px-3">Warna</th>
                <th className="py-2 px-3">Taruhan</th>
                <th className="py-2 px-3">Hasil Netto</th>
                <th className="py-2 px-3">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {spins.map((s) => {
                const isZero = s.winningNumber === 0;
                const isRed = RED_NUMBERS.has(s.winningNumber);
                return (
                  <tr key={s.id} className="hover:bg-stone-800/40">
                    <td className="py-2 px-3 font-semibold text-stone-400">#{s.spinNumber}</td>
                    <td className="py-2 px-3 font-black">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold text-white ${
                          isZero
                            ? 'bg-emerald-600'
                            : isRed
                            ? 'bg-red-600'
                            : 'bg-stone-950 border border-stone-700'
                        }`}
                      >
                        {s.winningNumber}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium">
                      {isZero ? (
                        <span className="text-emerald-400">Hijau</span>
                      ) : isRed ? (
                        <span className="text-red-400">Merah</span>
                      ) : (
                        <span className="text-stone-300">Hitam</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-stone-300">${s.totalBet}</td>
                    <td
                      className={`py-2 px-3 font-bold ${
                        s.netProfit > 0
                          ? 'text-emerald-400'
                          : s.netProfit < 0
                          ? 'text-rose-400'
                          : 'text-stone-400'
                      }`}
                    >
                      {s.netProfit > 0 ? `+$${s.netProfit}` : `$${s.netProfit}`}
                    </td>
                    <td className="py-2 px-3 font-semibold text-stone-200">${s.balanceAfter}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
