/* jshint esversion: 6 */

/*
 * @Author: hedonglin
 * @Date:   2017-07-11 04:38:05
 * @Last Modified by:   hedonglin
 * @Last Modified time: 2017-07-14 09:56:37
 */

import Vue from 'vue';
require('./app.css');
import App from './app.vue';


new Vue({
    render: h => h(App)
}).$mount('#app');

