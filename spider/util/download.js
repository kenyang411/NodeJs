const fs = require('fs');
var request = require("request");
var path = require('path');

module.exports.downloadAsync = async function downloadAsync(url, fileName) {
    return new Promise((resolve, reject) => {
        //创建文件夹目录
        var dirPath = path.join("audio/");
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            console.log("文件夹创建成功");
        } else {
            console.log("文件夹已存在");
        }

        //开始下载
        let stream = fs.createWriteStream(`audio/${fileName}.m4a`);
        request(url).pipe(stream).on('close',function(err){
            if(err){
                reject("下载视频出错："+err);
            }else{
                resolve(`文件${fileName}.m4a下载完毕`);
            }
        })
    });
}
