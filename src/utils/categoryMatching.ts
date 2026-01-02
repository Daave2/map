export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function matchesRangeCategory(sectionCategory: string, rangeCategory: string): { matched: boolean, reason?: string } {
    // Improved normalization: handle ampersands and collapse spaces
    const normalize = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
    const sectionNorm = normalize(sectionCategory);
    const rangeNorm = normalize(rangeCategory);

    // 1. Direct match ONLY - Range category appears as whole word in Section
    try {
        const rangeRegex = new RegExp(`\\b${escapeRegExp(rangeNorm)}\\b`);
        if (rangeRegex.test(sectionNorm)) return { matched: true, reason: `Direct match: "${rangeNorm}" in "${sectionNorm}"` };
    } catch (e) {
        // Fallback for invalid regex - require exact match only
        if (sectionNorm === rangeNorm) return { matched: true, reason: 'Exact match' };
    }

    // 2. Simple inclusion check (fallback if regex fails/is too strict?)
    if (sectionNorm.includes(rangeNorm)) {
        return { matched: true, reason: `Partial match: "${rangeNorm}" in "${sectionNorm}"` };
    }

    return { matched: false };
}
