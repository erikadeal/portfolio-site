var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    buffer = require('gulp-buffer'),
    imagemin = require('gulp-imagemin'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    pngquant = require('imagemin-pngquant'),
    sass = require('gulp-sass'),
    source     = require('vinyl-source-stream'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

/* Output .scss files to compressed and prefixed CSS */
gulp.task('styles', function() {
    gulp.src('./sass/app.scss')
    	.pipe(
    		sass({ 
    			includePaths : ['./sass'] 
    		}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ style: 'expanded' }))
	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
	    .pipe(rename({suffix: '.min'}))
	    .pipe(minifycss())
        .pipe(gulp.dest('./css'));
});

/* Transform JS modules into a script */
gulp.task('scripts', function() {
  return browserify({entries:['./js/app.js']})
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(browserify().on('error', browserify.logError))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
});

/* Reduce images sizes */

gulp.task('images', function() {
    return gulp.src('img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('img/dist'));
});

/* Watch task for development */
gulp.task('watch', function() {
 	gulp.watch('sass/**/*.scss',['styles']);
 //	gulp.watch('js/**/*.js',['scripts']);
});

/* Default build task */
gulp.task('default', function() {
 	gulp.start('styles', 'images');
});