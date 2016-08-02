var browserify = require('browserify');
var fs = require('fs');

var b = browserify('dist/cjs/index.js', {
  baseDir: 'dist/cjs',
  standalone: 'toggle_api'
});
b.bundle().pipe(fs.createWriteStream('dist/global/toggle-api.umd.js'));
