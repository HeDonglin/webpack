/* jshint esversion: 6 */

/*
 * @Author: hedonglin
 * @Date:   2017-07-11 04:38:05
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-08-06 20:10:33
 */
require('./public/reset.css');
require('./public/common.css');
import App from './app.vue';

new Vue({
    render: h => h(App)
}).$mount('#app');
