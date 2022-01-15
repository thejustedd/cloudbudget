// Основной модуль
import gulp from 'gulp';
// Импорт путей
import {path} from './gulp/config/path.js';
// Импорт общих плагинов
import {plugins} from './gulp/config/plugins.js';

// Передаём значения в глобальную переменную
global.app = {
  isProd: process.argv.includes('--prod'),
  isDev: !process.argv.includes('--prod'),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// Импорт задач
import {copy} from './gulp/tasks/copy.js';
import {reset} from './gulp/tasks/reset.js';
import {html} from './gulp/tasks/html.js';
import {scss} from './gulp/tasks/scss.js';
import {js} from './gulp/tasks/js.js';
import {server} from './gulp/tasks/server.js';
import {images} from './gulp/tasks/images.js';
import {otfToTtf, ttfToWoff, woffToDest, fontsStyle} from './gulp/tasks/fonts.js';
import {svgSprite} from './gulp/tasks/svgSprite.js';
import {zip} from './gulp/tasks/zip.js';
import {ftp} from './gulp/tasks/ftp.js';

// Наблюдатель за изменениями в файлах
function watcher() {
  gulp.watch(path.watch.files, copy); // partials -> gulp.series(copy, ftp)
  gulp.watch(path.watch.html, html); // partials -> gulp.series(partials, ftp)
  gulp.watch(path.watch.scss, scss); // scss -> gulp.series(scss, ftp)
  gulp.watch(path.watch.js, js); // js -> gulp.series(js, ftp)
  gulp.watch(path.watch.images, images); // images -> gulp.series(images, ftp)
}

// Последовательная обработка шрифтов
const convertFonts = gulp.series(otfToTtf, ttfToWoff);
const copyFonts = woffToDest;
const fonts = gulp.series(copyFonts, fontsStyle);

// Основная задача
// const mainTasks = gulp.parallel(copy, partials, scss, js, images);
// const mainTasks = gulp.series(fonts, gulp.parallel(copy, partials, scss, js, images));
const mainTasks = gulp.parallel(copy, html, scss, js, images, fonts);

// Построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip);
const deployFTP = gulp.series(reset, mainTasks, ftp);

export {svgSprite};
export {convertFonts};
export {fonts};
export {dev};
export {build};
export {deployFTP};

// Выполняем сценарий по умолчанию
gulp.task('default', dev);