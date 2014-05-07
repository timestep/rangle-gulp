'use strict';

/* global require */
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var beautify = require('gulp-js-beautify');
var karma = require('gulp-karma');
var nodemon = require('gulp-nodemon');
var fs = require('fs');
// var lr = require('tiny-lr');
// var server = lr();

var defaults = {};

defaults.clientScripts = [
  'client/app/**/*.js',
  'client/app/*.js'
];

defaults.serverScripts = [
  'server/app.js',
  'server/lib/**/*.js'
];

defaults.allScripts = defaults.clientScripts.concat(defaults.serverScripts);

defaults.clientTestScripts = [
  // 3rd party code
  'client/components-bower/angular/angular.js',
  'client/components-bower/angular-mocks/angular-mocks.js',
  'client/components-bower/koast/client/src/**/*.js',

  // app and test code
  'client/app/**/*.js'
];

// Makes a task that runs or watches client-side tests using Karma.
function makeKarmaTask(action, options) {
  options = options || {};
  return function () {
    // Be sure to return the stream
    return gulp.src(options.files || defaults.clientTestScripts)
      .pipe(karma({
        configFile: options.karmaConf || 'client/tests/karma.conf.js',
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

// Makes a task that runs the server in dev mode.
exports.nodemon = function (options) {
  options = options || {};
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
        console.log('--- Restarted the server ---');
      });
  };
};