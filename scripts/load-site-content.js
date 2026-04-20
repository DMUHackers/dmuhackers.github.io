const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadSiteContent(rootDir) {
  const root = rootDir || path.resolve(__dirname, '..');
  const source = fs.readFileSync(path.join(root, 'data/site-content.js'), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: 'data/site-content.js' });
  return sandbox.window.DMU_SITE_CONTENT;
}

module.exports = { loadSiteContent };
