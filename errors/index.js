exports.routeNotFound = (req, res) => {
  res.status(404).send({ status: 404, msg: 'Route not found' });
}

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg || 'Oops! Something is not quite right.' });
  }
  else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  const psqlBadRequestCodes = {
    '22P02': { status: 400, msg: 'Invalid Entry' },
    '23503': { status: 404, msg: 'Input not found' },
    '42703': { status: 400, msg: 'Column Not Found' }
  };
  if (psqlBadRequestCodes[err.code])
    res
      .status(psqlBadRequestCodes[err.code].status)
      .send({ msg: psqlBadRequestCodes[err.code].msg || 'Bad Request' });
  else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal server error' });
};