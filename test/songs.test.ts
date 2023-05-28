import { expect } from 'chai';
import request from 'supertest';
import app from '../server'; 

describe('Songs API', () => {
  it('should fetch all songs successfully with valid token', (done) => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDcyYTA0MDA3ZjA3ZjA1YjFmNzIzODMiLCJpYXQiOjE2ODUyNTI3MTYsImV4cCI6MTY4NTMzOTExNn0.uW3IQChN_mgqlVOkmzYwjnJwS6HQVJRvSx1tt2GfqUM'; // Replace with a valid JWT token

    request(app)
      .post('/api/songs/get-all-songs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.true;
        expect(res.body.message).to.equal('Songs fetched successfully');
        expect(res.body.data).to.be.an('array');

        done();
      });
  });

  it('should return 500 status with error message for invalid token', (done) => {
    const token = 'invalid-token'; 

    request(app)
      .post('/api/songs/get-all-songs')
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.success).to.be.false;
        expect(res.body.message).to.be.a('string');

        done();
      });
  });

});
