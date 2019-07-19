const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
  return connection
    .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
    .first('articles.*')
    .groupBy('articles.article_id', 'comments.article_id')
    .count('comments.article_id AS comment_count')
    .from('articles')
    .where('articles.article_id', article_id)
    .then(article => {
      if (!article) {

        return Promise.reject({//returns a Promise object that is rejected with a given reason
          status: 404,
          msg: 'Article not found.'
        });
      } else return article;
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .increment('votes', inc_votes)
    .returning('*');
};
