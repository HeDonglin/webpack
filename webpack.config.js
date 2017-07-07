/*
 * @Author: hedonglin
 * @Date:   2017-07-07 20:19:39
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-07 23:40:10
 */

// 单页面开发
var path = require('path'); //引入path模块
var webpack = require('webpack'); //引入webpack插件
var HtmlWebpackPlugin = require('html-webpack-plugin'); //引入HtmlWebpackPlugin插件
var ExtractTextPlugin = require("extract-text-webpack-plugin"); //引入ExtractTextPlugin插件
var CleanWebpackPlugin = require('clean-webpack-plugin'); //引入CleanWebpackPlugin插件
var WebpackDevServer = require('webpack-dev-server'); //引入WebpackDevServer插件
var CopyWebpackPlugin = require("copy-webpack-plugin"); //引入CopyWebpackPlugin插件
var precss = require('precss'); //引入precss插件
var cssnext = require('cssnext'); //下一代CSS书写方式兼容现在浏览器
var cssgrace = require('cssgrace'); //让CSS兼容旧版IE
var postcssclean = require('postcss-clean'); //压缩css文件
var autoprefixer = require('autoprefixer'); //为CSS补全浏览器前缀


// 设置文件夹
var R = path.resolve(__dirname); //webpack.config.js所在文件夹，即是porject项目文件夹
var S = path.resolve(R, 'src'); //在porject文件夹下的src文件夹作为入口文件夹
var D = path.resolve(R, 'dist'); //在porject文件夹下建立dist文件夹作为输出文件夹

// 一键配置单页面开发
var jsHash='[chunkhash:8]';
var jsName='common';//公共模块名
var jsChunk=['b','c'];//指定从哪些模块提取到公共模块
var cssHash='[contenthash:8]';
var cssBrowsers='last 10 versions';//css前缀浏览器版本
var imgPath='./images/';//相对于入口文件，如果采用绝对路径必须指定--content-base src
var imgHash='[hash:8]';
var imgNum=1000;//小于设置的值图片转为bash64，单位字节B,10000B=9.77KB
var fontPath='./fonts/';//相对于入口文件
var fontHash='[hash:8]';
var fontNum=1000;//小于设置的值图片转为bash64，单位字节B,10000B=9.77KB
var htmlChunk=true;//指定哪些js文件嵌入到html中,true为所有，['c']指定c模块；
var htmlExChunks=[''];//排除哪些js文件嵌入到html中['c'],['']表示不排除;
var htmlTemplate='src/main/b.html';//指定路径的模板,相对于配置文件要加src
var htmlFilename='index.html';//相对于出口文件配置path；（输入模板的名字必须为index.html并且不能设置路径否则不能预览）
var htmlFavicon='src/favicon.ico';//相对于配置文件要加src

module.exports = {
    // 便于开发调试,现在的代码是合并以后的代码，不利于排错和定位，添加这个以后就会采用source-map的形式直接显示你出错代码的位置。
    // 开发环境推荐：
    // cheap-module-eval-source-map
    // 生产环境推荐：
    // cheap-module-source-map
    devtool: 'cheap-module-eval-source-map',
    // 文件路径的指向，https://doc.webpack-china.org/configuration/resolve/
    resolve: {
        // 省去入口文件中的后缀名
        extensions: ['.js'],
        // 别名，随时可以调用
        // 将模块名和路径对应起来,在js中直接通过require('模块名'),就可以把文件加载进去了
        alias: {
            // 首页
            // "A": path.resolve(S, 'a'),
            "B": path.resolve(S, 'main/b'),
            "C": path.resolve(S, 'main/c'),
        },
    },

    // 入口文件
    entry: {
        // "a": ['A'],
        "b": ['B'],
        "c": ['C'],
    },

    // 出口文件配置
    output: {
        //在porject文件夹下建立dist文件夹
        path: D,
        //部署到CDN上可以用到publicPath
        // publicPath: "./",//如果设置了那么预览的文件是相对 publicPath 这个路径的
        filename: '[name].js?v='+jsHash,
        sourceMapFilename: 'maps/[name].map'
    },

    //加载模块
    module: {
        rules: [{
            //https://www.npmjs.com/package/html-withimg-loader
            test: /\.html$/,
            loader: 'html-withimg-loader?min=false', //由于默认会压缩，这个任务交给了html-webpack-plugin处理，min=false(不压缩)，exclude=../(对../的路径都不处理)，deep=false关闭include语法嵌套子页面的功能参数之间用&

        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            /*exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件*/
            /*include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件*/
            query: {
                presets: ['latest'] //按照最新的ES6语法规则去转换
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',//prefix(添加前缀)，mimetype（设置文件的MIME类型）limit（在小于指定值转为bash64）
            options: {
                limit: imgNum, // 把较小的图片转换成base64的字符串内嵌在生成的js文件里,单位B字节，10000大小为9.77KB；
                name: imgPath+'[name].[ext]?v='+imgHash,// 默认相对于src，路径和生产环境下的不同，要与修改后的publickPath相结合

            }
        }, {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            loader: 'file-loader',
            options: {
                limit: fontNum,
                name: fontPath+'[name].[ext]?v='+fontHash, // 默认相对于src，路径和生产环境下的不同，要与修改后的publickPath相结合
            }
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader', //编译后用什么loader来提取css文件
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [precss, cssnext, cssgrace, postcssclean, autoprefixer({
                            browsers: [cssBrowsers], //前缀兼容
                            remove: true //去掉不必要的后缀;
                        })]
                    }
                }]
            })
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader', //编译后用什么loader来提取css文件
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [precss, cssnext, cssgrace, postcssclean, autoprefixer({
                            browsers: [cssBrowsers], //前缀兼容
                            remove: true //去掉不必要的后缀;
                        })]
                    }
                }, 'less-loader']
            })
        }, {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader', //编译后用什么loader来提取css文件
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [precss, cssnext, cssgrace, postcssclean, autoprefixer({
                            browsers: [cssBrowsers], //前缀兼容
                            remove: true //去掉不必要的后缀;
                        })]
                    }
                }, 'sass-loader']
            })
        }]
    },

    // 插件项
    plugins: [
        // 一般我们把自己写的模块进行模块化打包，其他第三方的直接引入不需要打包这样更有针对性；
        // 把js/aa和js/bb相同的模块抽离出来放到common.js中
        new webpack.optimize.CommonsChunkPlugin({
            name: jsName, //提取公共代码块后js文件的名字
            chunks: jsChunk, //省略该属性，那么默认所有块；
            // minChunks:1, //minChunks ：公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
            // minSize:5, //控制的文件大小。
            // children:true //（不能和chunks同时使用）从公共文件中抽离到各自引用的页面
        }),

        // 自动插入相关脚本（favicon,模板，js），压缩，hash处理
        new HtmlWebpackPlugin({
            title: 'hello', //设置效title的名字，如果template已经有了此处无
            template: htmlTemplate, //加载自定义模板（默认情况下为ejs)也可以是html,要使用的模块的路径（注意是相对路径，相对于本文件的路径）
            filename: htmlFilename, //出口文件（默认是 index.html）
            favicon: htmlFavicon, //网站图标
            inject: true, //把template模板注入到哪个标签,true | 'head' | 'body' | false
            hash: false, //是否添加hash，默认(false)
            cache: true, //是否缓存，默认（true)
            xhtml: true, //默认（false),注意，这里指的是该插件自动生成的半闭合标签进行添加斜杠；并不是模板里的；
            showErrors: false, //是否将错误的详细信息将被写入HTML页面，默认为（true）；
            chunks:htmlChunk,//指定哪些模块嵌入到html中
            excludeChunks:htmlExChunks,//排除某些块(不太明白)
            minify: {
                removeComments: true, //清除HTML注释
                keepClosingSlash: true, //是否保留源文件中半闭合的斜杠(在源文件中最好写上半斜杠，如果源文件中没有半闭合斜杠则不会自动添加)
                collapseWhitespace: true, //删除空白符与换行符
                collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
                removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
                removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
                removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
                minifyJS: true, //压缩页面JS
                minifyCSS: true //压缩页面CSS
            }, //是否压缩{...} | 默认（false）
        }),

        // 把js中通过require('/index.css')中的文件抽离出来插入到html文件link标签中
        new ExtractTextPlugin("[name].css?v="+cssHash), //单独使用style标签加载css并设置其路径

        // 删除文件
        new CleanWebpackPlugin(
            ['dist/'], 　 //匹配删除的文件
            {
                root: R, //根目录
                verbose: true, //开启在控制台输出信息
                dry: false //启用删除文件
            }
        ),

        // 允许错误不打断程序
        new webpack.NoEmitOnErrorsPlugin(),

        // 全局挂载插件
        new webpack.ProvidePlugin({
            Vue: "vue",
            THREE: 'three',
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        //拷贝资源插件
        // new CopyWebpackPlugin([{
        //     from: path.resolve(S, 'a'),
        //     to: path.resolve(D, 'a')
        // }]),

        // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
        new webpack.NamedModulesPlugin()

    ]
};

