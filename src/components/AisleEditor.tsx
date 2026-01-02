import React from 'react';
import type { Aisle, AisleSection } from '../types';

interface AisleEditorProps {
    aisle: Aisle | null;
    selectedCount?: number;
    onUpdateAisle: (id: string, updates: Partial<Aisle>) => void;
    onDeleteAisle: (id: string) => void;
}

export const AisleEditor: React.FC<AisleEditorProps> = ({
    aisle,
    selectedCount = 0,
    onUpdateAisle,
    onDeleteAisle,
}) => {
    if (selectedCount > 1) {
        return (
            <div className="aisle-editor multi-select">
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </svg>
                    <h3>{selectedCount} Aisles Selected</h3>
                    <p>Select a single aisle to edit its properties.</p>
                </div>
            </div>
        );
    }

    if (!aisle) {
        return (
            <div className="aisle-editor empty">
                <div className="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <h3>No Aisle Selected</h3>
                    <p>Click on an aisle in the map to edit its properties</p>
                </div>
            </div>
        );
    }

    const handleChange = (field: keyof Aisle, value: unknown) => {
        onUpdateAisle(aisle.id, { [field]: value });
    };

    const handleP1Change = (index: 0 | 1, value: number) => {
        const newP1: [number, number] = [...aisle.p1] as [number, number];
        newP1[index] = value;
        onUpdateAisle(aisle.id, { p1: newP1 });
    };

    const handleP2Change = (index: 0 | 1, value: number) => {
        const newP2: [number, number] = [...aisle.p2] as [number, number];
        newP2[index] = value;
        onUpdateAisle(aisle.id, { p2: newP2 });
    };

    const handleAddSection = () => {
        const currentSections = aisle.sections || [];
        const newSection: AisleSection = {
            bay: `${currentSections.length + 1}`,
            category: 'Category'
        };
        onUpdateAisle(aisle.id, { sections: [...currentSections, newSection] });
    };

    const handleUpdateSection = (index: number, updates: Partial<AisleSection>) => {
        const newSections = [...(aisle.sections || [])];
        newSections[index] = { ...newSections[index], ...updates };
        onUpdateAisle(aisle.id, { sections: newSections });
    };

    const handleRemoveSection = (index: number) => {
        const newSections = [...(aisle.sections || [])];
        newSections.splice(index, 1);
        onUpdateAisle(aisle.id, { sections: newSections });
    };

    const handleMoveSection = (index: number, direction: -1 | 1) => {
        const sections = [...(aisle.sections || [])];
        if (index + direction < 0 || index + direction >= sections.length) return;
        const temp = sections[index];
        sections[index] = sections[index + direction];
        sections[index + direction] = temp;
        onUpdateAisle(aisle.id, { sections });
    };

    return (
        <div className="aisle-editor">
            <div className="editor-header">
                <h2>Edit Aisle</h2>
                <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDeleteAisle(aisle.id)}
                    title="Delete this aisle"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                </button>
            </div>

            <div className="editor-section">
                <label className="editor-label">ID</label>
                <input
                    type="text"
                    className="editor-input"
                    value={aisle.id}
                    onChange={(e) => handleChange('id', e.target.value)}
                    disabled={aisle.locked}
                />
            </div>

            <div className="editor-section">
                <label className="editor-label">Label</label>
                <input
                    type="text"
                    className="editor-input"
                    value={aisle.label}
                    onChange={(e) => handleChange('label', e.target.value)}
                />
            </div>

            <div className="editor-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label className="editor-label">Label Position</label>
                    {aisle.labelPosition && (
                        <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => handleChange('labelPosition', undefined)}
                            title="Reset to Center"
                            style={{ fontSize: '10px', padding: '2px 4px' }}
                        >
                            Reset
                        </button>
                    )}
                </div>
                {aisle.labelPosition ? (
                    <div className="coordinate-inputs">
                        <div className="coord-input">
                            <span>X</span>
                            <input
                                type="number"
                                value={Math.round(aisle.labelPosition.x)}
                                onChange={(e) => handleChange('labelPosition', {
                                    ...aisle.labelPosition,
                                    x: parseFloat(e.target.value) || 0
                                })}
                            />
                        </div>
                        <div className="coord-input">
                            <span>Y</span>
                            <input
                                type="number"
                                value={Math.round(aisle.labelPosition.y)}
                                onChange={(e) => handleChange('labelPosition', {
                                    ...aisle.labelPosition,
                                    y: parseFloat(e.target.value) || 0
                                })}
                            />
                        </div>
                    </div>
                ) : (
                    <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', marginTop: '4px' }}
                        onClick={() => {
                            const bounds = {
                                minX: Math.min(aisle.p1[0], aisle.p2[0]),
                                maxX: Math.max(aisle.p1[0], aisle.p2[0]),
                                minY: Math.min(aisle.p1[1], aisle.p2[1]),
                                maxY: Math.max(aisle.p1[1], aisle.p2[1])
                            };
                            const centerX = (bounds.minX + bounds.maxX) / 2;
                            const centerY = (bounds.minY + bounds.maxY) / 2;
                            handleChange('labelPosition', { x: centerX, y: centerY });
                        }}
                    >
                        Set Custom Position
                    </button>
                )}
            </div>

            <div className="editor-section">
                <label className="editor-label">Width</label>
                <input
                    type="number"
                    className="editor-input"
                    value={aisle.aisleWidth}
                    onChange={(e) => handleChange('aisleWidth', parseFloat(e.target.value) || 0)}
                    min={10}
                    max={200}
                />
            </div>

            <div className="editor-section">
                <label className="editor-label">Rotation (degrees)</label>
                <div className="rotation-controls">
                    <input
                        type="number"
                        className="editor-input rotation-input"
                        value={aisle.rotation || 0}
                        onChange={(e) => handleChange('rotation', (parseFloat(e.target.value) || 0) % 360)}
                        min={0}
                        max={360}
                        step={15}
                    />
                    <input
                        type="range"
                        className="rotation-slider"
                        value={aisle.rotation || 0}
                        onChange={(e) => handleChange('rotation', parseFloat(e.target.value))}
                        min={0}
                        max={360}
                        step={15}
                    />
                </div>
                <div className="rotation-presets">
                    <button
                        className={`rotation-btn ${(aisle.rotation || 0) === 0 ? 'active' : ''}`}
                        onClick={() => handleChange('rotation', 0)}
                        title="Reset to 0°"
                    >
                        0°
                    </button>
                    <button
                        className={`rotation-btn ${(aisle.rotation || 0) === 90 ? 'active' : ''}`}
                        onClick={() => handleChange('rotation', 90)}
                        title="Rotate to 90°"
                    >
                        90°
                    </button>
                    <button
                        className={`rotation-btn ${(aisle.rotation || 0) === 180 ? 'active' : ''}`}
                        onClick={() => handleChange('rotation', 180)}
                        title="Rotate to 180°"
                    >
                        180°
                    </button>
                    <button
                        className={`rotation-btn ${(aisle.rotation || 0) === 270 ? 'active' : ''}`}
                        onClick={() => handleChange('rotation', 270)}
                        title="Rotate to 270°"
                    >
                        270°
                    </button>
                </div>
            </div>

            <div className="editor-section">
                <label className="editor-label">
                    Point 1 (P1)
                    <span className="point-indicator p1"></span>
                </label>
                <div className="coordinate-inputs">
                    <div className="coord-input">
                        <span>X</span>
                        <input
                            type="number"
                            value={Math.round(aisle.p1[0])}
                            onChange={(e) => handleP1Change(0, parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="coord-input">
                        <span>Y</span>
                        <input
                            type="number"
                            value={Math.round(aisle.p1[1])}
                            onChange={(e) => handleP1Change(1, parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </div>

            <div className="editor-section">
                <label className="editor-label">
                    Point 2 (P2)
                    <span className="point-indicator p2"></span>
                </label>
                <div className="coordinate-inputs">
                    <div className="coord-input">
                        <span>X</span>
                        <input
                            type="number"
                            value={Math.round(aisle.p2[0])}
                            onChange={(e) => handleP2Change(0, parseFloat(e.target.value) || 0)}
                        />
                    </div>
                    <div className="coord-input">
                        <span>Y</span>
                        <input
                            type="number"
                            value={Math.round(aisle.p2[1])}
                            onChange={(e) => handleP2Change(1, parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
            </div>

            <div className="editor-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3>Sections ({aisle.sections?.length || 0})</h3>
                    <button className="btn btn-primary btn-sm" onClick={handleAddSection} title="Add Section">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>

                <div className="sections-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(aisle.sections || []).map((section, index) => (
                        <div key={index} className="section-item" style={{
                            display: 'grid',
                            gridTemplateColumns: '36px 40px 1fr auto',
                            gap: '6px',
                            alignItems: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            padding: '6px',
                            borderRadius: '4px'
                        }}>
                            <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleUpdateSection(index, { side: section.side === 'L' ? 'R' : section.side === 'R' ? undefined : 'L' })}
                                title={`Side: ${section.side || 'Both'} (click to change)`}
                                style={{
                                    padding: '2px 6px',
                                    fontWeight: 'bold',
                                    fontSize: '11px',
                                    background: section.side === 'L' ? 'rgba(100, 180, 255, 0.3)' : section.side === 'R' ? 'rgba(255, 180, 100, 0.3)' : 'rgba(128, 128, 128, 0.2)',
                                    border: section.side ? '1px solid currentColor' : '1px dashed #666',
                                    borderRadius: '3px'
                                }}
                            >
                                {section.side || '–'}
                            </button>
                            <input
                                type="text"
                                className="editor-input"
                                value={section.bay}
                                onChange={(e) => handleUpdateSection(index, { bay: e.target.value })}
                                placeholder="#"
                                title="Bay Number/Code"
                                style={{ textAlign: 'center', padding: '4px' }}
                            />
                            <input
                                type="text"
                                className="editor-input"
                                value={section.category}
                                onChange={(e) => handleUpdateSection(index, { category: e.target.value })}
                                placeholder="Category"
                                title="Category Name"
                                style={{ padding: '4px' }}
                            />
                            <div className="section-actions" style={{ display: 'flex', gap: '2px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => handleMoveSection(index, -1)}
                                        disabled={index === 0}
                                        title="Move Up"
                                        style={{ padding: '1px', height: '12px', lineHeight: '10px' }}
                                    >▲</button>
                                    <button
                                        className="btn btn-ghost btn-xs"
                                        onClick={() => handleMoveSection(index, 1)}
                                        disabled={index === (aisle.sections?.length || 0) - 1}
                                        title="Move Down"
                                        style={{ padding: '1px', height: '12px', lineHeight: '10px' }}
                                    >▼</button>
                                </div>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleRemoveSection(index)}
                                    title="Remove Section"
                                    style={{ padding: '4px' }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                    {(aisle.sections?.length || 0) === 0 && (
                        <div style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', fontSize: '12px', padding: '8px' }}>
                            No sections. Unit treated as single block.
                        </div>
                    )}
                </div>
            </div>

            <div className="editor-section">
                <h3>Promo Ends</h3>

                {/* Front Promo End */}
                <div className="promo-end-group" style={{ marginBottom: '16px', padding: '8px', border: '1px solid #333', borderRadius: '4px' }}>
                    <label className="editor-label checkbox-label" style={{ marginBottom: '8px' }}>
                        <input
                            type="checkbox"
                            checked={!!aisle.promoEnds?.front}
                            onChange={(e) => {
                                const current = aisle.promoEnds || {};
                                if (e.target.checked) {
                                    onUpdateAisle(aisle.id, {
                                        promoEnds: { ...current, front: { code: 'New', label: 'Promo', name: 'Promo End' } }
                                    });
                                } else {
                                    const updated = { ...current };
                                    delete updated.front;
                                    onUpdateAisle(aisle.id, { promoEnds: updated });
                                }
                            }}
                        />
                        <span style={{ fontWeight: 'bold' }}>Front Promo End</span>
                    </label>

                    {aisle.promoEnds?.front && (
                        <div style={{ paddingLeft: '8px' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <label style={{ fontSize: '10px', color: '#888' }}>Code (e.g. AE3)</label>
                                <input
                                    type="text"
                                    className="editor-input"
                                    value={aisle.promoEnds.front.code}
                                    onChange={(e) => {
                                        const current = aisle.promoEnds || {};
                                        onUpdateAisle(aisle.id, {
                                            promoEnds: {
                                                ...current,
                                                front: { ...current.front!, code: e.target.value }
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                <label style={{ fontSize: '10px', color: '#888' }}>Label</label>
                                <input
                                    type="text"
                                    className="editor-input"
                                    value={aisle.promoEnds.front.label}
                                    onChange={(e) => {
                                        const current = aisle.promoEnds || {};
                                        onUpdateAisle(aisle.id, {
                                            promoEnds: {
                                                ...current,
                                                front: { ...current.front!, label: e.target.value }
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Front Side Units */}
                    {aisle.promoEnds?.front && (
                        <div style={{ marginTop: '8px', borderTop: '1px solid #444', paddingTop: '8px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#aaa' }}>SIDE UNITS</div>

                            {/* Front Left */}
                            <div style={{ marginBottom: '6px' }}>
                                <label className="editor-label checkbox-label" style={{ fontSize: '11px' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!aisle.promoEnds.frontLeft}
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            if (e.target.checked) {
                                                onUpdateAisle(aisle.id, {
                                                    promoEnds: { ...current, frontLeft: { code: 'L', label: '', name: 'Promo Left' } }
                                                });
                                            } else {
                                                const updated = { ...current };
                                                delete updated.frontLeft;
                                                onUpdateAisle(aisle.id, { promoEnds: updated });
                                            }
                                        }}
                                    />
                                    Left Side
                                </label>
                                {aisle.promoEnds.frontLeft && (
                                    <input
                                        type="text"
                                        className="editor-input"
                                        value={aisle.promoEnds.frontLeft.code}
                                        placeholder="Code"
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            onUpdateAisle(aisle.id, {
                                                promoEnds: {
                                                    ...current,
                                                    frontLeft: { ...current.frontLeft!, code: e.target.value }
                                                }
                                            });
                                        }}
                                    />
                                )}
                            </div>

                            {/* Front Right */}
                            <div>
                                <label className="editor-label checkbox-label" style={{ fontSize: '11px' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!aisle.promoEnds.frontRight}
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            if (e.target.checked) {
                                                onUpdateAisle(aisle.id, {
                                                    promoEnds: { ...current, frontRight: { code: 'R', label: '', name: 'Promo Right' } }
                                                });
                                            } else {
                                                const updated = { ...current };
                                                delete updated.frontRight;
                                                onUpdateAisle(aisle.id, { promoEnds: updated });
                                            }
                                        }}
                                    />
                                    Right Side
                                </label>
                                {aisle.promoEnds.frontRight && (
                                    <input
                                        type="text"
                                        className="editor-input"
                                        value={aisle.promoEnds.frontRight.code}
                                        placeholder="Code"
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            onUpdateAisle(aisle.id, {
                                                promoEnds: {
                                                    ...current,
                                                    frontRight: { ...current.frontRight!, code: e.target.value }
                                                }
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Back Promo End */}
                <div className="promo-end-group" style={{ padding: '8px', border: '1px solid #333', borderRadius: '4px' }}>
                    <label className="editor-label checkbox-label" style={{ marginBottom: '8px' }}>
                        <input
                            type="checkbox"
                            checked={!!aisle.promoEnds?.back}
                            onChange={(e) => {
                                const current = aisle.promoEnds || {};
                                if (e.target.checked) {
                                    onUpdateAisle(aisle.id, {
                                        promoEnds: { ...current, back: { code: 'New', label: 'Promo', name: 'Promo End Back' } }
                                    });
                                } else {
                                    const updated = { ...current };
                                    delete updated.back;
                                    onUpdateAisle(aisle.id, { promoEnds: updated });
                                }
                            }}
                        />
                        <span style={{ fontWeight: 'bold' }}>Back Promo End</span>
                    </label>

                    {aisle.promoEnds?.back && (
                        <div style={{ paddingLeft: '8px' }}>
                            <div style={{ marginBottom: '4px' }}>
                                <label style={{ fontSize: '10px', color: '#888' }}>Code (e.g. Z)</label>
                                <input
                                    type="text"
                                    className="editor-input"
                                    value={aisle.promoEnds.back.code}
                                    onChange={(e) => {
                                        const current = aisle.promoEnds || {};
                                        onUpdateAisle(aisle.id, {
                                            promoEnds: {
                                                ...current,
                                                back: { ...current.back!, code: e.target.value }
                                            }
                                        });
                                    }}
                                />
                            </div>
                            <div style={{ marginBottom: '4px' }}>
                                <label style={{ fontSize: '10px', color: '#888' }}>Label</label>
                                <input
                                    type="text"
                                    className="editor-input"
                                    value={aisle.promoEnds.back.label}
                                    onChange={(e) => {
                                        const current = aisle.promoEnds || {};
                                        onUpdateAisle(aisle.id, {
                                            promoEnds: {
                                                ...current,
                                                back: { ...current.back!, label: e.target.value }
                                            }
                                        });
                                    }}
                                />
                            </div>
                        </div>

                    )}

                    {/* Back Side Units */}
                    {aisle.promoEnds?.back && (
                        <div style={{ marginTop: '8px', borderTop: '1px solid #444', paddingTop: '8px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px', color: '#aaa' }}>SIDE UNITS</div>

                            {/* Back Left */}
                            <div style={{ marginBottom: '6px' }}>
                                <label className="editor-label checkbox-label" style={{ fontSize: '11px' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!aisle.promoEnds.backLeft}
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            if (e.target.checked) {
                                                onUpdateAisle(aisle.id, {
                                                    promoEnds: { ...current, backLeft: { code: 'L', label: '', name: 'Promo Left' } }
                                                });
                                            } else {
                                                const updated = { ...current };
                                                delete updated.backLeft;
                                                onUpdateAisle(aisle.id, { promoEnds: updated });
                                            }
                                        }}
                                    />
                                    Left Side
                                </label>
                                {aisle.promoEnds.backLeft && (
                                    <input
                                        type="text"
                                        className="editor-input"
                                        value={aisle.promoEnds.backLeft.code}
                                        placeholder="Code"
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            onUpdateAisle(aisle.id, {
                                                promoEnds: {
                                                    ...current,
                                                    backLeft: { ...current.backLeft!, code: e.target.value }
                                                }
                                            });
                                        }}
                                    />
                                )}
                            </div>

                            {/* Back Right */}
                            <div>
                                <label className="editor-label checkbox-label" style={{ fontSize: '11px' }}>
                                    <input
                                        type="checkbox"
                                        checked={!!aisle.promoEnds.backRight}
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            if (e.target.checked) {
                                                onUpdateAisle(aisle.id, {
                                                    promoEnds: { ...current, backRight: { code: 'R', label: '', name: 'Promo Right' } }
                                                });
                                            } else {
                                                const updated = { ...current };
                                                delete updated.backRight;
                                                onUpdateAisle(aisle.id, { promoEnds: updated });
                                            }
                                        }}
                                    />
                                    Right Side
                                </label>
                                {aisle.promoEnds.backRight && (
                                    <input
                                        type="text"
                                        className="editor-input"
                                        value={aisle.promoEnds.backRight.code}
                                        placeholder="Code"
                                        onChange={(e) => {
                                            const current = aisle.promoEnds || {};
                                            onUpdateAisle(aisle.id, {
                                                promoEnds: {
                                                    ...current,
                                                    backRight: { ...current.backRight!, code: e.target.value }
                                                }
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="editor-section">
                <label className="editor-label checkbox-label">
                    <input
                        type="checkbox"
                        checked={aisle.locked}
                        onChange={(e) => handleChange('locked', e.target.checked)}
                    />
                    <span>Locked</span>
                </label>
            </div>

            {
                aisle.type && (
                    <div className="editor-section">
                        <label className="editor-label">Type</label>
                        <select
                            className="editor-input"
                            value={aisle.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                        >
                            <option value="grocery">Grocery</option>
                            <option value="chilled">Chilled</option>
                            <option value="alcohol">Alcohol</option>
                            <option value="household">Household</option>
                            <option value="bev">Beverages</option>
                            <option value="front">Front of Store</option>
                        </select>
                    </div>
                )
            }
        </div >
    );
};
