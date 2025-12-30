import React, { useState, useRef } from 'react';
import type { RangeActivity } from '../types';

interface RangePanelProps {
    rangeData: RangeActivity[];
    onImport: (data: RangeActivity[]) => void;
    onClear: () => void;
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

// Parse TSV data into RangeActivity array
function parseTSV(text: string): RangeActivity[] {
    const lines = text.split('\n').filter(line => line.trim());
    const results: RangeActivity[] = [];

    // Skip header rows (first 2-3 lines usually)
    let dataStartIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('Mon') || lines[i].includes('Wed')) {
            dataStartIndex = i;
            break;
        }
    }

    for (let i = dataStartIndex; i < lines.length; i++) {
        const cols = lines[i].split('\t');

        // Skip empty or summary rows
        if (!cols[2] || cols[2].trim() === '' || cols[2].includes('Total')) continue;

        const date = cols[0]?.trim() || '';
        const category = cols[2]?.trim() || '';
        const brief = cols[3]?.trim() || '';
        const capacityStr = cols[4]?.replace(/[^0-9.]/g, '') || '0';
        const capacityHours = parseFloat(capacityStr) || 0;
        const newLines = parseInt(cols[6]?.replace(/[^0-9]/g, '') || '0') || 0;
        const delistLines = parseInt(cols[7]?.replace(/[^0-9]/g, '') || '0') || 0;
        const reason = cols[9]?.trim() || '';
        const buyer = cols[14]?.trim() || '';
        const merchandiser = cols[15]?.trim() || '';
        const supplyChain = cols[16]?.trim() || '';

        // Only add if we have a category
        if (category && category !== '#N/A') {
            results.push({
                date,
                category,
                brief: brief || undefined,
                capacityHours,
                newLines,
                delistLines,
                reason,
                buyer: buyer && buyer !== '#N/A' ? buyer : undefined,
                merchandiser: merchandiser && merchandiser !== '#N/A' ? merchandiser : undefined,
                supplyChain: supplyChain && supplyChain !== '#N/A' ? supplyChain : undefined,
            });
        }
    }

    return results;
}

// Get color based on capacity hours
function getWorkloadColor(hours: number): string {
    if (hours < 1) return '#22c55e'; // green
    if (hours < 2) return '#eab308'; // yellow
    if (hours < 3) return '#f97316'; // orange
    return '#ef4444'; // red
}

export const RangePanel: React.FC<RangePanelProps> = ({
    rangeData,
    onImport,
    onClear,
    selectedCategory,
    onSelectCategory,
}) => {
    const [pasteMode, setPasteMode] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const parsed = parseTSV(text);
            onImport(parsed);
        };
        reader.readAsText(file);
    };

    const handlePasteImport = () => {
        const parsed = parseTSV(pasteText);
        onImport(parsed);
        setPasteMode(false);
        setPasteText('');
    };

    const totalNewLines = rangeData.reduce((sum, r) => sum + r.newLines, 0);
    const totalDelists = rangeData.reduce((sum, r) => sum + r.delistLines, 0);
    const totalHours = rangeData.reduce((sum, r) => sum + r.capacityHours, 0);

    return (
        <div className="range-panel">
            {rangeData.length === 0 ? (
                <div className="range-import-section">
                    <div className="empty-state">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3>Import Range Activity</h3>
                        <p>Paste or upload range data to see affected sections</p>
                    </div>

                    {!pasteMode ? (
                        <div className="import-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={() => setPasteMode(true)}
                            >
                                Paste Data
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Upload File
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".tsv,.csv,.txt"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div className="paste-section">
                            <textarea
                                className="paste-textarea"
                                placeholder="Paste range activity data here..."
                                value={pasteText}
                                onChange={(e) => setPasteText(e.target.value)}
                                rows={10}
                            />
                            <div className="paste-buttons">
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePasteImport}
                                    disabled={!pasteText.trim()}
                                >
                                    Import
                                </button>
                                <button
                                    className="btn btn-ghost"
                                    onClick={() => {
                                        setPasteMode(false);
                                        setPasteText('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="range-summary">
                        <div className="summary-stat">
                            <span className="stat-value">{rangeData.length}</span>
                            <span className="stat-label">Categories</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-value" style={{ color: '#22c55e' }}>{totalNewLines}</span>
                            <span className="stat-label">New Lines</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-value" style={{ color: '#ef4444' }}>{totalDelists}</span>
                            <span className="stat-label">Delists</span>
                        </div>
                        <div className="summary-stat">
                            <span className="stat-value">{totalHours.toFixed(1)}h</span>
                            <span className="stat-label">Total Work</span>
                        </div>
                    </div>

                    <div className="range-list">
                        {rangeData.map((item, index) => (
                            <div
                                key={index}
                                className={`range-item ${selectedCategory === item.category ? 'selected' : ''}`}
                                onClick={() => onSelectCategory(selectedCategory === item.category ? null : item.category)}
                            >
                                <div
                                    className="workload-indicator"
                                    style={{ backgroundColor: getWorkloadColor(item.capacityHours) }}
                                />
                                <div className="range-item-content">
                                    <div className="range-item-category">{item.category}</div>
                                    <div className="range-item-stats">
                                        <span className="new-lines">+{item.newLines}</span>
                                        <span className="delist-lines">-{item.delistLines}</span>
                                        <span className="hours">{item.capacityHours}h</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-danger btn-sm clear-btn"
                        onClick={onClear}
                    >
                        Clear Import
                    </button>
                </>
            )}
        </div>
    );
};
