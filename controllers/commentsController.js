const { insertComment, selectAllComments,
    incrementVotes, deleteComments } = require('../models/commentsModel');

exports.addComments = (req, res, next) => {
    const { article_id } = req.params;
    const { username } = req.body;
    const { body } = req.body;

    if (article_id === undefined || username === undefined || body === undefined)
        next({ status: 400, msg: 'Invalid Entry' });

    else if (Object.keys(req.body).length > 2)
        next({ status: 400, msg: 'Unexpected keys found' });
    else {
        insertComment(article_id, username, body)
            .then(insertedComment => {
                res.status(201).send({ comment: insertedComment });
            })
            .catch(next);
    }
};

exports.sendAllComments = (req, res, next) => {
    const { article_id } = req.params;
    selectAllComments(article_id, req.query)
        .then(arrayOfComments => {
            res.status(200).send({ comments: arrayOfComments });
        })
        .catch(next);
};

exports.updateVotes = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    if (inc_votes === undefined) next({ status: 400, msg: 'Invalid Entry' });

    else if (Object.keys(req.body).length > 1)
        next({ status: 400, msg: 'body contains unexpected keys' });
    else {
        incrementVotes(comment_id, inc_votes)
            .then(([updatedComment]) => {
                if (!updatedComment) {
                    next({
                        status: 404,
                        msg: `Comment not found`
                    });
                } else {
                    res.status(200).send({ comment: updatedComment });
                }
            })
            .catch(next);
    }
};

exports.removeComments = (req, res, next) => {
    const { comment_id } = req.params;
    deleteComments(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
};