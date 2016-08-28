'use strict';

var gulp  = require('gulp');
var nodemon  = require('gulp-nodemon');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('css', function() {
	return gulp.src('sass/main.scss')
		.pipe(sass({style: 'compressed'}))
		.pipe(autoprefixer('last 10 version'))
		.pipe(minifycss())
		.pipe(gulp.dest('build/css'));
});

gulp.task('serve', function () {
	nodemon({
		script: 'app.js'
	}).on('restart', function () {
		console.log('Server restarted...')
	})
});

gulp.task('build', function() {
	gulp.run('css');
	gulp.run('serve');
	gulp.watch('sass/**/*.scss', function() {
		gulp.run('css');
	});
});

