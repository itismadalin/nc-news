process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted')); //testing if an array has sorted values (strings, numbers, booleans)
const app = require('../app.js');
const request = require('supertest');

//refactor at the end using nested describe blocks to group the methods together and build the functionality as we go

describe('/*', () => {
  //Mocha Hooks - before, beforeEach and after - used to set up preconditions and clean up after your tests
  after(() => connection.destroy()); //
  beforeEach(() => connection.seed.run()); //

  it('GET status 404 for a wrong route', () => { //no endpoint available for this url
    return request(app) //it makes a dummy connection to the server
      .get('/wrongroute')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Route not found');
        expect(body.status).to.equal(404);
      });
  });

  describe('/topics', () => {
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
  // describe('Invalid Methods', () => {
  //   it('Returns status 405', () => {
  //     const invalidMethods = ['patch', 'put', 'delete'];
  //     const methodPromises = invalidMethods.map((method) => {
  //       return request(app)
  //       [method]('/api/topics') //`request.patch('/api/topics')` is equivalent to `request[method]('/api/topics')`
  //         .expect(405)
  //     });
  //     return Promise.all(methodPromises);
  //   });
  // });

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
      // describe('Invalid Methods', () => {
      //   it('Returns status 405', () => {
      //     const invalidMethods = ['patch', 'put', 'delete'];
      //     const methodPromises = invalidMethods.map((method) => {
      //       return request(app)
      //       [method]('/api/users/lurker')
      //         .expect(405)
      //     });
      //     return Promise.all(methodPromises);
      //   });
      // });
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
      it('GET returns an article object with all the keys', () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "body",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it('GET ERROR status 404 for an non-existing article', () => {
        return request(app)
          .get('/api/articles/1000')
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('Article not found.');
          });
      });
      it('GET ERROR status 400 if the article id is wrong', () => {
        return request(app)
          .get('/api/articles/salt-n-pepa')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).eql('Invalid article_ID');
          });
      });

      it("PATCH returns 200 and the updated article", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.all.keys(
              "author",
              "title",
              "article_id",
              "topic",
              "body",
              "created_at",
              "votes"
            );
          });
      });

      it('PATCH ERROR returns 404 for an non-existing article ', () => {
        return request(app)
          .patch("/api/articles/100")
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql("No article found for article_id: 100");
          });
      });
      it("PATCH ERROR returns 400 if article_id is wrong", () => {
        return request(app)
          .patch("/api/articles/banana")
          .send({ inc_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).eql("Invalid article_ID");
          });
      });
      it("PATCH ERROR returns 400 if there is a missing request", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).eql("Missing Request");
          });
      });
      // describe('Invalid Methods', () => {
      //   it('Returns status 405', () => {
      //     const invalidMethods = ['post', 'put', 'delete'];
      //     const methodPromises = invalidMethods.map((method) => {
      //       return request(app)
      //       [method]('/api/articles/2')
      //         .expect(405)
      //     });
      //     return Promise.all(methodPromises);
      //   });
      // });

    });
    describe('/comments', () => {
      it('POST respond with status 201 and a posted comment', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({
            username: 'butter_bridge',
            body: 'Im coming for you.'
          })
          .expect(201)
          .then(({ body }) => {
            expect(body.comment[0]).to.have.all.keys(
              "article_id",
              "author",
              "body",
              "comment_id",
              "created_at",
              "votes"
            );
          });
      });
      it('POST ERROR returns 404 when commenting on a non-existing article', () => {
        return request(app)
          .post('/api/articles/100/comments')
          .send({
            username: 'butter_bridge',
            body: 'Im coming for you.'
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Article_ID not found');
          })
      });
      it('POST ERROR returns 400 when commenting on an article with a wrong format', () => {
        return request(app)
          .post('/api/articles/banana/comments')
          .send({
            username: 'theundertaker',
            body: 'Im coming for you.'
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Invalid article_ID');
          })
      });

    });
  });
});