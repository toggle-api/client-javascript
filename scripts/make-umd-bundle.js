var browserify = require('browserify');
var fs = require('fs');

var b = browserify('dist/index.js', {
  baseDir: 'dist',
  standalone: 'toggle_api'
});
b.bundle().pipe(fs.createWriteStream('dist/bundles/toggle-api.umd.js'));
