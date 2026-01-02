import fs from 'fs';
import path from 'path';

// 1. Read referenceLayout.ts and extract all unique categories
const layoutPath = '/Users/nikicooke/store map editor/src/constants/referenceLayout.ts';
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

const categoryRegex = /"category":\s*"([^"]+)"/g;
const validCategories = new Set<string>();
let match;

while ((match = categoryRegex.exec(layoutContent)) !== null) {
    validCategories.add(match[1].toLowerCase());
}

console.log(`Found ${validCategories.size} unique valid categories in referenceLayout.ts.`);
// console.log("Sample valids:", Array.from(validCategories).slice(0, 10));

// 2. Read defaultCategoryMappings.ts
const mappingPath = '/Users/nikicooke/store map editor/src/constants/defaultCategoryMappings.ts';
const mappingContent = fs.readFileSync(mappingPath, 'utf8');

// Extract mappings object roughly
const mappingRegex = /"([^"]+)":\s*"([^"]+)"/g;
const mappings: Record<string, string> = {};

while ((match = mappingRegex.exec(mappingContent)) !== null) {
    mappings[match[1]] = match[2];
}

console.log(`Found ${Object.keys(mappings).length} mappings to check.`);

// 3. Audit
const invalidMappings: string[] = [];
const fuzzyMappings: string[] = []; // Mappings that contain | or are not exact matches

for (const [key, value] of Object.entries(mappings)) {
    if (value === 'IGNORE_ITEM') continue;

    const targetCategories = value.split('|');
    const allTargetsValid = targetCategories.every(target => {
        const t = target.trim().toLowerCase();
        // Check for exact match
        if (validCategories.has(t)) return true;

        // Check for fuzzy match (substring) - simulating app logic
        // The app logic: if validCategory.includes(target) OR target.includes(validCategory) -> Match
        // But we want to be strict here. If we map "foo" to "bar", "bar" should be a real category or a substring of one.
        for (const valid of validCategories) {
            if (valid.includes(t) || t.includes(valid)) return true;
        }
        return false;
    });

    if (!allTargetsValid) {
        invalidMappings.push(`${key} -> "${value}"`);
    }
}

if (invalidMappings.length > 0) {
    console.log("\nPossible Invalid Mappings (Targets not found in layout):");
    invalidMappings.forEach(m => console.log(m));
} else {
    console.log("\nAll mappings appear to target valid categories or substrings.");
}
