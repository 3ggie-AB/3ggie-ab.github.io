import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Puzzle, Download, Trash2, Plus, X, Upload, Check, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ThemeToggle from '@/components/ThemeToggle';
import BottomNav from '@/components/BottomNav';
import { toast } from 'sonner';
import {
  BUILTIN_PLUGINS,
  getInstalledIds,
  installPlugin,
  uninstallPlugin,
  getCustomPlugins,
  addCustomPlugin,
  removeCustomPlugin,
  type Plugin,
  type PluginContent,
} from '@/lib/plugins';

const PluginPage = () => {
  const navigate = useNavigate();
  const [installedIds, setInstalledIds] = useState<string[]>(getInstalledIds());
  const [customPlugins, setCustomPlugins] = useState<Plugin[]>(getCustomPlugins());
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newEmoji, setNewEmoji] = useState('📄');
  const [newContents, setNewContents] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setInstalledIds(getInstalledIds());
    setCustomPlugins(getCustomPlugins());
  };

  const handleInstall = (id: string) => {
    installPlugin(id);
    refresh();
    toast.success('Plugin terinstal!');
  };

  const handleUninstall = (id: string) => {
    uninstallPlugin(id);
    refresh();
    toast('Plugin dihapus');
  };

  const handleRemoveCustom = (id: string) => {
    removeCustomPlugin(id);
    refresh();
    toast('Plugin custom dihapus');
  };

  const handleAddManual = () => {
    if (!newName.trim()) return;
    const contents: PluginContent[] = newContents
      .split('\n')
      .filter((l) => l.trim())
      .map((line) => ({ title: line.trim(), translation: '' }));

    const plugin: Plugin = {
      id: `custom-${Date.now()}`,
      name: newName,
      description: newDesc || newName,
      icon: newEmoji,
      type: 'custom',
      installed: true,
      contents: contents.length > 0 ? contents : [{ title: newName }],
    };
    addCustomPlugin(plugin);
    refresh();
    setNewName('');
    setNewDesc('');
    setNewContents('');
    setShowAdd(false);
    toast.success('Plugin custom ditambahkan!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        // Support format: { name, description?, icon?, contents: [{ title, arabic?, latin?, translation? }] }
        if (!data.name || !data.contents || !Array.isArray(data.contents)) {
          toast.error('Format JSON tidak valid. Butuh: { name, contents: [...] }');
          return;
        }
        const plugin: Plugin = {
          id: `custom-${Date.now()}`,
          name: data.name,
          description: data.description || data.name,
          icon: data.icon || '📄',
          type: 'custom',
          installed: true,
          contents: data.contents,
        };
        addCustomPlugin(plugin);
        refresh();
        toast.success(`Plugin "${data.name}" berhasil diimport!`);
      } catch {
        toast.error('Gagal parse JSON. Periksa format file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleExportPlugin = (plugin: Plugin) => {
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
    toast.success(`Plugin "${plugin.name}" berhasil didownload!`);
  };

  const builtinWithStatus = BUILTIN_PLUGINS.map((p) => ({
    ...p,
    installed: installedIds.includes(p.id),
  }));

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Puzzle className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight text-foreground">Plugin</h1>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" />
            </Button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImportJSON} />
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setShowAdd(!showAdd)}>
              {showAdd ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        {/* Add custom form */}
        {showAdd && (
          <div className="mb-4 space-y-2 rounded-lg border border-border bg-card p-3 animate-scale-in">
            <div className="flex gap-2">
              <Input
                placeholder="Emoji ikon"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="w-16 bg-background border-border text-center"
                maxLength={2}
              />
              <Input
                placeholder="Nama plugin..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 bg-background border-border"
              />
            </div>
            <Input
              placeholder="Deskripsi (opsional)..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="bg-background border-border"
            />
            <Textarea
              placeholder="Isi konten (satu judul per baris)..."
              value={newContents}
              onChange={(e) => setNewContents(e.target.value)}
              className="bg-background border-border min-h-[80px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddManual} disabled={!newName.trim()}>
                Tambah Plugin
              </Button>
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="h-3.5 w-3.5 mr-1" /> Import JSON
              </Button>
            </div>
          </div>
        )}

        {/* Installed plugins */}
        {(builtinWithStatus.some((p) => p.installed) || customPlugins.length > 0) && (
          <div className="mb-6">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Terinstal</p>
            <div className="space-y-2">
              {builtinWithStatus.filter((p) => p.installed).map((plugin, i) => (
                <div
                  key={plugin.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 animate-slide-up"
                  style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="text-2xl">{plugin.icon}</span>
                  <button className="flex-1 min-w-0 text-left" onClick={() => navigate(`/plugin/${plugin.id}`)}>
                    <span className="font-medium text-foreground block truncate">{plugin.name}</span>
                    <span className="text-xs text-muted-foreground block truncate">{plugin.description}</span>
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleUninstall(plugin.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
              {customPlugins.map((plugin, i) => (
                <div
                  key={plugin.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 animate-slide-up"
                  style={{ animationDelay: `${(i + 5) * 30}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="text-2xl">{plugin.icon}</span>
                  <button className="flex-1 min-w-0 text-left" onClick={() => navigate(`/plugin/${plugin.id}`)}>
                    <span className="font-medium text-foreground block truncate">{plugin.name}</span>
                    <span className="text-xs text-muted-foreground block truncate">{plugin.description}</span>
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemoveCustom(plugin.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available plugins */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Plugin Bawaan</p>
          <div className="space-y-2">
            {builtinWithStatus.map((plugin, i) => (
              <div
                key={plugin.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 animate-slide-up"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
              >
                <span className="text-2xl">{plugin.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="font-medium text-foreground block truncate">{plugin.name}</span>
                  <span className="text-xs text-muted-foreground block truncate">{plugin.description}</span>
                </div>
                {plugin.installed ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Check className="h-3.5 w-3.5" /> Terinstal
                  </span>
                ) : (
                  <Button variant="secondary" size="sm" className="shrink-0" onClick={() => handleInstall(plugin.id)}>
                    <Download className="h-3.5 w-3.5 mr-1" /> Install
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PluginPage;
