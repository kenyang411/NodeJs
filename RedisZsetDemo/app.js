const express = require('express');
const redisHelper = require('./util/redisHelper');
const app = express();

const key = "lb";

//获取信息 前100名和单个用户信息
app.get('/gets', async (req, res) => {
    try {
        res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
        var name = req.query.name;

        //获取当前信息补充到后面
        // if (!name) {
        //     res.end("请输入用户名");
        //     return;
        // }
        var results = await redisHelper.redis.zrevrangeAsync(key, 0, 2, 'withscores');
        var length = results.length;

        // //根据key从redis获取数据
        var ranking = await redisHelper.redis.zrevrankAsync(key, name);   //获取当前用户排名
        var score = await redisHelper.redis.zscoreAsync(key, name);      //获取当前用户分数

        var curUser = {};
        if (score != null) {
            curUser = { ranking: ranking+1, name: name, score: score };
        }


        var datas = [];
        for (var i = 0; i < results.length; i += 2) {
            data = {};
            data.ranking = i / 2 + 1;
            data.name = results[i];
            data.score = results[i + 1];
            datas.push(data);
        }

        datas = { datas: datas, curUser: curUser }
        res.end(JSON.stringify(datas));

    } catch (error) {
        console.log(error);
    }
})

/**
 * var args = [ 'myzset', 1, 'one', 2, 'two', 3, 'three', 99, 'ninety-nine' ];
 */
//添加
app.post('/add', async (req, res) => {
    //var datas=req.body.datas;
    /**
     * 把分数和姓名都存放到数组中，然后数组使用join(',')拼接即可
     */
    var dataArray=[];
    //dataArray.push(`${key}`);
    dataArray.push(60);
    dataArray.push("a");
    dataArray.push(70);
    dataArray.push("b");
    dataArray.push(80);
    dataArray.push("c");

    res.writeHead(200, { "Content-Type": "text/plain'charset=utf-8" });
    try {
        var result = await redisHelper.redis.zaddAsync(key,dataArray);
        res.end(JSON.stringify(result));
    } catch (err) {
        res.end(err);
    }
});


//删除全部
app.get('/delall', async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
    try {
        var result = await redisHelper.redis.zremrangebyrankAsync(key, 0, -1);
        res.end("redis已清空");
    } catch (err) {
        console.log(err);
    }
})


app.listen(3000, () => {
    console.log("Server run at http://localhost:3000");
})
