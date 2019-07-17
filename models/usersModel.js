const connection = require('../db/connection');

exports.fetchUserByUsername = username => {
  return connection
    .first('*')
    .from('users')
    .where('username', '=', username);
};