const express = require('express');
const app = express();
const apiRouter = require('./routers/apiRouter');
app.use(express.json());
const { routeNotFound, handleCustomErrors, handlePsqlErrors, handleServerErrors } = require('./errors/index');
let cors = require('cors');

app.use('/api', apiRouter);

app.use(cors());

//handle errors
app.use('/*', routeNotFound);
app.use(handleCustomErrors);
app.use(handlePsqlErrors)
app.use(handleServerErrors);


module.exports = app;