const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const countsRegex = /assets: managedAssets.length,\n            deck: exportDeck.itemIds.length/;
content = content.replace(countsRegex, "assets: managedAssets.length,\n            jobs: jobs.length,\n            deck: exportDeck.itemIds.length");

fs.writeFileSync('src/App.tsx', content);
console.log('App.tsx counts updated');
