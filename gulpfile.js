'use strict';

var gulp = require( 'gulp' );
var connect = require( 'gulp-connect' );
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var stripCssComments = require('gulp-strip-css-comments');
var files = [
  '*.html',
  'template/*.*',
  'source/**/*.*'
];

gulp.task('minify-js', function () {
    gulp.src([
      'source/js/l*js'
    ])
    .pipe(concat('wweaver.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('js/'));
});

gulp.task('minify-css', function(){
    gulp.src([
      'source/css/*.css'
    ])
    .pipe(concat('wweaver.min.css'))
    .pipe(stripCssComments({all: true}))
    .pipe(cssmin())
    .pipe(gulp.dest('css/'));
});

gulp.task( 'files', function() {
  gulp.src(files)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(files, ['files', 'minify-js', 'minify-css']);
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('default', ['connect', 'watch', 'minify-js', 'minify-css']);