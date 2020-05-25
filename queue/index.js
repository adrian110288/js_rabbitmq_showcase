const rabbitPromise = require('./rabbit');
const q = require('q');
const config = require('../config');

function queueSetup(rabbit) {
    rabbit.queue(
        'debug.log', {autoDelete: false}, function (q) {
            q.bind(config.rabbitMq.exchange, '*.log');
            q.close()
        }
    )

    rabbit.queue(
        'error.log', {autoDelete: false}, function (q) {
            q.bind(config.rabbitMq.exchange, 'error.log');
            q.close()
        }
    )
}

module.exports = q.Promise(function (resolve, reject, notify) {
    rabbitPromise.done(function (rabbit) {
        rabbit.exchange(
            config.rabbitMq.exchange,
            {type: 'topic', autoDelete: false},
            function (exchange) {
                queueSetup(rabbit);
                resolve(exchange)
            }
        )
    })
})