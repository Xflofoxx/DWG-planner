const mockApp = {
  use: jest.fn(),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  listen: jest.fn(),
};

const mockRouter = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const express = function () {
  return mockApp;
};

express.json = jest.fn(() => (req, res, next) => next());
express.urlencoded = jest.fn(() => (req, res, next) => next());
express.static = jest.fn();
express.Router = jest.fn(() => mockRouter);

module.exports = express;
module.exports.default = express;
