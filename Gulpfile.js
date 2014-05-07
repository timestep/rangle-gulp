var gulp = require('gulp');
var rg = require('./src/rangle-gulp');

var allScripts = ['src/*.js', 'test-data/**/*.js'];

gulp.task('karma', rg.karma({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('karma-watch', rg.karmaWatch({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('lint', rg.jshint({
  files: allScripts
}));

gulp.task('beautify', rg.beautify({
  files: allScripts
}));

gulp.task('dev', rg.nodemon({
  onChange: ['lint'] // or ['lint', 'karma']
}));

gulp.task('default', ['lint']);