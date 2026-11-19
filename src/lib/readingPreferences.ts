import { useState, useCallback } from 'react';

const STORAGE_KEY = 'quran-reading-preferences';

export type ReadingTheme = 'default' | 'sepia' | 'emerald' | 'midnight';

export interface ReadingPreferences {
  showLatin: boolean;
  showTranslation: boolean;
  theme: ReadingTheme;
}

const DEFAULT_PREFERENCES: ReadingPreferences = {
  showLatin: true,
  showTranslation: true,
  theme: 'default',
};

function readPreferences(): ReadingPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(raw);
    return {
      showLatin: typeof parsed.showLatin === 'boolean' ? parsed.showLatin : true,
      showTranslation: typeof parsed.showTranslation === 'boolean' ? parsed.showTranslation : true,
      theme: ['default', 'sepia', 'emerald', 'midnight'].includes(parsed.theme) ? parsed.theme : 'default',
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/** Hook untuk membaca dan menyimpan preferensi tampilan teks bacaan & tema */
export function useReadingPreferences() {
  const [preferences, setPreferencesState] = useState<ReadingPreferences>(readPreferences);

  const updatePreferences = useCallback((patch: Partial<ReadingPreferences>) => {
    setPreferencesState((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  }, []);

  const setShowLatin = useCallback(
    (val: boolean) => updatePreferences({ showLatin: val }),
    [updatePreferences]
  );
  const setShowTranslation = useCallback(
    (val: boolean) => updatePreferences({ showTranslation: val }),
    [updatePreferences]
  );
  const setTheme = useCallback(
    (theme: ReadingTheme) => updatePreferences({ theme }),
    [updatePreferences]
  );

  return {
    preferences,
    showLatin: preferences.showLatin,
    showTranslation: preferences.showTranslation,
    theme: preferences.theme,
    setShowLatin,
    setShowTranslation,
    setTheme,
    updatePreferences,
  };
}

export const THEME_CLASSES: Record<
  ReadingTheme,
  {
    container: string;
    card: string;
    textArabic: string;
    textLatin: string;
    textTranslation: string;
    badge: string;
    name: string;
  }
> = {
  default: {
    name: 'Bawaan',
    container: 'bg-background text-foreground',
    card: 'border-border bg-card',
    textArabic: 'text-foreground',
    textLatin: 'text-muted-foreground',
    textTranslation: 'text-foreground/85',
    badge: 'bg-secondary text-secondary-foreground',
  },
  sepia: {
    name: 'Sepia (Klasik)',
    container: 'bg-[#f4ebd0] dark:bg-[#1a1714] text-[#3e2e1e] dark:text-[#eedec5]',
    card: 'border-[#dfd1b3] dark:border-[#2e261f] bg-[#fdf8ec] dark:bg-[#25201b]',
    textArabic: 'text-[#302111] dark:text-[#f8ecdb]',
    textLatin: 'text-[#68533c] dark:text-[#bba78f]',
    textTranslation: 'text-[#443322] dark:text-[#ded0bc]',
    badge: 'bg-[#e7d8b8] dark:bg-[#342b23] text-[#3e2e1e] dark:text-[#eedec5]',
  },
  emerald: {
    name: 'Emerald (Mushaf)',
    container: 'bg-[#f0fbf4] dark:bg-[#071a13] text-[#063321] dark:text-[#d3f2e2]',
    card: 'border-[#ccefdc] dark:border-[#0e3b2b] bg-[#ffffff] dark:bg-[#0d2a1f]',
    textArabic: 'text-[#042417] dark:text-[#ecfdf5]',
    textLatin: 'text-[#206047] dark:text-[#80c8a8]',
    textTranslation: 'text-[#0f442f] dark:text-[#b2e5ce]',
    badge: 'bg-[#d8f5e5] dark:bg-[#133e2f] text-[#063321] dark:text-[#d3f2e2]',
  },
  midnight: {
    name: 'Midnight (OLED)',
    container: 'bg-[#000000] text-[#f4f4f5]',
    card: 'border-[#18181b] bg-[#09090b]',
    textArabic: 'text-[#ffffff]',
    textLatin: 'text-[#71717a]',
    textTranslation: 'text-[#d4d4d8]',
    badge: 'bg-[#18181b] text-[#a1a1aa]',
  },
};
