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
        return Promise.reject({
          status: 404,
          msg: 'Article not found.'
        });
      } else return article;
    });
};

exports.updateArticle = (article_id, points) => {
  return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .increment('votes', points)
    .returning('*');
};

exports.selectAllArticles = (sort_by, order, author, topic) => {
  return connection
    .select(
      'articles.author',
      'articles.title',
      'articles.article_id',
      'articles.topic',
      'articles.body',
      'articles.created_at',
      'articles.votes'
    )
    .from('articles')
    .orderBy(sort_by, order)
    .count('comment_id as comment_count')
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    // ^ if doesnt have any comments return all articles
    .groupBy('articles.article_id')
    .modify(query => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ topic });
    })
    .then(articles => {
      if (!articles.length && author)
        return Promise.reject({
          status: 400,
          msg:
            'Author does not exist'
        });
      else if (!articles.length && topic)
        return Promise.reject({
          status: 400,
          msg:
            'Topic does not exist'
        });
      else return articles;
    });
};