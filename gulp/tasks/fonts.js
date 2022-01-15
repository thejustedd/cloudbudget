import fs from 'fs';
import fonter from 'gulp-fonter';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
  // Ищем файлы шрифтов .otf
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`)
    .pipe(app.plugins.plumber(app.plugins.notify.onError({
      title: 'FONTS',
      message: 'Error: <%= error.message %>'
    })))
    // Конвертируем в .ttf
    .pipe(fonter({
      formats: ['ttf'],
    }))
    // Вігружаем в исходную папку
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

// export const ttfToWoff = () => {
//   // Ищем файлы шрифтов .ttf
//   return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`)
//     .pipe(app.plugins.plumber(app.plugins.notify.onError({
//       title: 'FONTS',
//       message: 'Error: <%= error.message %>'
//     })))
//     // Конвертируем в .woff
//     .pipe(fonter({
//       formats: ['woff'],
//     }))
//     // Выгружаем в папку с результатом
//     .pipe(app.gulp.dest(app.path.build.fonts))
//     // Ищем файлы шрифтов .ttf
//     .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
//     // Конвертируем в .woff2
//     .pipe(ttf2woff2())
//     // Выгружаем в папку с результатом
//     .pipe(app.gulp.dest(app.path.build.fonts));
// };

export const ttfToWoff = () => {
  // Ищем файлы шрифтов .ttf
  return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`)
    .pipe(app.plugins.plumber(app.plugins.notify.onError({
      title: 'FONTS',
      message: 'Error: <%= error.message %>'
    })))
    .pipe(app.plugins.newer(`${app.path.srcFolder}/fonts/converted`))
    // Конвертируем в .woff
    .pipe(fonter({
      formats: ['woff'],
    }))
    // Выгружаем в промежуточную папку
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/converted`))
    // Ищем файлы шрифтов .ttf
    .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
    .pipe(app.plugins.newer(`${app.path.srcFolder}/fonts/converted`))
    // Конвертируем в .woff2
    .pipe(ttf2woff2())
    // Выгружаем в промежуточную папку
    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/converted`));
};

export const woffToDest = () => {
  return app.gulp.src(`${app.path.srcFolder}/fonts/converted/*.*`)
    // Выгружаем в папку с результатом
    .pipe(app.gulp.dest(app.path.build.fonts));
};

export const fontsStyle = () => {
  // Файл стилей подключения шрифтов
  const fontsFile = `${app.path.srcFolder}/scss/_fonts.scss`;
  // Проверяем, существуют ли файлы шрифтов
  fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
    if (fontsFiles) {
      // Проверяем, существует ли файл стилей для подключения шрифтов
      if (!fs.existsSync(fontsFile)) {
        // Если файла нет, создаём его
        fs.writeFile(fontsFile, '', cb);
        let newFileOnly;
        for (let i = 0; i < fontsFiles.length; i++) {
          // Записываем подключения шрифтов в файл стилей
          const fontFileName = fontsFiles[i].split('.')[0];
          if (newFileOnly !== fontFileName) {
            const fontName = fontFileName.split('-')[0] ? fontFileName.split('-')[0] : fontFileName;
            let fontWeight = fontFileName.split('-')[1] ? fontFileName.split('-')[1] : fontFileName;
            switch (fontWeight.toLowerCase()) {
              case 'thin':
                fontWeight = 100;
                break;
              case 'extralight':
                fontWeight = 200;
                break;
              case 'light':
                fontWeight = 300;
                break;
              case 'medium':
                fontWeight = 500;
                break;
              case 'semibold':
                fontWeight = 600;
                break;
              case 'bold':
                fontWeight = 700;
                break;
              case 'extrabold':
                fontWeight = 800;
                break;
              case 'black':
                fontWeight = 900;
                break;
              default:
                fontWeight = 400;
                break;
            }
            fs.appendFile(fontsFile,
              '@font-face {\n' +
              '  font-family: ' + fontName + ';\n' +
              '  font-display: swap;\n' +
              '  src: url(\'../fonts/' + fontFileName + '.woff2\') format(\'woff2\'),\n' +
              '    url(\'../fonts/' + fontFileName + '.woff\') format(\'woff\');\n' +
              '  font-weight: ' + fontWeight + ';\n' +
              '  font-style: normal;\n' +
              '}\n', cb
            );
            newFileOnly = fontFileName;
          }
        }
      } else {
        // Если файл существует, выводим сообщение
        console.log('Файл scss/_fonts.scss уже существует. Для обновления файла нужно его удалить');
      }
    }
  });
  return app.gulp.src(app.path.srcFolder);

  function cb() {
  }
};