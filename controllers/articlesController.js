const { fetchArticleById, updateArticle, selectAllArticles } = require('../models/articlesModel');

exports.sendArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

exports.sendUpdatedArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { points } = req.body;
  if (points === undefined) next({ status: 400, msg: 'Bad Request' });
  else if (Object.keys(req.body).length > 1)
    next({ status: 400, msg: 'Unexpected keys' });
  else {
    updateArticle(article_id, points)
      .then((article) => {
        if (!article.length) {
          next({article,
            status: 404,
            msg: `Article_id: ${article_id} not found`
          });
        } else {
          res.status(200).send({ article });
        }
      })
      .catch(next);
  }
};

exports.sendAllArticles = (req, res, next) => {
  const { sort_by = 'created_at', order = 'desc', author, topic } = req.query;
  if (order === 'asc' || order === 'desc') {
    selectAllArticles(sort_by, order, author, topic)
      .then(articlesArray => {
        res.status(200).send({ articles: articlesArray });
      })
      .catch(next);
  } else {
    next({ status: 400, msg: 'Invalid Order' });
  }
};