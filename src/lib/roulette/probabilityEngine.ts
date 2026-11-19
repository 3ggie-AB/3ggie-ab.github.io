import { Bet, HistoryStats, MonteCarloResult, PredictionInsight, ProbabilityMetrics, RouletteColor, SpinRecord } from './types';
import { getNumberColor, RED_NUMBERS, BLACK_NUMBERS, VOISINS_NUMBERS, TIERS_NUMBERS, ORPHELINS_NUMBERS } from './constants';

export function calculateProbabilityMetrics(bets: Bet[]): ProbabilityMetrics {
  const totalBetAmount = bets.reduce((sum, b) => sum + b.amount, 0);

  if (bets.length === 0 || totalBetAmount === 0) {
    return {
      totalNumbersCovered: 0,
      coveragePercentage: 0,
      winProbability: 0,
      totalBetAmount: 0,
      expectedValue: 0,
      expectedValuePercentage: 0,
      minWinPayout: 0,
      maxWinPayout: 0,
      netOutcomes: {},
    };
  }

  const coveredSet = new Set<number>();
  const netOutcomes: { [number: number]: number } = {};

  // Initialize all 37 outcomes (0 to 36)
  for (let num = 0; num <= 36; num++) {
    let winPayout = 0;
    for (const bet of bets) {
      if (bet.coveredNumbers.includes(num)) {
        coveredSet.add(num);
        // Payout = bet.amount * multiplier + original bet amount
        winPayout += bet.amount * (bet.payoutMultiplier + 1);
      }
    }
    netOutcomes[num] = winPayout - totalBetAmount;
  }

  const totalNumbersCovered = coveredSet.size;
  const coveragePercentage = (totalNumbersCovered / 37) * 100;
  const winProbability = coveragePercentage;

  // Expected Value: sum(1/37 * netOutcome)
  let totalNet = 0;
  let minWin = Infinity;
  let maxWin = -Infinity;

  for (let num = 0; num <= 36; num++) {
    const net = netOutcomes[num];
    totalNet += net;
    if (net > maxWin) maxWin = net;
    if (net < minWin) minWin = net;
  }

  const expectedValue = totalNet / 37;
  const expectedValuePercentage = totalBetAmount > 0 ? (expectedValue / totalBetAmount) * 100 : 0;

  return {
    totalNumbersCovered,
    coveragePercentage,
    winProbability,
    totalBetAmount,
    expectedValue,
    expectedValuePercentage,
    minWinPayout: minWin === Infinity ? 0 : minWin,
    maxWinPayout: maxWin === -Infinity ? 0 : maxWin,
    netOutcomes,
  };
}

export function computeHistoryStats(spins: SpinRecord[]): HistoryStats {
  const totalSpins = spins.length;
  const numberFrequencies: Record<number, number> = {};
  for (let i = 0; i <= 36; i++) {
    numberFrequencies[i] = 0;
  }

  let redCount = 0;
  let blackCount = 0;
  let greenCount = 0;
  let evenCount = 0;
  let oddCount = 0;
  let lowCount = 0;
  let highCount = 0;
  let dozen1Count = 0;
  let dozen2Count = 0;
  let dozen3Count = 0;

  for (const s of spins) {
    const num = s.winningNumber;
    numberFrequencies[num] = (numberFrequencies[num] || 0) + 1;

    if (num === 0) {
      greenCount++;
    } else {
      if (RED_NUMBERS.has(num)) redCount++;
      if (BLACK_NUMBERS.has(num)) blackCount++;

      if (num % 2 === 0) evenCount++;
      else oddCount++;

      if (num <= 18) lowCount++;
      else highCount++;

      if (num <= 12) dozen1Count++;
      else if (num <= 24) dozen2Count++;
      else dozen3Count++;
    }
  }

  // Calculate hot and cold numbers
  const numberList = Array.from({ length: 37 }, (_, i) => ({
    number: i,
    count: numberFrequencies[i] || 0,
    color: getNumberColor(i),
  }));

  const hotNumbers = [...numberList].sort((a, b) => b.count - a.count).slice(0, 5);
  const coldNumbers = [...numberList].sort((a, b) => a.count - b.count).slice(0, 5);

  // Current Streak calculation
  let streakType: 'red' | 'black' | 'even' | 'odd' | 'none' = 'none';
  let streakLength = 0;

  if (spins.length > 0) {
    const recent = spins[0]; // newest first
    if (recent.winningNumber !== 0) {
      const isRed = RED_NUMBERS.has(recent.winningNumber);
      const targetColor: 'red' | 'black' = isRed ? 'red' : 'black';
      let count = 0;
      for (const sp of spins) {
        if (sp.winningNumber === 0) break;
        const c = RED_NUMBERS.has(sp.winningNumber) ? 'red' : 'black';
        if (c === targetColor) count++;
        else break;
      }
      if (count >= 2) {
        streakType = targetColor;
        streakLength = count;
      }
    }
  }

  // Chi-Square Goodness-of-fit against uniform (E = totalSpins / 37)
  let chiSquareStat = 0;
  if (totalSpins >= 37) {
    const expected = totalSpins / 37;
    for (let i = 0; i <= 36; i++) {
      const observed = numberFrequencies[i] || 0;
      chiSquareStat += Math.pow(observed - expected, 2) / expected;
    }
  }
  // Critical value for df=36 at p=0.05 is ~50.99
  const isUniform = chiSquareStat <= 50.99;

  return {
    totalSpins,
    redCount,
    blackCount,
    greenCount,
    evenCount,
    oddCount,
    lowCount,
    highCount,
    dozen1Count,
    dozen2Count,
    dozen3Count,
    numberFrequencies,
    hotNumbers,
    coldNumbers,
    currentStreak: { type: streakType, length: streakLength },
    chiSquareStat: Math.round(chiSquareStat * 100) / 100,
    isUniform,
  };
}

export function generatePredictionsAndInsights(
  stats: HistoryStats,
  bets: Bet[],
  currentBalance: number
): PredictionInsight[] {
  const insights: PredictionInsight[] = [];
  const metrics = calculateProbabilityMetrics(bets);

  // 1. Coverage & Risk Assessment
  if (metrics.totalBetAmount > 0) {
    if (metrics.coveragePercentage > 70) {
      insights.push({
        title: 'Cakupan Taruhan Sangat Luas (High Coverage)',
        category: 'kelly',
        recommendation: `Peluang menang putaran ini: ${metrics.coveragePercentage.toFixed(1)}%`,
        confidence: 'Tinggi',
        description: `Anda menutup ${metrics.totalNumbersCovered} dari 37 angka. Walau kemungkinan menang tinggi, perhatikan bahwa Expected Value tetap -2.7% (House Edge) per putaran jika angka yang tidak tertutup keluar.`,
        dataBadge: `${metrics.coveragePercentage.toFixed(1)}% Win Rate`,
      });
    } else if (metrics.coveragePercentage < 15) {
      insights.push({
        title: 'Taruhan Konsentrasi Tinggi (High Volatility)',
        category: 'kelly',
        recommendation: `Peluang menang putaran ini: ${metrics.coveragePercentage.toFixed(1)}%`,
        confidence: 'Rendah',
        description: `Hanya mencakup ${metrics.totalNumbersCovered} angka (Straight/Inside bets). Jika menang potensi profit sangat besar (${metrics.maxWinPayout > 0 ? '+' + metrics.maxWinPayout : ''}), namun volatilitas sangat tinggi.`,
        dataBadge: `Potensi Max Win: +$${metrics.maxWinPayout}`,
      });
    }
  }

  // 2. Streak Alert & Gambler's Fallacy Education
  if (stats.currentStreak.length >= 3) {
    const colorName = stats.currentStreak.type === 'red' ? 'Merah' : 'Hitam';
    const singleP = 18 / 37;
    const jointP = Math.pow(singleP, stats.currentStreak.length) * 100;
    const nextJointP = Math.pow(singleP, stats.currentStreak.length + 1) * 100;

    insights.push({
      title: `Streak ${colorName} Beruntun ${stats.currentStreak.length}x!`,
      category: 'streak',
      recommendation: `Waspada Gambler's Fallacy: Peluang putaran berikutnya tetap 48.65%`,
      confidence: 'Edukasi',
      description: `Warna ${colorName} telah muncul ${stats.currentStreak.length} kali berturut-turut (Peluang gabungan awal: ${jointP.toFixed(2)}%). Ingat: Roda roulette independen secara fisik! Putaran berikutnya TIDAK "berutang" warna sebaliknya; peluang Merah vs Hitam tetap persis 48.65% masing-masing, dan 2.70% Hijau (0).`,
      dataBadge: `Streak: ${stats.currentStreak.length}x | P(next sama): ${nextJointP.toFixed(2)}%`,
    });
  }

  // 3. Hot Numbers Momentum
  if (stats.totalSpins >= 10 && stats.hotNumbers.length > 0 && stats.hotNumbers[0].count > 1) {
    const topHot = stats.hotNumbers.slice(0, 3);
    const hotStr = topHot.map((h) => `#${h.number} (${h.count}x)`).join(', ');
    insights.push({
      title: 'Angka Panas Terdeteksi (Hot Numbers Momentum)',
      category: 'hot',
      recommendation: `Angka dengan frekuensi tertinggi: ${hotStr}`,
      confidence: 'Sedang',
      description: `Dalam ${stats.totalSpins} putaran terakhir, angka ini paling sering keluar. Banyak pemain roulette menggunakan strategi momentum untuk mengikuti angka yang sedang hangat.`,
      dataBadge: `Top Hot: ${topHot[0].number}`,
    });
  }

  // 4. Cold Numbers / Regression to Mean
  if (stats.totalSpins >= 15 && stats.coldNumbers.length > 0) {
    const topCold = stats.coldNumbers.filter((c) => c.count === 0).slice(0, 3);
    if (topCold.length > 0) {
      const coldStr = topCold.map((c) => `#${c.number}`).join(', ');
      insights.push({
        title: 'Angka Dingin Belum Pernah Keluar (Cold Numbers)',
        category: 'cold',
        recommendation: `Angka belum muncul: ${coldStr}`,
        confidence: 'Rendah',
        description: `Angka ini belum pernah muncul sama sekali dalam sesi ini. Secara hukum bilangan besar (Law of Large Numbers), frekuensi jangka panjang akan mendekati 2.7%, namun dalam jangka pendek deviasi acak adalah hal yang sangat wajar.`,
      });
    }
  }

  // 5. Wheel Sector Distribution
  if (stats.totalSpins >= 12) {
    let voisinsCount = 0;
    let tiersCount = 0;
    let orphelinsCount = 0;

    for (let i = 0; i <= 36; i++) {
      const cnt = stats.numberFrequencies[i] || 0;
      if (VOISINS_NUMBERS.includes(i)) voisinsCount += cnt;
      else if (TIERS_NUMBERS.includes(i)) tiersCount += cnt;
      else if (ORPHELINS_NUMBERS.includes(i)) orphelinsCount += cnt;
    }

    const voisinsPct = (voisinsCount / stats.totalSpins) * 100;
    const tiersPct = (tiersCount / stats.totalSpins) * 100;
    const orphelinsPct = (orphelinsCount / stats.totalSpins) * 100;

    // Expected: Voisins 17/37 = 45.95%, Tiers 12/37 = 32.43%, Orphelins 8/37 = 21.62%
    let biasedSector = '';
    let maxDiff = 0;

    if (voisinsPct - 45.95 > maxDiff) {
      maxDiff = voisinsPct - 45.95;
      biasedSector = `Voisins du Zéro (${voisinsPct.toFixed(1)}% vs standar 45.9%)`;
    }
    if (tiersPct - 32.43 > maxDiff) {
      maxDiff = tiersPct - 32.43;
      biasedSector = `Le Tiers du Cylindre (${tiersPct.toFixed(1)}% vs standar 32.4%)`;
    }
    if (orphelinsPct - 21.62 > maxDiff) {
      maxDiff = orphelinsPct - 21.62;
      biasedSector = `Les Orphelins (${orphelinsPct.toFixed(1)}% vs standar 21.6%)`;
    }

    if (maxDiff > 8) {
      insights.push({
        title: 'Klaster Sektor Roda (Wheel Sector Clustering)',
        category: 'sector',
        recommendation: `Sektor dengan keunggulan frekuensi: ${biasedSector}`,
        confidence: 'Sedang',
        description: `Bola menunjukkan kecenderungan mendarat lebih sering pada sektor tersebut dalam sesi Anda. Pemain fisik sering mencari sektor bias jika ada ketidaksempurnaan rotor.`,
      });
    }
  }

  // 6. Kelly Criterion & Bankroll Management
  if (currentBalance > 0) {
    const safeMaxBet = Math.max(1, Math.floor(currentBalance * 0.05)); // 5% max safe allocation
    const totalBet = metrics.totalBetAmount;
    if (totalBet > currentBalance * 0.2) {
      insights.push({
        title: 'Peringatan Resiko Bankroll (High Drawdown Risk)',
        category: 'kelly',
        recommendation: `Rekomendasi maksimal taruhan: $${safeMaxBet} per putaran (5% modal)`,
        confidence: 'Tinggi',
        description: `Taruhan aktif Anda ($${totalBet}) mencapai ${((totalBet / currentBalance) * 100).toFixed(0)}% dari total saldo ($${currentBalance}). Tingkat taruhan ini beresiko mengalami kehancuran modal (risk of ruin) jika terjadi 2-3 putaran rugi beruntun.`,
      });
    } else {
      insights.push({
        title: 'Manajemen Modal Optimal (Bankroll Health)',
        category: 'kelly',
        recommendation: `Ukuran taruhan saat ini aman ($${totalBet} = ${currentBalance > 0 ? ((totalBet / currentBalance) * 100).toFixed(1) : 0}% modal)`,
        confidence: 'Tinggi',
        description: `Menjaga taruhan di bawah 5% saldo adalah prinsip kunci manajemen risiko untuk bertahan melalui fluktuasi statistik dan varian alami roulette.`,
      });
    }
  }

  return insights;
}

// Monte Carlo simulator for fast strategy backtesting
export function runMonteCarloSimulation(
  bets: Bet[],
  initialBalance: number,
  spinsToRun: number
): MonteCarloResult {
  const metrics = calculateProbabilityMetrics(bets);
  const totalBet = metrics.totalBetAmount;

  if (totalBet === 0 || bets.length === 0) {
    return {
      spinsRun: 0,
      initialBalance,
      finalBalance: initialBalance,
      totalWagered: 0,
      netProfit: 0,
      winRate: 0,
      maxDrawdown: 0,
      history: [{ spin: 0, balance: initialBalance }],
    };
  }

  let currentBalance = initialBalance;
  let peakBalance = initialBalance;
  let maxDrawdown = 0;
  let winCount = 0;
  let totalWagered = 0;

  // We record at most 100 points for graphing
  const step = Math.max(1, Math.floor(spinsToRun / 100));
  const history: { spin: number; balance: number }[] = [
    { spin: 0, balance: initialBalance },
  ];

  for (let spin = 1; spin <= spinsToRun; spin++) {
    if (currentBalance < totalBet) {
      // Busted / insufficient balance
      history.push({ spin, balance: currentBalance });
      break;
    }

    currentBalance -= totalBet;
    totalWagered += totalBet;

    // Simulate European roulette spin [0..36]
    const outcome = Math.floor(Math.random() * 37);
    let winPayout = 0;
    for (const b of bets) {
      if (b.coveredNumbers.includes(outcome)) {
        winPayout += b.amount * (b.payoutMultiplier + 1);
      }
    }

    if (winPayout > 0) {
      winCount++;
      currentBalance += winPayout;
    }

    if (currentBalance > peakBalance) {
      peakBalance = currentBalance;
    }
    const currentDrawdown = peakBalance - currentBalance;
    if (currentDrawdown > maxDrawdown) {
      maxDrawdown = currentDrawdown;
    }

    if (spin % step === 0 || spin === spinsToRun) {
      history.push({ spin, balance: currentBalance });
    }
  }

  return {
    spinsRun: spinsToRun,
    initialBalance,
    finalBalance: currentBalance,
    totalWagered,
    netProfit: currentBalance - initialBalance,
    winRate: (winCount / spinsToRun) * 100,
    maxDrawdown,
    history,
  };
}
