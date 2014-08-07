This is an NPM package that adds a few helper functions to make it even easier
to setup common Gulp tasks.

Your Gulpfile.js would look something like this:

    var gulp = require('gulp');
    var rg = require('rangle-gulp');

    // Set up a karma task with default paths.
    gulp.task('karma', rg.karma());

    // Set up a jshint task for folder foo.
    gulp.task('lint-foo', rg.jshint({
      files: ['foo/**/*.js']
    }));

# Available Functions

All functions take an optional parameter "options". For most functions
"options.files" specifies which files to run. It can be omitted if you want to
go with the default.

The default settings assume the project shown below.

Client side:

    client/app/ - client-side code (*.js) and unit tests (*.test.js).
    client/tests/karma.conf.js - karma configuration file.
    client/tests/mocha.conf.js - mocha configuration for client-side unit test.

    client/server/app.js - server's app file.
    client/server/lib/ - additional server-side code and unit tests.
    .jsbeautifyrc - JSBeautify configurations.
    .jshintrc - JSHint configurations.


## karma(options)

Set up a Karma task. Use "options.karmaConf" if you want to specify a path to
the Karma config file. Use "options.vendor" to specify the location of
angular.js, angular-mocks.js and sinon-chai.js.

## karmaWatch(options)

Set up a karma task to run when file content changes.

## webDriverUpdate(options)

Set up a Protractor web driver update task.

## protractor(options)

Set up a Protractor task. Use "options.protractorConf" if you want to specify a path to
the Protractor config file.


## mocha(options)

Set up a Mocha task. Use this for server-side unit testing.

## jshint(options)

Set up a JSHint task

## beautify(options)

Set up a JSBeautify task. Use "options.configFile" if you want to specify a
config file other than ".jsbeautifyrc".

## nodemon()

Sets up a nodemon task. Use "options.onChange" to provide an array of task
names for tasks that should run on file change. (The default is just lint.)

## sass(options)

Sets up a sass task that watches for changes, compiles sass to css and then minifies the css. The task requires source (array of source locations) and destination location to be passed in as options. 

## connectWatch(options)

Starts a connect server which watches for changes to html & js files. It re-loads browser (make sure you install live-reload extension for your browser). The options can set `root` (folder path) `port`, `livereload` (boolean) and `glob` (arrary of source locations).

# Logging

You can turn on control logging using setLogLevel(). E.g.:

    rg.setLogLevel('debug');
