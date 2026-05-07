const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async () => {
  global.__MONGO_SERVER__ = await MongoMemoryServer.create();
  process.env.MONGODB_URL = global.__MONGO_SERVER__.getUri();
};
