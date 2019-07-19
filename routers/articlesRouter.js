const articlesRouter = require('express').Router();
const { sendArticleById, sendUpdatedArticle, sendAllArticles } = require('../controllers/articlesController');
const {addComments, sendAllComments} = require('../controllers/commentsController');

articlesRouter.route("/").get(sendAllArticles);
articlesRouter.route("/:article_id").get(sendArticleById).patch(sendUpdatedArticle);
articlesRouter.route("/:article_id/comments").post(addComments).get(sendAllComments);

module.exports = articlesRouter;