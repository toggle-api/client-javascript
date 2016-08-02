var fs = require('fs');
var mkdirp = require('mkdirp');

var pkg = require('../package.json');

delete pkg.scripts;
delete pkg.devDependencies;

var cjsPkg = Object.assign({}, pkg, {
  main: 'index.js',
  typings: 'index.d.ts'
});

function copyFile(from, to) {
  fs.writeFileSync(to, fs.readFileSync(from).toString());
}

fs.writeFileSync('dist/cjs/package.json', JSON.stringify(cjsPkg, null, 2));
copyFile('LICENSE.txt', 'dist/cjs/LICENSE.txt');
copyFile('README.md', 'dist/cjs/README.md');

mkdirp.sync('dist/cjs/bundles');
copyFile('dist/global/toggle-api.umd.js', 'dist/cjs/bundles/toggle-api.umd.js');
copyFile('dist/global/toggle-api.umd.min.js', 'dist/cjs/bundles/toggle-api.umd.min.js');
copyFile('dist/global/toggle-api.umd.min.js.map', 'dist/cjs/bundles/toggle-api.umd.min.js.map');
