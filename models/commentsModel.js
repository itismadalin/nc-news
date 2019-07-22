const connection = require('../db/connection');

exports.insertComment = (article_id, username, body) => {
    return connection('comments')
        .returning('*')
        .insert({ article_id: article_id, author: username, body: body });
};

exports.selectAllComments = (
    article_id,
    { sort_by = 'created_at', order = 'desc' }
) => {
    return connection
        .select('*')
        .from('comments')
        .where('article_id', article_id)
        .orderBy(sort_by, order)
        .returning('*')
        .then(commentsArray => {
            if (!commentsArray.length) {
                return connection
                    .select('*')
                    .from('articles')
                    .where('article_id', article_id)
                    .then(articleInfo => {
                        if (!articleInfo.length) {
                            return Promise.reject({
                                status: 404,
                                msg: `No article found for article_id: ${article_id}`
                            });
                        }
                        return commentsArray;
                    });
            }
            return commentsArray;
        });
};


exports.incrementVotes = (comment_id, inc_votes) => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', comment_id)
        .increment('votes', inc_votes)
        .returning('*');
};

exports.deleteComments = comment_id => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', comment_id)
        .returning('*')
        .then(comments => {
            if (!comments.length) {
                return Promise.reject({
                    status: 404,
                    msg: 'Comment not found'
                });
            } else {
                return connection('comments')
                    .where('comment_id', comment_id)
                    .del();
            }
        });
};