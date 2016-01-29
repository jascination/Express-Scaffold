'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var watch = require('gulp-watch');
var less = require('gulp-less');
var concat = require('gulp-concat');
var lib = require('bower-files')();
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var gutil = require('gulp-util');




var BROWSER_SYNC_RELOAD_DELAY = 500;


gulp.task('bowerJS', function() {
  del(['./public/js/lib.min.js']).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
    gulp.src(lib.ext('js').files)
        .pipe(concat('lib.min.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('./public/js'));
  });
});



gulp.task('bowerCSS', function() {
    del(['./public/css/lib.min.css']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        gulp.src(lib.ext('css').files)
            .pipe(concat('lib.min.css'))
            .pipe(gulp.dest('./public/css'));
    });
});



gulp.task('less', function() {
    gulp.src('./public/css/*.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('nodemon', function(cb) {
    var called = false;
    return nodemon({
            script: 'app.js',
            watch: ['app.js', 'routes/**.js', 'config/*.js', 'app/**/*.js']
        })
        .on('start', function onStart() {

            if (!called) {
                cb();
            }
            called = true;
        })
        .on('restart', function onRestart() {

            setTimeout(function reload() {
                browserSync.reload({
                    stream: false //
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
});


gulp.task('watch', function() {
    gulp.watch('./public/css/*.less', ['less']);
});

gulp.task('browser-sync', ['nodemon', 'bowerJS', 'bowerCSS', 'less', 'watch'], function() {
    browserSync.init({
        files: ['public/js/*.js', 'public/js/vendor/*.js', 'public/css/*.css', 'views/**/*.jade'],
        proxy: 'https://127.0.0.1:1234',
        port: 4000,
        browser: ['google-chrome']
    });
});

gulp.task('default', ['browser-sync']);
