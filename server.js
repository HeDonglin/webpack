/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-10 02:03:22
 */

// @see https://github.com/expressjs/express
// node.js Web应用框架
var express = require('express');

// @see https://github.com/webpack/webpack
// 打包编译
var webpack = require('webpack');
// @see https://github.com/webpack/webpack-dev-middleware
// 处理内存中的文件
var webpackDevMiddleware = require('webpack-dev-middleware');

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
var compile = webpack(webpackConfig);

var devMiddleware = require('webpack-dev-middleware')(compile, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true
    }
});

var hotMiddleware = require('webpack-hot-middleware')(compile, {
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

// app.use('/', router);
var port = 3000;
var bs = require('browser-sync').create();
var server = app.listen(port, function() {
    bs.init({
        open: true,
        ui: false,
        notify: false,
        proxy: 'localhost:' + port,
        files: ['./src/**']
    });
});
