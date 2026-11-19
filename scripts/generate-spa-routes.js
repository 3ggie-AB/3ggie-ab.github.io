import fs from 'fs';
import path from 'path';

const routes = [
  'quran',
  'beranda',
  'history',
  'juz',
  'plugin',
  'downloads',
  'roulette',
  'plugin/doa-sholat',
  'plugin/doa-setelah-sholat',
  'plugin/doa-harian',
  'plugin/tahlil',
  'plugin/dzikir-pagi-petang',
  'plugin/yasin-fadhilah',
  'plugin/doa-dhuha',
];

// Add all 114 surah routes
for (let i = 1; i <= 114; i++) {
  routes.push(`surah/${i}`);
}

const templatePath = path.resolve('index.html');
if (!fs.existsSync(templatePath)) {
  console.error('index.html not found, skipping route generation.');
  process.exit(0);
}

const htmlContent = fs.readFileSync(templatePath, 'utf-8');

routes.forEach((route) => {
  const targetDir = path.resolve(route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), htmlContent, 'utf-8');
});

console.log(`[SPA Fallback] Generated ${routes.length} static route fallbacks successfully.`);
