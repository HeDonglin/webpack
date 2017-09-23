/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-09-23 12:52:23
 */

// 注意事项：
//      webpack模式下多页面开发中不能有相同的文件名，不需要手动引入css和js到html中,只需在js中引入;
//      webpakck模式中jsonserver需要单独开启，ctrl+alt+o 选择mockWatch即可启动
//      gulp模式下需要手动引入css和js,有两种开发方式：按功能页面进行开发，按后缀名命名文件夹进行开发；
//      文件打包编译后对dist页面进行预览那么请按下快捷键ctrl+alt+o 选择dist进行预览
//
// --------------------------------------------------


// 引入插件
// --------------------------------------------------
var gulp         = require('gulp'); //基础库
var runSequence  = require('run-sequence'); //控制task顺序
var htmlInjector = require('bs-html-injector'); //html注入
var browserSync  = require('browser-sync').create(); //浏览器预览
var stylus       = require('gulp-stylus');
var less         = require('gulp-less');
var sass         = require('gulp-sass');
var postcss      = require('gulp-postcss');
var precss       = require('precss');
var plumber      = require('gulp-plumber');
var nodemon      = require('gulp-nodemon');
var gpath        = require('path');
var rev          = require('gulp-rev'); //加MD5后缀
var flatten      = require('gulp-flatten'); //修改rev中json路径
var revCollector = require('gulp-rev-collector'); //路径替换
var uglify       = require('gulp-uglify'); //js压缩
var htmlinc      = require('gulp-content-includer'); //html模块打包
var htmlmin      = require('gulp-htmlmin'); //html压缩
var gulpcdn      = require('gulp-cdn-absolute-path'); //替换相对路径和绝对路径的cdn前缀
var clean        = require('gulp-clean'); //清理内容
var cssnext      = require('cssnext'); //下一代CSS书写方式兼容现在浏览器
var autoprefixer = require('autoprefixer'); //为CSS补全浏览器前缀
var postcssclean = require('postcss-clean'); //压缩css文件
// var rename    = require('gulp-rename'); //重新命名文件
// var replace   = require('gulp-replace'); //文件内容替换
// var spriter   = require('gulp-css-spriter'); //雪碧图
// var concat    = require('gulp-concat'); //合并文件

// 全局配置
// --------------------------------------------------

// webpack模式, 开发环境(dev)还是生产环境(pro)
var sEnv            = "pro";
// jsonserver监听文件路径
var mockpath        = gpath.resolve(__dirname, 'mock');
// serverNodemon中监听的文件重启
var serverWatchFile = ['webpack.config.js', 'package.json', 'server.js'];


// dist配置
// --------------------------------------------------
// dist根目录
var distRoot    = 'dist';
// dist根目录下的文件夹
var distFolder  = 'html';
// dist根目录下的文件夹的文件
var distFile    = distFolder + '/' + 'index.html';

// 必须设置：true (gulp预览)；false (webpack工具预览)
// --------------------------------------------------

if (false) {
    // src配置
    // --------------------------------------------------
    // src根目录
    var srcRoot     = 'src';
    // src根目录下的文件夹
    var srcFolder   = '';
    // src根目录下的文件夹的文件
    var srcFile     = srcFolder + 'index.html';
    // 是否把所有的scss集中在一个文件中
    var styleFolder = false ? 'style/' : '';
    var styleDst    = false ? 'css' : '';
    var cssBrowsers = 'last 10 versions'; //css前缀浏览器版本
    // 忽略的文件夹和文件
    var igFolder    = '!src/{font,img}/**/*.+(html|css|js)';
    // 是否按功能页面打包;按后缀文件打包还存在路径问题；
    var isPosa      = true;


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

    //文件复制
    gulp.task('file', function() {
        var src = ['src/file/**/*', 'src/favicon.ico'],
            dst = 'dist/';
        return gulp.src(src) //入口
            .pipe(plumber()) //日志
            .pipe(gulp.dest(dst)); //输出
    });

    // img图片压缩
    gulp.task('img', function() {
        var src = ['src/img/**/*', igFolder],
            dst = 'dist/img/';
        return gulp.src(src)
            .pipe(plumber()) //日志
            .pipe(rev()) //加MD5后缀
            .pipe(gulp.dest(dst))
            .pipe(flatten()) //删除或替换文件的相对路径(重要)
            .pipe(rev.manifest()) //版本号json文件
            .pipe(gulp.dest('src/rev/img')); //输出json文件到源包
    });

    // font文字图片压缩
    gulp.task('font', function() {
        var src = ['src/font/**/*', igFolder],
            dst = 'dist/font/';
        return gulp.src(src)
            .pipe(plumber()) //日志
            .pipe(rev()) //加MD5后缀
            .pipe(gulp.dest(dst))
            .pipe(flatten()) //删除或替换文件的相对路径(重要)
            .pipe(rev.manifest()) //版本号json文件
            .pipe(gulp.dest('src/rev/font')); //输出json文件到源包
    });

    //js语法检查 重命名 压缩
    gulp.task('js', function() {
        var src = ['src/rev/**/*.json', 'src/**/*.js', igFolder],
            dst = isPosa ? 'dist/' : 'dist/js/';
        return gulp.src(src) //入口
            .pipe(plumber()) //日志
            .pipe(revCollector({
                replaceReved: true
            })) //把图片路径进行替换
            .pipe(uglify()) //压缩
            .pipe(rev()) //加MD5后缀
            .pipe(gulp.dest(dst)) //输出
            .pipe(flatten()) //删除或替换文件的相对路径(重要)
            .pipe(rev.manifest()) //版本号json文件
            .pipe(gulp.dest('src/rev/js')); //输出json文件到源包

    });

    //html语法检查 重命名 压缩
    gulp.task('html', function() {
        var src = ['src/rev/**/*.json', 'src/**/*.html', igFolder],
            dst = isPosa ? 'dist/' : 'dist/html/';
        options = {
            removeComments: true, //清除HTML注释
            keepClosingSlash: true, //保留半闭合的斜杠
            collapseWhitespace: true, //压缩HTML
            collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: false, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: false, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        };
        return gulp.src(src) //入口
            .pipe(plumber()) //日志
            .pipe(revCollector({
                replaceReved: true
            })) //所有外部资源路径替换
            .pipe(htmlinc({ //打包
                includerReg: /<!\-\-#include\svirtual=+"([^"]+)"\-\->/g,
                deepConcat: true
            }))
            .pipe(htmlmin(options)) //压缩保留斜杠,删除注释
            .pipe(gulp.dest(dst)); //输出
    });

    // postcss
    // --------------------------------------------------
    gulp.task('npostcss', function() {
        var src = ['src/rev/**/*.json', './src/' + styleFolder + '**/*.css', '!./src/' + styleFolder + '**/_*.css', igFolder],
            dst = isPosa ? 'dist/' : 'dist/css/';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(revCollector({
                replaceReved: true
            })) //把图片路径进行替换
            .pipe(postcss([precss, cssnext, postcssclean, autoprefixer({ //cssgrace在这里的话会发生错误，所以不在使用该功能；
                browsers: [cssBrowsers], //前缀兼容
                remove: true //自动清除过时前缀
            })]))
            .pipe(rev()) //加MD5后缀
            .pipe(gulp.dest(dst))
            .pipe(flatten()) //删除或替换文件的相对路径(重要)
            .pipe(rev.manifest()) //版本号json文件
            .pipe(gulp.dest('src/rev/css')); //输出json文件到源包
    });

    //添加cdn
    gulp.task('cdnref', function() {
        var cdnSrc = ['dist/**/*', '!dist/vendor/**/*'],
            cdnDst = 'cdn/';
        // var path = require('path');//方法二
        return gulp.src(cdnSrc)
            .pipe(gulpcdn({ //方法一,比较完美
                cdn: 'http://w3c0929.com', //cdn前缀
                asset: 'dist' //原始地址的根目录
            }))
            // .pipe(revAll.revision({//方法二
            //     prefix: 'http://w3c0929.com', //只能替换掉使用绝对路径的地址
            //     transformFilename: function(file, hash) {
            //         var ext = path.extname(file.path);
            //         return path.basename(file.path, ext) + ext; //filename.扩展名,主要是不需要hash,且不需要更改名字
            //     }
            // }))
            .pipe(gulp.dest(cdnDst));

    });

    //运行前清空文件
    gulp.task('clean', function() {
        return gulp.src(['cdn/', 'dist/', 'build/', 'src/rev/'], {
                read: false
            })
            .pipe(clean());
    });

    // less
    // --------------------------------------------------
    gulp.task('nless', function() {
        var src = ['./src/' + styleFolder + '**/*.less', '!./src/' + styleFolder + '**/_*.less'];
        var dst = './src/' + styleDst + '';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(less())
            .pipe(gulp.dest(dst));
    });

    // sass,scss
    // --------------------------------------------------
    gulp.task('nsass', function() {
        var src = ['./src/' + styleFolder + '**/*.+(scss|sass)', '!./src/' + styleFolder + '**/_*.scss'];
        var dst = './src/' + styleDst + '';
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
        var src = ['./src/' + styleFolder + '**/*.styl', '!./src/' + styleFolder + '**/_*.styl'];
        var dst = './src/' + styleDst + '';
        return gulp.src(src)
            .pipe(plumber())
            .pipe(stylus())
            .pipe(gulp.dest(dst));

    });



    // watch
    // --------------------------------------------------
    gulp.task('nwatch', function() {
        // 监听fonts
        gulp.watch('src/font/**/*', ['font']);

        // 监听images
        gulp.watch('src/img/**/*', ['img']);

        // 监听js
        gulp.watch('src/**/*.js', ['js']);

        // 监听cdn
        // gulp.watch('src/**/*', ['cdnref']);

        // 监听html,当所有的文件都发生变化时候，重新替换MD5后缀
        gulp.watch(['src/**/*', igFolder], ['html']);

        gulp.watch(['src/' + styleFolder + '**/*.less', '!./src/' + styleFolder + '**/_*.less'], ['nless']);
        gulp.watch(['src/' + styleFolder + '**/*.+(scss|sass)', '!./src/' + styleFolder + '**/_*.+(scss|sass)'], ['nsass']);
        gulp.watch(['src/' + styleFolder + '**/*.styl', '!./src/' + styleFolder + '**/_*.styl'], ['nstylus']);
        gulp.watch(['src/' + styleFolder + '**/*.css', '!./src/' + styleFolder + '**/_*.css', igFolder], ['npostcss']);
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
            open: false,
            logPrefix: "控制台",
            browser: ['chrome'], //可以配置多个浏览器
            injectChanges: true, //热替换，注入css
            files: ['./' + srcRoot + '/' + styleDst + '/**/*.css'], //监听css文件便于bs-html-injector进行热替换
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

    gulp.task('default', ['clean'], function(done) {
        condition = false;
        runSequence(['img'], ['font'], ['file'], ['nless'], ['nsass'], ['nstylus'], ['npostcss'], ['js'], ['html'], ['nwatch'], ['nodemon'], ['preview'], ['mock'], done); //必须按顺序执行，加快速度
    });


} else {

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

// 关于日期
// var data = new Date(), //按日期
//     a = data.getFullYear(),
//     b = data.getMonth() + 1,
//     c = data.getDate();
// var timestamp = +new Date();

// 重命名
// .pipe(rename(function(path) {
//     path.dirname += "/日期"; //在cssDst路径最后加一个文件夹
//     path.basename += "-" + a + b + c; //位于前缀和后缀的名字
//     path.prefix += "abc-"; //前缀
//     path.suffix += ".min"; //后缀
//     path.extname = ".css"; //扩展后缀
// })) //重新命名
