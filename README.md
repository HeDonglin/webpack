## 多页面开发
开发工具：Sublime Text 3126  （简称ST）  
必备工具：node，npm，git  
构建工具：webpack，gulp  

主要功能：  
压缩，添加hash（?v=8位），抽离css，自动把link和script插入模板html中，所有页面都可以进行热更新（无刷新更新）
html文件上支持使用#include("./handlebars/layout.html")；嵌套子页面  
css文件上支持下一代css书写，css前缀补全，css兼容写法，postcss，less，sass，scss  
js文件上支持es6  
vue文件上支持模板书写  

原理：三个主要文件，html+css+js  
获取src下的所有html文件作为模板，js文件作为入口，文件名一一对应，如index.html,index.js，css文件名可以随意，因为它嵌入到js文件中使用的；经过loader和插件处理后得到相应的文件  

最终生成：文件保存在相应的文件夹下  
favicon.ico  
html文件夹，css文件夹，js文件夹，assets文件夹，font文件夹，img文件夹  

目前还不够完美的地方：
1. 生成后的文件html页面img的url是绝对路径，其实个人想把它设置为相对路劲，方便查看，只是想做的全能一点而已；
2. 在vue预览的时候如果在html页面上添加内容vue解析需要手动刷新一次才可以显示（暂时还没好的方案），其他功能都完美；


## 两种启动方式

### 第一种：git+npm  
预览：npm run dev  
生成：npm run pro  
.bashrc文件快捷命令，存放在C:\Users\Administrator目录下  
记忆：rs（src目录）rd（dist目录）  
alias rs="npm run dev"  
alias rd="npm run pro"  

### 第二种：ST+gulp插件(推荐)
好处：不用打开git，按下快捷键即可进行打包或者预览  
### 第一步：打开gulpfile.js选择模式  
```js
var sEnv="dev"; //选择dev（预览状态）和pro（打包状态）两个选项
if (false) {}//true gulp预览；false webpack工具预览
```

### 第二步：复制粘贴快捷键到ST中
```js
以下是gulp的中配置的快捷键，一般用到最多的是ctrl+alt+j和ctrl+alt+q

    ctrl+alt+q gulp 显示输出窗口
    ctrl+alt+h gulp 缓存清理
    ctrl+alt+j gulp 默认启动default任务
    ctrl+alt+k gulp 结束所有任务
    ctrl+alt+l gulp 任意任务启动
    ctrl+alt+; gulp 运行最后一次运行的任务
    ctrl+alt+o gulp 打开任务列表
    ctrl+alt+p gulp 打开插件列表

{ "keys": ["ctrl+alt+q"],  "command": "gulp_show_panel" },
{ "keys": ["ctrl+alt+h"],"command": "gulp_delete_cache", "args": { "paths": [] }},
{ "keys": ["ctrl+alt+j"], "command": "gulp", "args": { "task_name": "default", "paths": [] } },
{ "keys": ["ctrl+alt+k"],  "command": "gulp_kill" },
{ "keys": ["ctrl+alt+l"],"command": "gulp_arbitrary", "args": { "paths": [] } },
{ "keys": ["ctrl+alt+;"],"command": "gulp_last", "args": { "paths": [] } },
{ "keys": ["ctrl+alt+o"],"command": "gulp", "args": { "paths": [] }},
{ "keys": ["ctrl+alt+p"],"command": "gulp_plugins"},


```

## 默认情况预览只是打开index.html文件如果想要打开其他页面

# 全程演示  
https://github.com/HeDonglin/webpack/blob/master/src/assets/1.gif
