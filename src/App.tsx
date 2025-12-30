import { useState, useCallback, useRef, useEffect } from 'react';
import type { MapLayout, Aisle, ViewState, EditorSettings } from './types';
import { DEFAULT_MAP_LAYOUT, REFERENCE_STORE_LAYOUT, PDF_ACCURATE_LAYOUT } from './constants/referenceLayout';
import { MapCanvas } from './components/MapCanvas';
import { AisleEditor } from './components/AisleEditor';
import { AisleList } from './components/AisleList';
import { Toolbar } from './components/Toolbar';
import { useHistory } from './hooks/useHistory';
import { useClipboard } from './hooks/useClipboard';
import './App.css';

const STORAGE_KEY = 'store_map_editor_layout';

function App() {
  // Initialize with saved layout if available, otherwise default
  const getInitialLayout = (): MapLayout => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return PDF_ACCURATE_LAYOUT;
  };

  const { layout, set: setLayout, undo, redo, canUndo, canRedo, reset: resetHistory } = useHistory(getInitialLayout());
  const { copy, paste, hasItem: hasClipboardItem } = useClipboard();

  const [selectedAisleIds, setSelectedAisleIds] = useState<string[]>([]);
  const [viewState, setViewState] = useState<ViewState>({
    offsetX: 100,
    offsetY: 50,
    scale: 0.5,
  });
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    gridEnabled: false,
    snapEnabled: false,
    gridSize: 20,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track if we are viewing the saved layout or a reference one
  const [currentLayoutName, setCurrentLayoutName] = useState<'promo' | 'full' | 'pdf' | 'saved'>('saved');

  // Sidebar collapse states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);

  // Search state (lifted for highlighting)
  const [searchTerm, setSearchTerm] = useState('');

  // Manual save handler
  const handleSave = useCallback(async () => {
    try {
      // 1. Save to Local Storage (Client-side backup)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));

      // 2. Save to File in Repo (Server-side persistence)
      const response = await fetch('/api/save-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(layout),
      });

      if (response.ok) {
        alert('Map saved successfully to Repository and Local Storage!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Save API Error:', errorData);
        alert(`Saved to Local Storage, but failed to update repository file: ${errorData.error || 'Unknown error'}`);
      }
    } catch (e) {
      console.error('Failed to save to storage', e);
      alert('Failed to save map completely. Check console.');
    }
  }, [layout]);

  const selectedAisles = layout.aisles.filter((a) => selectedAisleIds.includes(a.id));
  const primarySelectedAisle = selectedAisles[0] || null;

  // Handler for selection changes (from MapCanvas or List)
  const handleSelectionChange = useCallback((id: string | null, multi: boolean = false) => {
    if (id === null) {
      setSelectedAisleIds([]);
      return;
    }

    if (multi) {
      setSelectedAisleIds((prev) => {
        if (prev.includes(id)) {
          return prev.filter((i) => i !== id);
        } else {
          return [...prev, id];
        }
      });
    } else {
      setSelectedAisleIds([id]);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMeta = e.metaKey || e.ctrlKey;

      // Undo: Ctrl+Z
      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((isMeta && e.key === 'y') || (isMeta && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
        return;
      }

      // Copy: Ctrl+C
      if (isMeta && e.key === 'c' && selectedAisles.length > 0) {
        e.preventDefault();
        copy(selectedAisles[0]); // Copy primary for now
        return;
      }

      // Save: Ctrl+S
      if (isMeta && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
        return;
      }

      // Paste: Ctrl+V
      if (isMeta && e.key === 'v') {
        e.preventDefault();
        handlePaste();
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedAisleIds.length > 0) {
        e.preventDefault();
        handleDeleteAisles(selectedAisleIds);
        return;
      }

      // Toggle Grid: G
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setEditorSettings((prev) => ({ ...prev, gridEnabled: !prev.gridEnabled }));
        return;
      }

      // Toggle Snap: S
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setEditorSettings((prev) => ({ ...prev, snapEnabled: !prev.snapEnabled }));
        return;
      }

      // Rotate 90°: R
      if ((e.key === 'r' || e.key === 'R') && selectedAisleIds.length > 0) {
        e.preventDefault();
        selectedAisleIds.forEach(id => {
          const aisle = layout.aisles.find(a => a.id === id);
          if (aisle) {
            const currentRotation = aisle.rotation || 0;
            handleUpdateAisle(id, { rotation: (currentRotation + 90) % 360 });
          }
        });
        return;
      }

      // Escape: Deselect
      if (e.key === 'Escape') {
        setSelectedAisleIds([]);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAisles, selectedAisleIds, undo, redo, copy, handleSave, layout.aisles]);

  const handleLayoutSwitch = useCallback((layoutName: 'promo' | 'full' | 'pdf' | 'saved') => {
    setCurrentLayoutName(layoutName);
    if (layoutName === 'saved') {
      // Attempt to reload from storage
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          resetHistory(JSON.parse(saved));
        } else {
          alert('No saved layout found. Staying on current layout.');
        }
      } catch (e) {
        console.error(e);
      }
    } else if (layoutName === 'promo') {
      resetHistory(DEFAULT_MAP_LAYOUT);
    } else if (layoutName === 'full') {
      resetHistory(REFERENCE_STORE_LAYOUT);
    } else {
      resetHistory(PDF_ACCURATE_LAYOUT);
    }
    setSelectedAisleIds([]);
    setViewState({ offsetX: 100, offsetY: 50, scale: 0.5 });
  }, [resetHistory]);

  const handleUpdateAisle = useCallback((id: string, updates: Partial<Aisle>) => {
    setLayout((prev) => ({
      ...prev,
      aisles: prev.aisles.map((aisle) =>
        aisle.id === id ? { ...aisle, ...updates } : aisle
      ),
    }));
  }, [setLayout]);

  const handleDeleteAisles = useCallback((ids: string[]) => {
    setLayout((prev) => ({
      ...prev,
      aisles: prev.aisles.filter((aisle) => !ids.includes(aisle.id)),
    }));
    setSelectedAisleIds([]);
  }, [setLayout]);

  const handleAddAisle = useCallback(() => {
    const newId = `new-aisle-${Date.now()}`;
    const centerX = (-viewState.offsetX + 400) / viewState.scale;
    const centerY = (-viewState.offsetY + 300) / viewState.scale;

    const newAisle: Aisle = {
      id: newId,
      label: 'New Aisle',
      p1: [centerX, centerY],
      p2: [centerX, centerY + 100],
      aisleWidth: 40,
      locked: false,
    };

    setLayout((prev) => ({
      ...prev,
      aisles: [...prev.aisles, newAisle],
    }));
    setSelectedAisleIds([newId]);
  }, [viewState, setLayout]);

  const handleCopy = useCallback(() => {
    if (primarySelectedAisle) {
      copy(primarySelectedAisle);
    }
  }, [primarySelectedAisle, copy]);

  const handlePaste = useCallback(() => {
    const newAisle = paste();
    if (newAisle) {
      setLayout((prev) => ({
        ...prev,
        aisles: [...prev.aisles, newAisle],
      }));
      setSelectedAisleIds([newAisle.id]);
    }
  }, [paste, setLayout]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(layout, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `store-map-${layout.meta.storeId}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [layout]);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string) as MapLayout;
        if (imported.aisles && imported.meta) {
          resetHistory(imported);
          setSelectedAisleIds([]);
          setViewState({ offsetX: 100, offsetY: 50, scale: 0.5 });
        } else {
          alert('Invalid map file format');
        }
      } catch {
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [resetHistory]);

  const handleResetView = useCallback(() => {
    setViewState({ offsetX: 100, offsetY: 50, scale: 0.5 });
  }, []);

  const handleToggleGrid = useCallback(() => {
    setEditorSettings((prev) => ({ ...prev, gridEnabled: !prev.gridEnabled }));
  }, []);

  const handleToggleSnap = useCallback(() => {
    setEditorSettings((prev) => ({ ...prev, snapEnabled: !prev.snapEnabled }));
  }, []);

  const handleSetGridSize = useCallback((size: number) => {
    setEditorSettings((prev) => ({ ...prev, gridSize: size }));
  }, []);

  return (
    <div className="app">
      <Toolbar
        onAddAisle={handleAddAisle}
        onSave={handleSave}
        onExport={handleExport}
        onResetView={handleResetView}
        onImport={handleImport}
        viewState={viewState}
        currentLayout={currentLayoutName}
        onLayoutSwitch={handleLayoutSwitch}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onCopy={handleCopy}
        onPaste={handlePaste}
        canCopy={selectedAisles.length > 0}
        canPaste={hasClipboardItem}
        editorSettings={editorSettings}
        onToggleGrid={handleToggleGrid}
        onToggleSnap={handleToggleSnap}
        onSetGridSize={handleSetGridSize}
      />

      <div className="main-content">
        <aside className={`sidebar left-sidebar ${leftSidebarCollapsed ? 'collapsed' : ''}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            title={leftSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {leftSidebarCollapsed ? (
                <polyline points="9,18 15,12 9,6" />
              ) : (
                <polyline points="15,18 9,12 15,6" />
              )}
            </svg>
          </button>
          {!leftSidebarCollapsed && (
            <AisleList
              aisles={layout.aisles}
              selectedAisleIds={selectedAisleIds}
              onSelectAisle={handleSelectionChange}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          )}
        </aside>

        <main className="canvas-area">
          <MapCanvas
            aisles={layout.aisles}
            selectedAisleIds={selectedAisleIds}
            onSelectAisle={handleSelectionChange}
            onUpdateAisle={handleUpdateAisle}
            viewState={viewState}
            onViewChange={setViewState}
            editorSettings={editorSettings}
            searchTerm={searchTerm}
          />
        </main>

        <aside className={`sidebar right-sidebar ${rightSidebarCollapsed ? 'collapsed' : ''}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
            title={rightSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {rightSidebarCollapsed ? (
                <polyline points="15,18 9,12 15,6" />
              ) : (
                <polyline points="9,18 15,12 9,6" />
              )}
            </svg>
          </button>
          {!rightSidebarCollapsed && (
            <AisleEditor
              aisle={primarySelectedAisle}
              selectedCount={selectedAisles.length}
              onUpdateAisle={handleUpdateAisle}
              onDeleteAisle={(id) => handleDeleteAisles([id])}
            />
          )}
        </aside>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}

export default App;
