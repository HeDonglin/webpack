/* jshint esversion: 6 */

var jsonServer  = require('json-server');
var db          = require('./db.js');
var routes      = require('./routes.js');
var port        = 3002;

// 返回Express服务器
var server      = jsonServer.create();
// 返回JSON服务器路由器。
var router      = jsonServer.router(db);
// 返回JSON服务器使用的中间件,static 静态文件的路径,logger 启用记录器中间件（默认值：true）,bodyParser 启用身体解析中间件（默认值：true）,noCors 禁用CORS（默认值：false）,readOnly 只接受GET请求（默认值：false）
var middlewares = jsonServer.defaults();
// 要添加重写规则
var rewriter    = jsonServer.rewriter(routes);

server.use(middlewares);
// 将 POST 请求转为 GET
server.use((request, res, next) => {
  request.method = 'GET';
  next();
});

server.use(rewriter); // 注意：rewriter 的设置一定要在 router 设置之前
server.use(router);

server.listen(port, () => {
  console.log('open mock server at http://localhost:' + port);
});
