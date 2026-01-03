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
import { StoreScene3D } from './components/StoreScene3D';
import { useHistory } from './hooks/useHistory';
import { useClipboard } from './hooks/useClipboard';
import { matchesRangeCategory } from './utils/categoryMatching';
import { DEFAULT_CATEGORY_MAPPINGS } from './constants/defaultCategoryMappings';
import { PROMO_END_GROUPS } from './constants/promoEndGroups';
import './App.css';

const STORAGE_KEY = 'store_map_editor_layout';
const MAPPINGS_KEY = 'store_map_editor_mappings';

function App() {
  // Initialize with saved layout if available, otherwise default
  const getInitialLayout = (): MapLayout => {
    try {
      // const saved = localStorage.getItem(STORAGE_KEY);
      // if (saved) {
      //   return JSON.parse(saved);
      // }
    } catch (e) {
      console.error('Failed to load from storage', e);
    }
    return PDF_ACCURATE_LAYOUT;
  };

  // Load saved mappings - merge with defaults so bundled mappings always work
  const getInitialMappings = (): Record<string, string> => {
    try {
      const saved = localStorage.getItem(MAPPINGS_KEY);
      const userMappings = saved ? JSON.parse(saved) : {};
      // Merge: defaults first, user overrides take priority
      return { ...DEFAULT_CATEGORY_MAPPINGS, ...userMappings };
    } catch {
      return { ...DEFAULT_CATEGORY_MAPPINGS };
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
  const [activeTab, setActiveTab] = useState<'range' | 'edit' | 'promo'>('range');
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
      }
      // Also check promo ends
      if (a.promoEnds) {
        Object.values(a.promoEnds).forEach(pe => {
          if (pe && pe.label) categories.add(pe.label); // Promo ends use 'label' as their category equivalent
        });
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

  // 3D View mode
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  // Get selected range activity for details panel
  const selectedRangeActivity = rangeData.find(r => r.category === selectedRangeCategory) || null;
  // Compute match reason if a section is selected

  // Wait, selectedAisleIds refers to AISLES. RangeDetails usually shows simply the selected RANGE item.
  // But if I clicked a SECTION, I want to know why THAT section matched.
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

  // Autosave layout to local storage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  // }, [layout]);

  // Autosave validation: detecting large changes or issues could go here

  // Silent save handler for autosave (file only)
  const silentSave = useCallback(async (currentLayout: MapLayout) => {
    try {
      // Save to File in Repo (Server-side persistence - works in dev mode)
      await fetch('/api/save-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentLayout),
      });
    } catch (e) {
      console.error('Failed to autosave to file', e);
    }
  }, []);

  // Debounced autosave to file
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     silentSave(layout);
  //   }, 2000); // Save after 2 seconds of inactivity

  //   return () => clearTimeout(handler);
  // }, [layout, silentSave]);

  // Manual save handler
  const handleSave = useCallback(async () => {
    try {
      // 1. Save to Local Storage (Client-side backup)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));

      // 2. Save to File in Repo (Server-side persistence - works in dev mode)
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
      alert('Saved to Local Storage only. (API save only works in dev mode)');
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
    // If the ID is being changed, update the selection to use the new ID
    if (updates.id && updates.id !== id) {
      setSelectedAisleIds((prev) =>
        prev.map((selectedId) => (selectedId === id ? updates.id! : selectedId))
      );
    }

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
          {viewMode === '3d' ? (
            <StoreScene3D
              aisles={layout.aisles}
              rangeData={rangeData}
              categoryMappings={categoryMappings}
              activeTab={activeTab}
              onExit={() => setViewMode('2d')}
            />
          ) : (
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
          )}
        </main>

        {/* Mobile Menu Buttons - Always visible on mobile when in 2D view */}
        {viewMode === '2d' && (
          <>
            {/* Left menu button */}
            {appMode === 'edit' && leftSidebarCollapsed && (
              <button
                className="mobile-menu-btn mobile-menu-left"
                onClick={() => setLeftSidebarCollapsed(false)}
                aria-label="Open Aisle List"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            )}

            {/* Right menu button */}
            {rightSidebarCollapsed && (
              <button
                className="mobile-menu-btn mobile-menu-right"
                onClick={() => setRightSidebarCollapsed(false)}
                aria-label="Open Settings"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              </button>
            )}
          </>
        )}

        {/* Print Summary Tables - Page 2 (hidden in normal view, shown when printing) */}
        {printMode && activeTab === 'range' && rangeData.length > 0 && (() => {
          // Calculate unmapped categories
          const allCategories = [...new Set(rangeData.map(r => r.category))];
          const unmappedCategories = allCategories.filter(category => {
            const mapping = categoryMappings[category];
            if (mapping && mapping !== 'IGNORE_ITEM') return false;
            if (mapping === 'IGNORE_ITEM') return false;

            // Check matches in AISLE SECTIONS
            const hasSectionMatch = layout.aisles.some(aisle =>
              aisle.sections?.some(section => {
                const match = matchesRangeCategory(section.category, category);
                return match.matched;
              })
            );
            if (hasSectionMatch) return false;

            // Check matches in PROMO ENDS
            const hasPromoMatch = layout.aisles.some(aisle =>
              aisle.promoEnds && Object.values(aisle.promoEnds).some(pe => {
                const match = matchesRangeCategory(pe?.label || '', category);
                return match.matched;
              })
            );
            return !hasPromoMatch;
          });
          const mappedActivities = rangeData.filter(r => !unmappedCategories.includes(r.category));

          return (
            <div className="print-summary-tables">
              <h2>Areas Changing ({mappedActivities.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: '80px' }}>Date</th>
                    <th style={{ width: '180px' }}>Category</th>
                    <th className="center" style={{ width: '50px' }}>Hrs</th>
                    <th className="center" style={{ width: '40px' }}>New</th>
                    <th className="center" style={{ width: '40px' }}>Del</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {mappedActivities.map((activity, i) => (
                    <tr key={i}>
                      <td>{activity.date}</td>
                      <td>{activity.category}</td>
                      <td className="center">{activity.capacityHours}</td>
                      <td className="center">{activity.newLines}</td>
                      <td className="center">{activity.delistLines}</td>
                      <td>{(activity.reason || '').substring(0, 80)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {unmappedCategories.length > 0 && (
                <>
                  <h2>Unmapped Categories ({unmappedCategories.length})</h2>
                  <ul className="unmapped-list">
                    {unmappedCategories.sort().map((cat, i) => (
                      <li key={i}>{cat}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          );
        })()}
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
                <button
                  className={`mode-btn ${viewMode === '3d' ? 'active' : ''}`}
                  onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
                  title="Toggle 3D Walkthrough (WASD to move, mouse to look)"
                >
                  🎮 3D
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

                {/* Actual Print button - opens print dialog */}
                {appMode === 'view' && printMode && (
                  <button
                    className="theme-toggle-btn"
                    onClick={() => {
                      // Get current canvas
                      const canvas = document.querySelector('.map-canvas-container canvas') as HTMLCanvasElement;
                      if (!canvas) {
                        alert('Canvas not found');
                        return;
                      }

                      // Save current viewState and canvas size
                      const savedViewState = { ...viewState };
                      const savedWidth = canvas.width;
                      const savedHeight = canvas.height;

                      // Set canvas to large size for crisp print
                      canvas.width = 2000;
                      canvas.height = 1400;

                      // Use the DEFAULT view which shows the full map correctly
                      // (same as handleResetView: offsetX: 100, offsetY: 50, scale: 0.5)
                      setViewState({
                        scale: 0.5,
                        offsetX: 100,
                        offsetY: 50
                      });

                      // Wait for canvas to re-render using requestAnimationFrame
                      // Triple RAF ensures we're past React commit + browser paint
                      requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                          requestAnimationFrame(() => {
                            const mapImage = canvas.toDataURL('image/png');

                            // Restore original canvas size and view
                            canvas.width = savedWidth;
                            canvas.height = savedHeight;
                            setViewState(savedViewState);

                            // Calculate unmapped categories
                            const allCategories = [...new Set(rangeData.map(r => r.category))];
                            const unmappedCategories = allCategories.filter(category => {
                              const mapping = categoryMappings[category];
                              if (mapping && mapping !== 'IGNORE_ITEM') return false;
                              if (mapping === 'IGNORE_ITEM') return false;
                              return true;
                            });
                            const mappedActivities = rangeData.filter(r => !unmappedCategories.includes(r.category));

                            // Create hidden iframe for printing
                            const printFrame = document.createElement('iframe');
                            printFrame.style.position = 'fixed';
                            printFrame.style.right = '0';
                            printFrame.style.bottom = '0';
                            printFrame.style.width = '0';
                            printFrame.style.height = '0';
                            printFrame.style.border = 'none';
                            document.body.appendChild(printFrame);

                            const printDoc = printFrame.contentWindow?.document;
                            if (!printDoc) {
                              alert('Could not create print frame');
                              return;
                            }

                            printDoc.open();
                            printDoc.write(`
                              <!DOCTYPE html>
                              <html>
                              <head>
                                <title>Store Map - Print</title>
                                <style>
                                  * { margin: 0; padding: 0; box-sizing: border-box; }
                                  @page { size: A4 landscape; margin: 8mm; }
                                  @page :first { margin: 5mm; }
                                  body { font-family: Inter, system-ui, sans-serif; }
                                  .page1 { 
                                    page-break-after: always; 
                                    width: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: flex-start;
                                  }
                                  .page1 img { 
                                    max-width: 100%; 
                                    max-height: 180mm;
                                    width: auto;
                                    height: auto;
                                  }
                                  .page2 { padding: 10px; }
                                  h2 { font-size: 14px; margin: 0 0 10px; }
                                  table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 20px; }
                                  th { background: #e0e0e0; padding: 5px; text-align: left; border: 1px solid #000; }
                                  td { padding: 4px 5px; border: 1px solid #ccc; }
                                  tr:nth-child(even) { background: #f5f5f5; }
                                  .unmapped { column-count: 3; font-size: 10px; list-style: none; padding: 0; margin: 0; }
                                  .unmapped li { margin: 3px 0; }
                                </style>
                              </head>
                              <body>
                                <div class="page1">
                                  <img src="${mapImage}" alt="Store Map" />
                                </div>
                                <div class="page2">
                                  <h2>Areas Changing (${mappedActivities.length})</h2>
                                  <table>
                                    <tr><th>Date</th><th>Category</th><th>Hrs</th><th>New</th><th>Del</th><th>Reason</th></tr>
                                    ${mappedActivities.map(a => `
                                      <tr>
                                        <td>${a.date}</td>
                                        <td>${a.category}</td>
                                        <td>${a.capacityHours}</td>
                                        <td>${a.newLines}</td>
                                        <td>${a.delistLines}</td>
                                        <td>${(a.reason || '').substring(0, 60)}</td>
                                      </tr>
                                    `).join('')}
                                  </table>
                                  ${unmappedCategories.length > 0 ? `
                                    <h2>Unmapped (${unmappedCategories.length})</h2>
                                    <ul class="unmapped">
                                      ${unmappedCategories.sort().map(c => `<li>• ${c}</li>`).join('')}
                                    </ul>
                                  ` : ''}
                                </div>
                              </body>
                              </html>
                            `);
                            printDoc.close();

                            // Wait for image to load, then print
                            setTimeout(() => {
                              printFrame.contentWindow?.print();
                              setTimeout(() => {
                                document.body.removeChild(printFrame);
                              }, 1000);
                            }, 500);
                          });
                        });
                      });
                    }}
                    title="Print to PDF"
                  >
                    🖨️
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
                    onClearMappings={() => {
                      setCategoryMappings({});
                      localStorage.removeItem(MAPPINGS_KEY);
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
                      className={`sidebar-tab ${activeTab === 'promo' ? 'active' : ''}`}
                      onClick={() => setActiveTab('promo')}
                    >
                      Promo
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
                        onClearMappings={() => {
                          setCategoryMappings({});
                          localStorage.removeItem(MAPPINGS_KEY);
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
                  ) : activeTab === 'promo' ? (
                    <div style={{ padding: 16, overflow: 'auto' }}>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: 14, color: 'var(--text-secondary)' }}>
                        Promo End Groups
                      </h3>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                        Click a promo end on the map, then assign a group in the Aisle tab.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {PROMO_END_GROUPS.map(group => {
                          // Count promo ends with this group
                          let count = 0;
                          layout.aisles.forEach(a => {
                            if (a.promoEnds) {
                              const ends = [
                                a.promoEnds.front,
                                a.promoEnds.frontLeft,
                                a.promoEnds.frontRight,
                                a.promoEnds.back,
                                a.promoEnds.backLeft,
                                a.promoEnds.backRight,
                              ];
                              ends.forEach(end => {
                                if (end?.group === group.id) count++;
                              });
                            }
                          });
                          return (
                            <div key={group.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <span style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                backgroundColor: group.color,
                                flexShrink: 0,
                              }} />
                              <span style={{ flex: 1, fontSize: 13 }}>{group.label}</span>
                              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count}</span>
                            </div>
                          );
                        })}
                      </div>
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
    </div >
  );
}

export default App;
