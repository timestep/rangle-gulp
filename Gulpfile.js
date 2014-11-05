var gulp = require('gulp');
var rg = require('./src/rangle-gulp');

var exec = require('child_process').exec;

var allScripts = ['src/*.js', 'test-data/**/*.js'];

gulp.task('karma', rg.karma({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('karma-watch', rg.karmaWatch({
  // files: specify which folders
  // karmaConf: specify which karma config file
}));

gulp.task('webdriver-update', rg.webdriverUpdate(

));

gulp.task('protractor', rg.protractor(
  // files: test files containing protractor scenarios
  // baseUrl:
  // protractorConf: optional location of the protractor config file
));

gulp.task('lint', rg.jshint({
  files: allScripts
}));

gulp.task('beautify', rg.beautify({
  files: allScripts
}));

gulp.task('dev', rg.nodemon({
  onChange: ['lint'] // or ['lint', 'karma']
}));

gulp.task('styles', function() {
  rg.sass({
    source: './test-data/scss/app.scss',
    destination: './test-data/css/'
  });
});

gulp.task('watch', ['styles'], function() {
  gulp.watch('./test-data/**/*.scss', ['styles']);
});

// Example dev task if you are building a Cordova app
gulp.task('dev-cordova', ['watch'], function(options) {
  'use strict';

	// Start a connect server
	// Watch for changes to html & js files
	// Re-load browser (make sure you install live-reload
	// extension for your browser)
	rg.connectWatch({
		root : 'test-data',
		port : 3000,
		livereload : true,
  	// Files to watch for live re-load
		glob : ['./test-data/*.html', './test-data/*.js']
	});
});

gulp.task('icons', function() {
  'use strict';

  var params = {
    project: 'Test App',
    iconSrc: './test-data/icon.png',
    platforms: ['ios', 'android']
  };

  exec('mkdir -p \"platforms/ios/' + params.project + '/Resources/icons\"');
  exec('mkdir -p \"platforms/android/res/drawable\"');
  exec('mkdir -p \"platforms/android/res/drawable-ldpi\"');
  exec('mkdir -p \"platforms/android/res/drawable-mdpi\"');
  exec('mkdir -p \"platforms/android/res/drawable-hdpi\"');
  exec('mkdir -p \"platforms/android/res/drawable-xhdpi\"');

  rg.cordovaIcons(params)();
});

gulp.task('default', ['lint']);
