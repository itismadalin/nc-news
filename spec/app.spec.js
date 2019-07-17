process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const chai = require('chai');
const { expect } = chai;
const app = require('../app.js');
const request = require('supertest');


describe('/*', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());
  describe('/topics', () => {
    //refactor at the end using nested describe blocks to group the methods together and build the functionality as we go
    it('GET status 200, returns an array of topics objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
          expect(body.topics).to.be.an('Array');
          expect(body.topics[0]).to.contain.keys('slug', 'description');
        });
    });
  });
  describe('/users', () => {
    describe('/users/:username', () => {
      it('GET status 200, returns an user object by username', () => {
        return request(app)
          .get('/api/users/rogersop')
          .expect(200)
          .then(({ body }) => {
            expect(body.user.username).to.be.equal('rogersop');
            expect(body.user).to.contain.keys('username', 'avatar_url', 'name');
          });
      });
      it('GET ERROR status 404 for an invalid user', () => {
        return request(app)
          .get('/api/users/druserwho')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('User not found');
          });
      });
    });
  });
  describe('/articles', () => {
    describe('/articles/:article_id', () => {
      it('GET status 200, returns an article object', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at',
              'comment_count'
            );
          });
      });
      // it('GET ERROR status 404, for an invalid article id', () => {
      //   return request(app)
      //     .get('/api/articles/')
      //     .expect(404)
      //     .then(({ body }) => {
      //       expect(body.msg).to.equal('Article not found');
      //     });
      // });
      it('PATCH status 200, returns an updated article', () => {
        return request(app)
          .patch('/api/articles/2')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.contain.keys(
              'article_id',
              'title',
              'body',
              'votes',
              'topic',
              'author',
              'created_at'
            );
            expect(body.article[0].votes).to.equal(1);
          });
      });
    });
  });
});