var fs = require("fs");
var browserify = require("browserify");
var gulp = require('gulp');
var webserver = require('gulp-webserver');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jsdoc = require('gulp-jsdoc3');

if (!fs.existsSync("dist")){
  fs.mkdirSync("dist");
}

//babelify, es6 to es5
gulp.task('browserify', function() {
browserify("./src/main.js")
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(fs.createWriteStream("dist/main.js"));
});

//http server live reload (html changes)
gulp.task('webserver', function() {
  gulp.src('./')
  .pipe(webserver({
    livereload: true,
    directoryListing: false,
    open: true
  }));
});

//Check the code with jshint
gulp.task('jshint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

//Task to launch jsdoc
gulp.task('doc', function (cb) {
  gulp.src(['README.md', './src/*.js'], {read: false})
      .pipe(jsdoc(cb));
});

// watch any change
gulp.task('watch', ['browserify'], function () {
    gulp.watch('./src/**/*.js', ['browserify']);
});

//Check the code with jscs
gulp.task('jscs', function() {
  gulp.src('./src/*.js')
    //.pipe(jscs({fix: true}))
    //.pipe(gulp.dest('src'));
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('default', ['browserify','doc','jshint','jscs','webserver', 'watch']);
