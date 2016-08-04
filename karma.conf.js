module.exports = function(config) {
  var extraReporters = [];

  if (process.env.CIRCLE_TEST_REPORTS) {
    extraReporters.push('junit');
  }

  config.set({
    basePath: '',
    frameworks: ['systemjs', 'mocha'],
    files: [
      'spec/*-spec.ts',
      'spec/**/*-spec.ts'
    ],
    systemjs: {
      serveFiles: [
        'node_modules/plugin-typescript/lib/*.js',
        'node_modules/typescript/lib/typescript.js',
        'node_modules/chai/chai.js',
        'node_modules/semver/semver.js',
        'node_modules/crypto-js/*.js',
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
          'systemjs': 'node_modules/systemjs/dist/system.js',
          'system-polyfills': 'node_modules/systemjs/dist/system-polyfills.js',
          'es6-module-loader': 'node_modules/es6-module-loader/dist/es6-module-loader.js',
          'typescript': 'node_modules/typescript/',
          'chai': 'node_modules/chai/chai.js',
          'semver': 'node_modules/semver/semver.js',
          'crypto-js/': 'node_modules/crypto-js/',
          'plugin-typescript': 'node_modules/plugin-typescript/lib/'
        },
        packages: {
          'src': {
            defaultExtension: 'ts'
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
