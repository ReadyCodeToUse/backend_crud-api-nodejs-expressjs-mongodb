const { User } = require('../src/models/User.model');
const testData = require('../src/controllers/__data__/testData.json');

module.exports.beforeEach = async function () {
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
