export interface PluginContent {
  title: string;
  arabic?: string;
  latin?: string;
  translation?: string;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  type: 'builtin' | 'custom';
  installed: boolean;
  contents: PluginContent[];
}

const INSTALLED_KEY = 'quran-installed-plugins';
const CUSTOM_KEY = 'quran-custom-plugins';

// Built-in plugins catalog
export const BUILTIN_PLUGINS: Plugin[] = [
  {
    id: 'doa-sholat',
    name: 'Doa Sholat',
    description: 'Kumpulan doa dalam sholat dari iftitah sampai salam',
    icon: '🕌',
    type: 'builtin',
    installed: false,
    contents: [
      { title: 'Doa Iftitah', arabic: 'اللَّهُ أَكْبَرُ كَبِيرًا وَالْحَمْدُ لِلَّهِ كَثِيرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا', latin: 'Allahu Akbar Kabiiraw walhamdu lillaahi katsiiraa wa subhaanallaahi bukrataw wa ashiilaa', translation: 'Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, dan Maha Suci Allah pada pagi dan petang hari.' },
      { title: 'Doa Ruku', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', latin: 'Subhaana Rabbiyal \'Adhiim', translation: 'Maha Suci Tuhanku Yang Maha Agung.' },
      { title: 'Doa I\'tidal', arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ رَبَّنَا وَلَكَ الْحَمْدُ', latin: 'Sami\'allaahu liman hamidah, Rabbanaa wa lakal hamd', translation: 'Allah mendengar orang yang memuji-Nya. Wahai Tuhan kami, bagi-Mu segala puji.' },
      { title: 'Doa Sujud', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', latin: 'Subhaana Rabbiyal A\'laa', translation: 'Maha Suci Tuhanku Yang Maha Tinggi.' },
      { title: 'Doa Duduk Antara Dua Sujud', arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَارْفَعْنِي وَارْزُقْنِي وَاهْدِنِي وَعَافِنِي وَاعْفُ عَنِّي', latin: 'Rabbighfir lii warhamnii wajburnii warfa\'nii warzuqnii wahdinii wa \'aafinii wa\'fu \'annii', translation: 'Ya Tuhanku, ampunilah aku, rahmatilah aku, cukupkanlah aku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, berilah aku kesehatan, dan maafkanlah aku.' },
      { title: 'Tasyahud Awal', arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ', latin: 'Attahiyyaatul mubaarakaatush shalawaatuth thayyibaatu lillaah. Assalaamu \'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. Assalaamu \'alainaa wa \'alaa \'ibaadillaahish shaalihiin', translation: 'Segala penghormatan, keberkahan, shalawat dan kebaikan hanya bagi Allah. Semoga keselamatan terlimpah kepadamu wahai Nabi, begitu juga rahmat Allah dan berkah-Nya. Semoga keselamatan terlimpah kepada kami dan kepada hamba-hamba Allah yang saleh.' },
    ],
  },
  {
    id: 'doa-harian',
    name: 'Doa Harian',
    description: 'Doa sehari-hari: makan, tidur, bepergian, dll',
    icon: '🤲',
    type: 'builtin',
    installed: false,
    contents: [
      { title: 'Doa Sebelum Makan', arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ', latin: 'Bismillaahi wa \'alaa barakatillaah', translation: 'Dengan nama Allah dan dengan berkah Allah.' },
      { title: 'Doa Sesudah Makan', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ', latin: 'Alhamdu lillaahil ladzii ath\'amanaa wa saqaanaa wa ja\'alanaa muslimiin', translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, dan menjadikan kami muslim.' },
      { title: 'Doa Sebelum Tidur', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', latin: 'Bismikallaahumma amuutu wa ahyaa', translation: 'Dengan nama-Mu ya Allah aku mati dan aku hidup.' },
      { title: 'Doa Bangun Tidur', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ', latin: 'Alhamdu lillaahil ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin nusyuur', translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya kami dikembalikan.' },
      { title: 'Doa Keluar Rumah', arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', latin: 'Bismillaahi tawakkaltu \'alallaahi laa haula wa laa quwwata illaa billaah', translation: 'Dengan nama Allah, aku bertawakal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.' },
      { title: 'Doa Masuk Masjid', arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', latin: 'Allaahummaf tah lii abwaaba rahmatik', translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.' },
    ],
  },
  {
    id: 'tahlil',
    name: 'Bacaan Tahlil',
    description: 'Rangkaian bacaan tahlil lengkap',
    icon: '📿',
    type: 'builtin',
    installed: false,
    contents: [
      { title: 'Al-Fatihah', arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿١﴾ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾', translation: 'Bacakan surat Al-Fatihah yang dihadiahkan kepada arwah.' },
      { title: 'Al-Ikhlas (3x)', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ ﴿٤﴾', translation: 'Katakanlah: Dia-lah Allah, Yang Maha Esa. Dibaca 3 kali.' },
      { title: 'Al-Falaq', arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾', translation: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh.' },
      { title: 'An-Nas', arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَٰهِ النَّاسِ ﴿٣﴾', translation: 'Katakanlah: Aku berlindung kepada Tuhannya manusia.' },
      { title: 'Tahlil', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', latin: 'Laa ilaaha illallaahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai-in qadiir', translation: 'Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan pujian, dan Dia Maha Kuasa atas segala sesuatu.' },
      { title: 'Doa Tahlil', arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ', latin: 'Allaahummagh fir lahu warhamhu wa \'aafihi wa\'fu \'anhu', translation: 'Ya Allah, ampunilah dia, rahmatilah dia, sejahterakanlah dia dan maafkanlah dia.' },
    ],
  },
  {
    id: 'dzikir-pagi-petang',
    name: 'Dzikir Pagi & Petang',
    description: 'Kumpulan dzikir pagi dan petang sesuai sunnah',
    icon: '🌅',
    type: 'builtin',
    installed: false,
    contents: [
      { title: 'Ayat Kursi', arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ', translation: 'Allah, tidak ada Tuhan selain Dia, Yang Maha Hidup, Yang terus menerus mengurus makhluk-Nya.' },
      { title: 'Sayyidul Istighfar', arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ', latin: 'Allaahumma anta rabbii laa ilaaha illaa anta khalaqtanii wa ana \'abduka wa ana \'alaa \'ahdika wa wa\'dika mastatha\'tu', translation: 'Ya Allah, Engkau Tuhanku, tidak ada tuhan selain Engkau. Engkau menciptakanku dan aku hamba-Mu. Aku berada di atas perjanjian dan janji-Mu semampuku.' },
      { title: 'Subhanallah (33x)', arabic: 'سُبْحَانَ اللَّهِ', latin: 'Subhaanallaah', translation: 'Maha Suci Allah. (33 kali)' },
      { title: 'Alhamdulillah (33x)', arabic: 'الْحَمْدُ لِلَّهِ', latin: 'Alhamdulillaah', translation: 'Segala puji bagi Allah. (33 kali)' },
      { title: 'Allahu Akbar (33x)', arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allaahu Akbar', translation: 'Allah Maha Besar. (33 kali)' },
    ],
  },
  {
    id: 'yasin-fadhilah',
    name: 'Yasin & Fadhilah',
    description: 'Surat Yasin beserta fadhilah dan keutamaannya',
    icon: '📖',
    type: 'builtin',
    installed: false,
    contents: [
      { title: 'Keutamaan Surat Yasin', translation: 'Rasulullah ﷺ bersabda: "Bacakanlah Yasin kepada orang-orang yang sedang menghadapi kematian di antara kalian." (HR. Abu Dawud). Surat Yasin disebut sebagai jantungnya Al-Quran.' },
      { title: 'Baca Surat Yasin', translation: 'Buka Surat Yasin (Surah ke-36) untuk membaca lengkap dengan terjemahan dan audio.' },
    ],
  },
];

export function getInstalledIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(INSTALLED_KEY) || '[]');
  } catch { return []; }
}

function saveInstalledIds(ids: string[]) {
  localStorage.setItem(INSTALLED_KEY, JSON.stringify(ids));
}

export function installPlugin(id: string) {
  const ids = getInstalledIds();
  if (!ids.includes(id)) {
    ids.push(id);
    saveInstalledIds(ids);
  }
}

export function uninstallPlugin(id: string) {
  saveInstalledIds(getInstalledIds().filter((i) => i !== id));
}

export function getCustomPlugins(): Plugin[] {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
  } catch { return []; }
}

export function saveCustomPlugins(plugins: Plugin[]) {
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(plugins));
}

export function addCustomPlugin(plugin: Plugin) {
  const list = getCustomPlugins();
  list.push(plugin);
  saveCustomPlugins(list);
}

export function removeCustomPlugin(id: string) {
  saveCustomPlugins(getCustomPlugins().filter((p) => p.id !== id));
}
