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
