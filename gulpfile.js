(() => {

  'use strict';

  const gulp = require('gulp');
  const browsersync   = require('browser-sync').create();
  const proxy = require('http-proxy-middleware');

  const files = [
    './*.html',
    './source/js/*.js',
    './source/css/*.css'
  ];

  const jsonPlaceholderProxy = proxy(['/folders', '/files'], {
    target: 'http://localhost:8080',
    changeOrigin: true,
    logLevel: 'debug'
  });
  
  function watch (){
    browsersync.init({
      server: {
        baseDir: './',
        index: 'index.html',
        port: 3000,
        middleware: [jsonPlaceholderProxy]
      }
    });
  }
  
  gulp.watch(files).on('change', browsersync.reload);
  const dev = gulp.series(watch);

  exports.default = dev;

})();