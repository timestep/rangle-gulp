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

gulp.task('lint', rg.jshint({
  files: allScripts
}));

gulp.task('beautify', rg.beautify({
  files: allScripts
}));

gulp.task('dev', rg.nodemon({
  onChange: ['lint'] // or ['lint', 'karma']
}));

// Example dev task if you are building a Cordova app
gulp.task('dev-cordova', function(options) {
  'use strict';

	// Watch sass files
	// re-compile sass and minify css
	rg.sass({
		source : './test-data/scss/app.scss',
		destination : './test-data/css'
	});

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
    iconSrc: './test-data/icon.png'
  };

  exec('mkdir -p \"platforms/ios/' + params.project + '/Resources/icons\"');
  rg.cordovaIcons(params)();
});

gulp.task('default', ['lint']);
