/* jshint esversion: 6 */

// 文章
let Mock=require('mockjs');
let Random=Mock.Random;

module.exports=()=>{
    let data={
        articles:[]
    };

    for(let i=0;i<100;i++){
        data.articles.push({
            id:i,
            author:Random.cname(),
            time:Random.time('yyyy-MM-dd'),
            title:Random.ctitle(6),
            tag:Random.word(4),
            views:Random.integer(100,5000),
            discuss:Random.integer(1,100),
            content:Random.cparagraph(30,100)
        });
    }
    return data;
};
