/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-15 12:35:32
 */

// 引入插件
var gulp = require('gulp'); //基础库
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence'); //控制task顺序
var htmlInjector = require('bs-html-injector'); //html注入
var browserSync = require('browser-sync').create(); //浏览器预览

var sEnv="dev"; //选择dev和pro两个选项

if (false) {//true gulp预览；false webpack工具预览

    var path = true ? 'dist' : 'src'; //布尔值控制选择哪个作为服务器根目录

    var distPath = path === 'dist' ? 'html/' : ''; //在根目录下的哪个文件夹

    // 指定运行的文件和位置
    var pathHtmlName = distPath + 'app.html'; //文件夹中哪个文件作为预览

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

} else {
    // nodemon 的配置
    var nodemonConfig = {
        script: 'server.js',
        watch: ['webpack.config.js','package.json','server.js'],
        env: {
            "NODE_ENV": sEnv
        },
    };

    // 使用 nodemone 跑起服务器
    gulp.task('start', function() {
        return nodemon(nodemonConfig);
    });


    // 同步运行
    gulp.task('default', function(done) {
        condition = false;
        runSequence(['start'], done); //必须按顺序执行，加快速度
    });
}
