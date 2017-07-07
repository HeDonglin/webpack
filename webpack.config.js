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
