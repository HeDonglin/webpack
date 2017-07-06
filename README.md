# 2017年7月5日

## window下快速新建文件及文件夹buildfolder.bat批处理
md 新建文件夹
cd 定位到文件夹
rd 删除文件夹
type NUL > 文件名 新建空文件
del 删除文件
exit 运行后退出界面
```
md src
md src\images
md src\fonts
md src\main
md src\modules
md src\vendors
md src\publice
type NUL > src\index.html
type NUL > src\index.css
type NUL > src\index.less
type NUL > src\index.scss
type NUL > src\index.js
type NUL > src\favicon.ico
exit
```

## 配置自动刷新预览脚本
nodemon 监听多个文件时候需要些两次--watch
监听webpack.dev.config.js文件改动自动重新加载配置
--exec \"\" 运行插件配置信息
--content-base src 服务器在src所在位置（但是实际上生成的文件在内存，怎么配置都可以）
--progress cmd控制台带进度条
--colors cmd控制台带颜色
--inline webpack-dev-server的模式2
--port 8080 配置端口
--open 打开浏览器
--hot 模块热加载 （注意：设置后无法自动刷新）


```    
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon --watch webpack.dev.config.js --watch package.json --exec \"webpack-dev-server --config webpack.dev.config.js --inline --colors --progress --content-base src --port 8080 --open\"",
    "pub": "nodemon --watch webpack.dev.config.js --watch package.json --exec \"webpack --config webpack.dev.config.js\""
  },
```

## 开发的时候使用
npm run dev (git中配置了快捷键rs)

## 生成dist文件夹
npm run pub (git中配置了快捷键rd)

## 问题1：如何解决html中img图片没有hash
方法1：var imgUrl = require('./images/1.gif');缺点：没法添加hash
方法2：npm i html-withimg-loader -D
```
{
    //https://www.npmjs.com/package/html-withimg-loader
    test: /\.html$/,
    loader: 'html-withimg-loader?min=false'//由于默认会压缩，这个任务交给了html-webpack-plugin处理
},
```

## 问题2：如何解决html中img在多页开发中url不正确

## 问题3：如何使用source-map

## 问题4：如何打包第三方库

## 问题5：link中的favicon的路径不对
