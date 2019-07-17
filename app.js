const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
app.use(express.json());
const { handleCustomErrors } = require('./errors/index');

app.use('/api', apiRouter);

app.use(handleCustomErrors);

module.exports = app;