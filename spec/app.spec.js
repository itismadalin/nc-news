process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const chai = require('chai');
const {expect} = chai;
const app = require('../app.js');
const request = require('supertest');


describe('/*', () => {
    after(() => connection.destroy());
    beforeEach(() => connection.seed.run());
    describe('/topics', () => {
        //use nested describe blocks to group the methods together and build the functionality as we go
      it('GET status 200, returns an array of topics objects', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then(({body}) => {
            expect(body.topics).to.be.an('Array');
            expect(body.topics[0]).to.have.keys('slug', 'description');
          });
      });
    });
});
