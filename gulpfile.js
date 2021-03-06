/**********************************************
** *** Developer: Debashis Roy Bhowmik *** ****
* *** Email: debashis.buet08@gmail.com *** ****
********* *** Website: debashis.me *** ********
* *** Github: https://github.com/wall-e-08/ ***
***********************************************/

const gulp = require('gulp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const auto_prefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browser_sync = require('browser-sync').create();


function style() {
    // scss file location
    return gulp.src('./src/scss/*.scss')

    // error message handler
		.pipe(plumber({
            // show notification
			errorHandler: notify.onError({
				title: 'SASS',
				message: 'Error: <%= error.message %>'
			})
        }))

    // init sourcemap package
        .pipe(sourcemaps.init())

    // pass scss files to sass compiler
        .pipe(sass({
            // outputStyle:'expanded'
            outputStyle:'compressed'
        }))

    // css prefix for browsers compatibility (browsers listed on package.json)
        .pipe(auto_prefixer())

    // rename output file
        .pipe(rename({suffix: '.min'}))

    // default behaviour for pipeline after it was piped
        .pipe(plumber.stop())

    // generate sourcemap file
        .pipe(sourcemaps.write('.'))

    // set compiled css file location
        .pipe(gulp.dest('./build/css'))

    // stream changes to browser
        .pipe(browser_sync.stream());
}

function template() {
    return gulp.src('src/pug/*.pug')
        .pipe(plumber({
            errorHandler: notify.onError({
                title: 'PUG',
                message: 'Error: <%= error.message %>'
            })
        }))
        .pipe(pug({
            pretty: '\t'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('./build'))
        .pipe(browser_sync.stream());
}

function watch() {
    // initial process
    template();
    style();

    browser_sync.init({
        server: {
            baseDir: './build'
        }
    });

    // watch for these file changes
    gulp.watch('./src/scss/**/*.scss', style);
    gulp.watch('./src/pug/**/*.pug', template);
    gulp.watch('./build/js/*.js').on('change', browser_sync.reload);
}

function build_style() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass({
            outputStyle:'compressed'
        }))
        .pipe(auto_prefixer())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./build/css'))
}

function build_template() {
    return gulp.src('src/pug/*.pug')
        .pipe(pug({
            pretty: '\t'
        }))
        .pipe(gulp.dest('./build'))
        .pipe(browser_sync.stream());
}

var build = gulp.series(gulp.parallel(build_style, build_template));

exports.style = style;
exports.template = template;
exports.watch = watch;
exports.build = build;
