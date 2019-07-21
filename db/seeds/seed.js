const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function (knex) {
  const topicsInsertions = knex('topics').insert(topicData);
  const usersInsertions = knex('users').insert(userData);

  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return Promise.all([topicsInsertions, usersInsertions])
    })
    .then(() => {
      const dateFormatted = formatDates(articleData);
      return knex("articles")
        .insert(dateFormatted)
        .returning("*");
    })
    .then(articleRows => {

      const articleRef = makeRefObj(articleRows);
      const formattedComments = formatComments(commentData, articleRef);
      return knex('comments').insert(formattedComments);
    });
};

