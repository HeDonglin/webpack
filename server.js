/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-09-18 03:35:42
 */

// 判断开发环境还是生产环境
// --------------------------------------------------
var ENV = process.env.NODE_ENV; //package.json中配置的参数
var isDev = (ENV === 'dev') ? true : false;

// 开发环境下进行预览
// 生成环境进行打包编译
// --------------------------------------------------

if (isDev) {

    // 开发环境预览编译；
    // @see https://github.com/expressjs/express
    // node.js Web应用框架
    var express = require('express');

    // @see https://github.com/webpack/webpack
    // 打包编译
    var webpack = require('webpack');

    // @see https://github.com/webpack/webpack-dev-middleware
    // 处理内存中的文件
    var webpackDevMiddleware = require('webpack-dev-middleware');

    // @see https://www.npmjs.com/package/webpack-dev-server
    // webpack开发服务器（这里不需要）
    // var webpackDevServer = require('webpack-dev-server');

    // @see https://github.com/glenjamin/webpack-hot-middleware
    // 实现浏览器的无刷新更新
    var webpackHotMiddleware = require('webpack-hot-middleware');

    // @see https://github.com/expressjs/body-parser
    // 处理 JSON, Raw, Text 和 URL 编码的数据
    var bodyParser = require('body-parser');

    // @see https://github.com/paulmillr/chokidar
    // 解决Node.js fs.watch出现的问题
    // var chokidar = require('chokidar').watch('./mock');
    var webpackConfig = require('./webpack.config');

    // 运行配置文件
    var compiler = webpack(webpackConfig);

    var devMiddleware = require('webpack-dev-middleware')(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true
        }
    });

    var hotMiddleware = require('webpack-hot-middleware')(compiler, {
        log: console.log
    });


    var app = express();

    app.use(devMiddleware);

    app.use(hotMiddleware);


    if (isDev) {
        var files = ['./src/**']; //如果采用编写vue用['./src/**'];不采用vue的时候用['!./src/**/*.html']；
    } else {
        var files = ['./dist/**'];
    }
    var port = 3000;
    var bs = require('browser-sync').create();
    var server = app.listen(port, function() {
        bs.init({
            open: true,
            ui: false,
            notify: false,
            proxy: 'localhost:' + port,
            files: files, //监听文件
            logPrefix: "控制台", //控制台日志前缀
            online: false, //browser-sync的某些功能需要联网，如果是离线设置为false，则可以以减少启动时间
            browser: ["chrome"], //打开多个用逗号隔开
            plugins: [{
                module: "bs-html-injector",
                options: {
                    files: ["src/**"] //注入html文件对于bs-html-injector插件关键作用
                }
            }]
        });
    });
} else {
    // 生成环境直接打包
    var webpack = require('webpack');

    var webpackConfig = require('./webpack.config');

    webpack(webpackConfig, function(err, stats) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stats.toString({
            // chunks: false,
            colors: true
        }));
    });
}
