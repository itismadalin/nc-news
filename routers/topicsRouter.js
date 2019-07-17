const topicsRouter = require('express').Router();
const { sendTopics } = require('../controllers/topicsController');

topicsRouter.route('/').get(sendTopics);

module.exports = topicsRouter;