import { useCallback, useState } from 'react';

const KEY = 'quran-font-scale';
export const FONT_SCALE_MIN = 0.8;
export const FONT_SCALE_MAX = 2;
export const FONT_SCALE_STEP = 0.1;

const clamp = (n: number) =>
  Math.round(Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, n)) * 10) / 10;

function readScale(): number {
  try {
    const n = parseFloat(localStorage.getItem(KEY) || '');
    return Number.isFinite(n) ? clamp(n) : 1;
  } catch {
    return 1;
  }
}

/** Ukuran teks bacaan (Arab, latin, terjemahan); tersimpan dan dipakai di semua halaman baca. */
export function useFontScale() {
  const [scale, setScaleState] = useState(readScale);

  const setScale = useCallback((next: number) => {
    const value = clamp(next);
    setScaleState(value);
    try {
      localStorage.setItem(KEY, String(value));
    } catch {
      // penyimpanan tidak tersedia: ukuran tetap berlaku untuk halaman ini
    }
  }, []);

  /** Ukuran font untuk teks yang ukuran dasarnya `baseRem`. */
  const size = useCallback((baseRem: number) => ({ fontSize: `${baseRem * scale}rem` }), [scale]);

  return { scale, setScale, size };
}
