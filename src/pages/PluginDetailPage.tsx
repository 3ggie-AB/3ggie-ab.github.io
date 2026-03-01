import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { BUILTIN_PLUGINS, getCustomPlugins, type Plugin } from '@/lib/plugins';

const SURAH_LINK: Record<string, number> = {
  'yasin-fadhilah': 36,
};

const PluginDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const allPlugins = [...BUILTIN_PLUGINS, ...getCustomPlugins()];
  const plugin = allPlugins.find((p) => p.id === id);

  if (!plugin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <p className="text-muted-foreground">Plugin tidak ditemukan.</p>
        <BottomNav />
      </div>
    );
  }

  const surahLink = SURAH_LINK[plugin.id];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => navigate('/plugin')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-base font-bold text-foreground leading-tight flex items-center gap-2">
                <span>{plugin.icon}</span> {plugin.name}
              </h1>
              <p className="text-xs text-muted-foreground">{plugin.contents.length} item</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 space-y-3">
        {surahLink && (
          <button
            onClick={() => navigate(`/surah/${surahLink}`)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-3 transition-all hover:bg-accent"
          >
            <span className="text-sm font-medium text-primary">Buka Surat di Al-Quran →</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        {plugin.contents.map((item, i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-card p-4 animate-slide-up"
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'backwards' }}
          >
            <p className="text-sm font-semibold text-foreground mb-2">{item.title}</p>
            {item.arabic && (
              <p className="arabic-text text-right text-xl leading-loose text-foreground mb-2">{item.arabic}</p>
            )}
            {item.latin && (
              <p className="text-sm italic text-muted-foreground mb-1">{item.latin}</p>
            )}
            {item.translation && (
              <p className="text-sm text-foreground/80">{item.translation}</p>
            )}
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default PluginDetailPage;
