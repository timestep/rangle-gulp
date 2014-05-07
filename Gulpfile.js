var gulp = require('gulp');
var rg = require('./src/rangle-gulp');

gulp.task('karma', rg.karma({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('karma-watch', rg.karmaWatch({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('lint', rg.jshint({
  files: ['src/*.js']
}));

gulp.task('beautify', rg.beautify({
  // files: specify which files
}));

gulp.task('dev', rg.nodemon({
  onChange: ['lint'] // or ['lint', 'karma']
}));

gulp.task('default', ['lint']);