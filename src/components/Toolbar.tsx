import React from 'react';
import type { ViewState, EditorSettings } from '../types';

interface ToolbarProps {
    onAddAisle: () => void;
    onSave: () => void;
    onExport: () => void;
    onResetView: () => void;
    onImport: () => void;
    viewState: ViewState;
    currentLayout: 'promo' | 'full' | 'pdf' | 'saved';
    onLayoutSwitch: (layout: 'promo' | 'full' | 'pdf' | 'saved') => void;
    // New props for editor features
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onCopy: () => void;
    onPaste: () => void;
    canCopy: boolean;
    canPaste: boolean;
    editorSettings: EditorSettings;
    onToggleGrid: () => void;
    onToggleSnap: () => void;
    onSetGridSize: (size: number) => void;
    // App mode for hiding edit controls
    appMode?: 'view' | 'edit';
}

export const Toolbar: React.FC<ToolbarProps> = ({
    onAddAisle,
    onSave,
    onExport,
    onResetView,
    onImport,
    currentLayout,
    onLayoutSwitch,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onCopy,
    onPaste,
    canCopy,
    canPaste,
    editorSettings,
    onToggleGrid,
    onToggleSnap,
    onSetGridSize,
    appMode = 'edit',
}) => {
    return (
        <div className="toolbar">
            <div className="toolbar-section">
                <div className="toolbar-brand">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                    <span>Store Map Editor</span>
                </div>
                <select
                    className="layout-selector"
                    value={currentLayout}
                    onChange={(e) => onLayoutSwitch(e.target.value as 'promo' | 'full' | 'pdf' | 'saved')}
                >
                    <option value="saved">Saved Layout</option>
                    <option value="pdf">PDF Accurate (selling space)</option>
                    <option value="promo">Promo Layout (27 aisles)</option>
                    <option value="full">Full Store (97 items)</option>
                </select>
            </div>

            {/* Edit-only controls */}
            {appMode === 'edit' && (
                <>
                    {/* Undo/Redo Section */}
                    <div className="toolbar-section">
                        <div className="btn-group">
                            <button
                                className="btn btn-ghost"
                                onClick={onUndo}
                                disabled={!canUndo}
                                title="Undo (Ctrl+Z)"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 7v6h6" />
                                    <path d="M3 13a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64" />
                                </svg>
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={onRedo}
                                disabled={!canRedo}
                                title="Redo (Ctrl+Y)"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 7v6h-6" />
                                    <path d="M21 13a9 9 0 0 0-9-9 9 9 0 0 0-6.36 2.64" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Copy/Paste Section */}
                    <div className="toolbar-section">
                        <div className="btn-group">
                            <button
                                className="btn btn-ghost"
                                onClick={onCopy}
                                disabled={!canCopy}
                                title="Copy (Ctrl+C)"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                </svg>
                            </button>
                            <button
                                className="btn btn-ghost"
                                onClick={onPaste}
                                disabled={!canPaste}
                                title="Paste (Ctrl+V)"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Grid/Snap Section */}
                    <div className="toolbar-section">
                        <button
                            className={`btn btn-ghost ${editorSettings.gridEnabled ? 'btn-active' : ''}`}
                            onClick={onToggleGrid}
                            title="Toggle Grid (G)"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" />
                                <line x1="3" y1="9" x2="21" y2="9" />
                                <line x1="3" y1="15" x2="21" y2="15" />
                                <line x1="9" y1="3" x2="9" y2="21" />
                                <line x1="15" y1="3" x2="15" y2="21" />
                            </svg>
                        </button>
                        <button
                            className={`btn btn-ghost ${editorSettings.snapEnabled ? 'btn-active' : ''}`}
                            onClick={onToggleSnap}
                            title="Toggle Snap (S)"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4l4 4" />
                                <path d="M20 4l-4 4" />
                                <path d="M4 20l4-4" />
                                <path d="M20 20l-4-4" />
                                <circle cx="12" cy="12" r="2" />
                            </svg>
                        </button>
                        {editorSettings.gridEnabled && (
                            <select
                                className="grid-size-selector"
                                value={editorSettings.gridSize}
                                onChange={(e) => onSetGridSize(Number(e.target.value))}
                                title="Grid Size"
                            >
                                <option value="1">1px</option>
                                <option value="5">5px</option>
                                <option value="10">10px</option>
                                <option value="20">20px</option>
                                <option value="50">50px</option>
                                <option value="100">100px</option>
                            </select>
                        )}
                    </div>

                    <div className="toolbar-section toolbar-actions">
                        <button className="btn btn-primary" onClick={onAddAisle}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            <span>Add Aisle</span>
                        </button>

                        <div className="btn-group">
                            <button className="btn btn-primary" onClick={onSave} title="Save to Repo (Ctrl+S)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                <span>Save</span>
                            </button>

                            <button className="btn btn-secondary" onClick={onImport} title="Import JSON">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                    <polyline points="17,8 12,3 7,8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Import</span>
                            </button>

                            <button className="btn btn-secondary" onClick={onExport} title="Export JSON">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                                    <polyline points="7,10 12,15 17,10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Export</span>
                            </button>
                        </div>

                        <button className="btn btn-ghost" onClick={onResetView} title="Reset View">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
                                <path d="M3 3v5h5" />
                            </svg>
                        </button>
                    </div>
                </>
            )}

            <div className="toolbar-section toolbar-help">
                <div className="help-hint">
                    <span className="key">Ctrl+Z</span> Undo
                    <span className="separator">•</span>
                    <span className="key">G</span> Grid
                    <span className="separator">•</span>
                    <span className="key">S</span> Snap
                    <span className="separator">•</span>
                    <span className="key">R</span> Rotate
                </div>
            </div>
        </div>
    );
};
