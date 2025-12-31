export const CATEGORY_MAPPINGS: Record<string, string[]> = {
    // Spreadsheet Category -> [Store Section Keywords]
    'all wine': ['red wine', 'white wine', 'rose wine', 'sparkling', 'fortified', 'wine', 'champagne'],
    'no & low alcohol': ['low alc & stubb', 'low alc', 'no alcohol', 'non alcoholic'],
    'free from': ['free from'],
    'baby foods': ['baby food', 'baby access', 'baby milk'],
    'carbonates & mixers': ['carbonates', 'mixers', 'mixer'],
    'spirits/liqueurs/cocktails': ['spirits', 'liqueurs', 'cocktails', 'gin', 'vodka', 'whisky', 'rum'],
    'bought in morning goods': ['morning goods', 'croissants'],
    'bought in bread': ['bread and cakes', 'bread rolls', 'bread clear', 'bread'],
    'jam,marmalades & sweet spread': ['jam', 'marmalade', 'peanut butter', 'chocolate spread', 'honey'],
    'canned meat': ['canned meats'],
    'canned fish': ['canned fish'],
    'nuts & snacks': ['nuts', 'snacks', 'peanuts'],
    'crispbreads & crackers': ['crackers', 'crispbread'],
    'oven fresh': ['oven fres'],
    'salad bar': ['salad bar'],
    'party drinks & perry': ['party drinks', 'perry'],
    'sauces, mustards & dressings': ['sauces', 'mustards', 'dressings', 'condiments'],
    'fruit juice & drinks': ['fruit juice', 'juice'],
    'squash & other soft drinks': ['squash', 'cordial'],
    'reusable bags': ['bags', 'carrier bags']
};

export function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export function matchesRangeCategory(sectionCategory: string, rangeCategory: string): { matched: boolean, reason?: string } {
    // Improved normalization: handle ampersands and collapse spaces
    const normalize = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/\s+/g, ' ').trim();
    const sectionNorm = normalize(sectionCategory);
    const rangeNorm = normalize(rangeCategory);

    // 1. Direct match ONLY - Range category appears as whole word in Section
    // (Disabled reverse matching as it causes too many false positives)
    try {
        const rangeRegex = new RegExp(`\\b${escapeRegExp(rangeNorm)}\\b`);
        if (rangeRegex.test(sectionNorm)) return { matched: true, reason: `Direct match: "${rangeNorm}" in "${sectionNorm}"` };
    } catch (e) {
        // Fallback for invalid regex - require exact match only
        if (sectionNorm === rangeNorm) return { matched: true, reason: 'Exact match' };
    }

    // 2. Dictionary lookup
    for (const [key, aliases] of Object.entries(CATEGORY_MAPPINGS)) {
        const keyNorm = normalize(key);
        if (rangeNorm === keyNorm || rangeNorm.includes(keyNorm) || keyNorm.includes(rangeNorm)) {
            for (const alias of aliases) {
                const aliasNorm = normalize(alias);
                const aliasRegex = new RegExp(`\\b${escapeRegExp(aliasNorm)}\\b`);
                if (aliasRegex.test(sectionNorm)) return { matched: true, reason: `Dictionary key: "${key}" (alias "${alias}")` };
            }
        }
    }

    return { matched: false };
}
