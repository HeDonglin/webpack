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
nodemon 监听多个文件时候需要些两次--watch，但是监控packge.json实际内容还是旧的  
监听webpack.config.js文件改动可以自动重新加载配置  
--exec \"\" 运行插件配置信息  
--content-base src 服务器所在位置，当有绝对路径时候必须设置
--progress cmd控制台带进度条  
--colors cmd控制台带颜色  
--inline webpack-dev-server的模式2  
--port 8080 配置端口  
--open 打开浏览器  
--hot 模块热加载 （注意：设置后无法自动刷新）  


## 开发的时候使用
npm run dev (git中配置了快捷键rs)

## 生成dist文件夹
npm run pub (git中配置了快捷键rd)

## 问题1：如何解决html中img图片没有hash
方法1：var imgUrl = require('./images/1.gif');缺点：没法添加hash  
方法2：npm i html-withimg-loader -D  ，缺点多页面中无法实现相对地址；
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

## 问题6：如何在手机端调试预览 手机上直接输入192.168.1.100:8080
```
    在package.json文件中设置路由器中固定的ip，可以在本地设置
    --content-base src --host 192.168.1.100 --port 8080 --open
    以下在webpack.dev.config文件中设置
    devServer: {
        disableHostCheck: true//解决页面显示invalid host header
    }
```

## .bashrc
```
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
```    
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
            "command": "cross-env NODE_ENV=dev nodemon --watch webpack.dev.config.js --watch package.json --exec \"webpack-dev-server --config webpack.dev.config.js --inline --colors --progress --content-base src --host 192.168.1.100 --port 8080 --open\""
        },
        "pub": {
            "command": "cross-env NODE_ENV=production nodemon --watch webpack.dev.config.js --watch package.json --exec \"webpack --config webpack.dev.config.js\""
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

## webpack.config.js
```
/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-08 00:39:23
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
// 忽略的文件夹
var igFolder = /\/src\/publics\//; //相对于根目录
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

    new webpack.optimize.CommonsChunkPlugin({
        name: jsName,
        // chunks: jsChunk, //省略该属性，那么默认所有块；
        // minChunks:1, //minChunks ：公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
        // minSize:5, //控制的文件大小。
        // children:true //（不能和chunks同时使用）从公共文件中抽离到各自引用的页面
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
    // new CopyWebpackPlugin([{
    //     from: path.resolve(S, 'a'),
    //     to: path.resolve(D, 'a')
    // }]),

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
        disableHostCheck: true//手机端访问必须设置
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
        // https://github.com/kangax/html-minifier#options-quick-reference
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
        // src/publics/*.html 排除在publices中定位
        if (!entry.match(igFolder)) {
            entries.push({
                filename: entry.split('/').splice(2).join('/'), //出口文件名及路径
                template: entry,
                chunks: [jsName, basename], //把哪些js文件嵌入到html
                // title: 'hello', //设置效title的名字，如果template已经有了此处无
                favicon: 'src/favicon.ico', //网站图标（相对于根目录所以要加src）
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
