const request = require('request');
const download = require('./util/download');

main();

async function main() {
    for (let i = 293; i <= 860; i++) {
        var url = `http://m.ting56.com/video/4092-0-${i}.html`;

        var oriurl = await getOriginUrlAsync(url);    //获取原始url
        console.log("原始url：" + oriurl);

        var url = await getAduioUrlAsync(oriurl);
        console.log("视频url：" + url);

        //开始下载
        await download.downloadAsync(url, i);

        await sleep(1000 * 5);    //休息5秒
    }

}


/**
 * 封装休息时间
 * @param {休息时间} duration 
 */
async function sleep(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}


/**
 * 获取音频url
 * @param {页面获取原始音频地址} url 
 */
async function getAduioUrlAsync(url) {
    let decode = url.split('*');
    for (let i = 0; i < decode.length; i++) {

        let tmp = String.fromCharCode(decode[i]);
        var result;
        result += tmp;
    }
    url = result.split('&')[0];
    url = url.toString().split('http')[1];
    url = "http" + url;
    return url;
}


/**
 * 解析原始url提取音频地址
 */
async function getOriginUrlAsync(oriurl) {
    return new Promise((resolve, reject) => {
        request(oriurl, function (err, response, body) {
            if (err) {
                reject(err);
            }
            var tmp = body.split("FonHen_JieMa('*");
            var data = tmp[1].split(").split('&'))");
            resolve(data[0]);
        })
    })
}

