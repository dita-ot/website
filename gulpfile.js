const gulp = require('gulp')
const babel = require('gulp-babel')
const watch = require('gulp-watch')

gulp.task('default', ['js'])

gulp.task('js', () => {
  return gulp
    .src('_js/**/*.js')
    .pipe(babel({
      presets: ['es2015'],
      compact: true,
      comments: false
    }))
    .pipe(gulp.dest('js'))
})

gulp.task('watch-js', ['js'], () => {
  return watch('_js/**/*.js', () => {
    gulp.start('js')
  })
})
