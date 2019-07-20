const usersRouter = require('express').Router();
const {sendUserByUsername} = require('../controllers/usersController');
const { methodNotAllowed } = require('../errors/index');

usersRouter.route('/:username').get(sendUserByUsername).all(methodNotAllowed);

module.exports = usersRouter;