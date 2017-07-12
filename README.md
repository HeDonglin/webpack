## 2017-07-11 解决了[Nodemon]中发生的错误
原因：  
```
[Nodemon] failed to start process, possible issue with exec arguments
```
解决办法：添加||true  
例如：--exec \"webpack --config webpack.config.js ||true\"  

## window下快速新建文件及文件夹用newFloder.bat批处理
目的：快速建立项目所需要的文件及文件夹，免去一个个新建  
命令：
```js
md 新建文件夹  
cd 定位到文件夹  
rd 删除文件夹  
type NUL > 文件名 新建空文件  
del 删除文件  
exit 运行后退出界面  
```

```js
按功能分类
md src
md src\img 图片
md src\font 图标
md src\main 子页面
md src\module 特殊模块
md src\vendor 第三方库
md src\public 公共模块
type NUL > src\index.html
type NUL > src\index.css
type NUL > src\index.less
type NUL > src\index.scss
type NUL > src\index.js
type NUL > src\favicon.ico
exit
```

## 监控配置文件
目的：当修改了配置文件不需手动重启，从而全新投入工作中  
插件：npm i nodemon -D  
```js
        "nodemon": "^1.11.0",
```
说明：
```
-- watch 监听多个文件时候需要些两次--watch （优点：可以监控webpack.config.js文件;缺点：无法监控packge.json）  
--exec \"\" 运行插件配置信息

其他命令：
运行非节点脚本
    nodemon --exec "python -v" ./app.py
监控多个目录
    nodemon --watch app --watch libs app/server.js
指定扩展监视列表
    nodemon --ext '.js|.css|.html'
    或nodemon -e js,css,html
延迟重启
    nodemon --delay 10 server.js
    忽略文件 新建.nodemonignore文件

```

## 开发的时候使用
npm run dev (git中配置了快捷键rs)

## 生成dist文件夹
npm run pub (git中配置了快捷键rd)

# webpack 2.0/3.0 版本遇到的坑

## 如何区分开发环境还是生产环境
```js
插件：
"cross-env": "^5.0.1",  
"better-npm-run": "0.0.15",  

package.json中设置：
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "better-npm-run dev",
    "pub": "better-npm-run pub"
},
"betterScripts": {
    "dev": {
        "command": "cross-env NODE_ENV=dev nodemon --watch webpack.config.js --watch package.json --exec \"webpack-dev-server --config webpack.config.js --inline --colors --progress --content-base src --host 192.168.1.100 --port 8080 --open\""
    },
    "pub": {
        "command": "cross-env NODE_ENV=production nodemon --watch webpack.config.js --watch package.json --exec \"webpack --config webpack.config.js\""
    }
},

webpack.confing.js中配置：
var ENV = process.env.NODE_ENV; //package.json中配置的参数
var isDev = (ENV === 'dev') ? true : false;
var happyThreadPool = happyPack.ThreadPool({
    size: (isDev ? 4 : 10) //进程池数量
});
```

## 如何做到同步指定
```
插件："glob": "^7.1.2",
glob.sync(globPath)
```

## 如何获得文件名的后缀(path.extname)
```
详见地址：http://nodejs.cn/api/path.html
```

## 如何获取不带后缀的文件名(path.basename)
```
var basename = path.basename(entry, path.extname(entry));
```

## 如何获得不带文件名的路径(path.dirname)
```
var pathname = path.dirname(entry); //不带文件名(/文件名.js)
```

## js文件中@import 有样式重复问题
```
不推荐使用@import的,生成的样式文件有样式是重复的
require来引入样式文件
```

## 语法转换
```
npm i babel-core -D 
npm i babel-loader -D 
//因为ES6语法每年都在更新，因此，我们需要一定的规则去转换
npm i babel-preset-latest -D 
```

## 如何解决html中img图片没有hash
方法1：var imgUrl = require('./images/1.gif');缺点：没法添加hash  
方法2：npm i html-withimg-loader -D  ，缺点多页面中无法实现相对地址；
```js
{
    //https://www.npmjs.com/package/html-withimg-loader
    test: /\.html$/,
    loader: 'html-withimg-loader?min=false'//由于默认会压缩，这个任务交给了html-webpack-plugin处理
},
```

## 如何解决html中img在多页开发不能设置为相对路径；
暂时没有办法解决  

## 如何使用source-map
```js
devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
```

## 如何打包第三方库
```js
命令：npm i jquery -S
插件：全局挂载插件官方自带webpack.ProvidePlugin（有webpack的就是官方自带的插件）
生产文件时候会自动打包到相应的文件下;
```

## link中的favicon的路径问题（设置路绝对路径出错，设置了相对路径，但是其他页面link中的地址没更改，如果不设置那么图标不会输出到目标文件夹里）
```js
采用CopyWebpackPlugin 资源拷贝插件，然后在各自的页面手动添加
```

## 如何在手机端调试预览 手机上直接输入192.168.1.100:8080
```js
在package.json文件中设置路由器中固定的ip，可以在本地设置
--content-base src --host 192.168.1.100 --port 8080 --open

以下在webpack.dev.config文件中设置
devServer: {
    disableHostCheck: true//解决页面显示invalid host header
}
常用配置说明：
--content-base src 服务器所在位置，（注意：绝对路径时候必须设置，方便预览）  
--progress cmd  控制台带进度条  
--colors cmd  控制台带颜色  
--inline webpack-dev-server  的模式2  
--port 8080 配置端口  
--open 打开浏览器  
--hot 模块热加载 （注意：设置后无法自动刷新）

其他配置说明
--content-base <file/directory/url/port>：内容的基本路径。
--quiet：不要将任何东西输出到控制台。
--no-info：抑制无聊的信息。
--colors：向输出添加一些颜色。
--no-colors：不要在输出中使用颜色。
--compress：使用gzip压缩。
--host <hostname/ip>：主机名或IP。绑定到所有主机。0.0.0.0
--port <number>： 端口号。
--inline：将webpack-dev-server运行时嵌入到包中。
--hot：添加并将HotModuleReplacementPlugin服务器切换到热模式。注意：确保不要添加HotModuleReplacementPlugin两次。
--hot --inline还添加了webpack/hot/dev-server条目。
--public：覆盖在--inline客户机模式下使用的主机和端口（对VM或Docker有用）。
--lazy：不看，根据要求进行编译（不能与之组合--hot）。
--https：通过HTTPS协议提供webpack-dev-server。包括在提供请求时使用的自签名证书。
--cert，--cacert，--key：路径的证书文件。
--open：在默认浏览器中打开url（对于webpack-dev-server版本> 2.0）。
--history-api-fallback：支持历史API回退。
--client-log-level：控制浏览器中显示的控制台日志消息。使用error，warning，info或none

```

## 关于hash和chunkhash，contenthash
```
hash（默认）所有资源全打上同一个 hash，无法完成持久化缓存的需求。(一般images和fonts使用)

chunkhash为每个 chunk 资源都生成与其内容相关的 hash 摘要，为不同的资源打上不同的 hash。（js中使用）

contenthash为extract-text-webpack-plugin插件抽离出来的css打上hash（抽离的css中使用）

不要在开发环境使用 [chunkhash]/[hash]/[contenthash]，因为不需要在开发环境做持久缓存，而且这样会增加编译时间，开发环境用 [name] 就可以了。

```

## filename和chunkFilename区别
```js
filename是主入口的文件名（对应于entry里面生成出来的文件名）
chunkFilename是非主入口的文件名（未被列在entry中，按需加载（异步）模块的时候，这样的文件是没有被列在entry中的）
例如：
filename: "[name].min.js",
chunkFilename: "[name].min.js"

```


## 不显示错误插件
```
new webpack.NoErrorsPlugin(),(弃用)
new webpack.NoEmitOnErrorsPlugin()(代替NoErrorsPlugin)
```


```
ERROR in multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./src
Module not found: Error: Can't resolve 'G:\abc\src' in 'G:\abc'
 @ multi (webpack)-dev-server/client?http://localhost:8080 webpack/hot/dev-server ./src

原因：没有设置路径--content-base src
```


```
    You may need an appropriate loader to handle this file type.
    (Source code omitted for this binary file)

原因：css背景图片是二进制，需要另外的加载器处理
解决：npm i file-loader -D
```


```
$ webpack
module.js:471
    throw err;
    ^

Error: Cannot find module 'webpack'
    at Function.Module._resolveFilename (module.js:469:15)
    at Function.Module._load (module.js:417:25)
    at Module.require (module.js:497:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (G:\abc\webpack.config.js:3:15)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)

原因：全局安装了webpack后还需要在本地安装webpack，因为在配置文件中需要用到插件，而这些插件是webpack对象的一个属性（过程有点像gulp，gulp全局安装后也需要在本地安装）；
解决：npm i webpack -D
```

```
$ webpack
Invalid configuration object. Webpack has been initialised using a configuration object that does not match the API schema.
 - configuration.resolve.extensions[0] should not be empty.

原因：在webpack3.0中extensions不支持空字符串，extensions:['','.js']
解决：把extensions:['','.js']改为extensions:['*','.js']或者['.js'],
详情：<https://github.com/webpack/webpack/issues/3043>
```

```
$ webpack
G:\abc\node_modules\webpack\lib\optimize\CommonsChunkPlugin.js:10
                        throw new Error(`Deprecation notice: CommonsChunkPlugin now only takes a single argument. Either an options
                        ^

Error: Deprecation notice: CommonsChunkPlugin now only takes a single argument. Either an options
object *or* the name of the chunk.
Example: if your old code looked like this:
原因：新版改动后不再支持原来的传参方式
new webpack.optimize.CommonsChunkPlugin({'common',['a','b']});

解决：采用以下格式
new webpack.optimize.CommonsChunkPlugin({ 
    name: 'common', //注意不要.js后缀
    chunks:['main','user','index']//需要抽离的文件
});
```

```
ERROR in   Error: Child compilation failed:
  Entry module not found: Error: Can't resolve 'G:\src\index.html' in 'G:\abc':
  Error: Can't resolve 'G:\src\index.html' in 'G:\abc'

原因：路径出错了
解决：template:'./src/index.html',
改为相对路径，相对于webpack.config.js配置的路径
例如template:'./src/index.html'
或者template:'src/index.html'

```

```
(node:1784) DeprecationWarning: Chunk.modules is deprecated. Use Chunk.getNumberOfModules/mapModules/forEachModule/containsModule instead.

原因：webpack3.0中extract-text-webpack-plugin插件不推荐使用Chunk.modules，插件index.js文件中

解决:使用extract-text-webpack-plugin插件的时候报错,只是一个警告不影响工具使用，该问题还在修复中；
详情：<https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/529>
```


```
ERROR in ./node_modules/css-loader!./node_modules/less-loader/dist!./src/c.less
    Module build failed: Error: Cannot find module 'less'

原因:没有安装less模块，本以为有了load-less就不用了，新手常见坑；
解决：本地安装npm i less -D
```

```
ERROR in ./src/d.scss
Module parse failed: G:\abc\src\d.scss Unexpected token (1:2)
You may need an appropriate loader to handle this file type.

原因：没有安装node-sass模块；结合sass-loader使用
解决本地安装npm i node-sass -D
```


```
详情：<https://github.com/postcss/postcss-loader/issues/209>

package.json注释带来的问题
原因:项目的package.json中，只要带有注释，必然编译不能通过
解决:禁止在package.json中注释

## 使用devServe时，开启了inline和hot，但是热更新无效
原因是，没有引入这个插件HotModuleReplacementPlugin，需要如下声明
new webpack.HotModuleReplacementPlugin()

```

```
"webpack版本的问题"
如果webpack使用的1.x的版本，那么webpack-dev-server也要使用1.x的版本，否则会报如下错误：Connot find module 'webpack/bin/config-yargs'。
"端口占用问题"
如果已经有一个工程中使用了webpack-dev-server，并且在运行中，没有关掉的话，那么8080端口就被占用了，此时如果在另一个工程中使用webpack-dev-server就会报错：Error: listen EADDRINUSE 127.0.0.1:8080。
```

```
Module build failed: ModuleBuildError: Module build failed: Error: No PostCSS Config found in: G:\abc\src

原因：配置错误，网上LoaderOptionsPlugin它只适用于webpack 2 beta，对于webpack3.0无效，

解决：更改写法；
test: /\.css$/,
use: ExtractTextPlugin.extract({
    fallback: 'style-loader', //编译后用什么loader来提取css文件
    use: ['css-loader', {
            loader: 'postcss-loader',
            options: {
                plugins: [precss, autoprefixer({
                    browsers: ['last 10 versions'], //前缀兼容
                    remove: true //去掉不必要的后缀;
                })]
            }
        }]
})
```


## .bashrc
```js
alias in="git init"
alias cl="git clone"
alias t="touch"
alias md="mkdir"
alias tg="git tag"
alias rs="npm run dev"
alias rd="npm run pub"
# 常用命令
alias a="git add"
alias s="git status"
alias st="git stash"
alias stl="git stash list"
alias sta="git stash apply"
alias stc="git stash clear"
alias d="git diff"
alias dc="git diff --cached"
alias co="git commit -m"
alias l="git log --oneline --decorate --graph"
alias r="git reflog"
alias lf="git log --pretty=format:'%cn--%h--%cd'"
alias sl="git shortlog"
alias la="git log --author"
alias laf="git log --after"
alias lbe="git log --before"
alias b="git branch"
alias bv="git branch -vv"
alias bs="git branch --set-upstream"
alias c="git checkout"
alias cb="git checkout -b"
alias cm="git checkout master"
alias f="git fetch"
alias rem="git remote"
alias m="git merge"
alias rm="git rm"
alias rmf="git rm -f"
alias rmc="git rm --cached"
alias re="git reset"
alias reh="re --hard"
alias fs="git fsck --lost-found"
alias pl="git pull"
alias ps="git push"

# .git目录下配置
alias g="git config"
alias g1.0="g credential.helper store"
alias g1.1="g core.autocrlf false"
alias g1.2="g core.quotepath false"
alias g1.3="g core.editor \"'D:\\Program Files\\Sublime Text 3126\\sublime_text.exe' -w\""
alias g1.4="g core.safecrlf false"
alias g1.5="g push.default simple"
alias g1.6="g user.email abc@163.com"
alias g1.7="g user.name abc"
alias gl="g1.0 && g1.1 && g1.2 && g1.3 && g1.4 && g1.5 && g1.6 &&g1.7"
alias gue="g user.email"
alias gun="g user.name"

# 全局配置
alias cg="git config --global"
alias g2.0="cg credential.helper store"
alias g2.1="cg core.autocrlf false"
alias g2.2="cg core.quotepath false"
alias g2.3="cg core.editor \"'D:\\Program Files\\Sublime Text 3126\\sublime_text.exe' -w\""
alias g2.4="cg core.safecrlf false"
alias g2.5="cg push.default simple"
alias g2.6="cg user.email abc@163.com"
alias g2.7="cg user.name abc"
alias gg="g2.0 && g2.1 && g2.2 && g2.3 && g2.4 && g2.5 && g2.6 &&g2.7"
alias ggue="cg user.email"
alias ggun="cg user.name"

```

## package.json
```js
{
    "name": "webpack",
    "version": "1.0.0",
    "description": "",
    "main": "",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "better-npm-run dev",
        "pub": "better-npm-run pub"
    },
    "betterScripts": {
        "dev": {
            "command": "cross-env NODE_ENV=dev nodemon --watch webpack.config.js --watch package.json --exec \"webpack-dev-server --config webpack.config.js --inline --colors --progress --content-base src --host 192.168.1.100 --port 8080 --open\""
        },
        "pub": {
            "command": "cross-env NODE_ENV=production nodemon --watch webpack.config.js --watch package.json --exec \"webpack --config webpack.config.js\""
        }
    },
    "keywords": [],
    "author": "hedonglin",
    "license": "ISC",
    "devDependencies": {
        "autoprefixer": "^7.1.1",
        "babel-core": "^6.25.0",
        "babel-loader": "^7.1.1",
        "babel-preset-latest": "^6.24.1",
        "better-npm-run": "0.0.15",
        "clean-webpack-plugin": "^0.1.16",
        "copy-webpack-plugin": "^4.0.1",
        "cross-env": "^5.0.1",
        "css-loader": "^0.28.4",
        "cssgrace": "^3.0.0",
        "cssnext": "^1.8.4",
        "extract-text-webpack-plugin": "^2.1.2",
        "file-loader": "^0.11.2",
        "glob": "^7.1.2",
        "happypack": "^4.0.0-beta.1",
        "html-webpack-plugin": "^2.29.0",
        "html-withimg-loader": "^0.1.16",
        "less": "^2.7.2",
        "less-loader": "^4.0.4",
        "node-sass": "^4.5.3",
        "nodemon": "^1.11.0",
        "postcss": "^6.0.5",
        "postcss-clean": "^1.0.2",
        "postcss-loader": "^2.0.6",
        "precss": "^2.0.0",
        "sass-loader": "^6.0.6",
        "style-loader": "^0.18.2",
        "url-loader": "^0.5.9",
        "webpack": "^3.0.0",
        "webpack-dev-server": "^2.5.0"
    },
    "dependencies": {
        "jquery": "^3.2.1"
    }
}

```

## webpack.confing.js （使用了webpack-dev-server）
```js
/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-08 03:16:30
 */

// 引入模块及插件
var path = require('path'); //引入path模块
var webpack = require('webpack'); //引入webpack插件
var HtmlWebpackPlugin = require('html-webpack-plugin'); //新建html
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //抽离css
var CleanWebpackPlugin = require('clean-webpack-plugin'); //删除文件夹
var WebpackDevServer = require('webpack-dev-server'); //实时预览
var CopyWebpackPlugin = require("copy-webpack-plugin"); //拷贝文件
var precss = require('precss'); //CSS预处理器
var cssnext = require('cssnext'); //下一代CSS书写方式兼容现在浏览器
var cssgrace = require('cssgrace'); //让CSS兼容旧版IE
var postcssclean = require('postcss-clean'); //压缩css文件
var autoprefixer = require('autoprefixer'); //为CSS补全浏览器前缀
var glob = require('glob'); //同步执行
var happyPack = require('happyPack'); //多进程，加速代码构建

// 设置文件夹
var R = path.resolve(__dirname); //根目录，webpack.config.js所在文件夹
var S = path.resolve(R, 'src'); //入口文件夹
var D = path.resolve(R, 'dist'); //出口文件夹

// 常规配置

var igFolder = /\/src\/publics\//; // 忽略的某个文件夹所有的内容，相对于根目录
var htmlExChunks = ['']; //哪些js文件不需要嵌入到html中例如：['c']表示c.js不嵌入,['']表示都嵌入;
var delFolder = ['dist/']; //需删除的文件夹
// 出口路径
var imgPath = '/images/'; //相对于出口文件夹，如果采用绝对路径必须指定--content-base src
var fontPath = '/fonts/'; //相对于出口文件夹，如果采用绝对路径必须指定--content-base src
var cssPath = 'css/'; //相对于出口文件夹，如果采用绝对路径必须指定--content-base src
var jsPath = 'js/'; //相对于出口文件夹，如果采用绝对路径必须指定--content-base src
var mapPath = 'maps/'; //相对于出口文件夹，如果采用绝对路径必须指定--content-base src
// 配置哈希值
var jsHash = '[chunkhash:8]';
var cssHash = '[contenthash:8]';
var fontHash = '[hash:8]';
var imgHash = '[hash:8]';
var mapHash = '[chunkhash:8]';

// 小于设置的值转为bash64,单位为Bytes,10000B=9.77KB
var imgNum = 100;
var fontNum = 100;

// 公共设置
var jsName = 'common'; //抽离到符合要求的js模块到common.js文件中；
var cssBrowsers = 'last 10 versions'; //css前缀浏览器版本
var vendor = { //第三方库
    Vue: "vue",
    THREE: 'three',
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
};

// 入口文件，函数调用；
var entryHtml = getEntryHtml('./src/**/*.html'); //获取html路径，相对于根目录
var entryJs = getEntry('./src/**/*.js'); //获取js路径，相对于根目录

// 判断开发环境还是生产环境
var ENV = process.env.NODE_ENV; //package.json中配置的参数
var isDev = (ENV === 'dev') ? true : false;
var happyThreadPool = happyPack.ThreadPool({
    size: (isDev ? 4 : 10) //进程池数量
});

// 开发环境不压缩css,生成环境压缩
var cssConfig = isDev ? {
    plugins: [precss] //因使用了postcss-loader需保留precss
} : {
    plugins: [precss, cssnext, cssgrace, postcssclean, autoprefixer({
        browsers: [cssBrowsers], //前缀兼容
        remove: true //自动清除过时前缀
    })]
};


// 插件封装在数组里
var configPlugins = [
    new happyPack({
        id: 'js', //给
        // @see https://github.com/amireh/happyPack
        threadPool: happyThreadPool,
        loaders: ['babel-loader']
    }),

    new happyPack({
        id: 'css',
        threadPool: happyThreadPool,
        loaders: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader', 'sass-loader']
    }),

    // 抽离相同模块到指定文件中
    new webpack.optimize.CommonsChunkPlugin({
        name: jsName,
        // chunks: jsChunk, //省略该属性，那么默认所有块；
        // minChunks:1, //minChunks ：公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
        // minSize:5, //控制的文件大小。
        // children:true //（不能和chunks同时使用）从公共文件中抽离到各自引用的页面
    }),

    // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
    new webpack.optimize.DedupePlugin(),

    //压缩js
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }),

    // @see https://github.com/webpack/webpack/tree/master/examples/multiple-entry-points-commons-chunk-css-bundle
    new ExtractTextPlugin({
        filename: cssPath + '[name].css?v=' + cssHash,
        allChunks: true
    }),

    // 删除文件
    new CleanWebpackPlugin(
        delFolder, //匹配删除的文件
        {
            root: R, //根目录
            verbose: true, //开启在控制台输出信息
            dry: false //启用删除文件
        }
    ),

    // 允许错误不打断程序
    new webpack.NoEmitOnErrorsPlugin(),

    // 全局挂载插件
    new webpack.ProvidePlugin(vendor),

    //拷贝资源插件
    new CopyWebpackPlugin([{
        from: path.resolve(S, 'favicon.ico'),
        to: path.resolve(D, 'favicon.ico')
    }]),

    // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
    new webpack.NamedModulesPlugin()
];

// 向数组里添加新的插件
entryHtml.forEach(function(v) {
    configPlugins.push(new HtmlWebpackPlugin(v));
});

// js处理
var config = {
    // 开发环境推荐：cheap-module-eval-source-map
    // 生产环境推荐：cheap-module-source-map
    devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
    // @see https://doc.webpack-china.org/configuration/resolve/
    resolve: {
        // 省去入口文件中的后缀名
        extensions: ['.js'],
        // 别名，随时可以调用
        // 将模块名和路径对应起来,在js中直接通过require('模块名'),就可以把文件加载进去了
        alias: { //可以全局require到任何文件中，也可以用于入口文件
            "A": path.resolve(S, 'a'),
            "B": path.resolve(S, 'main/b'),
            "C": path.resolve(S, 'main/c'),
        },
    },

    // 入口文件
    entry: entryJs,

    // 出口文件配置
    output: {
        path: D, //输出文件夹
        //部署到CDN上可以用到publicPath
        // publicPath: "./", //所有url路径添加；
        filename: jsPath + '[name].js?v=' + jsHash, //
        sourceMapFilename: mapPath + '[name].map?v=' + mapHash
    },

    //加载模块
    module: {
        rules: [{
            //@see https://www.npmjs.com/package/html-withimg-loader
            test: /\.html$/,
            loader: 'html-withimg-loader?min=false', //由于默认会压缩，这个任务交给了html-webpack-plugin处理，min=false(不压缩)，exclude=../(对../的路径都不处理)，deep=false关闭include语法嵌套子页面的功能参数之间用&

        }, {
            test: /\.js$/,
            loader: 'babel-loader?id=js',
            /*exclude: path.resolve(R, 'node_modules'), //编译时，不需要编译哪些文件*/
            /*include: path.resolve(R, 'src'),//在config中查看编译时，需要包含哪些文件*/
            query: {
                presets: ['latest'] //按照最新的ES6语法规则去转换
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader', //三个参数prefix(添加前缀)，mimetype（设置文件的MIME类型）limit（在小于指定值转为bash64）
            options: {
                limit: imgNum,
                name: imgPath + '[name].[ext]?v=' + imgHash,

            }
        }, {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            loader: 'file-loader',
            options: {
                limit: fontNum,
                name: fontPath + '[name].[ext]?v=' + fontHash,
            }
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader?=css', //编译后用什么loader来提取css文件
                use: ['css-loader?=css', {
                    loader: 'postcss-loader?=css',
                    options: cssConfig
                }]
            })
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader?=css',
                use: ['css-loader?=css', {
                    loader: 'postcss-loader?=css',
                    options: cssConfig
                }, 'less-loader?=css']
            })
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader?=css',
                use: ['css-loader?=css', {
                    loader: 'postcss-loader?=css',
                    options: cssConfig
                }, 'sass-loader?=css']
            })
        }]
    },
    plugins: configPlugins,
    devServer: {
        disableHostCheck: true //手机端访问必须设置
    }
};

// 获取js路径
function getEntry(globPath) {
    var entries = {};
    glob.sync(globPath).forEach(function(entry) {
        var basename = path.basename(entry, path.extname(entry));
        var pathname = path.dirname(entry);
        if (!entry.match(igFolder)) {
            entries[basename] = pathname + '/' + basename;
        }
    });
    return entries;
}

// 获取html路径
function getEntryHtml(globPath) {
    var entries = [];
    glob.sync(globPath).forEach(function(entry) {
        // http://nodejs.cn/api/path.html
        var basename = path.basename(entry, path.extname(entry)); //不带后缀的文件名
        var pathname = path.dirname(entry); //不带文件名(/文件名.js)
        // 开发环境不压缩html,生成环境压缩
        var minifyConfig = isDev ? '' : { //是否压缩{...} | 默认（false）
            removeComments: true, //清除HTML注释
            keepClosingSlash: true, //是否保留源文件中半闭合的斜杠(在源文件中最好写上半斜杠，如果源文件中没有半闭合斜杠则不会自动添加)
            collapseWhitespace: true, //删除空白符与换行符
            collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
            minifyJS: true, //压缩页面JS
            minifyCSS: true //压缩页面CSS
        };

        // 排除某个写文件
        if (!entry.match(igFolder)) {
            entries.push({
                filename: entry.split('/').splice(2).join('/'), //出口文件名及路径
                template: entry,
                chunks: [jsName, basename], //把哪些js文件嵌入到html
                // favicon: 'src/favicon.ico', //网站图标（相对于根目录所以要加src,但多页面开发中自动嵌入head后地址不更改，也不能相对设置为绝对路径，不太友好，手动设置使用copy插件处理）
                inject: true, //把template模板注入到哪个标签,true | 'head' | 'body' | false
                hash: false, //是否添加hash，默认(false)
                cache: true, //是否缓存，默认（true)
                xhtml: true, //默认（false),注意，这里指的是该插件自动生成的半闭合标签进行添加斜杠；并不是模板里的；
                showErrors: false, //是否将错误的详细信息将被写入HTML页面，默认为（true）；
                excludeChunks: htmlExChunks, //排除某些块
                minify: minifyConfig
            });
        }
    });
    return entries;
}

module.exports = config;

```
