// const ENV = process.env.NODE_ENV || 'development';

const connection = require('knex');

const dbConfig = require('../knexfile');

module.exports = connection(dbConfig);