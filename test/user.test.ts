import { expect } from 'chai';
import request from 'supertest';
import app from '../server';

describe('User Register', () => {

  describe('User valid login', () => {
    it('should login a user with correct credentials', (done) => {
      const userData = {
        email: 'test@test.fr',
        password: '123',
      };

      request(app)
        .post('/api/users/login')
        .send(userData)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          expect(res.body.success).to.be.true;
          expect(res.body.message).to.equal('User logged in successfully');
          expect(res.body.data).to.be.a('string'); // Assuming the token is returned as a string

          done();
        });
    });

  });


});
