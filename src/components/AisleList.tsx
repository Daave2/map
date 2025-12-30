import React from 'react';
import type { Aisle } from '../types';

// ... imports

interface AisleListProps {
    aisles: Aisle[];
    selectedAisleIds: string[];
    onSelectAisle: (id: string, multi?: boolean) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export const AisleList: React.FC<AisleListProps> = ({
    aisles,
    selectedAisleIds,
    onSelectAisle,
    searchTerm,
    onSearchChange,
}) => {

    // Filter out aisle voids (type='aisle') - they're just reference markers
    const sellingSpaceAisles = aisles.filter((aisle) => aisle.type !== 'aisle');

    // Get the selected aisle for showing sections (Only show if exactly one is selected)
    const singleSelectedId = selectedAisleIds.length === 1 ? selectedAisleIds[0] : null;
    const selectedAisle = singleSelectedId ? aisles.find((a) => a.id === singleSelectedId) : null;
    const hasSections = selectedAisle?.sections && selectedAisle.sections.length > 0;

    // Also search in sections (bay codes and categories)
    const filteredAisles = sellingSpaceAisles.filter((aisle) => {
        const matchesLabel = aisle.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesId = aisle.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSections = aisle.sections?.some(
            (s) => s.bay.includes(searchTerm) || s.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return matchesLabel || matchesId || matchesSections;
    });

    return (
        <div className="aisle-list">
            <div className="list-header">
                <h2>Selling Space</h2>
                <span className="aisle-count">{sellingSpaceAisles.length}</span>
            </div>

            <div className="search-container">
                <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search aisles, bay codes..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="search-clear"
                        onClick={() => onSearchChange('')}
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Show sections panel when a gondola with sections is selected */}
            {hasSections && selectedAisle && (
                <div className="sections-panel">
                    <div className="sections-header">
                        <strong>{selectedAisle.label}</strong> - Sections
                    </div>
                    <div className="sections-list">
                        {selectedAisle.sections?.map((section, idx) => (
                            <div key={idx} className="section-item">
                                <span className="section-bay">{section.bay}</span>
                                <span className="section-category">{section.category}</span>
                                {section.side && <span className="section-side">({section.side})</span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="list-items">
                {filteredAisles.length === 0 ? (
                    <div className="list-empty">
                        {searchTerm ? 'No aisles match your search' : 'No aisles defined'}
                    </div>
                ) : (
                    filteredAisles.map((aisle) => (
                        <div
                            key={aisle.id}
                            className={`list-item ${selectedAisleIds.includes(aisle.id) ? 'selected' : ''} ${aisle.locked ? 'locked' : ''}`}
                            onClick={(e) => onSelectAisle(aisle.id, e.shiftKey)}
                        >
                            <div className="item-main">
                                <span className="item-label">{aisle.label}</span>
                                {aisle.sections && aisle.sections.length > 0 && (
                                    <span className="section-badge">{aisle.sections.length}</span>
                                )}
                                {aisle.locked && (
                                    <svg className="lock-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4z" />
                                    </svg>
                                )}
                            </div>
                            <span className="item-id">{aisle.id}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

