import React from 'react';

interface LinkMappingPopupProps {
    rangeCategory: string;
    sectionCategory: string;
    position: { x: number; y: number };
    onLink: () => void;
    onIgnore: () => void;
    onCancel: () => void;
}

export const LinkMappingPopup: React.FC<LinkMappingPopupProps> = ({
    rangeCategory,
    sectionCategory,
    position,
    onLink,
    onIgnore,
    onCancel,
}) => {
    return (
        <div
            className="link-mapping-popup"
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                zIndex: 1000,
            }}
        >
            <div className="popup-header">
                Link Category?
            </div>
            <div className="popup-content">
                <div className="popup-from">
                    <span className="label">Range:</span>
                    <span className="value">{rangeCategory}</span>
                </div>
                <div className="popup-arrow">↓</div>
                <div className="popup-to">
                    <span className="label">Section:</span>
                    <span className="value">{sectionCategory}</span>
                </div>
            </div>
            <div className="popup-actions">
                <button className="btn btn-primary btn-sm" onClick={onLink}>
                    ✓ Link
                </button>
                <button className="btn btn-warning btn-sm" onClick={onIgnore}>
                    ✗ Ignore Category
                </button>
                <button className="btn btn-ghost btn-sm" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};
