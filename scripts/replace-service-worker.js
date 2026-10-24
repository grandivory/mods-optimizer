// react-scripts always generates a precaching service-worker.js during a production build. The app no longer
// registers a service worker, but browsers that installed one from an earlier build will keep using it until
// it is replaced, so overwrite the generated worker with one that removes itself.
const fs = require('fs');
const path = require('path');

const source = path.join(__dirname, 'self-destroying-service-worker.js');
const target = path.join(__dirname, '..', 'build', 'service-worker.js');

fs.copyFileSync(source, target);
console.log('Replaced build/service-worker.js with a self-destroying service worker.');
