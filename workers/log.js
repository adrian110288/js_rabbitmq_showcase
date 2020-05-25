const rabbitPromise = require('../queue/rabbit');
const config = require('../config');
const fs = require('fs-extra')
const os = require('os');

rabbitPromise.done(function (rabbit) {

    rabbit.queue('debug.log', {autoDelete: false}, function (q) {
        q.bind(config.rabbitMq.exchange, '*.log');
        q.subscribe({ack: true, prefetchCount: 1}, function (message, headers, delivery, messageObject) {

            const log = 'Debug-Routing:' + delivery.routingKey + JSON.stringify(message)
            fs.outputFileSync('logs/debug-log.txt', log + os.EOL, {flag: 'a'})
            console.log(log);

            messageObject.acknowledge();

            // reject re-queues a message if worker cannot complete the work.
            //
            // setTimeout(function () {
            //         messageObject.reject(true);
            //     },
            //     2000);
        })
    })

    rabbit.queue('error.log', {autoDelete: false}, function (q) {
        q.bind(config.rabbitMq.exchange, 'error.log');
        q.subscribe({ack: true, prefetchCount: 1}, function (message, headers, delivery, messageObject) {

            const log = 'Error-Routing:' + delivery.routingKey + JSON.stringify(message)
            fs.outputFileSync('logs/error-log.txt', log + os.EOL, {flag: 'a'})
            console.log(log);

            messageObject.acknowledge();
        })
    })


})