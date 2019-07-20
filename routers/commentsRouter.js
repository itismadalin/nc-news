const commentsRouter = require('express').Router();
const { updateVotes, removeComments } = require('../controllers/commentsController');
const { methodNotAllowed } = require('../errors/index');


commentsRouter.route('/:comment_id').patch(updateVotes).delete(removeComments).all(methodNotAllowed);


module.exports = commentsRouter;