process.env.NODE_ENV = 'test';
const connection = require('../db/connection');
const chai = require('chai');
const { expect } = chai;
chai.use(require('chai-sorted'));
const app = require('../app.js');
const request = require('supertest');


describe('/*', () => {
  after(() => connection.destroy());
  beforeEach(() => connection.seed.run());

  it('GET status 404 for a wrong route', () => {
    return request(app)
      .get('/wrongroute')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Route not found');
        expect(body.status).to.equal(404);
      });
  });

  describe('/api', () => {
    it('Method not allowed: status 405', () => {
      const invalidMethods = ['patch', 'put', 'post', 'del'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
        [method]('/api')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed!');
          });
      });
      return Promise.all(methodPromises);
    });
  });

  describe('/topics', () => {
    it('Method not allowed: status 405 for /topics', () => {
      const invalidMethods = ['patch', 'put', 'post', 'del'];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
        [method]('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).to.equal('Method not allowed!');
          });
      });
      return Promise.all(methodPromises);
    });
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
      it('Method not allowed: status 405 for /users/:username', () => {
        const invalidMethods = ['patch', 'put', 'post', 'del'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]('/api/users/rogersop')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
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
      it('GET returns an article object with all the keys', () => {
        return request(app)
          .get('/api/articles/2')
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.have.all.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'body',
              'created_at',
              'votes',
              'comment_count'
            );
          });
      });
      it('Method not allowed: status 405 for /articles', () => {
        const invalidMethods = ['patch', 'put', 'post', 'del'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]('/api/articles')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
      it('GET ERROR status 404 for an non-existing article', () => {
        return request(app)
          .get('/api/articles/1000')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Article not found.');
          });
      });
      it('GET ERROR status 400 if the article id is wrong', () => {
        return request(app)
          .get('/api/articles/salt-n-pepa')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).eql('Invalid Entry');
          });
      });
      it('PATCH returns 200 and the updated article', () => {
        return request(app)
          .patch('/api/articles/2')
          .send({ points: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article[0]).to.contain.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'body',
              'created_at',
              'votes'
            );
          });
      });
      it('PATCH ERROR returns 404 for an non-existing article ', () => {
        return request(app)
          .patch('/api/articles/100')
          .send({ points: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Article_id: 100 not found');
          });
      });
      it('PATCH ERROR returns 400 if article_id is wrong', () => {
        return request(app)
          .patch('/api/articles/banana')
          .send({ points: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).eql('Invalid Entry');
          });
      });
      it('PATCH ERROR returns 400 if there is a missing request', () => {
        return request(app)
          .patch('/api/articles/1')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).eql('Bad Request');
          });
      });

    });

    describe('/comments', () => {
      it('Method not allowed: status 405 for /comments', () => {
        const invalidMethods = ['get', 'put', 'post'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]('/api/comments/1')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
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
              'article_id',
              'author',
              'body',
              'comment_id',
              'created_at',
              'votes'
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
            expect(body.msg).to.equal('Input not found');
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
            expect(body.msg).to.equal('Invalid Entry');
          })
      });

      it('POST ERROR returns 400 when commenting on an article with a correct path but wrong username', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            username: 'theundertaker',
            body: 'Im coming for you.'
          })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal('Input not found');
          })
      });

      it('GET returns 200 and an empty array if the article has no comments', () => {
        return request(app)
          .get('/api/articles/2/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.eql([]);
          });
      });
      it('GET returns 200 and an array sorted by created_at if no query is passed', () => {
        return request(app)
          .get('/api/articles/5/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('created_at', { descending: true });
          });
      });
      it('GET returns 200 and an array sorted by a given variable if passed on as a query', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=votes&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy('votes', { descending: false });
          });
      });
    });

    describe('/api/articles', () => {
      it('GET returns 200 and an array with the correct keys', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.all.keys(
              'author',
              'title',
              'article_id',
              'topic',
              'body',
              'created_at',
              'votes',
              'comment_count'
            );
          });
      });
      it('GET returns 200 and an array of articles sorted in asc given order', () => {
        return request(app)
          .get('/api/articles?sort_by=votes&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy('votes', { descending: false });
          });
      });
      it('GET ERROR returns 400 when passed an invalid sort_by query', () => {
        return request(app)
          .get('/api/articles?sort_by=idwrong')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Column Not Found');
          });
      });
      it('GET ERROR returns 400 when passed an invalid order query', () => {
        return request(app)
          .get('/api/articles?order=worldsneworder')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Invalid Order');
          });
      });
      it('GET ERROR returns 400 and filter an author with no articles', () => {
        return request(app)
          .get('/api/articles?author=notexisting')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql(
              'Author does not exist'
            );
          });
      });
      it('GET ERROR returns 400 and filter a topic with no articles', () => {
        return request(app)
          .get('/api/articles?topic=notexisting')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql(
              'Topic does not exist'
            );
          });
      });
      it('GET ERROR status 404 for an non-existing author', () => {
        return request(app)
          .get('/api/articles?author=not-an-author')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Author does not exist');
          });
      });
      it('GET ERROR status 404 for an non-existing topic', () => {
        return request(app)
          .get('/api/articles/topic=not-a-topic')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Topic does not exist');
          });
      });
    });

    describe('/api/comments/:comment_id', () => {
      it('PATCH returns 200 and an updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ points: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.comment[0]).to.have.all.keys(
              'comment_id',
              'author',
              'article_id',
              'votes',
              'created_at',
              'body'
            );
            expect(body.comment[0].votes).to.equal(17);
          });
      });
      it('PATCH ERROR returns 400 if comment_id is wrong', () => {
        return request(app)
          .patch('/api/comments/banana')
          .send({ points: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Invalid Entry');
          });
      });
      it('PATCH ERROR returns 404 if comment_id does not exist', () => {
        return request(app)
          .patch('/api/comments/100')
          .send({ points: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Comment_id: 100 not found');
          });
      });
      it('PATCH ERROR returns 400 if there is no body on the request', () => {
        return request(app)
          .patch('/api/comments/1')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.eql('Invalid Entry');
          });
      });

      it('DELETE returns 204 and no content', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204)
          .then(({ body }) => {
            expect(body).to.eql({});
          });
      });
      it('DELETE ERROR returns 404 if the comment_id does not exist', () => {
        return request(app)
          .delete('/api/comments/100')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Comment_id: 100 not found');
          });
      });
      it('DELETE ERROR returns 400 if the comment_id has a wrong format', () => {
        return request(app)
          .delete('/api/comments/invalidentry')
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.eql('Invalid Entry');
          });
      });
      it('Method not allowed: status 405 for /comments/:comment_id', () => {
        const invalidMethods = ['get', 'put', 'post'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]('/api/comments/1')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});