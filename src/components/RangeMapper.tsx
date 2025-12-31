
import React from 'react';

interface RangeMapperProps {
    unmatchedCategories: string[];
    onAssignMapping: (rangeCat: string, storeSectionCat: string) => void;
    onClearMappings?: () => void;
    onClose: () => void;
}

export const RangeMapper: React.FC<RangeMapperProps> = ({
    unmatchedCategories,
    onClearMappings,
    onClose
}) => {
    if (unmatchedCategories.length === 0) return null;

    const handleDragStart = (e: React.DragEvent, category: string) => {
        e.dataTransfer.setData('text/plain', category);
    };

    return (
        <div className="range-mapper-palette">
            <div className="range-mapper-header">
                <h3>Unmatched ({unmatchedCategories.length})</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {onClearMappings && (
                        <button onClick={onClearMappings} className="action-btn secondary" title="Reset all Mappings">
                            Reset
                        </button>
                    )}
                    <button onClick={onClose} className="close-btn">×</button>
                </div>
            </div>

            <div className="modal-body" style={{ padding: '0.5rem', overflowY: 'auto' }}>
                <p className="helper-text" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Drag these items onto their correct shelf on the map to link them.
                </p>

                <div className="mapping-list">
                    {unmatchedCategories.map(cat => (
                        <div
                            key={cat}
                            className="draggable-item"
                            draggable
                            onDragStart={(e) => handleDragStart(e, cat)}
                            style={{
                                padding: '0.5rem',
                                margin: '0.25rem 0',
                                backgroundColor: 'var(--bg-primary)',
                                border: '1px solid var(--border-dim)',
                                borderRadius: '4px',
                                cursor: 'grab',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>⋮⋮</span>
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
                        </div>
                    ))}
                    {unmatchedCategories.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--success)', fontSize: '0.85rem' }}>
                            All items mapped!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
