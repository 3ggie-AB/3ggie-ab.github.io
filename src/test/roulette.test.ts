import { describe, it, expect } from 'vitest';
import { calculateProbabilityMetrics, computeHistoryStats, runMonteCarloSimulation } from '../lib/roulette/probabilityEngine';
import { Bet } from '../lib/roulette/types';
import { getCoveredNumbers, RED_NUMBERS } from '../lib/roulette/constants';

describe('Roulette Probability Engine', () => {
  it('correctly calculates single straight-up bet probability and EV', () => {
    const singleBet: Bet = {
      id: 'straight_17',
      type: 'straight',
      target: 17,
      amount: 10,
      payoutMultiplier: 35,
      label: '#17',
      coveredNumbers: [17],
    };

    const metrics = calculateProbabilityMetrics([singleBet]);
    expect(metrics.totalNumbersCovered).toBe(1);
    expect(metrics.coveragePercentage).toBeCloseTo((1 / 37) * 100, 2);
    expect(metrics.totalBetAmount).toBe(10);
    // Win payout = 10 * 36 - 10 = +350 on 17, -10 on other 36
    // Expected value = (350 - 360) / 37 = -10/37 ≈ -0.27
    expect(metrics.expectedValue).toBeCloseTo(-10 / 37, 2);
    expect(metrics.netOutcomes[17]).toBe(350);
    expect(metrics.netOutcomes[0]).toBe(-10);
  });

  it('correctly calculates red bet probability and coverage', () => {
    const redBet: Bet = {
      id: 'red',
      type: 'red',
      amount: 50,
      payoutMultiplier: 1,
      label: 'RED',
      coveredNumbers: getCoveredNumbers('red'),
    };

    const metrics = calculateProbabilityMetrics([redBet]);
    expect(metrics.totalNumbersCovered).toBe(18);
    expect(metrics.coveragePercentage).toBeCloseTo((18 / 37) * 100, 2); // 48.65%
    expect(metrics.expectedValuePercentage).toBeCloseTo(-2.70, 1);
  });

  it('computes history stats including streak and hot numbers correctly', () => {
    const mockSpins = [
      { id: '1', spinNumber: 1, winningNumber: 7, color: 'red' as const, timestamp: 1, totalBet: 10, payout: 20, netProfit: 10, balanceAfter: 1010 },
      { id: '2', spinNumber: 2, winningNumber: 1, color: 'red' as const, timestamp: 2, totalBet: 10, payout: 20, netProfit: 10, balanceAfter: 1020 },
      { id: '3', spinNumber: 3, winningNumber: 3, color: 'red' as const, timestamp: 3, totalBet: 10, payout: 20, netProfit: 10, balanceAfter: 1030 },
    ];

    const stats = computeHistoryStats(mockSpins);
    expect(stats.totalSpins).toBe(3);
    expect(stats.redCount).toBe(3);
    expect(stats.currentStreak.type).toBe('red');
    expect(stats.currentStreak.length).toBe(3);
  });

  it('runs Monte Carlo simulation reliably', () => {
    const bet: Bet = {
      id: 'even',
      type: 'even',
      amount: 10,
      payoutMultiplier: 1,
      label: 'EVEN',
      coveredNumbers: getCoveredNumbers('even'),
    };

    const sim = runMonteCarloSimulation([bet], 1000, 50);
    expect(sim.spinsRun).toBe(50);
    expect(sim.totalWagered).toBe(500);
    expect(sim.history.length).toBeGreaterThan(1);
  });
});
