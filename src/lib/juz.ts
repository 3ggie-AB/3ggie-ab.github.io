// Juz data: each juz maps to starting surah:ayat and ending surah:ayat
export interface JuzEntry {
  juz: number;
  start: { surah: number; ayat: number };
  end: { surah: number; ayat: number };
}

export const JUZ_DATA: JuzEntry[] = [
  { juz: 1, start: { surah: 1, ayat: 1 }, end: { surah: 2, ayat: 141 } },
  { juz: 2, start: { surah: 2, ayat: 142 }, end: { surah: 2, ayat: 252 } },
  { juz: 3, start: { surah: 2, ayat: 253 }, end: { surah: 3, ayat: 92 } },
  { juz: 4, start: { surah: 3, ayat: 93 }, end: { surah: 4, ayat: 23 } },
  { juz: 5, start: { surah: 4, ayat: 24 }, end: { surah: 4, ayat: 147 } },
  { juz: 6, start: { surah: 4, ayat: 148 }, end: { surah: 5, ayat: 81 } },
  { juz: 7, start: { surah: 5, ayat: 82 }, end: { surah: 6, ayat: 110 } },
  { juz: 8, start: { surah: 6, ayat: 111 }, end: { surah: 7, ayat: 87 } },
  { juz: 9, start: { surah: 7, ayat: 88 }, end: { surah: 8, ayat: 40 } },
  { juz: 10, start: { surah: 8, ayat: 41 }, end: { surah: 9, ayat: 92 } },
  { juz: 11, start: { surah: 9, ayat: 93 }, end: { surah: 11, ayat: 5 } },
  { juz: 12, start: { surah: 11, ayat: 6 }, end: { surah: 12, ayat: 52 } },
  { juz: 13, start: { surah: 12, ayat: 53 }, end: { surah: 14, ayat: 52 } },
  { juz: 14, start: { surah: 15, ayat: 1 }, end: { surah: 16, ayat: 128 } },
  { juz: 15, start: { surah: 17, ayat: 1 }, end: { surah: 18, ayat: 74 } },
  { juz: 16, start: { surah: 18, ayat: 75 }, end: { surah: 20, ayat: 135 } },
  { juz: 17, start: { surah: 21, ayat: 1 }, end: { surah: 22, ayat: 78 } },
  { juz: 18, start: { surah: 23, ayat: 1 }, end: { surah: 25, ayat: 20 } },
  { juz: 19, start: { surah: 25, ayat: 21 }, end: { surah: 27, ayat: 55 } },
  { juz: 20, start: { surah: 27, ayat: 56 }, end: { surah: 29, ayat: 45 } },
  { juz: 21, start: { surah: 29, ayat: 46 }, end: { surah: 33, ayat: 30 } },
  { juz: 22, start: { surah: 33, ayat: 31 }, end: { surah: 36, ayat: 27 } },
  { juz: 23, start: { surah: 36, ayat: 28 }, end: { surah: 39, ayat: 31 } },
  { juz: 24, start: { surah: 39, ayat: 32 }, end: { surah: 41, ayat: 46 } },
  { juz: 25, start: { surah: 41, ayat: 47 }, end: { surah: 45, ayat: 37 } },
  { juz: 26, start: { surah: 46, ayat: 1 }, end: { surah: 51, ayat: 30 } },
  { juz: 27, start: { surah: 51, ayat: 31 }, end: { surah: 57, ayat: 29 } },
  { juz: 28, start: { surah: 58, ayat: 1 }, end: { surah: 66, ayat: 12 } },
  { juz: 29, start: { surah: 67, ayat: 1 }, end: { surah: 77, ayat: 50 } },
  { juz: 30, start: { surah: 78, ayat: 1 }, end: { surah: 114, ayat: 6 } },
];

export interface JuzDivision {
  person: number;
  juzList: number[];
}

export function divideJuz(totalJuz: number, startJuz: number, totalPeople: number): JuzDivision[] {
  const juzRange: number[] = [];
  for (let i = 0; i < totalJuz; i++) {
    juzRange.push(((startJuz - 1 + i) % 30) + 1);
  }

  const base = Math.floor(totalJuz / totalPeople);
  const remainder = totalJuz % totalPeople;
  const result: JuzDivision[] = [];
  let idx = 0;

  for (let p = 0; p < totalPeople; p++) {
    const count = base + (p < remainder ? 1 : 0);
    result.push({
      person: p + 1,
      juzList: juzRange.slice(idx, idx + count),
    });
    idx += count;
  }

  return result;
}
