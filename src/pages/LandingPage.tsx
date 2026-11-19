import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  BookOpen,
  MessageSquare,
  Sparkles,
  Code2,
  Server,
  Database,
  Brain,
  Award,
  FileText,
  ArrowUpRight,
  Terminal,
  Layers,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Download,
  Crop,
  Radio,
  Workflow,
  Cpu,
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function LandingPage() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'ai'>('all');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('3ggie.ab@gmail.com');
    setCopiedEmail(true);
    toast.success('Email berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const skillsData = [
    { name: 'TypeScript / JavaScript', category: 'frontend', level: 'Advanced', icon: Code2 },
    { name: 'React.js & Vite', category: 'frontend', level: 'Advanced', icon: Layers },
    { name: 'Tailwind CSS & Shadcn', category: 'frontend', level: 'Advanced', icon: Sparkles },
    { name: 'Go (Golang)', category: 'backend', level: 'Intermediate', icon: Server },
    { name: 'PHP & Laravel / AdonisJS', category: 'backend', level: 'Advanced', icon: Server },
    { name: 'Python (Flask / FastAPI)', category: 'backend', level: 'Intermediate', icon: Terminal },
    { name: 'Chrome Extensions (Manifest V3)', category: 'frontend', level: 'Advanced', icon: Smartphone },
    { name: 'PostgreSQL / MySQL', category: 'backend', level: 'Advanced', icon: Database },
    { name: 'IndexedDB & Offline Storage', category: 'frontend', level: 'Advanced', icon: Database },
    { name: 'TensorFlow & PyTorch', category: 'ai', level: 'Intermediate', icon: Brain },
    { name: 'Machine Learning & NLP', category: 'ai', level: 'Intermediate', icon: Brain },
    { name: 'Docker & Linux Server', category: 'backend', level: 'Intermediate', icon: Cpu },
  ];

  const filteredSkills =
    activeTab === 'all' ? skillsData : skillsData.filter((s) => s.category === activeTab);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-primary/20 selection:text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-primary/60 text-primary-foreground font-bold shadow-md shadow-primary/20 transition-transform group-hover:scale-105">
              <span>EB</span>
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground group-hover:text-primary transition-colors text-sm sm:text-base">
                Egi Ahmad Baihaqi
              </span>
              <span className="text-[11px] text-muted-foreground">Software Engineer</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">
              Tentang
            </a>
            <a href="#projects" className="hover:text-foreground transition-colors font-semibold text-primary">
              Proyek Unggulan
            </a>
            <a href="#skills" className="hover:text-foreground transition-colors">
              Tech Stack
            </a>
            <a href="#research" className="hover:text-foreground transition-colors">
              Riset & Publikasi
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">
              Kontak
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <a
              href="https://github.com/3ggie-AB"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="hidden sm:inline-flex"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Button>
            </a>
            <a
              href="https://www.linkedin.com/in/3ggieab/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
            >
              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-sm">
                <Linkedin className="h-4 w-4" />
                <span className="hidden sm:inline">LinkedIn</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle decorative background gradient */}
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20">
          <div className="h-[450px] w-[450px] rounded-full bg-gradient-to-tr from-primary via-blue-500 to-indigo-500 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Text & CTA */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <Badge variant="secondary" className="px-3 py-1 text-xs gap-1.5 border border-primary/20 bg-primary/10 text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Tersedia untuk Kolaborasi & Proyek
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-xs gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3 text-red-500" /> Cirebon, Indonesia
                </Badge>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                  Halo, Saya{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
                    Egi Ahmad Baihaqi
                  </span>
                </h1>
                <p className="text-xl sm:text-2xl font-medium text-foreground/90">
                  Fullstack Developer & AI/ML Specialist
                </p>
                <div className="inline-block rounded-lg bg-muted/60 px-3.5 py-1.5 font-mono text-xs text-muted-foreground border border-border">
                  &ldquo;Be came the next man of revolutioner&rdquo;
                </div>
              </div>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Mahasiswa Sarjana Terapan di <strong className="text-foreground">Politeknik Siber Cerdika Internasional (Poltek SCI)</strong>. 
                Berpengalaman dalam merancang aplikasi web modern, sistem backend terdistribusi, ekstensi browser produktivitas, 
                serta automasi kecerdasan buatan (AI & Data Science).
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a href="#projects">
                  <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                    <Sparkles className="h-4 w-4" />
                    Jelajahi Proyek Utama
                  </Button>
                </a>
                <a href="#contact">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Hubungi Saya
                  </Button>
                </a>
                <Link to="/quran">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-500" />
                    Buka Al-Quran App
                  </Button>
                </Link>
              </div>

              {/* Quick Profile Social Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/60 max-w-md mx-auto lg:mx-0 text-center">
                <div className="p-2">
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">65+</p>
                  <p className="text-xs text-muted-foreground font-medium">Public Repos</p>
                </div>
                <div className="p-2 border-x border-border/60">
                  <p className="text-2xl sm:text-3xl font-extrabold text-primary">2</p>
                  <p className="text-xs text-muted-foreground font-medium">Proyek Utama</p>
                </div>
                <div className="p-2">
                  <p className="text-2xl sm:text-3xl font-extrabold text-foreground">3+</p>
                  <p className="text-xs text-muted-foreground font-medium">Jurnal Ilmiah</p>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Profile Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-30 blur-xl transition duration-500 group-hover:opacity-100" />
                
                <div className="relative rounded-2xl border border-border bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <img
                        src="https://avatars.githubusercontent.com/u/151058698?v=4"
                        alt="Egi Ahmad Baihaqi"
                        className="h-28 w-28 sm:h-32 sm:w-32 rounded-full border-4 border-background object-cover shadow-xl"
                      />
                      <span className="absolute bottom-1 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold border-2 border-background" title="Verified Developer">
                        ✓
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-foreground">Egi Ahmad Baihaqi</h2>
                    <p className="text-sm text-primary font-medium">@3ggie-AB</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5" /> Politeknik Siber Cerdika Internasional
                    </p>

                    <div className="w-full my-5 border-t border-border/80" />

                    <div className="w-full space-y-2.5 text-left text-xs">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Sertifikasi
                        </span>
                        <span className="font-semibold text-foreground">Junior Network Admin</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-blue-500" /> Spesialisasi
                        </span>
                        <span className="font-semibold text-foreground">Web & AI Engineer</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/40 border border-border/50">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-rose-500" /> Domisili
                        </span>
                        <span className="font-semibold text-foreground">Cirebon, Jawa Barat</span>
                      </div>
                    </div>

                    <div className="w-full grid grid-cols-2 gap-2 mt-5">
                      <a
                        href="https://github.com/3ggie-AB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition-colors"
                      >
                        <Github className="h-3.5 w-3.5" /> Profil GitHub
                      </a>
                      <a
                        href="https://www.linkedin.com/in/3ggieab/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 text-xs font-semibold transition-colors"
                      >
                        <Linkedin className="h-3.5 w-3.5" /> Hubungkan
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 border-t border-border/60 bg-muted/20 relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Proyek Portofolio Terpilih
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              2 Karya Unggulan yang Dibangun
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              Fokus pada solusi perangkat lunak yang berorientasi pengguna, performa tinggi, dan arsitektur kode modern.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* PROJECT 1: Al Quran Digital */}
            <div className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Web & PWA Application
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">Al Quran Digital</h3>
                  </div>
                </div>
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                  Live & Production
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Aplikasi Al-Quran digital modern dan interaktif yang memudahkan umat Muslim membaca, mentadaburi, 
                dan mendengarkan lantunan ayat suci kapan saja dengan dukungan mode <strong>Offline Pertama (PWA)</strong>.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 mb-6 text-xs text-foreground/90">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>114 Surah Lengkap & 30 Juz:</strong> Teks Arab resmi font Amiri, transliterasi latin, dan terjemahan Kemenag RI.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Audio Player Interaktif:</strong> Pemutar Murottal ayat per ayat dan per surah dengan sinkronisasi sorotan ayat real-time.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Jadwal Sholat & Kalender Hijriah:</strong> Perhitungan waktu sholat presisi otomatis berbasis geolokasi perangkat pengguna.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Offline Cache & Download Manager:</strong> Penyimpanan lokal IndexedDB (Dexie) untuk akses tanpa kuota internet.</span>
                </div>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {['React 18', 'TypeScript', 'Tailwind CSS', 'Dexie (IndexedDB)', 'PWA', 'TanStack Query', 'Radix UI'].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/80">
                <Link to="/quran" className="w-full">
                  <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20">
                    <BookOpen className="h-4 w-4" /> Buka Aplikasi Langsung
                  </Button>
                </Link>
                <a
                  href="https://github.com/3ggie-AB/3ggie-ab.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Github className="h-4 w-4" /> Repositori GitHub
                  </Button>
                </a>
              </div>
            </div>

            {/* PROJECT 2: WhatsappReextended Extension */}
            <div className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-blue-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Browser Extension (Manifest V3)
                    </span>
                    <h3 className="text-2xl font-bold text-foreground">WhatsappReextended</h3>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
                  v1.3.2 Studio
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Ekstensi browser Chrome & Chromium canggih untuk WhatsApp Web yang berfungsi sebagai <strong>Sticker Manager, Studio Crop Interaktif</strong>, dan pengirim stiker asli instan dalam 1 klik.
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 mb-6 text-xs text-foreground/90">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Kirim Stiker Asli (1-Click):</strong> Stiker dikirim sebagai format stiker murni (bukan kompresi foto) langsung ke obrolan.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Workspace Crop 8-Titik Handle:</strong> Tool crop visual dengan rotasi 90°, konversi otomatis ke standar 512×512 WebP transparan.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Reply Pesan dengan Stiker:</strong> Integrasi kutipan pesan (quote reply) otomatis saat membalas chat menggunakan stiker.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span><strong>Dual Panel & Smart Context Menu:</strong> Mode popup floating atau sidebar kanan dengan integrasi tombol rapi di samping emoji bar.</span>
                </div>
              </div>

              {/* Tech Badges */}
              <div className="flex flex-wrap gap-1.5 mb-8">
                {['Chrome Manifest V3', 'JavaScript ES6+', 'HTML5 Canvas', 'WebP Engine', 'WPPConnect API', 'Custom CSS'].map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/80">
                <a
                  href="/whatsapp-reextended/"
                  className="w-full"
                >
                  <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20">
                    <MessageSquare className="h-4 w-4" /> Buka Aplikasi Langsung
                  </Button>
                </a>
                <a
                  href="https://github.com/3ggie-AB/WAReextendeeed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Github className="h-4 w-4" /> Repositori GitHub
                  </Button>
                </a>
              </div>

              {/* Extra Download & Install Links */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 px-1">
                <a
                  href="/whatsapp-reextended/whatsapp-reextended.zip"
                  download
                  className="hover:text-blue-500 flex items-center gap-1 font-medium transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> Unduh ZIP Ekstensi
                </a>
                <a
                  href="/whatsapp-reextended/#cara-install"
                  className="hover:text-blue-500 flex items-center gap-1 transition-colors"
                >
                  Panduan Instalasi <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Educational Journey */}
      <section id="about" className="py-20 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                Profil & Perjalanan
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Membangun Solusi Digital dengan Kualitas Kode Tinggi
              </h2>
              <div className="space-y-4 text-muted-foreground text-sm sm:text-base leading-relaxed">
                <p>
                  Saya adalah seorang programmer yang berbasis di Cirebon, Jawa Barat. Saat ini sedang menempuh studi sarjana terapan di{' '}
                  <strong className="text-foreground">Politeknik Siber Cerdika Internasional (Poltek SCI)</strong>.
                </p>
                <p>
                  Memiliki antusiasme mendalam pada integrasi <strong className="text-foreground">Artificial Intelligence (AI)</strong>, arsitektur Web modern, ekstensi peramban, dan sistem analitik. Terbiasa memecahkan masalah kompleks dari hulu ke hilir—mulai dari perancangan antarmuka pengguna (UI/UX) responsif hingga logika backend yang kokoh dan teroptimasi.
                </p>
                <p>
                  Selain pemrograman aplikasi praktis, saya juga aktif berkontribusi dalam riset akademis dan proyek pengabdian masyarakat kampus, salah satunya perancangan platform informasi dan sistem akuntansi koperasi.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <GraduationCap className="h-4 w-4 text-primary" /> Pendidikan
                  </div>
                  <p className="text-xs text-muted-foreground">Sarjana Terapan di Poltek SCI (Politeknik Siber Cerdika Internasional)</p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
                  <div className="flex items-center gap-2 text-foreground font-semibold text-sm">
                    <Award className="h-4 w-4 text-emerald-500" /> Sertifikasi Resmi
                  </div>
                  <p className="text-xs text-muted-foreground">Junior Network Administrator - BPSDMP Komdigi (Kominfo) RI</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" /> Filosofi & Minat Utama
                  </h3>
                  <span className="text-xs font-mono text-muted-foreground">interests.json</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="font-semibold text-foreground block mb-1">Web Development</span>
                    <span className="text-muted-foreground">Modern Frontend, Reactive State & PWA</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="font-semibold text-foreground block mb-1">Artificial Intelligence</span>
                    <span className="text-muted-foreground">Agentic Workflows, Machine Learning & NLP</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="font-semibold text-foreground block mb-1">Browser Extensions</span>
                    <span className="text-muted-foreground">Manifest V3, DOM Automation & Canvas</span>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <span className="font-semibold text-foreground block mb-1">Quantitative Systems</span>
                    <span className="text-muted-foreground">Trading Analytics, APIs & Data Pipelines</span>
                  </div>
                </div>
              </div>

              {/* GitHub Activity Snapshot Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4 text-foreground" />
                    <h3 className="font-bold text-foreground text-sm">GitHub Snapshot</h3>
                  </div>
                  <a
                    href="https://github.com/3ggie-AB"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    @3ggie-AB <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  Lebih dari 65 repositori publik aktif mencakup proyek Golang backend, Laravel API, React PWA, AI checkers, dan automasi.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary" className="text-[11px]">Go</Badge>
                  <Badge variant="secondary" className="text-[11px]">TypeScript</Badge>
                  <Badge variant="secondary" className="text-[11px]">PHP</Badge>
                  <Badge variant="secondary" className="text-[11px]">Python</Badge>
                  <Badge variant="secondary" className="text-[11px]">C++</Badge>
                  <Badge variant="secondary" className="text-[11px]">Docker</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="skills" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              Keahlian Teknis
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Teknologi & Toolstack
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Perangkat dan bahasa pemrograman yang digunakan untuk merancang aplikasi berkualitas.
            </p>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
              {(['all', 'frontend', 'backend', 'ai'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {tab === 'all' ? 'Semua Teknologi' : tab === 'ai' ? 'AI & Machine Learning' : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card/80 hover:bg-card hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <skill.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">{skill.name}</h3>
                  <span className="text-[11px] text-muted-foreground">{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Publications & Academic Research Section */}
      <section id="research" className="py-20 border-t border-border/60">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              Riset & Karya Tulis Ilmiah
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Publikasi Akademik
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Karya penelitian di bidang sistem informasi, telekomunikasi jaringan, dan rekayasa perangkat lunak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <Badge variant="secondary" className="text-[10px]">2026 • Research Paper</Badge>
                <h3 className="font-bold text-foreground text-base leading-snug">
                  Implementasi Website Traffic Analytics sebagai Media Pemantauan Aktivitas Jaringan
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Penelitian mengenai pemantauan aktivitas komunikasi jaringan internal perusahaan melalui analitik lalu lintas web secara real-time.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-primary font-medium">
                <span>ResearchGate Indexed</span>
                <FileText className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <Badge variant="secondary" className="text-[10px]">2025 • Research Paper</Badge>
                <h3 className="font-bold text-foreground text-base leading-snug">
                  Perancangan Prototipe Sistem Informasi Akuntansi Berbasis Web (SAK EP)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Rancang bangun sistem akuntansi digital untuk Koperasi Syariah Nurul Amal Bandung guna memenuhi standar SAK EP.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-primary font-medium">
                <span>Journal Publication</span>
                <FileText className="h-4 w-4" />
              </div>
            </div>

            <div className="flex flex-col justify-between p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <Badge variant="secondary" className="text-[10px]">2025 • PKM Research</Badge>
                <h3 className="font-bold text-foreground text-base leading-snug">
                  Design & Implementation of Mount Ciremai Basecamp Website (Linggasana)
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Pengembangan portal informasi digital pendakian Gunung Ciremai melalui jalur Desa Linggasana sebagai wujud Pengabdian Kepada Masyarakat.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/60 flex items-center justify-between text-xs text-primary font-medium">
                <span>Al-Makki Publisher</span>
                <FileText className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-3">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
              Hubungi & Terhubung
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Tertarik Berkolaborasi atau Mengembangkan Proyek?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Silakan hubungi saya melalui saluran komunikasi di bawah ini. Saya terbuka untuk diskusi peluang kerja, proyek freelance, dan pengembangan sistem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {/* Email Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-card shadow-sm">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                  <Mail className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">Email Pribadi</h3>
                <p className="text-xs text-muted-foreground font-mono">3ggie.ab@gmail.com</p>
              </div>
              <div className="pt-4 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyEmail}
                  className="w-full text-xs gap-1.5"
                >
                  {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedEmail ? 'Disalin' : 'Salin Email'}
                </Button>
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-card shadow-sm">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Linkedin className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">LinkedIn Network</h3>
                <p className="text-xs text-muted-foreground">linkedin.com/in/3ggieab</p>
              </div>
              <div className="pt-4 mt-2">
                <a
                  href="https://www.linkedin.com/in/3ggieab/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button size="sm" className="w-full text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Buka Profil
                  </Button>
                </a>
              </div>
            </div>

            {/* GitHub Card */}
            <div className="flex flex-col justify-between p-5 rounded-2xl border border-border bg-card shadow-sm">
              <div className="space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 text-foreground">
                  <Github className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground">GitHub Workspace</h3>
                <p className="text-xs text-muted-foreground">github.com/3ggie-AB</p>
              </div>
              <div className="pt-4 mt-2">
                <a
                  href="https://github.com/3ggie-AB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Kunjungi GitHub
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Egi Ahmad Baihaqi. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/quran" className="hover:text-foreground transition-colors">
              Al-Quran App
            </Link>
            <a
              href="/whatsapp-reextended/"
              className="hover:text-foreground transition-colors"
            >
              WhatsappReextended
            </a>
            <a
              href="https://github.com/3ggie-AB"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/3ggieab/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
