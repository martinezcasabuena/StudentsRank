var fs = require('fs');
var browserify = require('browserify');
var gulp = require('gulp');
//var webserver = require('gulp-webserver');
var nodemon = require('gulp-nodemon');
var $ = require('gulp-load-plugins')({ lazy: true });
var jsdoc = require('gulp-jsdoc3');
//var jshint = require('gulp-jshint');

if (!fs.existsSync('dist')){
  fs.mkdirSync('dist');
}

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function() {
  //log('Analyzing source with JSHint and JSCS');
  return gulp
    .src('./src/client/*')
    //.pipe($.if(args.verbose, $.print()))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
    .pipe($.jshint.reporter('fail'))
    .pipe($.jscs())
    .pipe($.jscs.reporter());
});

/**
 * $ gulp
 * description: Generate automatically all development documentation using jsdoc
 */

gulp.task('doc', function (cb) {
  var config = require('./jsdoc.json');
  gulp.src(['README.md','./src/**/*.js'], {read: false})
    .pipe(jsdoc(config, cb));
});

///babelify, es6 to es5
gulp.task('browserify', function() {
  browserify('./src/client/main.js')
  .transform('babelify', {presets: ['env']})
  .bundle()
  .pipe(fs.createWriteStream('dist/main.js'));
});

gulp.task('webserver', function () {
  var stream = nodemon({
    script: 'src/server/app.js',
    ext: 'js html css',
    env: { 'NODE_ENV': 'development' }
  })
  stream
    .on('restart',function() {
      console.log('restarted');
    })
    
    .on('crash',function() {
      console.error('App has crashed!\n');
      stream.emit('restart',10); //restart the server in 10 seconds
    })
})

// watch any change
gulp.task('watch', ['browserify'], function () {
  gulp.watch('./src/client/**/*.js', ['browserify']);
});
gulp.task('default', ['browserify','doc', 'webserver', 'watch']);
