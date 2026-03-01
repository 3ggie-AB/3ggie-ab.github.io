const STORAGE_KEY = 'quran-shortcuts';

export function getShortcuts(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addShortcut(nomor: number): number[] {
  const list = getShortcuts();
  if (!list.includes(nomor)) {
    list.push(nomor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  return list;
}

export function removeShortcut(nomor: number): number[] {
  const list = getShortcuts().filter((n) => n !== nomor);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function isShortcut(nomor: number): boolean {
  return getShortcuts().includes(nomor);
}
