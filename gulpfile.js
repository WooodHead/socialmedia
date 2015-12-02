var gulp = require('gulp');
var eslint = require('gulp-eslint');
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

gulp.task('lint', function () {
  gulp
    .src(['app/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format('stylish'))
    .pipe(eslint.failAfterError());
});
