const express = require('express');
const { routeNotFound, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');
const apiRouter = require('./routers/apiRouter');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);


//handle errors
app.use('/*', routeNotFound);
app.use(handleCustomErrors);
app.use(handlePsqlErrors)
app.use(handleServerErrors);


module.exports = app;