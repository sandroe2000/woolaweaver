(() => {

  'use strict';

  const gulp = require('gulp');
  const browsersync   = require('browser-sync').create();

  const files = [
    './*.html',
    './source/js/*.js',
    './source/css/*.css'
  ];
  
  function watch (){
    browsersync.init({
      server: {
        baseDir   : './',
        index     : 'index.html'
      },
      port        : 3000,
      open        : false
    });
  }
  
  gulp.watch(files).on('change', browsersync.reload);
  const dev = gulp.series(watch);

  exports.default = dev;

})();