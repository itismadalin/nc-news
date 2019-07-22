const articlesRouter = require('express').Router();
const { sendArticleById, sendUpdatedArticle, sendAllArticles } = require('../controllers/articlesController');
const {addComments, sendAllComments} = require('../controllers/commentsController');
const { methodNotAllowed } = require('../errors/index');

articlesRouter.route("/").get(sendAllArticles).all(methodNotAllowed);
articlesRouter.route("/:article_id").get(sendArticleById).patch(sendUpdatedArticle).all(methodNotAllowed);
articlesRouter.route("/:article_id/comments").post(addComments).get(sendAllComments).all(methodNotAllowed);

module.exports = articlesRouter;