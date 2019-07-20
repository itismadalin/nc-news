const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topicsController');
const { methodNotAllowed } = require('../errors/index');


topicsRouter.route('/').get(sendTopics).all(methodNotAllowed);

module.exports = topicsRouter;