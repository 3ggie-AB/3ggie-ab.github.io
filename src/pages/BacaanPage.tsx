import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Plus, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';

interface BacaanItem {
  id: string;
  title: string;
  content: string;
}

const DEFAULT_BACAAN: BacaanItem[] = [
  {
    id: 'yasin-fadhilah',
    title: 'Yasin & Fadhilah Yasin',
    content: 'Bacaan Surat Yasin beserta fadhilah dan keutamaannya.',
  },
  {
    id: 'tahlil',
    title: 'Bacaan Tahlil',
    content: 'Rangkaian bacaan tahlil lengkap untuk mendoakan yang telah meninggal.',
  },
  {
    id: 'al-mulk',
    title: 'Surat Al-Mulk',
    content: 'Surat Al-Mulk (67) — dibaca sebelum tidur sebagai pelindung.',
  },
  {
    id: 'al-kahfi',
    title: 'Surat Al-Kahfi',
    content: 'Surat Al-Kahfi (18) — sunnah dibaca setiap Jumat.',
  },
];

const STORAGE_KEY = 'quran-custom-bacaan';

function getCustomBacaan(): BacaanItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCustomBacaan(items: BacaanItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const SURAH_MAP: Record<string, number> = {
  'yasin-fadhilah': 36,
  'al-mulk': 67,
  'al-kahfi': 18,
};

const BacaanPage = () => {
  const navigate = useNavigate();
  const [customBacaan, setCustomBacaan] = useState<BacaanItem[]>(getCustomBacaan());
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const allBacaan = [...DEFAULT_BACAAN, ...customBacaan];

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    const item: BacaanItem = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      content: newContent || newTitle,
    };
    const updated = [...customBacaan, item];
    setCustomBacaan(updated);
    saveCustomBacaan(updated);
    setNewTitle('');
    setNewContent('');
    setShowAdd(false);
  };

  const handleRemove = (id: string) => {
    const updated = customBacaan.filter((b) => b.id !== id);
    setCustomBacaan(updated);
    saveCustomBacaan(updated);
  };

  const handleClick = (item: BacaanItem) => {
    const surahNum = SURAH_MAP[item.id];
    if (surahNum) {
      navigate(`/surah/${surahNum}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Bacaan</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Add form */}
        {showAdd && (
          <div className="mb-4 space-y-2 rounded-lg border border-border bg-card p-3 animate-scale-in">
            <Input
              placeholder="Judul bacaan..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-background border-border"
            />
            <Input
              placeholder="Deskripsi (opsional)..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="bg-background border-border"
            />
            <Button size="sm" onClick={handleAdd} disabled={!newTitle.trim()}>
              Tambah Bacaan
            </Button>
          </div>
        )}

        <p className="mb-3 text-xs text-muted-foreground">{allBacaan.length} bacaan tersedia</p>

        <div className="space-y-2">
          {allBacaan.map((item, i) => {
            const isCustom = item.id.startsWith('custom-');
            const isClickable = !!SURAH_MAP[item.id];
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 animate-slide-up"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary">
                  <FileText className="h-4 w-4 text-secondary-foreground" />
                </div>
                <button
                  className="flex-1 min-w-0 text-left"
                  onClick={() => handleClick(item)}
                  disabled={!isClickable}
                >
                  <span className="font-medium text-foreground block truncate">{item.title}</span>
                  <span className="text-xs text-muted-foreground block truncate">{item.content}</span>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  {isCustom && (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemove(item.id)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {isClickable && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default BacaanPage;
