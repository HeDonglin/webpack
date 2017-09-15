/* jshint esversion: 6 */

// 用户密码
let Mock=require('mockjs');
let Random=Mock.Random;
module.exports=()=>{
    let data={
        users:[]
    };

    for(let i=0;i<100;i++){
        data.users.push({
            id:i,
            username:Random.cname(),
            password:'abc'+i
        });
    }
    return data;
};
