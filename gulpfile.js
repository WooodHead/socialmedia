var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nodemon = require('gulp-nodemon');
var eslint = require('gulp-eslint');
var protractor = require('gulp-angular-protractor');

gulp.task('default', function() {
  nodemon({ script: 'bin/www' });
});

gulp.task('start-testing-server', function() {
  // TODO: Find a way to stop the server after the tests are run
  nodemon({ script: 'bin/www', env: { 'NODE_ENV': 'test' } });
});

gulp.task('test-server', function() {
  gulp
    .src('routes/**/*.js')
    .pipe(istanbul({ includeUntested: true }))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp
        .src('test/server/**/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports());
    });
});

gulp.task('test-client', ['start-testing-server'], function() {
  gulp
    .src('test/client/**/*.js')
    .pipe(protractor({
      autoStartStopServer: false,
      configFile: 'protractor.js',
      args: ['--baseUrl', 'http://localhost:3000']
    }))
    .on('error', function(e) { throw e; });
});

gulp.task('lint', function () {
  gulp
    .src(['app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});
