import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import FontSizeControl from '@/components/FontSizeControl';
import ReadingSettingsControl from '@/components/ReadingSettingsControl';
import { useFontScale } from '@/lib/fontSize';
import { useReadingPreferences, THEME_CLASSES } from '@/lib/readingPreferences';
import { BUILTIN_PLUGINS, getCustomPlugins } from '@/lib/plugins';

const SURAH_LINK: Record<string, number> = {
  'yasin-fadhilah': 36,
};

const PluginDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scale, setScale, size } = useFontScale();
  const { preferences, showLatin, showTranslation, theme, updatePreferences } = useReadingPreferences();
  const themeStyle = THEME_CLASSES[theme];

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

  const handleExport = () => {
    const exportData = {
      name: plugin.name,
      description: plugin.description,
      icon: plugin.icon,
      contents: plugin.contents,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plugin.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Plugin berhasil didownload!');
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${themeStyle.container}`}>
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
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleExport} title="Download JSON">
              <FileDown className="h-4 w-4" />
            </Button>
            <ReadingSettingsControl preferences={preferences} onUpdate={updatePreferences} />
            <FontSizeControl scale={scale} onChange={setScale} />
            <ThemeToggle />
          </div>
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
            className={`rounded-lg border p-4 animate-slide-up transition-colors duration-200 ${
              item.highlight ? 'border-primary/40 bg-primary/5' : themeStyle.card
            }`}
            style={{ animationDelay: `${Math.min(i * 30, 300)}ms`, animationFillMode: 'backwards' }}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              {item.ayat ? (
                <span className={`flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-xs font-semibold ${themeStyle.badge}`}>
                  {item.ayat}
                </span>
              ) : (
                <p className={`text-sm font-semibold ${item.highlight ? 'text-primary' : themeStyle.textTranslation}`}>
                  {item.highlight && '🤲 '}{item.title}
                </p>
              )}
              {item.note && (
                <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {item.note}
                </span>
              )}
            </div>
            {item.arabic && (
              <p className={`arabic-text whitespace-pre-line text-right leading-loose mb-2 ${themeStyle.textArabic}`} style={size(1.25)}>
                {item.arabic}
              </p>
            )}
            {showLatin && item.latin && (
              <p className={`italic mb-1 ${themeStyle.textLatin}`} style={size(0.875)}>
                {item.latin}
              </p>
            )}
            {showTranslation && item.translation && (
              <p className={themeStyle.textTranslation} style={size(0.875)}>
                {item.translation}
              </p>
            )}
          </div>
        ))}
      </main>

      <BottomNav />
    </div>
  );
};

export default PluginDetailPage;
