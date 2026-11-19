import React, { useState } from 'react';
import { Bet, MonteCarloResult } from '@/lib/roulette/types';
import { runMonteCarloSimulation } from '@/lib/roulette/probabilityEngine';
import { Play, RotateCcw, Activity, TrendingDown, Percent, Layers } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface MonteCarloSimulatorProps {
  bets: Bet[];
  currentBalance: number;
}

export const MonteCarloSimulator: React.FC<MonteCarloSimulatorProps> = ({
  bets,
  currentBalance,
}) => {
  const [spinCount, setSpinCount] = useState<number>(500);
  const [result, setResult] = useState<MonteCarloResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const totalBet = bets.reduce((s, b) => s + b.amount, 0);

  const handleRun = () => {
    if (totalBet === 0 || bets.length === 0) return;
    setIsSimulating(true);

    setTimeout(() => {
      const res = runMonteCarloSimulation(bets, currentBalance > 0 ? currentBalance : 1000, spinCount);
      setResult(res);
      setIsSimulating(false);
    }, 150);
  };

  return (
    <div className="bg-stone-900/90 rounded-2xl border border-stone-800 p-4 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div>
          <h3 className="text-base font-bold text-stone-200 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Simulator Monte Carlo (Backtest Strategi)</span>
          </h3>
          <p className="text-xs text-stone-400">
            Uji coba ribuan putaran dalam sekejap dengan kombinasi taruhan Anda saat ini.
          </p>
        </div>

        {/* Spin Count Selector & Run Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-stone-950 border border-stone-800 p-0.5 text-xs font-semibold">
            {[100, 500, 1000, 2500].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setSpinCount(count)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  spinCount === count
                    ? 'bg-amber-500 text-stone-950 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={totalBet === 0 || isSimulating}
            onClick={handleRun}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-md transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Menghitung...' : 'Mulai Simulasi'}</span>
          </button>
        </div>
      </div>

      {totalBet === 0 ? (
        <div className="text-center py-8 text-stone-400 text-xs">
          <Layers className="w-8 h-8 text-stone-400/50 mx-auto mb-2" />
          Pasang taruhan di meja roulette di atas untuk menjalankan simulasi Monte Carlo.
        </div>
      ) : result ? (
        <div className="mt-4 space-y-4">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Saldo Akhir</span>
              <span
                className={`text-base font-black ${
                  result.finalBalance >= result.initialBalance ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ${result.finalBalance}
              </span>
              <span className="text-[10px] text-stone-400 block">
                {result.netProfit >= 0 ? '+' : ''}${result.netProfit} Net
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Win Rate Simulasi</span>
              <span className="text-base font-black text-amber-400">
                {result.winRate.toFixed(1)}%
              </span>
              <span className="text-[10px] text-stone-400 block">
                dari {result.spinsRun} putaran
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Max Drawdown</span>
              <span className="text-base font-black text-rose-400">
                -${result.maxDrawdown}
              </span>
              <span className="text-[10px] text-stone-400 block">
                Penurunan terdalam
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950/70 border border-stone-800">
              <span className="text-[10px] text-stone-400 block">Total Dipertaruhkan</span>
              <span className="text-base font-black text-blue-400">
                ${result.totalWagered}
              </span>
              <span className="text-[10px] text-stone-400 block">
                ${totalBet}/putaran
              </span>
            </div>
          </div>

          {/* Balance Curve Line Chart */}
          <div className="h-56 w-full pt-2">
            <div className="text-[11px] font-semibold text-stone-400 mb-1 flex items-center justify-between">
              <span>Kurva Fluktuasi Saldo Terhadap Putaran (Trajectory)</span>
              <span>Modal Awal: ${result.initialBalance}</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#292524" />
                <XAxis
                  dataKey="spin"
                  stroke="#78716c"
                  fontSize={10}
                  tickLine={false}
                  label={{ value: 'Spin', position: 'insideBottomRight', offset: -4, fill: '#78716c', fontSize: 10 }}
                />
                <YAxis
                  stroke="#78716c"
                  fontSize={10}
                  tickLine={false}
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderColor: '#44403c', borderRadius: '8px', fontSize: '11px' }}
                  labelStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                  formatter={(val: number) => [`$${val}`, 'Saldo']}
                  labelFormatter={(lbl) => `Spin #${lbl}`}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke={result.netProfit >= 0 ? '#10b981' : '#f43f5e'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-stone-400 text-xs">
          Klik tombol <strong>"Mulai Simulasi"</strong> untuk melihat proyeksi matematis jangka panjang strategi Anda.
        </div>
      )}
    </div>
  );
};
