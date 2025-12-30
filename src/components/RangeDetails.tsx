import React from 'react';
import type { RangeActivity } from '../types';

interface RangeDetailsProps {
    activity: RangeActivity | null;
    onClose: () => void;
}

export const RangeDetails: React.FC<RangeDetailsProps> = ({ activity, onClose }) => {
    if (!activity) return null;

    return (
        <div className="range-details">
            <div className="range-details-header">
                <h3>{activity.category}</h3>
                <button className="btn btn-ghost btn-sm" onClick={onClose}>×</button>
            </div>

            <div className="range-details-body">
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

                {activity.reason && (
                    <div className="detail-section">
                        <span className="detail-label">Reason for Change</span>
                        <p className="detail-text">{activity.reason}</p>
                    </div>
                )}

                <div className="contacts-section">
                    <span className="detail-label">Contacts</span>
                    {activity.buyer && (
                        <div className="contact-row">
                            <span className="contact-role">Buyer</span>
                            <span className="contact-name">{activity.buyer}</span>
                        </div>
                    )}
                    {activity.merchandiser && (
                        <div className="contact-row">
                            <span className="contact-role">Merchandising</span>
                            <span className="contact-name">{activity.merchandiser}</span>
                        </div>
                    )}
                    {activity.supplyChain && (
                        <div className="contact-row">
                            <span className="contact-role">Supply Chain</span>
                            <span className="contact-name">{activity.supplyChain}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
