const amqp = require('amqp');
const q = require('q');
const config = require('../config');

module.exports = q.Promise(function (resolve, reject, notify) {
    const rabbit = amqp.createConnection({
        host: config.rabbitMq.host,
        port:config.rabbitMq.port,
        login: config.rabbitMq.login,
        password: config.rabbitMq.password
    });

    rabbit.on('ready', function () {
        console.log("RabbitMQ connection ready")
        resolve(rabbit);
    })

    rabbit.on('error', function (e) {
        console.log("Error connecting to RabbitMQ!", e)
        reject()
    })

})