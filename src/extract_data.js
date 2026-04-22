
const fs = require('fs');
const path = require('path');

const filePath = 'd:\\Code làm việc\\test\\Albion\\src\\store\\data.ts';
const content = fs.readFileSync(filePath, 'utf-8');

const regex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*detail:\s*(?:`([^`]+)`|'([^']+)')/g;

let match;
const items = {};

while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    const detail = (match[3] || match[4] || '').trim();
    if (detail) {
        items[id] = { name, detail };
    }
}

fs.writeFileSync('d:\\Code làm việc\\test\\Albion\\src\\items.json', JSON.stringify(items, null, 2), 'utf8');
console.log("Done");
