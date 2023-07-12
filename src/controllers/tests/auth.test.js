// eslint-disable-next-line import/order
const app = require('../../../app');
const supertest = require('supertest');

const request = supertest(app);
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const testUtils = require('../../../utils/testUtils');

let mongoServer = null;

describe('Auth Endpoint', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    return testUtils.beforeAll(mongoServer, 'testdb', mongoose);
  });

  afterAll(async () => testUtils.afterAll(mongoServer, mongoose));

  beforeEach(async () => testUtils.beforeEach());

  afterEach(async () => testUtils.afterEach());

  describe('POST /auth/login', () => {
    it('Should login a user', async () => {
      const expectedResponse = {
        reqId: expect.any(String),
        timestamp: expect.any(String),
        data: {
          expires: '2h',
          token: expect.any(String),
          httpOnly: true,
        },
        status: 200,
        method: 'POST',
        path: '/auth/login',
        message: 'User logged in',
      };
      const response = await request
        .post('/auth/login')
        .send({
          email: 'a.ioele@icloud.com',
          password: 'password',
        });
      expect(response.body)
        .toEqual(expectedResponse);
    });

    it('Should not login a user with wrong credentials', async () => {
      const expectedResponse = {
        reqId: expect.any(String),
        timestamp: expect.any(String),
        status: 401,
        method: 'POST',
        path: '/auth/login',
        message: 'User or password incorrect. Please try again',
        level: 'error',
      };
      const response = await request
        .post('/auth/login')
        .send({
          email: 'test@test.it',
          password: 'test',
        });
      expect(response.body)
        .toEqual(expectedResponse);
    });

    it('Should ignore additional body property', async () => {
      const expectedResponse = {
        reqId: expect.any(String),
        timestamp: expect.any(String),
        data: {
          expires: '2h',
          token: expect.any(String),
          httpOnly: true,
        },
        status: 200,
        method: 'POST',
        path: '/auth/login',
        message: 'User logged in',
      };
      const response = await request
        .post('/auth/login')
        .send({
          email: 'a.ioele@icloud.com',
          password: 'password',
          additionalProperty: expect.any(String),
        });
      expect(response.body)
        .toEqual(expectedResponse);
    });
    /*
      })

      it('tests a successful query of an existing contract', async () => {
        const response = await request
          .get('/masterdata/contract-1');
        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.name).toBe('Contract 1');
        expect(response.body.description).toBe('Test-Contract Nr. 1');
      });

      it('tests a successful query of a non existing contract', async () => {
        const response = await request
          .get('/masterdata/contract-3');
        expect(response.status).toBe(200);
        expect(response.body).toBeNull();
      });

      it('tests a successful query of the children for an existing contract', async () => {
        const response = await request
          .get('/masterdata/contract-1/children');
        expect(response.status).toBe(200);
        expect(response.body.children).toBeDefined();
        expect(response.body.children.length).toBe(2);
        expect(response.body.children.filter((item) => item.name === 'Booking 1-1').length).toBe(1);
        expect(response.body.children.filter((item) => item.name === 'Booking 1-2').length).toBe(1);
      });

     */
  });
  describe('POST /auth/register', () => {
    it('Should register a user with correct body', async () => {
      const testUser = {
        firstName: 'Andrea',
        lastName: 'Ioele',
        birthDate: '1997-04-15',
        sex: 'M',
        email: 'a.ioele2@icloud.com',
        loginData: {
          username: 'andrea.ioele2',
          password: 'password',
          role: 'user',
        },
        address: 'Via torino milano',
      };
      const expectedResponse = {
        timestamp: expect.any(String),
        reqId: expect.any(String),
        method: 'POST',
        path: '/auth/register',
        status: 200,
        message: 'User Registered',
        data: {
          token: expect.any(String),
          expires: '2h',
          httpOnly: true,
        },
      };

      const response = await request
        .post('/auth/register')
        .send(testUser);

      expect(response.body).toEqual(expectedResponse);
    });
    it('Should not register a user with missing required property', async () => {
      const testUser = {
        firstName: 'Andrea',
        birthDate: '1997-04-15',
        sex: 'M',
        email: 'a.ioele2@icloud.com',
        loginData: {
          username: 'andrea.ioele2',
          password: 'password',
          role: 'user',
        },
        address: 'Via torino milano',
      };

      const expectedResponse = {
        fields: [
          'lastName',
        ],
        level: 'error',
        message: ['Last Name is required'],
        method: 'POST',
        path: '/auth/register',
        reqId: expect.any(String),
        status: 400,
        success: false,
        timestamp: expect.any(String),
      };

      const response = await request
        .post('/auth/register')
        .send(testUser);

      expect(response.body).toEqual(expectedResponse);
    });
    it('Should return an error if try to insert an user already registered with same email', async () => {
      const testUser = {
        firstName: 'Andrea',
        lastName: 'Ioele',
        birthDate: '1997-04-15',
        sex: 'M',
        email: 'a.ioele@icloud.com',
        loginData: {
          username: 'andrea.ioele',
          password: 'password',
          role: 'user',
        },
        address: 'Via torino milano',
      };

      const expectedResponse = {
        level: 'error',
        message: 'An account with that email already exists.',
        method: 'POST',
        path: '/auth/register',
        reqId: expect.any(String),
        status: 409,
        success: false,
        timestamp: expect.any(String),
        stack: expect.anything(),
      };

      const response = await request
        .post('/auth/register')
        .send(testUser);

      expect(response.body).toEqual(expectedResponse);
    });
  });
});
