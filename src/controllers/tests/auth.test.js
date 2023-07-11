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

  it('Should login a user', async () => {
    const response = await request
      .post('/auth/login').send({
        email: 'a.ioele@icloud.com',
        password: 'password',
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User logged in');
  });
/*
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
