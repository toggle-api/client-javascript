var fs = require('fs');
var mkdirp = require('mkdirp');

var pkg = require('../package.json');

delete pkg.scripts;
delete pkg.devDependencies;

var distPkg = Object.assign({}, pkg, {
  main: 'index.js',
  typings: 'index.d.ts'
});

function copyFile(from, to) {
  fs.writeFileSync(to, fs.readFileSync(from).toString());
}

fs.writeFileSync('dist/package.json', JSON.stringify(distPkg, null, 2));
copyFile('LICENSE.txt', 'dist/LICENSE.txt');
copyFile('README.md', 'dist/README.md');
