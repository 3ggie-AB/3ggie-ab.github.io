import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX, RotateCcw, Play, Zap, HelpCircle, Trophy } from 'lucide-react';
import { RouletteWheel } from '@/components/roulette/RouletteWheel';
import { RouletteTable } from '@/components/roulette/RouletteTable';
import { ChipSelector } from '@/components/roulette/ChipSelector';
import { ProbabilityDashboard } from '@/components/roulette/ProbabilityDashboard';
import { MonteCarloSimulator } from '@/components/roulette/MonteCarloSimulator';
import { SpinHistory } from '@/components/roulette/SpinHistory';
import { Bet, SpinRecord, HistoryStats } from '@/lib/roulette/types';
import { getNumberColor, RED_NUMBERS } from '@/lib/roulette/constants';
import { soundManager } from '@/lib/roulette/audio';
import { computeHistoryStats, calculateProbabilityMetrics } from '@/lib/roulette/probabilityEngine';
import { toast } from 'sonner';

const BALANCE_KEY = 'roulette_user_balance';
const HISTORY_KEY = 'roulette_spin_history';
const INITIAL_BALANCE = 1000;

export default function RoulettePage() {
  // State
  const [balance, setBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(BALANCE_KEY);
      if (saved) return Number(saved);
    }
    return INITIAL_BALANCE;
  });

  const [spins, setSpins] = useState<SpinRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(HISTORY_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [activeBets, setActiveBets] = useState<Bet[]>([]);
  const [previousBets, setPreviousBets] = useState<Bet[]>([]);
  const [selectedChip, setSelectedChip] = useState<number>(25);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hoveredBetNumbers, setHoveredBetNumbers] = useState<number[] | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'simulator' | 'history'>('analytics');

  // Sync balance & history to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(BALANCE_KEY, balance.toString());
      localStorage.setItem(HISTORY_KEY, JSON.stringify(spins));
    }
  }, [balance, spins]);

  // Sound toggle
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  // Add / Update Bet
  const handleAddBet = (newBet: Bet) => {
    if (isSpinning) return;

    // Check balance
    const currentTotalBet = activeBets.reduce((s, b) => s + b.amount, 0);
    const existing = activeBets.find((b) => b.id === newBet.id);
    const addedAmount = existing ? newBet.amount - existing.amount : newBet.amount;

    if (currentTotalBet + addedAmount > balance) {
      toast.error('Saldo tidak mencukupi untuk menambah taruhan ini!', {
        description: `Saldo Anda: $${balance}`,
      });
      return;
    }

    setActiveBets((prev) => {
      const index = prev.findIndex((b) => b.id === newBet.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = newBet;
        return copy;
      }
      return [...prev, newBet];
    });
  };

  // Remove single bet
  const handleRemoveBet = (betId: string) => {
    if (isSpinning) return;
    setActiveBets((prev) => prev.filter((b) => b.id !== betId));
  };

  // Clear all bets
  const handleClearBets = () => {
    if (isSpinning) return;
    setActiveBets([]);
  };

  // Double bets
  const handleDoubleBets = () => {
    if (isSpinning || activeBets.length === 0) return;
    const currentTotal = activeBets.reduce((s, b) => s + b.amount, 0);
    if (currentTotal * 2 > balance) {
      toast.error('Saldo tidak mencukupi untuk melipatgandakan taruhan!');
      return;
    }
    setActiveBets((prev) => prev.map((b) => ({ ...b, amount: b.amount * 2 })));
  };

  // Repeat previous bets
  const handleRepeatBets = () => {
    if (isSpinning || previousBets.length === 0) return;
    const prevTotal = previousBets.reduce((s, b) => s + b.amount, 0);
    if (prevTotal > balance) {
      toast.error('Saldo tidak mencukupi untuk mengulangi taruhan sebelumnya!');
      return;
    }
    setActiveBets(previousBets);
  };

  // Reset Balance
  const handleResetBalance = () => {
    if (isSpinning) return;
    setBalance(INITIAL_BALANCE);
    toast.success('Saldo telah di-reset ke $1,000!');
  };

  // Spin trigger
  const handleSpin = () => {
    if (isSpinning) return;
    const totalBet = activeBets.reduce((s, b) => s + b.amount, 0);

    if (totalBet === 0) {
      toast.warning('Pasang setidaknya satu taruhan di meja sebelum memutar roda!');
      return;
    }

    if (totalBet > balance) {
      toast.error('Saldo tidak mencukupi untuk memutar taruhan ini!');
      return;
    }

    // Deduct total bet amount from balance
    setBalance((prev) => prev - totalBet);
    setPreviousBets(activeBets);

    // Pick random winning number [0..36] using cryptographic random for fairness
    let randomNum: number;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(1);
      window.crypto.getRandomValues(arr);
      randomNum = arr[0] % 37;
    } else {
      randomNum = Math.floor(Math.random() * 37);
    }

    setTargetNumber(randomNum);
    setIsSpinning(true);
  };

  // Spin completed callback
  const handleSpinComplete = useCallback(
    (winningNum: number) => {
      setIsSpinning(false);

      const color = getNumberColor(winningNum);
      const totalBet = activeBets.reduce((s, b) => s + b.amount, 0);

      // Calculate total win payout
      let winPayout = 0;
      for (const bet of activeBets) {
        if (bet.coveredNumbers.includes(winningNum)) {
          winPayout += bet.amount * (bet.payoutMultiplier + 1);
        }
      }

      const netProfit = winPayout - totalBet;
      const newBalance = balance + winPayout; // since bet was already deducted
      setBalance(newBalance);

      // Create spin record
      const record: SpinRecord = {
        id: `${Date.now()}_${Math.random()}`,
        spinNumber: spins.length + 1,
        winningNumber: winningNum,
        color,
        timestamp: Date.now(),
        totalBet,
        payout: winPayout,
        netProfit,
        balanceAfter: newBalance,
      };

      setSpins((prev) => [record, ...prev]);

      // Sound and notifications
      if (netProfit > 0) {
        soundManager.playWin();
        toast.success(`MENANG! Angka #${winningNum} (${color.toUpperCase()})`, {
          description: `Total Pembayaran: +$${winPayout} (Net Profit: +$${netProfit})`,
        });
      } else if (netProfit === 0 && totalBet > 0) {
        toast.info(`Seri: Angka #${winningNum}`, {
          description: `Modal Anda kembali utuh ($${totalBet}).`,
        });
      } else {
        soundManager.playLoss();
        toast.error(`Kalah: Angka #${winningNum} (${color.toUpperCase()})`, {
          description: `Rugi: -$${totalBet}`,
        });
      }
    },
    [activeBets, balance, spins.length]
  );

  const historyStats: HistoryStats = useMemo(() => computeHistoryStats(spins), [spins]);
  const metrics = useMemo(() => calculateProbabilityMetrics(activeBets), [activeBets]);

  const totalBetAmount = activeBets.reduce((s, b) => s + b.amount, 0);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-stone-950">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-stone-900/90 border-b border-stone-800 backdrop-blur-xl px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
              title="Kembali ke Portofolio"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-2">
                <span>Roulette Royale</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Prediksi Probabilitas
                </span>
              </h1>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Simulasi European Roulette mandiri dengan kalkulator probabilitas & analisis statistik.
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Balance Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 shadow-inner">
              <span className="text-xs font-semibold text-stone-400">Saldo:</span>
              <span className="text-sm sm:text-base font-black text-amber-400">
                ${balance.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={handleResetBalance}
                disabled={isSpinning}
                className="p-1 hover:text-amber-400 text-stone-400 transition-colors ml-1"
                title="Reset Saldo ke $1,000"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                isMuted
                  ? 'bg-stone-800/60 border-stone-700 text-stone-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
              title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 space-y-6">
        {/* Upper Game Arena: Wheel & Spin Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Wheel Column */}
          <div className="lg:col-span-5 flex justify-center">
            <RouletteWheel
              isSpinning={isSpinning}
              targetNumber={targetNumber}
              onSpinComplete={handleSpinComplete}
              size={340}
            />
          </div>

          {/* Action & Live Probability Spotlight Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
            {/* Spin CTA Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 border border-stone-800 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <div className="text-xs font-semibold text-stone-400">Taruhan Aktif Saat Ini</div>
                  <div className="text-2xl font-black text-amber-400 mt-0.5">
                    ${totalBetAmount}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-semibold text-stone-400">Peluang Menang Putaran</div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">
                    {metrics.winProbability.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Big Spin Button */}
              <button
                type="button"
                disabled={isSpinning || totalBetAmount === 0}
                onClick={handleSpin}
                className={`w-full py-4 rounded-xl font-black text-base sm:text-lg flex items-center justify-center gap-2.5 uppercase tracking-wider transition-all transform active:scale-95 shadow-xl ${
                  isSpinning
                    ? 'bg-stone-800 text-stone-400 cursor-not-allowed'
                    : totalBetAmount > 0
                    ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 hover:brightness-110 animate-pulse shadow-amber-500/20'
                    : 'bg-stone-800 text-stone-400 hover:bg-stone-750'
                }`}
              >
                <Play className="w-5 h-5 fill-current" />
                <span>{isSpinning ? 'Bola Sedang Berputar...' : 'Putar Roda (Spin)'}</span>
              </button>

              <div className="mt-3 flex items-center justify-between text-xs text-stone-400">
                <span>Cakupan: {metrics.totalNumbersCovered}/37 angka</span>
                <span>House Edge: -2.70%</span>
                <span>
                  Hasil: {metrics.minWinPayout >= 0 ? '+' : ''}${metrics.minWinPayout} s/d +${metrics.maxWinPayout}
                </span>
              </div>
            </div>

            {/* Quick Chips & Bet Modifiers */}
            <ChipSelector
              selectedChip={selectedChip}
              onSelectChip={setSelectedChip}
              onClearBets={handleClearBets}
              onDoubleBets={handleDoubleBets}
              onRepeatBets={handleRepeatBets}
              canRepeat={previousBets.length > 0}
              hasActiveBets={activeBets.length > 0}
              disabled={isSpinning}
            />
          </div>
        </div>

        {/* Middle: Full Interactive Roulette Table */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-stone-300">Meja Taruhan (Betting Board)</h2>
            <span className="text-xs text-stone-400">
              Hover untuk sorot angka | Klik kanan hapus taruhan
            </span>
          </div>
          <RouletteTable
            bets={activeBets}
            selectedChip={selectedChip}
            onAddBet={handleAddBet}
            onRemoveBet={handleRemoveBet}
            disabled={isSpinning}
            hoveredBetNumbers={hoveredBetNumbers}
            onHoverBetNumbers={setHoveredBetNumbers}
          />
        </section>

        {/* Bottom Feature Tabs: [Prediksi & Analisis Probabilitas] | [Simulator Monte Carlo] | [Riwayat Spin] */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-stone-800 pb-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              Kalkulator & Prediksi Probabilitas
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              Simulator Monte Carlo (Backtest)
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              Riwayat Putaran ({spins.length})
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'analytics' && (
            <ProbabilityDashboard
              bets={activeBets}
              historyStats={historyStats}
              balance={balance}
            />
          )}

          {activeTab === 'simulator' && (
            <MonteCarloSimulator
              bets={activeBets}
              currentBalance={balance}
            />
          )}

          {activeTab === 'history' && (
            <SpinHistory
              spins={spins}
              onClearHistory={() => setSpins([])}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800 bg-stone-950 py-4 text-center text-xs text-stone-400">
        <p>
          Roulette Royale & Prediksi Probabilitas &copy; {new Date().getFullYear()} - Dibuat untuk tujuan simulasi, edukasi matematika, dan pemahaman probabilitas stokastik.
        </p>
      </footer>
    </div>
  );
}
