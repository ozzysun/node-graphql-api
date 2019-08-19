'use strict'
const gulp = require('gulp')
const shell = require('shelljs')
const path = require('path')
const { removeFolder, copyFolder } = require('../../src/core/utils/file')
const { createConfFolder } = require('../../src/app')
// run js script
gulp.task('default', async() => {
  // 若連/conf 都不存在 則透過setting 產生
  await createConfFolder()
  // copy conf 到dist內 才執行測試
  const sourcePath = path.resolve('./conf')
  const targetPath = path.resolve('./dist/conf')
  await removeFolder(targetPath)
  await copyFolder(sourcePath, targetPath)
  await shell.exec('npm run compile')
  await shell.exec('npm run start')
})
// run es6 script
gulp.task('dev', async() => {
  await shell.exec('npm run dev')
})
gulp.task('lint', async() => {
  await shell.exec('npm run lint-watch')
})
// 建立可執行檔案
gulp.task('build', async() => {
  await shell.exec('npm run build')
})
// 執行單元測試
gulp.task('test', async() => {
  // 建立測試目錄 才執行測試
  const sourcePath = path.resolve('./.testsample')
  const targetPath = path.resolve('./testsample')
  await removeFolder(targetPath)
  await copyFolder(sourcePath, targetPath)
  await shell.exec('npm run test:unit')
})
