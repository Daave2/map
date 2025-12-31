import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { MapLayout, Aisle, ViewState, EditorSettings, RangeActivity } from './types';
import { DEFAULT_MAP_LAYOUT, REFERENCE_STORE_LAYOUT, PDF_ACCURATE_LAYOUT } from './constants/referenceLayout';
import { MapCanvas } from './components/MapCanvas';
import { AisleEditor } from './components/AisleEditor';
import { AisleList } from './components/AisleList';
import { Toolbar } from './components/Toolbar';
import { RangePanel } from './components/RangePanel';
import { RangeDetails } from './components/RangeDetails';
import { RangeMapper } from './components/RangeMapper';
import { useHistory } from './hooks/useHistory';
import { useClipboard } from './hooks/useClipboard';
import { matchesRangeCategory } from './utils/categoryMatching';
import './App.css';

const STORAGE_KEY = 'store_map_editor_layout';
const MAPPINGS_KEY = 'store_map_editor_mappings';

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

  // Load saved mappings
  const getInitialMappings = (): Record<string, string> => {
    try {
      const saved = localStorage.getItem(MAPPINGS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
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

  // Tab and Range state
  const [activeTab, setActiveTab] = useState<'range' | 'edit'>('range');
  const [rangeData, setRangeData] = useState<RangeActivity[]>([]);
  const [selectedRangeCategory, setSelectedRangeCategory] = useState<string | null>(null);
  const [categoryMappings, setCategoryMappings] = useState<Record<string, string>>(getInitialMappings());

  // Mapper Modal State
  const [showMapper, setShowMapper] = useState(false);
  const [unmatchedCategories, setUnmatchedCategories] = useState<string[]>([]);

  // Collect all available store categories for the mapper
  const getStoreCategories = useCallback(() => {
    const categories = new Set<string>();
    layout.aisles.forEach(a => {
      if (a.sections) {
        a.sections.forEach(s => categories.add(s.category));
      } else {
        // Add fixed labels if appropriate (usually aisle labels are generic, but sometimes useful)
        // categories.add(a.label); 
      }
    });
    return Array.from(categories);
  }, [layout]);

  // App Mode: 'view' (default - clean, no editing) or 'edit' (full editor)
  const [appMode, setAppMode] = useState<'view' | 'edit'>('view');

  // Theme: 'dark' (default) or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Print mode: B&W friendly rendering for Range view
  const [printMode, setPrintMode] = useState(false);

  // Get selected range activity for details panel
  // Get selected range activity for details panel
  const selectedRangeActivity = rangeData.find(r => r.category === selectedRangeCategory) || null;
  // Compute match reason if a section is selected

  // Wait, selectedAisleIds refers to AISLES. RangeDetails usually shows simply the selected RANGE item.
  // But if I clicked a SECTION, I want to know why THAT section matched.
  // MapCanvas handles visuals. App handles logic.
  // I need to know the SECTION associated with the selection.
  // Actually, MapCanvas onSelectAisle passes aisle ID.
  // If I click a section, MapCanvas passes `aisleId`. The `sectionIndex` is local to MapCanvas?
  // No, `onSelectAisle(id)` selects the whole aisle usually.
  // MapCanvas `onSelectAisle` prop: `(id: string | null, multi?: boolean) => void`.
  // It selects the AISLE.
  // Store Map Editor selects AISLES, not Sections.
  // BUT Range View highlights SECTIONS.
  // If I want to debug "Why did this section light up?", I need to know WHICH section I clicked.
  // Currently App.tsx doesn't know about individual section selection.
  // However, I can compute the reason for the *best match*?
  // `selectedRangeActivity` is the RANGE item.
  // If I have the Range Item "Brought in Bread".
  // And I want to know "Why did it match 'Ice Cream'?"
  // I need to scan all sections, find which one matched "Brought in Bread", and get the reason.

  const matchReason = useMemo(() => {
    if (!selectedRangeActivity) return undefined;
    const storeCats = getStoreCategories();
    for (const sectionCat of storeCats) {
      const result = matchesRangeCategory(sectionCat, selectedRangeActivity.category);
      if (result.matched) return `Matched Section "${sectionCat}": ${result.reason}`;
    }
    return undefined;
  }, [selectedRangeActivity, getStoreCategories]);

  // Save Mappings
  const handleSaveMappings = (newMappings: Record<string, string>) => {
    const updated = { ...categoryMappings, ...newMappings };
    setCategoryMappings(updated);
    localStorage.setItem(MAPPINGS_KEY, JSON.stringify(updated));
    // Re-trigger range match check? Or just let React reactivity handle it via props to MapCanvas
  };

  // Handle Range Import with Unmatched Check
  const handleRangeImport = (data: RangeActivity[]) => {
    // 1. Set data immediately
    setRangeData(data);

    // 2. Check for unmatched categories
    // Ideally we should reuse matchesRangeCategory logic from MapCanvas, but it's internal there.
    // We can duplicate the basic check or just check against strict store categories first. 
    // A truly "smart" check needs the same logic as MapCanvas.
    // For now, let's assume we pass the mappings to MapCanvas, which handles the complex logic.
    // But to FIND unmatched ones here, we need a helper.

    // Simplified check for now: just strict match against store categories + known mappings
    // Real check happens in MapCanvas visualization, but we need to prompt user HERE.
    // Strategy: Filter data items where we can't find a store section.

    const storeCats = getStoreCategories();
    // Use raw mapping keys for precise checking, plus normalized fallback if needed

    const unmatched = data.filter(item => {
      // 1. Check Custom Mappings (Exact or Normalized Key)
      if (categoryMappings[item.category]) return false;
      const itemNorm = item.category.toLowerCase().trim();
      if (Object.keys(categoryMappings).some(k => k.toLowerCase().trim() === itemNorm)) return false;

      // 2. Check Shared Logic (MapCanvas Logic)
      // Check if this item matches ANY store section category
      return !storeCats.some(sectionCat => matchesRangeCategory(sectionCat, item.category).matched);
    }).map(i => i.category);

    // Deduplicate
    const uniqueUnmatched = Array.from(new Set(unmatched));

    if (uniqueUnmatched.length > 0) {
      setUnmatchedCategories(uniqueUnmatched);
      setShowMapper(true);
    }
  };

  // Handle clearing all mappings
  const handleClearMappings = () => {
    if (confirm('Reset all custom mappings? This will also clear any "False Positive" associations you may have dragging items.')) {
      const emptyMappings = {};
      setCategoryMappings(emptyMappings);
      localStorage.removeItem(MAPPINGS_KEY);

      // Recalculate unmatched categories with empty mappings
      const storeCats = getStoreCategories();


      const unmatched = rangeData.filter(item => {
        // Shared Logic check only (since mappings cleared)
        return !storeCats.some(sectionCat => matchesRangeCategory(sectionCat, item.category).matched);
      }).map(i => i.category);

      const uniqueUnmatched = Array.from(new Set(unmatched));
      setUnmatchedCategories(uniqueUnmatched);
      if (uniqueUnmatched.length > 0) setShowMapper(true);
    }
  };

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

  // Handle single drag-and-drop mapping assignment
  const handleAssignMapping = (rangeCat: string, storeSectionCat: string) => {
    const newMapping = { [rangeCat]: storeSectionCat };
    handleSaveMappings(newMapping);

    // Remove from unmatched list
    setUnmatchedCategories(prev => prev.filter(c => c !== rangeCat));

    // If list empty, close mapper
    if (unmatchedCategories.length <= 1) { // 1 because state update is pending
      setShowMapper(false);
    }
  };

  const handleSetGridSize = useCallback((size: number) => {
    setEditorSettings((prev) => ({ ...prev, gridSize: size }));
  }, []);



  return (
    <div className={`app ${theme === 'light' ? 'light-theme' : ''}`}>
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
        appMode={appMode}
      />

      <div className="main-content">
        {/* Left sidebar - only in edit mode */}
        {appMode === 'edit' && (
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
        )}

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
            rangeData={rangeData}
            activeTab={activeTab}
            printMode={printMode}
            theme={theme}
            customMappings={categoryMappings}
            onAssignMapping={handleAssignMapping}
          />
        </main>

        {/* Unmatched Category Mapper Modal */}
        {showMapper && (
          <RangeMapper
            unmatchedCategories={unmatchedCategories}
            onAssignMapping={handleAssignMapping}
            onClearMappings={handleClearMappings}
            onClose={() => setShowMapper(false)}
          />
        )}

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
            <>
              {/* Mode toggle - subtle at top */}
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${appMode === 'view' ? 'active' : ''}`}
                  onClick={() => setAppMode('view')}
                >
                  View
                </button>
                <button
                  className={`mode-btn ${appMode === 'edit' ? 'active' : ''}`}
                  onClick={() => setAppMode('edit')}
                >
                  Edit
                </button>

                {/* Theme toggle */}
                <button
                  className="theme-toggle-btn"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5" />
                      <line x1="12" y1="1" x2="12" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="23" />
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                      <line x1="1" y1="12" x2="3" y2="12" />
                      <line x1="21" y1="12" x2="23" y2="12" />
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                    </svg>
                  )}
                </button>

                {/* Print toggle (only in view mode) */}
                {appMode === 'view' && (
                  <button
                    className={`theme-toggle-btn ${printMode ? 'active' : ''}`}
                    onClick={() => setPrintMode(!printMode)}
                    title={printMode ? 'Exit Print Mode' : 'Print-Friendly Mode'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                  </button>
                )}
              </div>

              {appMode === 'view' ? (
                /* View Mode: Clean Range panel only */
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
                  <RangePanel
                    rangeData={rangeData}
                    onImport={handleRangeImport}
                    onClear={() => { setRangeData([]); setSelectedRangeCategory(null); }}
                    selectedCategory={selectedRangeCategory}
                    onSelectCategory={setSelectedRangeCategory}
                    categoryMappings={categoryMappings}
                    onImportMappings={(imported) => {
                      const merged = { ...categoryMappings, ...imported };
                      setCategoryMappings(merged);
                      localStorage.setItem(MAPPINGS_KEY, JSON.stringify(merged));
                    }}
                  />
                  {selectedRangeActivity && (() => {
                    const mappingStr = categoryMappings[selectedRangeActivity.category] || '';
                    const isIgnored = mappingStr === 'IGNORE_ITEM';
                    const currentMappings = isIgnored ? [] : (mappingStr ? mappingStr.split('|') : []);

                    return (
                      <RangeDetails
                        activity={selectedRangeActivity}
                        onClose={() => setSelectedRangeCategory(null)}
                        reason={matchReason}
                        storeSections={getStoreCategories()}
                        currentMappings={currentMappings}
                        isIgnored={isIgnored}
                        onLinkSection={(section) => {
                          const existing = categoryMappings[selectedRangeActivity.category] || '';
                          const newVal = existing && existing !== 'IGNORE_ITEM'
                            ? `${existing}|${section}`
                            : section;
                          handleAssignMapping(selectedRangeActivity.category, newVal);
                        }}
                        onIgnore={() => handleAssignMapping(selectedRangeActivity.category, 'IGNORE_ITEM')}
                        onRemoveMapping={(section) => {
                          const existing = categoryMappings[selectedRangeActivity.category] || '';
                          const sections = existing.split('|').filter(s => s !== section);
                          if (sections.length === 0) {
                            const updated = { ...categoryMappings };
                            delete updated[selectedRangeActivity.category];
                            setCategoryMappings(updated);
                            localStorage.setItem(MAPPINGS_KEY, JSON.stringify(updated));
                          } else {
                            handleAssignMapping(selectedRangeActivity.category, sections.join('|'));
                          }
                        }}
                        onClearAllMappings={() => {
                          const updated = { ...categoryMappings };
                          delete updated[selectedRangeActivity.category];
                          setCategoryMappings(updated);
                          localStorage.setItem(MAPPINGS_KEY, JSON.stringify(updated));
                        }}
                      />
                    );
                  })()}
                </div>
              ) : (
                /* Edit Mode: Tabs for Range/Aisle editing */
                <>
                  <div className="sidebar-tabs">
                    <button
                      className={`sidebar-tab ${activeTab === 'range' ? 'active' : ''}`}
                      onClick={() => setActiveTab('range')}
                    >
                      Range
                    </button>
                    <button
                      className={`sidebar-tab ${activeTab === 'edit' ? 'active' : ''}`}
                      onClick={() => setActiveTab('edit')}
                    >
                      Aisle
                    </button>
                  </div>

                  {activeTab === 'range' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
                      <RangePanel
                        rangeData={rangeData}
                        onImport={setRangeData}
                        onClear={() => { setRangeData([]); setSelectedRangeCategory(null); }}
                        selectedCategory={selectedRangeCategory}
                        onSelectCategory={setSelectedRangeCategory}
                        categoryMappings={categoryMappings}
                        onImportMappings={(imported) => {
                          const merged = { ...categoryMappings, ...imported };
                          setCategoryMappings(merged);
                          localStorage.setItem(MAPPINGS_KEY, JSON.stringify(merged));
                        }}
                      />
                      {selectedRangeActivity && (() => {
                        const mappingStr = categoryMappings[selectedRangeActivity.category] || '';
                        const isIgnored = mappingStr === 'IGNORE_ITEM';
                        const currentMappings = isIgnored ? [] : (mappingStr ? mappingStr.split('|') : []);

                        return (
                          <RangeDetails
                            activity={selectedRangeActivity}
                            onClose={() => setSelectedRangeCategory(null)}
                            reason={matchReason}
                            storeSections={getStoreCategories()}
                            currentMappings={currentMappings}
                            isIgnored={isIgnored}
                            onLinkSection={(section) => {
                              const existing = categoryMappings[selectedRangeActivity.category] || '';
                              const newVal = existing && existing !== 'IGNORE_ITEM'
                                ? `${existing}|${section}`
                                : section;
                              handleAssignMapping(selectedRangeActivity.category, newVal);
                            }}
                            onIgnore={() => handleAssignMapping(selectedRangeActivity.category, 'IGNORE_ITEM')}
                            onRemoveMapping={(section) => {
                              const existing = categoryMappings[selectedRangeActivity.category] || '';
                              const sections = existing.split('|').filter(s => s !== section);
                              if (sections.length === 0) {
                                const updated = { ...categoryMappings };
                                delete updated[selectedRangeActivity.category];
                                setCategoryMappings(updated);
                                localStorage.setItem(MAPPINGS_KEY, JSON.stringify(updated));
                              } else {
                                handleAssignMapping(selectedRangeActivity.category, sections.join('|'));
                              }
                            }}
                            onClearAllMappings={() => {
                              const updated = { ...categoryMappings };
                              delete updated[selectedRangeActivity.category];
                              setCategoryMappings(updated);
                              localStorage.setItem(MAPPINGS_KEY, JSON.stringify(updated));
                            }}
                          />
                        );
                      })()}
                    </div>
                  ) : (
                    <AisleEditor
                      aisle={primarySelectedAisle}
                      selectedCount={selectedAisles.length}
                      onUpdateAisle={handleUpdateAisle}
                      onDeleteAisle={(id) => handleDeleteAisles([id])}
                    />
                  )}
                </>
              )}
            </>
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
