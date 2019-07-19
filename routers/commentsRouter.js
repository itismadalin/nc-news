const commentsRouter = require('express').Router();
const { updateVotes, removeComments } = require('../controllers/commentsController');


commentsRouter.route('/:comment_id').patch(updateVotes).delete(removeComments);


module.exports = commentsRouter;