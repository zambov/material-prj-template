var gulp = require('gulp')
  , connect = require('gulp-connect')
  , inject = require('gulp-inject')
  , clean = require('gulp-clean')
  , jshint = require('gulp-jshint')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , imagemin = require('gulp-imagemin')
  , gutil = require('gulp-util');


var bases = {
  app: 'app/',
  dist: './dist/',
};

var paths = {
  scripts: ['src/**/*.js'],
  styles: ['src/assets/css/*.css'],
  dependencies: ['bower_components/**/*.*'],
  html: ['src/**/*.html'],
  images: ['src/assets/images/**/*.*'],
  extras: []
};

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(bases.dist)
 .pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
 gulp.src(paths.scripts)
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat('app.min.js'))
 .pipe(gulp.dest(bases.dist + 'scripts/'));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
 gulp.src(paths.images, {cwd: bases.app})
 .pipe(imagemin())
 .pipe(gulp.dest(bases.dist + 'images/'));
});

// Copy all other files to dist directly
gulp.task('copy-html', ['clean'], function() {
 // Copy html
 return gulp.src(paths.html)
 .pipe(gulp.dest(bases.dist));
});

gulp.task('copy-styles', ['clean'], function() {
  // Copy Fonts
  return gulp.src(paths.styles)
  .pipe(gulp.dest(bases.dist + 'styles'));
});

gulp.task('copy-dependencies', ['clean'], function() {
  // Copy dependencies
  return gulp.src(paths.dependencies)
  .pipe(gulp.dest(bases.dist + 'dependencies'));
});

gulp.task('copy-styles', ['clean'], function() {
  // Copy styles
  return gulp.src(paths.styles)
  .pipe(gulp.dest(bases.dist + 'styles'));
});

gulp.task('copy', ['copy-html', 'copy-dependencies', 'copy-styles']);

gulp.task('inject-lib', ['copy'], function injectLib(){
    return gulp.src('./dist/index.html')
      .pipe(inject(gulp.src([
        './dist/dependencies/angular/angular.min.js',
        './dist/dependencies/angular-animate/angular-animate.min.js',
        './dist/dependencies/angular-aria/angular-aria.min.js',
        './dist/dependencies/angular-material/angular-material.min.js',
        './dist/dependencies/angular-material/angular-material.min.css',
        './dist/styles/*.css'
        ], {
            read: false
        }),
        {
           relative: true }
        ))
      .pipe(gulp.dest('./dist'));
});

gulp.task('webserver', ['inject-lib'], function() {
  connect.server({
    root: 'dist',
    port: 8000,
    base: 'http://localhost',
    livereload: true
  });
});

gulp.task('default', ['clean', 'scripts', 'imagemin', 'copy', 'inject-lib']);
gulp.task('serve', ['clean', 'scripts', 'imagemin', 'copy', 'inject-lib', 'webserver'], function() {

    gulp.watch(['./src/*.*'], ['default']);

});
