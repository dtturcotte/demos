'use strict';

var gulp  = require('gulp');
var nodemon  = require('gulp-nodemon');

gulp.task('serve', function () {
	nodemon({
		script: 'app.js',
	}).on('restart', function () {
      console.log('Server restarted...')
    })
});
