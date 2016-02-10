var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var spritesmith = require('gulp.spritesmith');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var merge = require('merge-stream');

gulp.task('sass', function() {
  return gulp.src('kidsncode_web/assets/stylesheets/application.sass')
    .pipe(sass())
    .pipe(autoprefix())
    .pipe(gulp.dest('kidsncode_web/static'));
});

gulp.task('js', function(){
  return gulp.src('kidsncode_web/assets/javascripts/*.js')
    .pipe(concat('application.js'))
    .pipe(gulp.dest('kidsncode_web/static'));
});

gulp.task('sprite', function () {
  var data = gulp.src('kidsncode_web/assets/images/chunks/*.png').pipe(spritesmith({
    retinaSrcFilter: 'kidsncode_web/assets/images/chunks/*@2x.png',
    retinaImgName: 'sprite@2x.png',
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    algorithm: 'top-down'
  }));
  var cssStream = data.css.pipe(gulp.dest('kidsncode_web/static/'));
  var imgStream = data.img.pipe(gulp.dest('kidsncode_web/static/'));
  return merge(imgStream, cssStream);
});

gulp.task('watch', function() {
  gulp.watch('kidsncode_web/assets/stylesheets/**/*.sass', ['sass']);
  gulp.watch('kidsncode_web/assets/javascripts/**/*.js', ['js']);
});

gulp.task('default', ['sass', 'js', 'watch', 'sprite']);