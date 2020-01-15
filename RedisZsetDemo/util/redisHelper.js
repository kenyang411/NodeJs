const redis=require('redis');
const bluebird=require('bluebird');
const dbConfig=require('./dbConfig');


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

//创建redisClient
var redisClient = redis.createClient(dbConfig.redis_config.port, dbConfig.redis_config.host, {})
if (dbConfig.redis_config.password != "") {
    redisClient.auth(dbConfig.redis_config.password);
}
redisClient.on('error', function (err) {
    utils.log('Error ' + err);
});

module.exports.redis = redisClient;