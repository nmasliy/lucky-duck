const { src, dest, series, watch } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('sass');
const gulpSass = require('gulp-sass');
const gcmq = require('gulp-group-css-media-queries');
const gulpif = require('gulp-if');
const notify = require('gulp-notify');
const image = require('gulp-imagemin');
const webp = require('gulp-webp');
const mainSass = gulpSass(sass);
const webpackStream = require('webpack-stream');
const plumber = require('gulp-plumber');
const path = require('path');
const nunjucksRender = require('gulp-nunjucks-render');

// paths
const srcFolder = './src';
const buildFolder = './app';
const paths = {
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCssFolder: `${buildFolder}/css`,
  srcFullJs: `${srcFolder}/js/**/*.js`,
  srcMainJs: `${srcFolder}/js/main.js`,
  buildJsFolder: `${buildFolder}/js`,
  srcPartialsFolder: `${srcFolder}/html`,
  resourcesFolder: `${srcFolder}/resources`,
  htmlFolder: `${srcFolder}/html`,
};

let isProd = false; // dev by default

const clean = () => {
  return del([buildFolder]);
};

const styles = () => {
  return (
    src(paths.srcScss, { sourcemaps: !isProd })
      .pipe(
        plumber(
          notify.onError({
            title: 'SCSS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(mainSass())
      .pipe(
        autoprefixer({
          cascade: false,
          grid: true,
          overrideBrowserslist: ['last 5 versions'],
        })
      )
      // .pipe(gcmq())
      .pipe(
        gulpif(
          isProd,
          cleanCSS({
            level: 2,
          })
        )
      )
      .pipe(dest(paths.buildCssFolder, { sourcemaps: '.' }))
      .pipe(browserSync.stream())
  );
};

const scripts = () => {
  return src(paths.srcFullJs)
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
};

const resources = () => {
  return src(`${paths.resourcesFolder}/**`).pipe(dest(buildFolder));
};

const images = () => {
  return src([`${paths.srcImgFolder}/*.{jpg,jpeg,png,svg}`])
    .pipe(
      gulpif(
        isProd,
        image([
          image.mozjpeg({
            quality: 90,
            progressive: true,
          }),
          image.optipng({
            optimizationLevel: 2,
          }),
        ])
      )
    )
    .pipe(dest(paths.buildImgFolder));
};

const webpImages = () => {
  return src([`${paths.srcImgFolder}/*.{jpg,jpeg,png}`])
    .pipe(webp({quality: 85}))
    .pipe(dest(paths.buildImgFolder));
};

const html = () => {
  return src([`${paths.htmlFolder}/pages/*.njk`])
    .pipe(nunjucksRender({
      path: [`${paths.htmlFolder}/templates`]
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
};

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: `${buildFolder}`,
    },
  });

  watch(paths.srcScss, styles);
  watch(paths.srcFullJs, scripts);
  watch(`${srcFolder}/**/*.html`, html);
  watch(`${paths.resourcesFolder}/**`, resources);
  watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png,svg}`, images);
  // watch(`${paths.srcImgFolder}/**/**.{jpg,jpeg,png}`, webpImages);
  watch(`${paths.htmlFolder}/**/**.{html,njk}`, html);
};

const toProd = (done) => {
  isProd = true;
  done();
};

exports.default = series(
  clean,
  html,
  scripts,
  styles,
  resources,
  images,
  webpImages,
  watchFiles
);

exports.build = series(
  toProd,
  clean,
  html,
  scripts,
  styles,
  resources,
  images,
  webpImages,
);
