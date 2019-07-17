exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({msg: err.msg || 'Oops! Something is not quite right.'});
    } 
    else next(err);
  };