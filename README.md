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

## karma(options)

Set up a Karma task. Use "options.karmaConf" if you want to specify a path to
the Karma config file.

## karmaWatch(options)

Set up a karma task to run when file content changes.

## jshint(options)

Set up a JSHint task

## beautify(options)

Set up a JSBeautify task. Use "options.configFile" if you want to specify a
config file other than ".jsbeautifyrc".

## nodemon()

Sets up a nodemon task. Use "options.onChange" to provide an array of task
names for tasks that should run on file change. (The default is just lint.)
