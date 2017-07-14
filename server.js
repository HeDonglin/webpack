/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-15 00:48:20
 */
// 判断开发环境还是生产环境
var ENV = process.env.NODE_ENV; //package.json中配置的参数
var isDev = (ENV === 'dev') ? true : false;

if (isDev) {
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
    // 当服务停止时候自动关闭浏览器
    var webpackDevServer = require('webpack-dev-server');

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

    // app.use(bodyParser.json());

    // app.use(bodyParser.urlencoded({
    //     extended: false
    // }));

    // app.use(function(res, req, next) {
    //     require('./mock')(res, req, next);
    // });

    // // 监控json文件变化
    // chokidar.on('ready', function() {
    //     chokidar.on('all', function() {
    //         console.log('Server restarting...');

    //         Object.keys(require.cache).forEach(function(id) {
    //             if (/[\/\\]mock[\/\\]/.test(id)) {
    //                 delete require.cache[id];
    //             }
    //         });
    //     });
    // });

    // var router = express.Router();
    // // 定义路由
    // router.all('*', function(req, res) {
    //     res.sendfile(__dirname + '/src/' + req.url);
    // });

    if (isDev) {
        var files = ['!./src/**/*.html']; //排除对html文件的监控css文件对于bs-html-injector插件关键作用
    } else {
        var files = ['./dist/**'];
    }

    // app.use('/', router);
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackDevServer = require('webpack-dev-server');

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

    var webpack = require('webpack');

    var webpackConfig = require('./webpack.config');

    webpack(webpackConfig, function(err, stats) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stats.toString({
            // chunks: false,
            clors: true
        }));
    });
}
