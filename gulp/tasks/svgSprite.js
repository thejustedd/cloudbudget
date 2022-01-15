import gulpSvgSprite from 'gulp-svg-sprite';

export const svgSprite = () => {
  return app.gulp.src(app.path.src.svgSprite)
    .pipe(app.plugins.plumber(app.plugins.notify.onError({
      title: 'SVGSprite',
      message: 'Error: <%= error.message %>'
    })))
    .pipe(gulpSvgSprite({
      mode: {
        stack: {
          sprite: '../icons/icons.svg',
          // Создавать страницу с перечнем иконок
          example: true,
        }
      }
    }))
    .pipe(app.gulp.dest(app.path.build.images));
};