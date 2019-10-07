const keys = require('./keys');
const redis = require('redis');


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

// function to calculate fib
function fib(index) {
    if (index < 2){
        return 1;
    } else {
        return fib(index - 1) + fib( index -2);
    }
}

sub.on('message', (channel, message)=>{
    // insert a index:value to a hash set values
    redisClient.hset('values', message, fib(parseInt(message)));
});

sub.subscribe('insert');