let browserify = require('browserify');
let ClosureCompiler = require("closurecompiler");
let fs = require('fs');

function bundle(inFile, outFile) {
  let stream = fs.createWriteStream(outFile);
  browserify(inFile, {
    baseDir: 'dist',
    standalone: 'toggle_api'
  }).
      ignore('./dist/clients/http/node.js').
      bundle().
      pipe(stream);
  console.log('Building "' + inFile + '" into "' + outFile + '"');

  let minOutFile = outFile.replace(/\.js$/, '.min.js');
  stream.on('finish', () => {
    ClosureCompiler.compile([outFile],{
      language_in: 'ECMASCRIPT5_STRICT',
      compilation_level: 'ADVANCED_OPTIMIZATIONS',
      create_source_map: minOutFile + '.map'
    },
    function (err, result) {
      if (result) {
        fs.writeFile(minOutFile, result, (err) => {
          if (err) {
            throw err;
          }
          console.log('Minified "' + outFile + '" to ' + result.length + ' characters.');
        });
      } else {
        throw err;
      }
    });
    console.log('Minifying "' + outFile + '"');
  });
}

bundle('dist/index.js', 'dist/bundles/toggle-api.umd.js');
