import { YASIN_FADHILAH } from './yasinFadhilah';

export interface PluginContent {
  title: string;
  arabic?: string;
  latin?: string;
  translation?: string;
  /** Nomor ayat; kartu ditampilkan dengan lencana nomor seperti halaman surat. */
  ayat?: number;
  /** Keterangan singkat, misalnya jumlah pengulangan. */
  note?: string;
  /** Kartu doa/sisipan yang ditonjolkan di antara ayat. */
  highlight?: boolean;
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
    id: 'doa-setelah-sholat',
    name: 'Doa Setelah Sholat',
    description: 'Wirid dan doa lengkap setelah sholat fardhu, dari istighfar sampai doa penutup',
    icon: '📿',
    type: 'builtin',
    installed: false,
    contents: [
      {"title": "Istighfar (3x)", "arabic": "أَسْتَغْفِرُ اللّٰهَ الْعَظِيْمَ الَّذِيْ لَآ إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّوْمُ وَأَتُوْبُ إِلَيْهِ", "latin": "Astaghfirullaahal 'azhiimal ladzii laa ilaaha illaa huwal hayyul qayyuumu wa atuubu ilaih", "translation": "Aku memohon ampun kepada Allah Yang Maha Agung, yang tiada Tuhan selain Dia, Yang Maha Hidup lagi terus-menerus mengurus makhluk-Nya, dan aku bertobat kepada-Nya. (Dibaca 3 kali.)"},
      {"title": "Tahlil (3x)", "arabic": "لَآ إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ", "latin": "Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa 'alaa kulli syai-in qadiir", "translation": "Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dia yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu. (Dibaca 3 kali; setelah Subuh dan Maghrib 10 kali.)"},
      {"title": "Mohon Perlindungan dari Neraka (7x)", "arabic": "اَللّٰهُمَّ أَجِرْنِيْ مِنَ النَّارِ", "latin": "Allaahumma ajirnii minan naar", "translation": "Ya Allah, lindungilah aku dari api neraka. (Dibaca 7 kali setelah Subuh dan Maghrib.)"},
      {"title": "Doa Keselamatan", "arabic": "اَللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ وَإِلَيْكَ يَعُوْدُ السَّلَامُ فَحَيِّنَا رَبَّنَا بِالسَّلَامِ وَأَدْخِلْنَا الْجَنَّةَ دَارَ السَّلَامِ تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", "latin": "Allaahumma antas salaam, wa minkas salaam, wa ilaika ya'uudus salaam, fahayyinaa rabbanaa bis salaam, wa adkhilnal jannata daaras salaam, tabaarakta rabbanaa wa ta'aalaita yaa dzal jalaali wal ikraam", "translation": "Ya Allah, Engkaulah Yang Maha Sejahtera, dari-Mu kesejahteraan, dan kepada-Mu kembali kesejahteraan. Maka hidupkanlah kami, wahai Tuhan kami, dengan sejahtera, dan masukkanlah kami ke dalam surga, negeri kesejahteraan. Maha Berkah Engkau, wahai Tuhan kami, dan Maha Tinggi, wahai Pemilik keagungan dan kemuliaan."},
      {"title": "Ayat Kursi", "arabic": "اَللّٰهُ لَآ اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّوْمُ ەۚ لَا تَأْخُذُهٗ سِنَةٌ وَّلَا نَوْمٌۗ  لَهٗ مَا فِى السَّمٰوٰتِ وَمَا فِى الْاَرْضِۗ مَنْ ذَا الَّذِيْ يَشْفَعُ عِنْدَهٗٓ اِلَّا بِاِذْنِهٖۗ يَعْلَمُ مَا بَيْنَ اَيْدِيْهِمْ وَمَا خَلْفَهُمْۚ وَلَا يُحِيْطُوْنَ بِشَيْءٍ مِّنْ عِلْمِهٖٓ اِلَّا بِمَا شَاۤءَۚ وَسِعَ كُرْسِيُّهُ السَّمٰوٰتِ وَالْاَرْضَۚ وَلَا يَـُٔوْدُهٗ حِفْظُهُمَاۚ وَهُوَ الْعَلِيُّ الْعَظِيْمُ", "latin": "Allāhu lā ilāha illā huw(a), al-ḥayyul-qayyūm(u), lā ta'khużuhū sinatuw wa lā naum(un), lahū mā fis-samāwāti wa mā fil-arḍ(i), man żal-lażī yasyfa‘u ‘indahū illā bi'iżnih(ī), ya‘lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bisyai'im min ‘ilmihī illā bimā syā'(a), wasi‘a kursiyyuhus-samāwāti wal-arḍ(a), wa lā ya'ūduhū ḥifẓuhumā, wa huwal-‘aliyyul-‘aẓīm(u).", "translation": "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup lagi terus-menerus mengurus (makhluk-Nya). Dia tidak dilanda oleh kantuk dan tidak (pula) oleh tidur. Milik-Nyalah apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka. Mereka tidak mengetahui sesuatu apa pun dari ilmu-Nya, kecuali apa yang Dia kehendaki. Kursi-Nya (ilmu dan kekuasaan-Nya) meliputi langit dan bumi. Dia tidak merasa berat memelihara keduanya. Dialah yang Maha Tinggi lagi Maha Agung."},
      {"title": "Surat Al-Ikhlas", "arabic": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ\nقُلْ هُوَ اللّٰهُ اَحَدٌۚ ﴿١﴾ اَللّٰهُ الصَّمَدُۚ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُوْلَدْۙ ﴿٣﴾ وَلَمْ يَكُنْ لَّهٗ كُفُوًا اَحَدٌ ࣖ ﴿٤﴾", "latin": "Qul huwallāhu aḥad(un). Allāhuṣ-ṣamad(u). Lam yalid wa lam yūlad. Wa lam yakul lahū kufuwan aḥad(un).", "translation": "(1) Katakanlah (Nabi Muhammad), “Dialah Allah Yang Maha Esa. (2) Allah tempat meminta segala sesuatu. (3) Dia tidak beranak dan tidak pula diperanakkan (4) serta tidak ada sesuatu pun yang setara dengan-Nya.”"},
      {"title": "Surat Al-Falaq", "arabic": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ\nقُلْ اَعُوْذُ بِرَبِّ الْفَلَقِۙ ﴿١﴾ مِنْ شَرِّ مَا خَلَقَۙ ﴿٢﴾ وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ ﴿٣﴾ وَمِنْ شَرِّ النَّفّٰثٰتِ فِى الْعُقَدِۙ ﴿٤﴾ وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ ࣖ ﴿٥﴾", "latin": "Qul a‘ūżu birabbil-falaq(i). Min syarri mā khalaq(a). Wa min syarri gāsiqin iżā waqab(a). Wa min syarrin-naffāṡāti fil-‘uqad(i). Wa min syarri ḥāsidin iżā ḥasad(a).", "translation": "(1) Katakanlah (Nabi Muhammad), “Aku berlindung kepada Tuhan yang (menjaga) fajar (subuh) (2) dari kejahatan (makhluk yang) Dia ciptakan, (3) dari kejahatan malam apabila telah gelap gulita, (4) dari kejahatan perempuan-perempuan (penyihir) yang meniup pada buhul-buhul (talinya), (5) dan dari kejahatan orang yang dengki apabila dia dengki.”"},
      {"title": "Surat An-Nas", "arabic": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ\nقُلْ اَعُوْذُ بِرَبِّ النَّاسِۙ ﴿١﴾ مَلِكِ النَّاسِۙ ﴿٢﴾ اِلٰهِ النَّاسِۙ ﴿٣﴾ مِنْ شَرِّ الْوَسْوَاسِ ەۙ الْخَنَّاسِۖ ﴿٤﴾ الَّذِيْ يُوَسْوِسُ فِيْ صُدُوْرِ النَّاسِۙ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ࣖ ﴿٦﴾", "latin": "Qul a‘ūżu birabbin-nās(i). Malikin-nās(i). Ilāhin-nās(i). Min syarril-waswāsil-khannās(i). Allażī yuwaswisu fī ṣudūrin-nās(i). Minal jinnati wan-nās(i).", "translation": "(1) Katakanlah (Nabi Muhammad), “Aku berlindung kepada Tuhan manusia, (2) raja manusia, (3) sembahan manusia (4) dari kejahatan (setan) pembisik yang bersembunyi (5) yang membisikkan (kejahatan) ke dalam dada manusia, (6) dari (golongan) jin dan manusia.”"},
      {"title": "Tasbih (33x)", "arabic": "سُبْحَانَ اللّٰهِ", "latin": "Subhaanallaah", "translation": "Maha Suci Allah. (Dibaca 33 kali.)"},
      {"title": "Tahmid (33x)", "arabic": "اَلْحَمْدُ لِلّٰهِ", "latin": "Alhamdulillaah", "translation": "Segala puji bagi Allah. (Dibaca 33 kali.)"},
      {"title": "Takbir (33x)", "arabic": "اَللّٰهُ أَكْبَرُ", "latin": "Allaahu akbar", "translation": "Allah Maha Besar. (Dibaca 33 kali.)"},
      {"title": "Penyempurna Dzikir", "arabic": "اَللّٰهُ أَكْبَرُ كَبِيْرًا وَالْحَمْدُ لِلّٰهِ كَثِيْرًا وَسُبْحَانَ اللّٰهِ بُكْرَةً وَأَصِيْلًا، لَآ إِلٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِيْ وَيُمِيْتُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَدِيْرٌ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظِيْمِ", "latin": "Allaahu akbar kabiiraa, wal hamdu lillaahi katsiiraa, wa subhaanallaahi bukratan wa ashiilaa. Laa ilaaha illallaahu wahdahuu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa 'alaa kulli syai-in qadiir. Wa laa haula wa laa quwwata illaa billaahil 'aliyyil 'azhiim", "translation": "Allah Maha Besar dengan sebesar-besarnya, segala puji bagi Allah dengan pujian yang banyak, dan Maha Suci Allah pada pagi dan petang. Tiada Tuhan selain Allah Yang Maha Esa, tiada sekutu bagi-Nya. Bagi-Nya kerajaan dan bagi-Nya segala puji. Dia yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu. Tiada daya dan kekuatan kecuali dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung."},
      {"title": "Pembuka Doa", "arabic": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ. اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ، حَمْدًا يُوَافِيْ نِعَمَهُ وَيُكَافِئُ مَزِيْدَهُ، يَا رَبَّنَا لَكَ الْحَمْدُ كَمَا يَنْبَغِيْ لِجَلَالِ وَجْهِكَ وَعَظِيْمِ سُلْطَانِكَ", "latin": "Bismillaahir rahmaanir rahiim. Alhamdu lillaahi rabbil 'aalamiin, hamdan yuwaafii ni'amahuu wa yukaafi-u maziidah. Yaa rabbanaa lakal hamdu kamaa yanbaghii lijalaali wajhika wa 'azhiimi sulthaanik", "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. Segala puji bagi Allah Tuhan semesta alam, pujian yang sebanding dengan nikmat-nikmat-Nya dan menjamin tambahannya. Wahai Tuhan kami, bagi-Mu segala puji sebagaimana layak bagi keagungan wajah-Mu dan kebesaran kekuasaan-Mu."},
      {"title": "Shalawat", "arabic": "اَللّٰهُمَّ صَلِّ وَسَلِّمْ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى اٰلِ سَيِّدِنَا مُحَمَّدٍ", "latin": "Allaahumma shalli wa sallim 'alaa sayyidinaa Muhammadin wa 'alaa aali sayyidinaa Muhammad", "translation": "Ya Allah, limpahkanlah shalawat dan salam kepada junjungan kami Nabi Muhammad dan kepada keluarga junjungan kami Nabi Muhammad."},
      {"title": "Doa Mohon Pertolongan Beribadah", "arabic": "اَللّٰهُمَّ أَعِنِّيْ عَلٰى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", "latin": "Allaahumma a'innii 'alaa dzikrika wa syukrika wa husni 'ibaadatik", "translation": "Ya Allah, tolonglah aku untuk selalu mengingat-Mu, bersyukur kepada-Mu, dan beribadah kepada-Mu dengan baik."},
      {"title": "Doa untuk Kedua Orang Tua", "arabic": "رَبِّ اغْفِرْ لِيْ وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِيْ صَغِيْرًا", "latin": "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa", "translation": "Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah mereka sebagaimana mereka mendidikku di waktu kecil."},
      {"title": "Doa Mohon Diterima Amal", "arabic": "رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيْعُ الْعَلِيْمُ، وَتُبْ عَلَيْنَا إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيْمُ", "latin": "Rabbanaa taqabbal minnaa innaka antas samii'ul 'aliim, wa tub 'alainaa innaka antat tawwaabur rahiim", "translation": "Wahai Tuhan kami, terimalah (amal) dari kami, sesungguhnya Engkau Maha Mendengar lagi Maha Mengetahui. Dan terimalah tobat kami, sesungguhnya Engkau Maha Penerima tobat lagi Maha Penyayang."},
      {"title": "Doa Mohon Ampunan", "arabic": "رَبَّنَا ظَلَمْنَآ أَنْفُسَنَا وَإِنْ لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُوْنَنَّ مِنَ الْخَاسِرِيْنَ", "latin": "Rabbanaa zhalamnaa anfusanaa wa in lam taghfir lanaa wa tarhamnaa lanakuunanna minal khaasiriin", "translation": "Wahai Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan tidak merahmati kami, niscaya kami termasuk orang-orang yang rugi."},
      {"title": "Doa Keteguhan Hati", "arabic": "رَبَّنَا لَا تُزِغْ قُلُوْبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَّدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ", "latin": "Rabbanaa laa tuzigh quluubanaa ba'da idz hadaitanaa wa hab lanaa mil ladunka rahmah, innaka antal wahhaab", "translation": "Wahai Tuhan kami, janganlah Engkau condongkan hati kami kepada kesesatan setelah Engkau beri kami petunjuk, dan karuniakanlah kepada kami rahmat dari sisi-Mu. Sesungguhnya Engkau Maha Pemberi."},
      {"title": "Doa Ilmu, Rezeki, dan Amal", "arabic": "اَللّٰهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا", "latin": "Allaahumma innii as-aluka 'ilman naafi'an wa rizqan thayyiban wa 'amalan mutaqabbalaa", "translation": "Ya Allah, aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima."},
      {"title": "Doa untuk Keluarga", "arabic": "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيّٰتِنَا قُرَّةَ أَعْيُنٍ وَّاجْعَلْنَا لِلْمُتَّقِيْنَ إِمَامًا", "latin": "Rabbanaa hab lanaa min azwaajinaa wa dzurriyyaatinaa qurrata a'yun, waj'alnaa lil muttaqiina imaamaa", "translation": "Wahai Tuhan kami, anugerahkanlah kepada kami pasangan dan keturunan yang menjadi penyejuk hati, dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa."},
      {"title": "Doa Husnul Khatimah", "arabic": "اَللّٰهُمَّ اخْتِمْ لَنَا بِحُسْنِ الْخَاتِمَةِ وَلَا تَخْتِمْ عَلَيْنَا بِسُوْءِ الْخَاتِمَةِ", "latin": "Allaahummakhtim lanaa bihusnil khaatimah, wa laa takhtim 'alainaa bisuu-il khaatimah", "translation": "Ya Allah, akhirilah hidup kami dengan akhir yang baik (husnul khatimah), dan janganlah Engkau akhiri hidup kami dengan akhir yang buruk (su'ul khatimah)."},
      {"title": "Doa Sapu Jagat", "arabic": "رَبَّنَآ اٰتِنَا فِى الدُّنْيَا حَسَنَةً وَّفِى الْاٰخِرَةِ حَسَنَةً وَّقِنَا عَذَابَ النَّارِ", "latin": "Rabbanaa aatinaa fid dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa 'adzaaban naar", "translation": "Wahai Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari siksa neraka."},
      {"title": "Penutup Doa", "arabic": "وَصَلَّى اللّٰهُ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى اٰلِهِ وَصَحْبِهِ وَسَلَّمَ، سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُوْنَ، وَسَلَامٌ عَلَى الْمُرْسَلِيْنَ، وَالْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِيْنَ", "latin": "Wa shallallaahu 'alaa sayyidinaa Muhammadin wa 'alaa aalihii wa shahbihii wa sallam. Subhaana rabbika rabbil 'izzati 'ammaa yashifuun, wa salaamun 'alal mursaliin, wal hamdu lillaahi rabbil 'aalamiin", "translation": "Semoga Allah melimpahkan shalawat dan salam kepada junjungan kami Nabi Muhammad, beserta keluarga dan sahabatnya. Maha Suci Tuhanmu, Tuhan Pemilik kemuliaan, dari apa yang mereka sifatkan. Salam sejahtera atas para rasul, dan segala puji bagi Allah Tuhan semesta alam."},
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
    name: 'Yasin Fadhilah',
    description: 'Surat Yasin Fadhilah lengkap dengan hadharah, doa sisipan, dan doa penutup',
    icon: '📖',
    type: 'builtin',
    installed: false,
    contents: YASIN_FADHILAH,
  },
  {
    id: 'doa-dhuha',
    name: 'Doa Dhuha',
    description: 'Niat sholat Dhuha dan doa setelah sholat Dhuha',
    icon: '☀️',
    type: 'builtin',
    installed: false,
    contents: [
      { title: 'Niat Sholat Dhuha', arabic: 'أُصَلِّيْ سُنَّةَ الضُّحٰى رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالٰى', latin: 'Ushallii sunnatadh dhuhaa rak\'ataini mustaqbilal qiblati adaa-an lillaahi ta\'aalaa', translation: 'Aku niat sholat sunnah Dhuha dua rakaat menghadap kiblat, tunai karena Allah Ta\'ala.' },
      { title: 'Doa Setelah Sholat Dhuha', arabic: 'اَللّٰهُمَّ إِنَّ الضُّحَآءَ ضُحَاؤُكَ، وَالْبَهَاءَ بَهَاؤُكَ، وَالْجَمَالَ جَمَالُكَ، وَالْقُوَّةَ قُوَّتُكَ، وَالْقُدْرَةَ قُدْرَتُكَ، وَالْعِصْمَةَ عِصْمَتُكَ', latin: 'Allaahumma innadh dhuhaa-a dhuhaa-uka, wal bahaa-a bahaa-uka, wal jamaala jamaaluka, wal quwwata quwwatuka, wal qudrata qudratuka, wal \'ishmata \'ishmatuka', translation: 'Ya Allah, sesungguhnya waktu dhuha adalah waktu dhuha-Mu, keagungan adalah keagungan-Mu, keindahan adalah keindahan-Mu, kekuatan adalah kekuatan-Mu, kekuasaan adalah kekuasaan-Mu, dan penjagaan adalah penjagaan-Mu.' },
      { title: 'Doa Memohon Rezeki', arabic: 'اَللّٰهُمَّ إِنْ كَانَ رِزْقِيْ فِي السَّمَآءِ فَأَنْزِلْهُ، وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ، وَإِنْ كَانَ مُعَسَّرًا فَيَسِّرْهُ، وَإِنْ كَانَ حَرَامًا فَطَهِّرْهُ، وَإِنْ كَانَ بَعِيْدًا فَقَرِّبْهُ، بِحَقِّ ضُحَائِكَ وَبَهَائِكَ وَجَمَالِكَ وَقُوَّتِكَ وَقُدْرَتِكَ، آتِنِيْ مَا آتَيْتَ عِبَادَكَ الصَّالِحِيْنَ', latin: 'Allaahumma in kaana rizqii fis samaa-i fa anzilhu, wa in kaana fil ardhi fa akhrijhu, wa in kaana mu\'assaran fa yassirhu, wa in kaana haraaman fa thahhirhu, wa in kaana ba\'iidan fa qarribhu, bihaqqi dhuhaa-ika wa bahaa-ika wa jamaalika wa quwwatika wa qudratika, aatinii maa aataita \'ibaadakash shaalihiin', translation: 'Ya Allah, jika rezekiku berada di langit maka turunkanlah, jika berada di bumi maka keluarkanlah, jika sulit maka mudahkanlah, jika haram maka sucikanlah, jika jauh maka dekatkanlah, berkat waktu dhuha-Mu, keagungan-Mu, keindahan-Mu, kekuatan-Mu, dan kekuasaan-Mu. Limpahkanlah kepadaku apa yang telah Engkau limpahkan kepada hamba-hamba-Mu yang saleh.' },
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
