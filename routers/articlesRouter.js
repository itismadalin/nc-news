const articlesRouter = require('express').Router();
const { sendArticleById } = require('../controllers/articlesController');

articlesRouter.route('/:article_id').get(sendArticleById);

module.exports = articlesRouter;