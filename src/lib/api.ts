import { db, type Surah, type Ayat, type Tafsir } from './db';

const BASE_URL = 'https://equran.id/api/v2';

export async function fetchSurahs(forceRefresh = false): Promise<Surah[]> {
  if (!forceRefresh) {
    const cached = await db.surahs.count();
    if (cached > 0) return db.surahs.orderBy('nomor').toArray();
  }

  try {
    const res = await fetch(`${BASE_URL}/surat`);
    const json = await res.json();
    const surahs: Surah[] = json.data.map((s: any) => ({
      nomor: s.nomor,
      nama: s.nama,
      namaLatin: s.namaLatin,
      jumlahAyat: s.jumlahAyat,
      tempatTurun: s.tempatTurun,
      arti: s.arti,
      deskripsi: s.deskripsi,
      audioFull: s.audioFull,
    }));
    await db.surahs.clear();
    await db.surahs.bulkPut(surahs);
    return surahs;
  } catch {
    return db.surahs.orderBy('nomor').toArray();
  }
}

export async function fetchAyats(surahNomor: number, forceRefresh = false): Promise<Ayat[]> {
  if (!forceRefresh) {
    const cached = await db.ayats.where('surahNomor').equals(surahNomor).count();
    if (cached > 0) return db.ayats.where('surahNomor').equals(surahNomor).sortBy('nomorAyat');
  }

  try {
    const res = await fetch(`${BASE_URL}/surat/${surahNomor}`);
    const json = await res.json();
    const ayats: Ayat[] = json.data.ayat.map((a: any) => ({
      surahNomor,
      nomorAyat: a.nomorAyat,
      teksArab: a.teksArab,
      teksLatin: a.teksLatin,
      teksIndonesia: a.teksIndonesia,
      audio: a.audio,
    }));
    await db.ayats.where('surahNomor').equals(surahNomor).delete();
    await db.ayats.bulkAdd(ayats);
    return ayats;
  } catch {
    return db.ayats.where('surahNomor').equals(surahNomor).sortBy('nomorAyat');
  }
}

export async function fetchTafsir(surahNomor: number, forceRefresh = false): Promise<Tafsir[]> {
  if (!forceRefresh) {
    const cached = await db.tafsirs.where('surahNomor').equals(surahNomor).count();
    if (cached > 0) return db.tafsirs.where('surahNomor').equals(surahNomor).sortBy('nomorAyat');
  }

  try {
    const res = await fetch(`${BASE_URL}/tafsir/${surahNomor}`);
    const json = await res.json();
    const tafsirs: Tafsir[] = json.data.tafsir.map((t: any) => ({
      surahNomor,
      nomorAyat: t.ayat,
      teks: t.teks,
    }));
    await db.tafsirs.where('surahNomor').equals(surahNomor).delete();
    await db.tafsirs.bulkAdd(tafsirs);
    return tafsirs;
  } catch {
    return db.tafsirs.where('surahNomor').equals(surahNomor).sortBy('nomorAyat');
  }
}

/** Download a single audio file and cache it */
async function downloadAudioFile(url: string, surahNomor: number, nomorAyat: number, qari: string): Promise<boolean> {
  try {
    // Check if already cached
    const existing = await db.audioCache
      .where('[surahNomor+nomorAyat+qari]')
      .equals([surahNomor, nomorAyat, qari])
      .count();
    if (existing > 0) return true;

    const res = await fetch(url);
    if (!res.ok) return false;
    const blob = await res.blob();
    await db.audioCache.add({ surahNomor, nomorAyat, qari, blob });
    return true;
  } catch {
    return false;
  }
}

/** Get cached audio blob URL */
export async function getCachedAudio(surahNomor: number, nomorAyat: number, qari: string = '01'): Promise<string | null> {
  const cached = await db.audioCache
    .where('[surahNomor+nomorAyat+qari]')
    .equals([surahNomor, nomorAyat, qari])
    .first();
  if (cached) return URL.createObjectURL(cached.blob);
  return null;
}

/** Check if a surah is fully downloaded (text + audio) */
export async function isSurahFullyDownloaded(surahNomor: number): Promise<boolean> {
  const status = await db.downloadStatus.get(surahNomor);
  return !!(status?.textDone && status?.audioDone);
}

/** Get download status for all surahs */
export async function getAllDownloadStatus() {
  return db.downloadStatus.toArray();
}

/** Download a single surah: text + tafsir + audio */
export async function downloadSurah(
  surahNomor: number,
  onProgress?: (phase: string, done: number, total: number) => void
): Promise<void> {
  // Fetch text
  onProgress?.('teks', 0, 1);
  const ayats = await fetchAyats(surahNomor, true);
  await fetchTafsir(surahNomor, true);
  onProgress?.('teks', 1, 1);

  // Download per-ayat audio
  const total = ayats.length;
  let done = 0;
  const qari = '01'; // default qari

  for (let i = 0; i < ayats.length; i += 3) {
    const batch = ayats.slice(i, i + 3);
    await Promise.all(
      batch.map(async (a) => {
        const url = a.audio?.[qari] || a.audio?.['01'];
        if (url) {
          await downloadAudioFile(url, surahNomor, a.nomorAyat, qari);
        }
        done++;
        onProgress?.('audio', done, total);
      })
    );
  }

  // Update status
  await db.downloadStatus.put({
    surahNomor,
    textDone: true,
    audioDone: true,
    totalAyat: total,
    downloadedAyatAudio: done,
  });
}

/** Download all 114 surahs + ayat + tafsir + audio to IndexedDB. Returns progress via callback. */
export async function downloadAllData(
  onProgress: (done: number, total: number, currentSurah?: string) => void
): Promise<void> {
  const surahs = await fetchSurahs(true);
  const total = surahs.length;
  let done = 0;

  for (let i = 0; i < surahs.length; i += 2) {
    const batch = surahs.slice(i, i + 2);
    await Promise.all(
      batch.map(async (s) => {
        const alreadyDone = await isSurahFullyDownloaded(s.nomor);
        if (!alreadyDone) {
          await downloadSurah(s.nomor);
        }
        done++;
        onProgress(done, total, s.namaLatin);
      })
    );
  }
}
