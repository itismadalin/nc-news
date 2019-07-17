const usersRouter = require('express').Router();
const {sendUserByUsername} = require('../controllers/usersController');

usersRouter.route('/:username').get(sendUserByUsername);

module.exports = usersRouter;