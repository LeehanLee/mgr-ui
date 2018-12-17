const gulp = require("gulp");
const del = require("del");
const path = require("path");
const assetDest = "E:\\StsWorkspace\\mgr\\src\\main\\resources\\static";
const pageDest = "E:\\StsWorkspace\\mgr\\src\\main\\resources\\templates";

function clean() {
  return del([assetDest], { force: true });
}
function copyAsset() {
  return gulp
    .src([
      "./dist/**/*.css",
      "./dist/**/*.ttf",
      "./dist/**/*.woff",
      "./dist/**/*.png",
      "./dist/**/*.jpg",
      "./dist/**/*.js",
      "./dist/**/*.js.map"
    ])
    .pipe(gulp.dest(assetDest));
}
function copyPage() {
  return gulp.src(["./dist/*.ico", "./dist/*.html"]).pipe(gulp.dest(pageDest));
}

const defaultTask = gulp.series(copyAsset, copyPage);
// gulp.watch("./dist/**", defaultTask);
module.exports.default = defaultTask;
