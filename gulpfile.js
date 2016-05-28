const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const watch = require('gulp-watch');

const paths = {
  server: ['server/**/*.js'],
  client: ['client/**/*.js', 'client/**/*.css']
};

gulp.task('babel', () =>
    gulp.src(paths.server)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build'))
);

gulp.task('webpack', function() {
  return gulp.src('./client/index.js')
    .pipe(webpack( require('./webpack.config.js') ))
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', () => {
    gulp.watch(paths.server, ['babel']);
    gulp.watch(paths.client, ['webpack']);
});

gulp.task('default', ['watch', 'babel', 'webpack']);
