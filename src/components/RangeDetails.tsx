import React, { useState } from 'react';
import type { RangeActivity } from '../types';

interface RangeDetailsProps {
    activity: RangeActivity | null;
    onClose: () => void;
    reason?: string;
    storeSections?: string[];
    // Changed to support multiple linked sections (comma-separated string or array)
    currentMappings?: string[];
    onLinkSection?: (sectionCategory: string) => void;
    onIgnore?: () => void;
    onRemoveMapping?: (sectionCategory: string) => void;
    onClearAllMappings?: () => void;
    isIgnored?: boolean;
}

export const RangeDetails: React.FC<RangeDetailsProps> = ({
    activity,
    onClose,
    reason,
    storeSections = [],
    currentMappings = [],
    onLinkSection,
    onIgnore,
    onRemoveMapping,
    onClearAllMappings,
    isIgnored = false,
}) => {
    const [showLinkDropdown, setShowLinkDropdown] = useState(false);
    const [searchFilter, setSearchFilter] = useState('');

    if (!activity) return null;

    // Filter out already linked sections from dropdown
    const filteredSections = storeSections.filter(s =>
        s.toLowerCase().includes(searchFilter.toLowerCase()) &&
        !currentMappings.some(m => m.toLowerCase() === s.toLowerCase())
    );

    const handleLinkClick = (section: string) => {
        onLinkSection?.(section);
        setSearchFilter('');
        // Keep dropdown open to allow adding more
    };

    return (
        <div className="range-details">
            <div className="range-details-header">
                <h3>{activity.category}</h3>
                <button className="btn btn-ghost btn-sm" onClick={onClose}>×</button>
            </div>

            <div className="range-details-body">
                {/* Custom Mapping Controls */}
                <div className="mapping-controls">
                    {/* Show linked sections */}
                    {currentMappings.length > 0 && !isIgnored && (
                        <div className="linked-sections">
                            <div className="mapping-header">
                                <span className="mapping-label">✓ Linked to:</span>
                                {onClearAllMappings && currentMappings.length > 1 && (
                                    <button className="btn btn-ghost btn-xs" onClick={onClearAllMappings} title="Clear all">Clear All</button>
                                )}
                            </div>
                            <div className="section-chips">
                                {currentMappings.map((section, idx) => (
                                    <div key={idx} className="section-chip">
                                        <span>{section}</span>
                                        {onRemoveMapping && (
                                            <button
                                                className="chip-remove"
                                                onClick={() => onRemoveMapping(section)}
                                                title="Remove this link"
                                            >×</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Show ignored status */}
                    {isIgnored && (
                        <div className="current-mapping ignored">
                            <span className="mapping-label">✗ Ignored (won't highlight)</span>
                            {onClearAllMappings && (
                                <button className="btn btn-ghost btn-xs" onClick={onClearAllMappings} title="Unignore">×</button>
                            )}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="mapping-actions">
                        <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setShowLinkDropdown(!showLinkDropdown)}
                        >
                            {showLinkDropdown ? '▲ Close' : '🔗 Link to Section'}
                        </button>
                        {onIgnore && !isIgnored && currentMappings.length === 0 && (
                            <button
                                className="btn btn-warning btn-sm"
                                onClick={onIgnore}
                            >
                                ✗ Ignore
                            </button>
                        )}
                    </div>

                    {/* Section dropdown */}
                    {showLinkDropdown && (
                        <div className="link-dropdown">
                            <input
                                type="text"
                                className="link-search"
                                placeholder="Search sections..."
                                value={searchFilter}
                                onChange={(e) => setSearchFilter(e.target.value)}
                                autoFocus
                            />
                            <div className="link-options">
                                {filteredSections.slice(0, 20).map((section, idx) => (
                                    <button
                                        key={idx}
                                        className="link-option"
                                        onClick={() => handleLinkClick(section)}
                                    >
                                        {section}
                                    </button>
                                ))}
                                {filteredSections.length === 0 && (
                                    <div className="no-options">
                                        {storeSections.length === currentMappings.length
                                            ? 'All sections linked!'
                                            : 'No sections match'}
                                    </div>
                                )}
                                {filteredSections.length > 20 && (
                                    <div className="more-options">+{filteredSections.length - 20} more...</div>
                                )}
                            </div>
                            <button
                                className="btn btn-ghost btn-sm link-done"
                                onClick={() => setShowLinkDropdown(false)}
                            >
                                Done
                            </button>
                        </div>
                    )}
                </div>

                {/* Map Logic Reason */}
                {reason && (
                    <div className="bg-slate-800 p-3 mb-4 rounded border border-blue-500/50 text-blue-200 text-sm" style={{ wordWrap: 'break-word', whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                        <span className="font-semibold block mb-1">Map Logic:</span>
                        <div style={{ wordBreak: 'break-word' }}>{reason}</div>
                    </div>
                )}

                <div className="detail-row">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">{activity.date}</span>
                </div>

                <div className="detail-row">
                    <span className="detail-label">Capacity</span>
                    <span className="detail-value">{activity.capacityHours} hours</span>
                </div>

                <div className="detail-stats">
                    <div className="stat new">
                        <span className="stat-num">+{activity.newLines}</span>
                        <span className="stat-text">New Lines</span>
                    </div>
                    <div className="stat delist">
                        <span className="stat-num">-{activity.delistLines}</span>
                        <span className="stat-text">Delists</span>
                    </div>
                </div>

                {activity.brief && (
                    <div className="detail-section">
                        <span className="detail-label">Brief</span>
                        <p className="detail-text">{activity.brief}</p>
                    </div>
                )}

                {activity.reason && (
                    <div className="detail-section">
                        <span className="detail-label">Reason for Change</span>
                        <p className="detail-text">{activity.reason}</p>
                    </div>
                )}

                {(activity.implementationGuidance || activity.kitRequirements) && (
                    <div className="detail-section">
                        <span className="detail-label">Implementation</span>
                        {activity.implementationGuidance && (
                            <div className="sub-detail">
                                <span className="sub-label">Guidance:</span>
                                <p className="detail-text">{activity.implementationGuidance}</p>
                            </div>
                        )}
                        {activity.kitRequirements && (
                            <div className="sub-detail">
                                <span className="sub-label">Kit Requirements:</span>
                                <p className="detail-text">{activity.kitRequirements}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="contacts-section">
                    <span className="detail-label">Issues / Contacts</span>
                    {activity.buyer && (
                        <div className="contact-row">
                            <span className="contact-role">Range Issues</span>
                            <span className="contact-name">{activity.buyer}</span>
                        </div>
                    )}
                    {activity.merchandiser && (
                        <div className="contact-row">
                            <span className="contact-role">Planogram Issues</span>
                            <span className="contact-name">{activity.merchandiser}</span>
                        </div>
                    )}
                    {activity.supplyChain && (
                        <div className="contact-row">
                            <span className="contact-role">Availability Issues</span>
                            <span className="contact-name">{activity.supplyChain}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
