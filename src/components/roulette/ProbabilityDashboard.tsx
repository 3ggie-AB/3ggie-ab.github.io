import React, { useState } from 'react';
import { Bet, HistoryStats, PredictionInsight, ProbabilityMetrics } from '@/lib/roulette/types';
import { calculateProbabilityMetrics, generatePredictionsAndInsights } from '@/lib/roulette/probabilityEngine';
import {
  Brain,
  TrendingUp,
  AlertTriangle,
  Flame,
  Snowflake,
  ShieldAlert,
  PieChart as PieIcon,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';

interface ProbabilityDashboardProps {
  bets: Bet[];
  historyStats: HistoryStats;
  balance: number;
}

export const ProbabilityDashboard: React.FC<ProbabilityDashboardProps> = ({
  bets,
  historyStats,
  balance,
}) => {
  const [activeTab, setActiveTab] = useState<'insights' | 'distribution' | 'sectors'>('insights');
  const metrics: ProbabilityMetrics = calculateProbabilityMetrics(bets);
  const insights: PredictionInsight[] = generatePredictionsAndInsights(historyStats, bets, balance);

  const totalSpins = historyStats.totalSpins;
  const redPct = totalSpins > 0 ? ((historyStats.redCount / totalSpins) * 100).toFixed(1) : '48.6';
  const blackPct = totalSpins > 0 ? ((historyStats.blackCount / totalSpins) * 100).toFixed(1) : '48.6';
  const greenPct = totalSpins > 0 ? ((historyStats.greenCount / totalSpins) * 100).toFixed(1) : '2.7';

  return (
    <div className="w-full bg-stone-900/90 rounded-2xl border border-stone-800 p-4 shadow-xl backdrop-blur-md">
      {/* Header with Live Coverage Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-stone-800">
        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-medium text-stone-400">Peluang Menang (Odds)</div>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            {metrics.winProbability.toFixed(1)}%
          </div>
          <div className="text-[10px] text-stone-400">
            {metrics.totalNumbersCovered} / 37 angka tertutup
          </div>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-medium text-stone-400">Total Taruhan Aktif</div>
          <div className="text-xl font-black text-amber-400 mt-0.5">
            ${metrics.totalBetAmount}
          </div>
          <div className="text-[10px] text-stone-400">
            {bets.length} jenis taruhan
          </div>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-medium text-stone-400">Nilai Harapan (Expected Value)</div>
          <div
            className={`text-xl font-black mt-0.5 ${
              metrics.expectedValue >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {metrics.totalBetAmount > 0 ? `${metrics.expectedValue.toFixed(2)}` : '$0.00'}
          </div>
          <div className="text-[10px] text-stone-400">
            House Edge teoretis: -2.70%
          </div>
        </div>

        <div className="bg-stone-950/70 p-3 rounded-xl border border-stone-800">
          <div className="text-[11px] font-medium text-stone-400">Potensi Hasil Netto</div>
          <div className="text-xl font-black text-blue-400 mt-0.5">
            {metrics.totalBetAmount > 0
              ? `${metrics.minWinPayout >= 0 ? '+' : ''}$${metrics.minWinPayout} s/d +$${metrics.maxWinPayout}`
              : '$0'}
          </div>
          <div className="text-[10px] text-stone-400">
            Rentang profit/loss
          </div>
        </div>
      </div>

      {/* Coverage Progress Bar */}
      <div className="py-3 border-b border-stone-800">
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-stone-300">Cakupan Angka Meja</span>
          <span className="text-amber-400">
            {metrics.totalNumbersCovered} dari 37 angka ({metrics.coveragePercentage.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-stone-950 h-3 rounded-full overflow-hidden border border-stone-800 flex">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 transition-all duration-300"
            style={{ width: `${metrics.coveragePercentage}%` }}
          />
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 mt-3 mb-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('insights')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'insights'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Prediksi & Analisis Probabilitas</span>
          {insights.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-stone-900 text-amber-400 text-[10px] flex items-center justify-center font-bold">
              {insights.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('distribution')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'distribution'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
          }`}
        >
          <PieIcon className="w-3.5 h-3.5" />
          <span>Distribusi Warna & Nomor ({totalSpins} Spin)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sectors')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
            activeTab === 'sectors'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Sektor Roda European</span>
        </button>
      </div>

      {/* Tab 1: AI & Statistical Insights */}
      {activeTab === 'insights' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {insights.length === 0 ? (
            <div className="text-center py-6 text-stone-400 text-sm">
              <Sparkles className="w-8 h-8 text-amber-400/60 mx-auto mb-2" />
              <p>Pasang taruhan di meja atau lakukan spin untuk mengaktifkan analisis probabilitas & prediksi.</p>
            </div>
          ) : (
            insights.map((ins, idx) => {
              const getIcon = () => {
                switch (ins.category) {
                  case 'hot':
                    return <Flame className="w-4 h-4 text-orange-400" />;
                  case 'cold':
                    return <Snowflake className="w-4 h-4 text-blue-400" />;
                  case 'streak':
                    return <AlertTriangle className="w-4 h-4 text-amber-400" />;
                  case 'kelly':
                    return <ShieldAlert className="w-4 h-4 text-purple-400" />;
                  default:
                    return <Info className="w-4 h-4 text-teal-400" />;
                }
              };

              return (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-stone-900 border border-stone-800">
                        {getIcon()}
                      </div>
                      <h4 className="font-bold text-sm text-stone-200">{ins.title}</h4>
                    </div>
                    {ins.dataBadge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {ins.dataBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-amber-300 mb-1">
                    {ins.recommendation}
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {ins.description}
                  </p>
                </div>
              );
            })
          )}

          {/* Theoretical Odds Reference Drawer */}
          <div className="p-3 rounded-xl bg-stone-950/40 border border-stone-800/60 text-[11px] text-stone-400 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-stone-300">Catatan Matematika Roulette:</span>
              <p className="mt-0.5">
                European Roulette memiliki 37 angka (0-36). Peluang satu angka adalah 1/37 = 2.703%.
                Taruhan Luar (Merah/Hitam/Genap/Ganjil) mencakup 18 angka = 48.649%, bukan 50% karena adanya angka hijau 0 (House Edge 2.70%).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Distribution & Hot/Cold */}
      {activeTab === 'distribution' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Color Breakdown Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-stone-300">Distribusi Warna Riwayat</span>
              <span className="text-stone-400">Total {totalSpins} Putaran</span>
            </div>
            <div className="w-full bg-stone-950 h-5 rounded-lg overflow-hidden border border-stone-800 flex text-[10px] font-bold text-white leading-5">
              <div
                className="bg-red-600 transition-all flex items-center justify-center"
                style={{ width: `${redPct}%` }}
              >
                {Number(redPct) > 10 && `Merah ${redPct}%`}
              </div>
              <div
                className="bg-emerald-600 transition-all flex items-center justify-center"
                style={{ width: `${greenPct}%` }}
              >
                {Number(greenPct) > 3 && `${greenPct}%`}
              </div>
              <div
                className="bg-stone-900 transition-all flex items-center justify-center border-l border-stone-700"
                style={{ width: `${blackPct}%` }}
              >
                {Number(blackPct) > 10 && `Hitam ${blackPct}%`}
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>Merah: {historyStats.redCount} ({redPct}%)</span>
              <span>Hijau (0): {historyStats.greenCount} ({greenPct}%)</span>
              <span>Hitam: {historyStats.blackCount} ({blackPct}%)</span>
            </div>
          </div>

          {/* Hot and Cold Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Hot Numbers */}
            <div className="p-3 rounded-xl bg-stone-950/70 border border-orange-950/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Angka Paling Sering (Hot Numbers)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {historyStats.hotNumbers.map((h, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700"
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-xs font-black flex items-center justify-center text-white ${
                        h.number === 0
                          ? 'bg-emerald-600'
                          : h.color === 'red'
                          ? 'bg-red-600'
                          : 'bg-stone-950 border border-stone-700'
                      }`}
                    >
                      {h.number}
                    </span>
                    <span className="text-xs font-semibold text-stone-300">{h.count}x</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cold Numbers */}
            <div className="p-3 rounded-xl bg-stone-950/70 border border-blue-950/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 mb-2">
                <Snowflake className="w-4 h-4 text-blue-400" />
                <span>Angka Paling Jarang (Cold Numbers)</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {historyStats.coldNumbers.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-700"
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-xs font-black flex items-center justify-center text-white ${
                        c.number === 0
                          ? 'bg-emerald-600'
                          : c.color === 'red'
                          ? 'bg-red-600'
                          : 'bg-stone-950 border border-stone-700'
                      }`}
                    >
                      {c.number}
                    </span>
                    <span className="text-xs font-semibold text-stone-300">{c.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dozen Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 bg-stone-950/60 rounded-lg border border-stone-800">
              <span className="text-stone-400 block text-[10px]">1st Dozen (1-12)</span>
              <span className="text-sm font-bold text-stone-200">{historyStats.dozen1Count} kali</span>
            </div>
            <div className="p-2.5 bg-stone-950/60 rounded-lg border border-stone-800">
              <span className="text-stone-400 block text-[10px]">2nd Dozen (13-24)</span>
              <span className="text-sm font-bold text-stone-200">{historyStats.dozen2Count} kali</span>
            </div>
            <div className="p-2.5 bg-stone-950/60 rounded-lg border border-stone-800">
              <span className="text-stone-400 block text-[10px]">3rd Dozen (25-36)</span>
              <span className="text-sm font-bold text-stone-200">{historyStats.dozen3Count} kali</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Sector Breakdown */}
      {activeTab === 'sectors' && (
        <div className="space-y-3 animate-in fade-in duration-200 text-xs">
          <p className="text-stone-400">
            Pembagian sektor roda Roulette Prancis standar (French/European Roulette Sections):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800">
              <div className="font-bold text-amber-400 mb-1">Voisins du Zéro (17 Angka)</div>
              <p className="text-[11px] text-stone-400 mb-2">
                Tetangga nol: 22, 18, 29, 7, 28, 12, 35, 3, 26, 0, 32, 15, 19, 4, 21, 2, 25.
              </p>
              <div className="text-[10px] text-stone-400 font-medium">
                Peluang Teoretis: <span className="text-white font-bold">45.95%</span>
              </div>
            </div>

            <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800">
              <div className="font-bold text-amber-400 mb-1">Le Tiers du Cylindre (12 Angka)</div>
              <p className="text-[11px] text-stone-400 mb-2">
                Satu pertiga silinder: 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33.
              </p>
              <div className="text-[10px] text-stone-400 font-medium">
                Peluang Teoretis: <span className="text-white font-bold">32.43%</span>
              </div>
            </div>

            <div className="p-3 bg-stone-950/70 rounded-xl border border-stone-800">
              <div className="font-bold text-amber-400 mb-1">Les Orphelins (8 Angka)</div>
              <p className="text-[11px] text-stone-400 mb-2">
                Anak yatim: 1, 20, 14, 31, 9, 17, 34, 6.
              </p>
              <div className="text-[10px] text-stone-400 font-medium">
                Peluang Teoretis: <span className="text-white font-bold">21.62%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
