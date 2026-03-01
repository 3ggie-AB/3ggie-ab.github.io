const getTodayKey = () => new Date().toISOString().slice(0, 10);

export function getDailyCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date === getTodayKey()) return parsed.data as T;
    return null;
  } catch {
    return null;
  }
}

export function setDailyCache<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify({ date: getTodayKey(), data }));
}
