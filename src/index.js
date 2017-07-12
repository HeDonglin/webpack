// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

console.log($('#less'));
require('./index.css');
require('./less.less');
require('./scss.scss');
require('./sass.sass');
// require('./app.vue');
// window.onload = function() {

console.log('日志');
console.log('日志');
// console.log('日志');
// console.log('日志');

// console.log('日志');
if (module.hot) {
    module.hot.accept();
}
