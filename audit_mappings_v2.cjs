const fs = require('fs');

// 1. Read referenceLayout.ts and extract all unique categories
const layoutPath = '/Users/nikicooke/store map editor/src/constants/referenceLayout.ts';
const layoutContent = fs.readFileSync(layoutPath, 'utf8');

const categoryRegex = /"category":\s*"([^"]+)"/g;
const validCategories = new Set();
let match;

while ((match = categoryRegex.exec(layoutContent)) !== null) {
    validCategories.add(match[1].toLowerCase());
}

console.log(`Found ${validCategories.size} unique valid categories in referenceLayout.ts.`);

// 2. Read defaultCategoryMappings.ts
const mappingPath = '/Users/nikicooke/store map editor/src/constants/defaultCategoryMappings.ts';
const mappingContent = fs.readFileSync(mappingPath, 'utf8');

// Extract mappings object roughly
const mappingRegex = /"([^"]+)":\s*"([^"]+)"/g;
const mappings = {};

while ((match = mappingRegex.exec(mappingContent)) !== null) {
    if (match[1] === "export const DEFAULT_CATEGORY_MAPPINGS") continue;
    mappings[match[1]] = match[2];
}

console.log(`Found ${Object.keys(mappings).length} mappings to check.\n`);

// 3. Audit
const invalidMappings = [];

for (const [key, value] of Object.entries(mappings)) {
    if (value === 'IGNORE_ITEM') continue;

    const targetCategories = value.split('|');
    const allTargetsValid = targetCategories.every(target => {
        const t = target.trim().toLowerCase();

        // Exact match
        if (validCategories.has(t)) return true;

        // Substring match (Valid category contains target, or Target contains valid category)
        for (const valid of validCategories) {
            if (valid.includes(t)) return true;
        }
        return false;
    });

    if (!allTargetsValid) {
        invalidMappings.push(`${key} -> "${value}"`);
    }
}

if (invalidMappings.length > 0) {
    console.log("Remaining Invalid Mappings:");
    invalidMappings.forEach(m => console.log(m));
} else {
    console.log("All mappings are valid!");
}
