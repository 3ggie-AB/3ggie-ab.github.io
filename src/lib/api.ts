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
