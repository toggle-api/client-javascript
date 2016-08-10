module.exports = function(config) {
  var extraReporters = [];

  if (process.env.CIRCLE_TEST_REPORTS) {
    extraReporters.push('junit');
  }

  config.set({
    basePath: '',
    frameworks: ['systemjs', 'mocha'],
    files: [
      'spec/setup.ts',
      'spec/*-spec.ts',
      'spec/**/*-spec.ts'
    ],
    ignoreFiles: [
      'spec/clients/http/node.ts'
    ],
    systemjs: {
      serveFiles: [
        // systemjs, missing default serves
        'node_modules/systemjs/dist/system*.*',
        'node_modules/es6-module-loader/dist/es6-module-loader.*',
        // typescript
        'node_modules/plugin-typescript/lib/*.js',
        'node_modules/typescript/lib/typescript.js',
        // assertion libraries
        'node_modules/chai/chai.js',
        'node_modules/chai-as-promised/lib/chai-as-promised.js',
        // dependencies
        'node_modules/semver/semver.js',
        'node_modules/crypto-js/*.js',
        // code
        'tsconfig.json',
        'src/**/*.ts',
        'spec/**/!(*-spec.ts)'
      ],
      config: {
        transpiler: 'plugin-typescript',
        typescriptOptions: {
          tsconfig: true
        },
        paths: {
          // systemjs
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
          // typescript
          'typescript': 'node_modules/typescript/',
          'plugin-typescript': 'node_modules/plugin-typescript/lib/',
          // assertion libraries
          'chai': 'node_modules/chai/chai.js',
          'chai-as-promised': 'node_modules/chai-as-promised/lib/chai-as-promised.js',
          // dependencies
          'semver': 'node_modules/semver/semver.js',
          'crypto-js/': 'node_modules/crypto-js/'
        },
        packages: {
          'src': {
            defaultExtension: 'ts',
            map: {
              './clients/http/node': '@empty'
            }
          },
          'crypto-js': {
            defaultExtension: "js"
          },
          'plugin-typescript': {
            main: 'plugin'
          },
          "typescript": {
            "main": "lib/typescript.js",
            "meta": {
              "lib/typescript.js": {
                "exports": "ts"
              }
            }
          }
        }
      }
    },
    reporters: ['dots'].concat(extraReporters),
    junitReporter: {
      outputDir: process.env.CIRCLE_TEST_REPORTS
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
};
