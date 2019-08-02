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


  //GENERAL WRONG ROUTE
  it('GET status 404 for a wrong route', () => {
    return request(app)
      .get('/wrongroute')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).to.equal('Route not found');
        expect(body.status).to.equal(404);
      });
  });


  //API METHOD NOT ALLOWED  
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


  //TOPICS
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
  });

  //USERS
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
    });
  });

  //ARTICLES
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
      it('GET a comment_count for the first article', () => {
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
            expect(body.article.comment_count).to.eql('13');
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
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.contain.keys(
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
      it('Method not allowed: status 405 for /users/:username', () => {
        const invalidMethods = ['put', 'patch', 'del'];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
          [method]('/api/articles/1/comments')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal('Method not allowed!');
            });
        });
        return Promise.all(methodPromises);
      });
      it("PATCH returns status 200, ignores a `patch` request, and returns the unchanged article as a result", () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: '' })
          .expect(200)
          .then(({ body }) => {
            expect(body.article).to.contain.keys(
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
      it('PATCH returns status 400 and a bad request error when inc_votes has a different key', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ change_votes: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal('Bad Request');
          });
      });
      it('PATCH ERROR returns 404 for an non-existing article ', () => {
        return request(app)
          .patch('/api/articles/100')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Article_id: 100 not found');
          });
      });
      it('PATCH ERROR returns 400 if article_id is wrong', () => {
        return request(app)
          .patch('/api/articles/banana')
          .send({ inc_votes: 1 })
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
      it('Method not allowed: status 405 for /articles', () => {
        const invalidMethods = ['put', 'post', 'del'];
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
      it('GET ERROR status 404 for a non-existing author', () => {
        return request(app)
          .get('/api/articles?author=not-an-author')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Author does not exist');
          });
      });
      it('GET ERROR status 404 for a non-existing topic', () => {
        return request(app)
          .get('/api/articles?topic=not-a-topic')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.eql('Topic does not exist');
          });
      });
    });
  });


  //COMMENTS
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
          expect(body.comment).to.contain.keys(
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
    it('POST ERROR returns 404 when commenting on an article with a correct path but wrong username', () => {
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
    it('GET returns 200 and an array with 13 comments for article 1', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments.length).to.eql(13);
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
    it('GET returns 200 and will sort the comments by votes, defaulted to DESC', () => {
      return request(app)
        .get('/api/articles/1/comments?sort_by=votes')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.descendingBy('votes');
          expect(body.comments[0].article_id).to.equal(1);
          expect(body.comments.length).to.equal(13);
        });
    });
    it('GET returns 200 and it will sort the comments in ASC order', () => {
      return request(app)
        .get('/api/articles/1/comments?order=asc')
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).to.be.ascendingBy('created_at');
        });
    });
  });
  //PATCH COMMENTS
  describe('/api/comments/:comment_id', () => {
    it('PATCH returns 200 and an updated comment', () => {
      return request(app)
        .patch('/api/comments/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({ body }) => {
          expect(body.comment).to.have.all.keys(
            'comment_id',
            'author',
            'article_id',
            'votes',
            'created_at',
            'body'
          );
          expect(body.comment.votes).to.equal(17);
        });
    });
    // it('PATCH returns 200 when sent a body with no `inc_votes` property', () => {
    //   return request(app)
    //     .patch('/api/comments/1')
    //     .send({  })
    //     .expect(200)
    //     .then(({ body }) => {
    //       expect(body.comments.votes).to.have.all.keys(
    //         'comment_id',
    //         'author',
    //         'article_id',
    //         'votes',
    //         'created_at',
    //         'body'
    //       );
    //     });
    // });
    it('PATCH ERROR returns 404 if comment_id does not exist', () => {
      return request(app)
        .patch('/api/comments/1000')
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.eql('Comment not found');
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
    //DELETE COMMENTS
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
          expect(body.msg).to.eql('Comment not found');
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