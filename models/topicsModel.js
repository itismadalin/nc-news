const connection = require('../db/connection');

exports.fetchAlltopics = () => {
  return connection.select('*').from('topics');
};