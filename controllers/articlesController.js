const { fetchArticleById, updateArticle, selectAllArticles } = require('../models/articlesModel');

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => next(err)); //here we can console.log the error to find out the psql codes
};

exports.sendUpdatedArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  if (inc_votes === undefined) next({ status: 400, msg: "Missing Request" });
  else {
    updateArticle(article_id, inc_votes)
      .then(article => {
        if (!article.length) {
          next({
            status: 404,
            msg: `No article found for article_id: ${article_id}`
          });
        } else {
          res.status(200).send({ article: article[0] });
        }
      })
      .catch(next);
  }
};