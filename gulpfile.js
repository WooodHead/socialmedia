var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

gulp.task('test-api', function() {
  gulp
    .src('routes/**/*.js')
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp
        .src('test/api/**/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports());
    });
});
