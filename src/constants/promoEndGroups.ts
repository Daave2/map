// Promo End Group definitions with colors
import type { PromoEndGroup } from '../types';

export interface PromoEndGroupInfo {
    id: PromoEndGroup;
    label: string;
    color: string;
}

export const PROMO_END_GROUPS: PromoEndGroupInfo[] = [
    { id: 'impulse_a', label: 'Impulse A', color: '#ef4444' },
    { id: 'core_grocery_b', label: 'Core Grocery B', color: '#f97316' },
    { id: 'bws_petcare_c', label: 'BWS & Petcare C', color: '#eab308' },
    { id: 'household_d', label: 'Household D', color: '#22c55e' },
    { id: 'health_beauty_baby', label: 'Health, Beauty & Baby', color: '#0d9488' },
    { id: 'fresh_bakery', label: 'Fresh & Bakery', color: '#06b6d4' },
    { id: 'frozen', label: 'Frozen', color: '#3b82f6' },
    { id: 'general_merchandise', label: 'General Merchandise', color: '#8b5cf6' },
    { id: 'event_ends', label: 'Event Ends', color: '#ec4899' },
    { id: 'other', label: 'Other', color: '#6b7280' },
];

export function getPromoEndGroupColor(groupId: PromoEndGroup | undefined): string | null {
    if (!groupId) return null;
    const group = PROMO_END_GROUPS.find(g => g.id === groupId);
    return group?.color ?? null;
}

export function getPromoEndGroupLabel(groupId: PromoEndGroup | undefined): string | null {
    if (!groupId) return null;
    const group = PROMO_END_GROUPS.find(g => g.id === groupId);
    return group?.label ?? null;
}
