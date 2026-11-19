import { useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight, Award, Brain, Check, Code2, Copy, Cpu, Database, Download, Github, GraduationCap,
  Layers, Linkedin, Server, Smartphone, Sparkles, Terminal,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { toast } from 'sonner';

const EMAIL = '3ggie.ab@gmail.com';
const GITHUB = 'https://github.com/3ggie-AB';
const LINKEDIN = 'https://www.linkedin.com/in/3ggieab/';

// left, size, [core, body, edge] colours, duration, delay (negative = already mid-flight), sideways drift
const ORANGE = ['#ffd27a', '#ff6a1a', '#e02a00'];
const PINK = ['#ffb3d1', '#ff2d78', '#c4004f'];
const VIOLET = ['#d9c2ff', '#8b5cf6', '#5b21b6'];
const BLOBS = [
  { left: '2%', size: '26vmax', c: ORANGE, dur: 26, delay: -4, dx: '6vw' },
  { left: '22%', size: '15vmax', c: PINK, dur: 19, delay: -11, dx: '-5vw' },
  { left: '40%', size: '30vmax', c: VIOLET, dur: 33, delay: -20, dx: '4vw' },
  { left: '60%', size: '13vmax', c: ORANGE, dur: 17, delay: -7, dx: '-7vw' },
  { left: '70%', size: '24vmax', c: PINK, dur: 29, delay: -15, dx: '5vw' },
  { left: '86%', size: '17vmax', c: VIOLET, dur: 22, delay: -2, dx: '-6vw' },
  { left: '50%', size: '10vmax', c: PINK, dur: 15, delay: -9, dx: '8vw' },
];

const PROJECTS = [
  {
    name: 'Al Quran Digital',
    desc: 'Baca & dengar Al-Quran. Bisa offline.',
    tags: ['React', 'PWA', 'IndexedDB'],
    open: { to: '/quran', internal: true },
    repo: 'https://github.com/3ggie-AB/3ggie-ab.github.io',
  },
  {
    name: 'WhatsappReextended',
    desc: 'Stiker manager untuk WhatsApp Web.',
    tags: ['Chrome MV3', 'Canvas', 'WebP'],
    open: { to: '/whatsapp-reextended/', internal: false },
    repo: 'https://github.com/3ggie-AB/WAReextendeeed',
    zip: '/whatsapp-reextended/whatsapp-reextended.zip',
  },
  {
    name: 'GreatTrackerActivity',
    desc: 'Ekstensi Chrome pelacak produktivitas mikro (ChatGPT, YouTube, GitHub) dengan auto-pause kursor diam (15s) atau ganti aplikasi.',
    tags: ['Chrome MV3', 'Smart Tracker', 'Idle Auto-Pause', 'Vanilla JS'],
    open: { to: '/great-tracker-activity/', internal: false },
    repo: 'https://github.com/3ggie-AB/GreatTrackerActivity',
    zip: '/great-tracker-activity/great-tracker-activity.zip',
  },
  {
    name: 'Roulette & Prediksi Probabilitas',
    desc: 'Simulasi European Roulette dengan kalkulator odds, analisis statistik, & Monte Carlo.',
    tags: ['React', 'Canvas', 'Probabilitas & Statistik', 'Web Audio'],
    open: { to: '/roulette', internal: true },
    repo: 'https://github.com/3ggie-AB/3ggie-ab.github.io',
  },
];

const SKILLS = [
  { name: 'TypeScript', category: 'frontend', icon: Code2 },
  { name: 'React', category: 'frontend', icon: Layers },
  { name: 'Tailwind', category: 'frontend', icon: Sparkles },
  { name: 'Chrome Extension', category: 'frontend', icon: Smartphone },
  { name: 'Go', category: 'backend', icon: Server },
  { name: 'Laravel / AdonisJS', category: 'backend', icon: Server },
  { name: 'Python', category: 'backend', icon: Terminal },
  { name: 'PostgreSQL / MySQL', category: 'backend', icon: Database },
  { name: 'Docker', category: 'backend', icon: Cpu },
  { name: 'TensorFlow / PyTorch', category: 'ai', icon: Brain },
  { name: 'ML & NLP', category: 'ai', icon: Brain },
];

const PAPERS = [
  { year: '2026', title: 'Website Traffic Analytics untuk Pemantauan Jaringan' },
  { year: '2025', title: 'Sistem Akuntansi Web Berbasis SAK EP' },
  { year: '2025', title: 'Website Basecamp Gunung Ciremai' },
];

const glass =
  'rounded-3xl border border-foreground/10 bg-background/55 backdrop-blur-2xl';
const pill =
  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors';

function LavaLamp() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id="lava-goo" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="22" result="soft" />
            <feColorMatrix in="soft" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8" result="goo" />
            <feGaussianBlur in="goo" stdDeviation="55" result="halo" />
            <feColorMatrix in="halo" values="1.35 0 0 0 0  0 1.35 0 0 0  0 0 1.35 0 0  0 0 0 0.9 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="goo" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div className="lava-heat" />
      <div className="lava-stage absolute inset-0">
        <span className="lava-pool" />
        {BLOBS.map((b, i) => (
          <span
            key={i}
            className="lava-blob"
            style={
              {
                left: b.left,
                width: b.size,
                height: b.size,
                background: `radial-gradient(circle at 38% 30%, ${b.c[0]} 0%, ${b.c[1]} 45%, ${b.c[2]} 100%)`,
                animationDuration: `${b.dur}s`,
                animationDelay: `${b.delay}s`,
                '--dx': b.dx,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'ai'>('all');
  const filteredSkills = activeTab === 'all' ? SKILLS : SKILLS.filter((x) => x.category === activeTab);

  const copyEmail = () => {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    toast.success('Email disalin');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen text-foreground">
      <LavaLamp />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="/avatar.png"
            alt="Egi Ahmad Baihaqi"
            className="h-8 w-8 rounded-full border border-foreground/15 object-cover shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-sm font-bold tracking-tight">egi<span className="text-primary font-black">.</span></span>
        </a>
        <nav className="flex items-center gap-1 text-sm">
          <a href="#karya" className="rounded-full px-3 py-1.5 hover:bg-foreground/10">Karya</a>
          <a href="#about" className="hidden rounded-full px-3 py-1.5 hover:bg-foreground/10 sm:block">Tentang</a>
          <a href="#kontak" className="rounded-full px-3 py-1.5 hover:bg-foreground/10">Kontak</a>
          <ThemeToggle />
        </nav>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-5 pb-16">
        {/* Hero */}
        <section className="grid items-center gap-5 pb-4 pt-2 sm:pt-8 lg:grid-cols-12 lg:gap-8 lg:py-14">
          <div className="space-y-5 lg:col-span-7">
            <div className="flex items-center gap-3">
              <img
                src="/avatar.png"
                alt="Egi Ahmad Baihaqi"
                className="h-12 w-12 rounded-full border border-foreground/15 object-cover"
              />
              <div className="text-sm leading-tight">
                <p className="font-semibold">@3ggie-AB</p>
                <p className="flex items-center gap-1.5 text-foreground/65">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Programmer · Cirebon, Indonesia
                </p>
              </div>
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.02] tracking-tighter sm:text-7xl">
              Egi Ahmad
              <br />
              Baihaqi
            </h1>
            <p className="text-lg text-foreground/75 sm:text-xl">Fullstack Developer &amp; AI/ML.</p>
            <div className="flex flex-wrap gap-2">
              <a href="#karya" className={`${pill} bg-foreground text-background hover:bg-foreground/85`}>
                Lihat karya
              </a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={`${pill} ${glass} hover:bg-background/80`}>
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={`${pill} ${glass} hover:bg-background/80`}>
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </div>

          <div className={`${glass} divide-y divide-foreground/10 lg:col-span-5`}>
            <div className="grid grid-cols-3 divide-x divide-foreground/10 text-center">
              {[
                ['65+', 'Repo'],
                ['4', 'Karya'],
                ['3', 'Riset'],
              ].map(([n, label]) => (
                <div key={label} className="px-2 py-4">
                  <p className="text-2xl font-extrabold tracking-tight sm:text-3xl">{n}</p>
                  <p className="text-xs text-foreground/60">{label}</p>
                </div>
              ))}
            </div>
            {[
              { icon: GraduationCap, label: 'Kampus', value: 'Poltek SCI' },
              { icon: Award, label: 'Sertifikasi', value: 'Junior Network Admin' },
              { icon: Code2, label: 'Fokus', value: 'Web & AI' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <span className="flex items-center gap-2 text-foreground/65">
                  <row.icon className="h-4 w-4" /> {row.label}
                </span>
                <span className="text-right font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Karya */}
        <section id="karya" className="scroll-mt-6 space-y-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Karya</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {PROJECTS.map((p) => (
              <article key={p.name} className={`${glass} flex flex-col gap-4 p-6`}>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{p.desc}</p>
                </div>
                <p className="text-xs text-foreground/55">{p.tags.join(' · ')}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {p.open.internal ? (
                    <Link to={p.open.to} className={`${pill} bg-foreground text-background hover:bg-foreground/85 font-semibold shadow-sm`}>
                      Buka Aplikasi Langsung <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <a href={p.open.to} className={`${pill} bg-foreground text-background hover:bg-foreground/85 font-semibold shadow-sm`}>
                      Buka Aplikasi Langsung <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className={`${pill} hover:bg-foreground/10 border border-foreground/15`}>
                    <Github className="h-4 w-4" /> Repositori GitHub
                  </a>
                  {p.zip && (
                    <a href={p.zip} download className={`${pill} hover:bg-foreground/10 border border-foreground/15`}>
                      <Download className="h-4 w-4" /> Unduh ZIP
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Profil & Perjalanan */}
        <section id="about" className={`${glass} scroll-mt-6 space-y-3 p-6 sm:p-10`}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Profil</h2>
          <p className="max-w-2xl text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            Programmer dari Cirebon, mahasiswa Poltek SCI.
          </p>
          <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
            Suka AI, web modern, dan ekstensi browser — dari UI sampai backend.
          </p>
        </section>

        {/* Tech Stack */}
        <section id="skills" className="scroll-mt-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Stack</h2>
            <div className="flex gap-1">
              {(['all', 'frontend', 'backend', 'ai'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    activeTab === tab ? 'bg-foreground text-background' : 'text-foreground/65 hover:bg-foreground/10'
                  }`}
                >
                  {tab === 'all' ? 'Semua' : tab === 'ai' ? 'AI' : tab}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {filteredSkills.map((skill) => (
              <span
                key={skill.name}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/55 px-3.5 py-2 text-sm font-medium backdrop-blur-2xl"
              >
                <skill.icon className="h-4 w-4 text-foreground/60" />
                {skill.name}
              </span>
            ))}
          </div>
        </section>

        {/* Riset */}
        <section className={`${glass} space-y-4 p-6 sm:p-10`}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Riset</h2>
          <ul className="space-y-2.5 text-sm">
            {PAPERS.map((p) => (
              <li key={p.title} className="flex gap-3">
                <span className="shrink-0 tabular-nums text-foreground/50">{p.year}</span>
                <span>{p.title}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Kontak */}
        <section id="kontak" className={`${glass} scroll-mt-6 space-y-4 p-6 sm:p-10`}>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">Kontak</h2>
          <button
            onClick={copyEmail}
            className="group flex max-w-full items-center gap-3 text-left text-2xl font-bold tracking-tight sm:text-4xl"
          >
            <span className="truncate">{EMAIL}</span>
            {copied ? (
              <Check className="h-5 w-5 shrink-0" />
            ) : (
              <Copy className="h-5 w-5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
            )}
          </button>
        </section>
      </main>

      <footer className="mx-auto max-w-5xl px-5 pb-8 text-xs text-foreground/50">
        © {new Date().getFullYear()} Egi
      </footer>
    </div>
  );
}
