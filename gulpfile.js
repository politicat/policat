const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

const paths = {
  scripts: ['server/**/*.js']
};

gulp.task('babel', () =>
    gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
);

gulp.task('watch', () =>
    gulp.watch(paths.scripts, ['babel'])
);

gulp.task('default', ['watch', 'babel']);
