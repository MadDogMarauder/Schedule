const gulp = require('gulp');
const babel = require('gulp-babel');

// Gulp dependencies:

gulp.task('default', function() {
    // Gulp Tasks:

    //transform es 6 to 5
    gulp.src("public/es6/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("public/dist"));
});