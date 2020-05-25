const express = require('express');
const config = require('./config');
const {logger, error} = require('./middleware/log');

const app = express()

app.use(logger)

app.get('/error', function (req, res) {
    error({error: 'Error 404'})
    res.status(404).send()
})

app.listen(config.app.port, () => console.log('App started on port ' + config.app.port))