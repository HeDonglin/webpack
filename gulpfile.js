/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-14 06:25:18
 */

// 引入插件
var gulp = require('gulp'); //基础库
var runSequence = require('run-sequence'); //控制task顺序
var htmlInjector = require("bs-html-injector"); //html注入
var browserSync = require('browser-sync').create(); //浏览器预览

var path = false ? 'dist' : 'src'; //布尔值控制选择哪个作为服务器根目录

var distPath=path==='dist'?'html/':'';//在根目录下的哪个文件夹

// 指定运行的文件和位置
var pathHtmlName = distPath+'app.html';//文件夹中哪个文件作为预览

// 无刷新更新实时预览
gulp.task('preview', function() {

    browserSync.init({
        index: pathHtmlName,
        server: {
            baseDir: './' + path
        },
        // proxy: 'localhost:3000',
        notify: false,
        open: true,
        browser: ['chrome'], //可以配置多个浏览器
        injectChanges: true, //热替换，注入css
        files: ['./' + path + '/**/*.css'], //监听css文件便于bs-html-injector进行热替换
        plugins: [{
            module: 'bs-html-injector',
            options: {
                files: [path + '/**/*.html'] //注入html文件
            }
        }]
    });

    gulp.watch([path + '/**/*.js']).on('change', browserSync.reload); //专门监控js文件,这个还没法做到热更新，选择了整个页面刷新
});

// 同步运行
gulp.task('default', function(done) {
    condition = false;
    runSequence(['preview'], done); //必须按顺序执行，加快速度
});
