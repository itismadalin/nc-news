const articlesRouter = require('express').Router();
const { sendArticleById, sendUpdatedArticle, sendAllArticles } = require('../controllers/articlesController');

articlesRouter.route('/')
articlesRouter.route('/:article_id').get(sendArticleById).patch(sendUpdatedArticle);
articlesRouter.route('/:article_id/comments')

module.exports = articlesRouter;