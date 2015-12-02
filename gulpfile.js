var gulp = require('gulp');
var eslint = require('gulp-eslint');
var jsdoc = require("gulp-jsdoc");
var protractor = require('gulp-angular-protractor');

gulp.task('test-client', function() {
  gulp
    .src('test/client/**/*.js')
    .pipe(protractor({
      autoStartStopServer: false,
      configFile: 'protractor.js',
      args: ['--baseUrl', 'http://localhost:3000']
    }))
    .on('error', function(e) { throw e; });
});

gulp.task('docs', function() {
  gulp
    .src(["app/**/*.js", 'package.json', 'README.md'])
    .pipe(jsdoc('docs'))
});

gulp.task('lint', function () {
  gulp
    .src(['app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});
