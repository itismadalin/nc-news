const ENV = process.env.NODE_ENV || 'development';

const testData = require('./test-data');
const developmentData = require('./development-data');


const data = {
    development: developmentData,
    test: testData,
    production: developmentData
};

module.exports = data[ENV];