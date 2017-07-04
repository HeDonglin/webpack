// 引入模块及插件
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

module.exports = {
    // 便于开发调试,现在的代码是合并以后的代码，不利于排错和定位，添加这个以后就会采用source-map的形式直接显示你出错代码的位置。
    // devtool:'source-map',
    // 文件路径的指向，https://doc.webpack-china.org/configuration/resolve/
    resolve: {
        // 省去入口文件中的后缀名
        extensions: ['.js'],
        // 别名，随时可以调用
        // 将模块名和路径对应起来,在js中直接通过require('模块名'),就可以把文件加载进去了
        alias: {
            // 首页
            "a": path.resolve(S, 'a'),
            "b": path.resolve(S, 'b'),
        },
    },

    // 入口文件
    entry: {
        "a": ['a'],
        "b": ['b'],
    },

    // 出口文件配置
    output: {
        //在porject文件夹下建立dist文件夹
        path: D,
        //部署到CDN上可以用到publicPath
        publicPath: "/",
        filename: '[name].js?v=[hash:8]',
    },

    //加载模块
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            /*exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件*/
            /*include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件*/
            query: {
                presets: ['latest'] //按照最新的ES6语法规则去转换
            }
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader',
            options: {
                limit: 10000, // 把较小的图片转换成base64的字符串内嵌在生成的js文件里,单位B字节，大小为9.77KB；
                name: 'images/[name].[ext]?v=[hash:8]' // 路径和生产环境下的不同，要与修改后的publickPath相结合
            }
        }, {
            test: /\.(eot|woff|woff2|svg|ttf)([\?]?.*)$/,
            loader: 'file-loader',
            options: {
                limit: 10000,
                name: 'fonts/[name].[ext]?v=[hash:8]', // 路径和生产环境下的不同，要与修改后的publickPath相结合
                prefix: 'font'
            }
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader', //编译后用什么loader来提取css文件
                use: ['css-loader', {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [precss, cssnext, cssgrace, postcssclean, autoprefixer({
                            browsers: ['last 10 versions'], //前缀兼容
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
                            browsers: ['last 10 versions'], //前缀兼容
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
                            browsers: ['last 10 versions'], //前缀兼容
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
            name: 'common', //提取公共代码块后js文件的名字
            chunks: ['a', 'b'], //省略该属性，那么默认所有块；
            // minChunks:1, //minChunks ：公共模块被使用的最小次数。比如配置为3，也就是同一个模块只有被3个以外的页面同时引用时才会被提取出来作为common chunks。
            // minSize:5, //控制的文件大小。
            // children:true //（不能和chunks同时使用）从公共文件中抽离到各自引用的页面
        }),

        // 自动插入相关脚本（favicon,模板，js），压缩，hash处理
        new HtmlWebpackPlugin({
            title: '主页', //设置效title的名字，如果template已经有了此处无
            filename: 'index.html', //设置这个html的文件名
            template: 'src/index.html', //加载自定义模板（默认情况下为ejs)也可以是html,要使用的模块的路径（注意是相对路径，相对于本文件的路径）
            favicon: 'src/favicon.ico', //
            inject: 'body', //把template模板注入到哪个标签,true | 'head' | 'body' | false
            hash: false, //是否添加hash，默认(false)
            cache: true, //是否缓存，默认（true)
            xhtml: true, //默认（false),注意，这里指的是该插件自动生成的半闭合标签进行添加斜杠；并不是模板里的；
            showErrors: false, //是否将错误的详细信息将被写入HTML页面，默认为（true）；
            // chunks:['app'],//限定某些块(不太明白)
            // excludeChunks:['dev-helper'],//排除某些块(不太明白)
            minify: {
                removeComments: true, //清除HTML注释
                keepClosingSlash: true, //是否保留源文件中半闭合的斜杠(在源文件中最好写上半斜杠，如果源文件中没有半闭合斜杠则不会自动添加)
                collapseWhitespace: false, //删除空白符与换行符
                collapseBooleanAttributes: false, //省略布尔属性的值 <input checked="true"/> ==> <input />
                removeEmptyAttributes: false, //删除所有空格作属性值 <input id="" /> ==> <input />
                removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
                removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
                minifyJS: true, //压缩页面JS
                minifyCSS: true //压缩页面CSS
            }, //是否压缩{...} | 默认（false）
        }),

        // 把js中通过require('/index.css')中的文件抽离出来插入到html文件link标签中
        new ExtractTextPlugin("[name].css?v=[contenthash:8]"), //单独使用style标签加载css并设置其路径

        // 删除文件
        new CleanWebpackPlugin(
            ['dist/'], 　 //匹配删除的文件
            {
                root: __dirname, //根目录
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
        new CopyWebpackPlugin([{
            from: path.resolve(S, 'a'),
            to: path.resolve(D, 'a')
        }]),

        // 当模块热替换（HMR）时在浏览器控制台输出对用户更友好的模块名字信息
        new webpack.NamedModulesPlugin()

    ]
};
