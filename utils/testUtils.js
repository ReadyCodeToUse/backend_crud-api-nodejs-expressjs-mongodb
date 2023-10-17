// eslint-disable-next-line import/no-unresolved
const { User } = require('../src/models/User.model');

module.exports.beforeEach = async function (testData) {
  // const address = testData[0].address;
  // eslint-disable-next-line no-return-assign
  const myFunc = jest.fn(() => this.location = {
    type: 'Point',
    coordinates: ['1234', '1234'],
    formattedAddress: 'address',
    street: 'street',
    city: 'city',
    state: 'state',
    zipcode: 'zipcode',
    country: 'country',
  });
  User.schema.pre('save', myFunc);
  // await test(nextSpy);
  // sinon.assertTrue(nextSpy.called);
  await User.insertMany(testData);
};

module.exports.afterEach = async function () {
  await User.deleteMany();
};

module.exports.beforeAll = async function (server, dbname, mongoose) {
  return new Promise((resolve) => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    const mongoUri = server.getUri(dbname);
    mongoose.connect(mongoUri, dbOptions);
    const db = mongoose.connection;
    db.once('open', () => {
      resolve();
    });
  });
};

module.exports.afterAll = async function (server, mongoose) {
  await mongoose.connection.close();
  await server.stop();
};
