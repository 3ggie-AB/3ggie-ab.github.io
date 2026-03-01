export interface HistoryEntry {
  surahNomor: number;
  surahName: string;
  ayat?: number;
  timestamp: number;
}

const HISTORY_KEY = 'quran_history';
const MAX_HISTORY = 30;

export function getHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addHistory(entry: Omit<HistoryEntry, 'timestamp'>) {
  const history = getHistory().filter(h => h.surahNomor !== entry.surahNomor);
  history.unshift({ ...entry, timestamp: Date.now() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}
