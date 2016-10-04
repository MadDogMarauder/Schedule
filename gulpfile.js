const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

// Gulp dependencies:

gulp.task('default', function() {
    // Gulp Tasks:

    // Run ESLint
    gulp.src(["app_server/**/*.js","public/es6/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format());
    //transform es 6 to 5
    gulp.src("public/es6/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("public/dist"));
});