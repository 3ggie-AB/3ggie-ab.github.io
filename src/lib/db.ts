import Dexie, { type Table } from 'dexie';

export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayat {
  id?: number;
  surahNomor: number;
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface Tafsir {
  id?: number;
  surahNomor: number;
  nomorAyat: number;
  teks: string;
}

class QuranDB extends Dexie {
  surahs!: Table<Surah, number>;
  ayats!: Table<Ayat, number>;
  tafsirs!: Table<Tafsir, number>;

  constructor() {
    super('quranDB');
    this.version(1).stores({
      surahs: 'nomor, namaLatin',
      ayats: '++id, surahNomor, [surahNomor+nomorAyat]',
      tafsirs: '++id, surahNomor, [surahNomor+nomorAyat]',
    });
  }
}

export const db = new QuranDB();
