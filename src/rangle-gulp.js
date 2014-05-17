/* global require, console */

'use strict';

/* global require */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var beautify = require('gulp-js-beautify');
var karma = require('gulp-karma');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulpFilter = require('gulp-filter');
var nodemon = require('gulp-nodemon');
var winston = require('winston');
var fs = require('fs');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var colors = require('colors');
var minifyCSS = require('gulp-minify-css');
var watch = require('gulp-watch');
// var lr = require('tiny-lr');
// var server = lr();

var defaults = {};

// Set up logger.
function makeLogger(level) {
  return new(winston.Logger)({
    transports: [
      new(winston.transports.Console)({
        level: level
      }),
    ]
  });
}
var logger = makeLogger('info');

defaults.clientScripts = [
  'client/app/**/*.js'
];

defaults.serverScripts = [
  'server/app.js',
  'server/lib/**/*.js'
];

defaults.allScripts = defaults.clientScripts.concat(defaults.serverScripts);

defaults.clientTestScripts = [
  // app and test code
  'client/app/**/*.js'
];

defaults.serverTestScripts = [
  'server/lib/**/*.test.js'
];

// Makes a task that runs or watches client-side tests using Karma.
function makeKarmaTask(action, options) {
  options = options || {};
  var files = options.vendor || [];
  files = files.concat(options.files || defaults.clientTestScripts);

  logger.debug('Setting up a karma task to run on the following files:');
  files.forEach(function (file) {
    logger.debug('  ', file);
  });

  return function () {
    // Be sure to return the stream
    return gulp.src(files)
      .pipe(karma({
        configFile: options.karmaConf || 'client/testing/karma.conf.js',
        action: action
      }))
      .on('error', function (err) {
        // Make sure failed tests cause gulp to exit non-zero
        throw err;
      });
  };
}

// Makes a task that runs Karma.
exports.karma = function (options) {
  options = options || {};
  return makeKarmaTask('run', options);
};

// Makes a task that runs Karma in watch mode.
exports.karmaWatch = function (options) {
  options = options || {};
  return makeKarmaTask('watch', options);
};

// Makes a task that runs Mocha. (Use this for server-side tests.)
exports.mocha = function (options) {
  options = options || {};
  var files = options.files || defaults.serverTestScripts;
  return function () {
    gulp.src(files)
      .pipe(mocha({
        reporter: 'nyan'
      }))
      .on('end', function () {
        console.log('Donnnn');
      });
  };
};

// Makes a task that runs JSHint on all script files.
exports.jshint = function (options) {
  options = options || {};
  return function () {
    gulp.src(options.files || defaults.allScripts)
      .pipe(jshint())
      .pipe(jshint.reporter('default'));
  };
};

// Makes a task that runs JSBeautify on all script and test files.
exports.beautify = function (options) {
  options = options || {};
  var jsBeautifyConfigFile = options.configFile || '.jsbeautifyrc';
  var jsBeautifyConfig = JSON.parse(fs.readFileSync(jsBeautifyConfigFile));
  var files = options.files || defaults.allScripts;
  return function () {
    files.forEach(function (path) {
      var dir = path.split('/')[0];
      gulp.src([path])
        .pipe(beautify(jsBeautifyConfig))
        .pipe(gulp.dest(dir));
    });
  };
};

// Makes a task that runs JSBeautify on all script and test files.
exports.concatAndUglify = function (options) {
  options = options || {};
  var name = options.name || 'all';
  var distFolder = options.dest || 'client/dist';
  var filter = gulpFilter(function (file) {
    return !/\.test\.js$/.test(file.path);
  });
  return function () {
    gulp.src(options.files || defaults.clientScripts)
      .pipe(filter)
      .pipe(concat(name + '.js'))
      .pipe(gulp.dest(distFolder))
      .pipe(rename(name + '.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest(distFolder));
  };
};

// Makes a task that runs the server in dev mode.
exports.nodemon = function (options) {
  options = options || {};

  // if (options.workingDirectory) {
  //   process.chdir(options.workingDirectory);
  // }

  var nodemonOptions = {
    script: 'server/app.js',
    ext: 'html js css',
    ignore: ['ignored.js']
  };
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      nodemonOptions[key] = options[key];
    }
  }
  return function () {
    nodemon(nodemonOptions)
      .on('change', options.onChange || ['lint'])
      .on('restart', function () {
        logger.info('--- Restarted the server ---');
      });
  };
};

// Sets log level for the task setup process.
exports.setLogLevel = function (level) {
  logger = makeLogger(level);
};

// Watch and compile sass: requires a source and destination
exports.sass = function(options) {
  options = options || {};
  var source = options.source || 
    ['./test-data/scss/**/*.scss', './test-data/scss/*.scss'];
  var destination = options.destination || './www/css';
  
  console.log('[SASS] recompiling'.yellow);
  gulp.src(source)
    .pipe(watch())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(destination))
    .pipe(connect.reload());
  console.log('[CSS] minifying'.yellow);
};

// Start a connect server and setup live reload
exports.connectWatch = function (options) {
  options = options || {};
  var root = options.root || 'www';
  var port = options.port || 3000;
  var livereload = options.livereload || true;
  // Files to watch for live re-load
  var glob = options.glob || ['./www/**/*.html', './www/**/*.js'];

  connect.server({
    root: root,
    port: port,
    livereload: livereload
  });

  console.log('[CONNECT] Listening on port 3000'.yellow.inverse);

  // Watch HTML and JS
  console.log('[CONNECT] Watching HTML and JS files for live-reload'.blue);
  watch({
    glob: glob
  })
    .pipe(connect.reload());
};