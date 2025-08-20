// Run this script with `node add-uuids-to-category-tree.js` in your project root
// It will output a new category tree with UUIDs for every node

const { randomUUID } = require('crypto');
const fs = require('fs');
const path = require('path');

// Load the original category tree (adjust the path if needed)
const categoryTree = require('./src/components/dashboard/catalog-uploads/bulk/category-tree.js');

function addUUIDsToCategoryTree(node) {
  if (node === null) return null;
  const newNode = { id: randomUUID() };
  for (const key in node) {
    newNode[key] = addUUIDsToCategoryTree(node[key]);
  }
  return newNode;
}

const categoryTreeWithIds = addUUIDsToCategoryTree(categoryTree);

// Output to a new file
fs.writeFileSync(
  path.join(__dirname, 'category-tree-with-ids.json'),
  JSON.stringify(categoryTreeWithIds, null, 2)
);

console.log('Done! Output written to category-tree-with-ids.json');
