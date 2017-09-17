/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-09-18 03:45:18
 */

// 注意事项：
//      webpack模式下多页面开发中不能有相同的文件名，不需要手动引入css和js,只需在js中引入;
//      webpakck模式中jsonserver需要单独开启，ctrl+alt+o 选择mockWatch即可启动
//      gulp模式下需要手动引入css和js,有两种开发方式：按功能页面进行开发，按后缀名命名文件夹进行开发；
//      文件打包编译后对dist页面进行预览那么请按下快捷键ctrl+alt+o 选择dist进行预览
//
// --------------------------------------------------


// 引入插件
// --------------------------------------------------
var gulp = require('gulp'); //基础库
var runSequence = require('run-sequence'); //控制task顺序
var htmlInjector = require('bs-html-injector'); //html注入
var browserSync = require('browser-sync').create(); //浏览器预览
var stylus = require('gulp-stylus');
var less = require('gulp-less');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var precss = require('precss');
var plumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');
var gpath = require('path');

// 全局配置
// --------------------------------------------------
// 必须设置：true (gulp预览)；false (webpack工具预览)

// webpack模式, 开发环境(dev)还是生产环境(pro)
var sEnv = "dev";
// jsonserver监听文件路径
var mockpath = gpath.resolve(__dirname, 'mock');
// serverNodemon中监听的文件重启
var serverWatchFile = ['webpack.config.js', 'package.json', 'server.js'];

if (true) {
    // src配置
    // --------------------------------------------------
    // src根目录
    var srcRoot = 'src';
    // src根目录下的文件夹
    var srcFolder = '';
    // src根目录下的文件夹的文件
    var srcFile = srcFolder + 'index.html';
    // 是否把所有的scss集中在一个文件中
    var styleFolder = false ? 'style/' : '';
    var styleDst = false ? 'css' : '';

    // dist配置
    // --------------------------------------------------
    // dist根目录
    var distRoot = 'dist';
    // dist根目录下的文件夹
    var distFolder = 'html';
    // dist根目录下的文件夹的文件
    var distFile = distFolder + '/' + 'index.html';

    // 生成后预览
    // --------------------------------------------------
    gulp.task('dist', function() {
        browserSync.init(null, {
            index: distFile,
            server: {
                baseDir: './' + distRoot,
                // 打开目录列表
                directory: true
            },
            notify: false,
            open: true,
            logPrefix: "控制台",
            browser: ['chrome'], //可以配置多个浏览器
            injectChanges: true, //热替换，注入css
            files: ['./' + distRoot + '/css/**/*.css'], //监听css文件便于bs-html-injector进行热替换
            online: false, //browser-sync的某些功能需要联网，如果是离线设置为false，则可以以减少启动时间
            plugins: [{
                module: 'bs-html-injector',
                options: {
                    files: [distRoot + '/**/*.html'] //注入html文件
                }
            }]
        });
        gulp.watch([distRoot + '/**/*.js']).on('change', browserSync.reload); //专门监控js文件,这个还没法做到热更新，选择了整个页面刷新
    });

    // less
    // --------------------------------------------------
    gulp.task('nless', function() {
        var src = ['./src/'+styleFolder+'**/*.less', '!./src/'+styleFolder+'**/_*.less'];
        var dst = './src/'+styleDst+'';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(less())
            .pipe(gulp.dest(dst));
    });

    // sass,scss
    // --------------------------------------------------
    gulp.task('nsass', function() {
        var src = ['./src/'+styleFolder+'**/*.+(scss|sass)', '!./src/'+styleFolder+'**/_*.scss'];
        var dst = './src/'+styleDst+'';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(sass({
                outputStyle: 'expanded'
            }).on('error', sass.logError))
            .pipe(gulp.dest(dst));
    });

    // stylus
    // --------------------------------------------------
    gulp.task('nstylus', function() {
        var src = ['./src/'+styleFolder+'**/*.styl', '!./src/'+styleFolder+'**/_*.styl'];
        var dst = './src/'+styleDst+'';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(stylus())
            .pipe(gulp.dest(dst));

    });

    // postcss
    // --------------------------------------------------
    gulp.task('npostcss', function() {
        var src = ['./src/'+styleFolder+'**/*.css', '!./src/'+styleFolder+'**/_*.css'];
        var dst = './src/'+styleDst+'';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(postcss([precss]))
            .pipe(gulp.dest(dst));
    });

    // watch
    // --------------------------------------------------
    gulp.task('nwatch', function() {
        gulp.watch(['src/'+styleFolder+'**/*.less', '!./src/'+styleFolder+'**/_*.less'], ['nless']);
        gulp.watch(['src/'+styleFolder+'**/*.+(scss|sass)', '!./src/'+styleFolder+'**/_*.+(scss|sass)'], ['nsass']);
        gulp.watch(['src/'+styleFolder+'**/*.styl', '!./src/'+styleFolder+'**/_*.styl'], ['nstylus']);
        gulp.watch(['src/'+styleFolder+'**/*.css', '!./src/'+styleFolder+'**/_*.css'], ['npostcss']);
    });

    // nodemon
    // --------------------------------------------------
    // 服务器重启
    gulp.task('nodemon', function(cb) {
        // 设个变量来防止重复重启
        var started = false;
        var stream = nodemon({
            script: './mock/server.js',
            // 监听文件的后缀
            ext: 'js',
            env: {
                "NODE_ENV": sEnv
            },
            // 监听的路径
            watch: [
                mockpath
            ]
        });
        stream.on('start', function() {
            if (!started) {
                cb();
                started = true;
            }
        }).on('crash', function() {
            console.error('application has crashed!\n');
            stream.emit('restart', 10);
        });
    });

    // browser-sync 配置，配置里启动 nodemon 任务
    // --------------------------------------------------
    gulp.task('preview', function() {
        browserSync.init(null, {
            index: srcFile,
            server: {
                baseDir: './' + srcRoot,
                // 打开目录列表
                directory: true
            },
            notify: false,
            open: true,
            logPrefix: "控制台",
            browser: ['chrome'], //可以配置多个浏览器
            injectChanges: true, //热替换，注入css
            files: ['./' + srcRoot + '/'+styleDst+'/**/*.css'], //监听css文件便于bs-html-injector进行热替换
            online: false, //browser-sync的某些功能需要联网，如果是离线设置为false，则可以以减少启动时间
            plugins: [{
                module: 'bs-html-injector',
                options: {
                    files: [srcRoot + '/**/*.html'] //注入html文件
                }
            }]
        });
        gulp.watch([srcRoot + '/**/*.js']).on('change', browserSync.reload); //专门监控js文件,这个还没法做到热更新，选择了整个页面刷新
    });

    // browser-sync 监听文件
    // --------------------------------------------------
    gulp.task('mock', function() {
        gulp.watch(['./mock/db.js', './mock/**'], ['bs-delay']);
    });

    // 延时刷新
    gulp.task('bs-delay', function() {
        setTimeout(function() {
            browserSync.reload();
        }, 1000);
    });

    // 默认运行开发中预览
    // --------------------------------------------------

    gulp.task('default', function(done) {
        condition = false;
        runSequence(['nless', 'nsass', 'nstylus', 'npostcss', 'nwatch', 'nodemon', 'preview', 'mock'], done); //必须按顺序执行，加快速度
    });


} else {

    // serverNodemon
    // --------------------------------------------------
    gulp.task('serverNodemon', function(cb) {
        // nodemon 的配置
        var started = false;
        var nodemonConfig = {
            script: 'server.js',
            watch: serverWatchFile,
            env: {
                "NODE_ENV": sEnv
            },
        };
        var serverStream = nodemon(nodemonConfig);
        serverStream.on('start', function() {
            if (!started) {
                cb();
                started = true;
            }
        }).on('crash', function() {
            console.error('application has crashed!\n');
            serverStream.emit('restart', 10);
        });
    });

    // mockNodemon
    // --------------------------------------------------
    gulp.task('mockNodemon', function(cb) {
        // nodemon 的配置
        var started = false;
        var nodemonConfig = {
            script: './mock/server.js',
            watch: mockpath,
            env: {
                "NODE_ENV": sEnv
            },
        };
        var mockStream = nodemon(nodemonConfig);
        mockStream.on('start', function() {
            if (!started) {
                cb();
                started = true;
            }
        }).on('crash', function() {
            console.error('application has crashed!\n');
            mockStream.emit('restart', 10);
        });
    });

    // 监听mock中的数据发生变化延迟1秒刷新;
    gulp.task('mockWatch', ['mockNodemon'], function() {
        gulp.watch(['./mock/db.js', './mock/**'], ['bs-delay']);
    });

    // 延时刷新
    gulp.task('bs-delay', function() {
        setTimeout(function() {
            browserSync.reload();
        }, 1000);
    });

    // 默认运行serverNodemon
    // --------------------------------------------------
    gulp.task('default', function(done) {
        condition = false;
        runSequence(['serverNodemon'], done); //必须按顺序执行，加快速度
    });

}
