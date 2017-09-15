/* jshint esversion: 6 */
var Mock = require('mockjs');
var Random = Mock.Random;
var news=require('./data/news.js');
var users=require('./data/users.js');
var articles=require('./data/articles.js');
module.exports = {
    news: Mock.mock(news),
    users:Mock.mock(users),
    articles:Mock.mock(articles),
};
