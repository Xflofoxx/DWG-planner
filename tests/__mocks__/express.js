const express = () => {
  const app = {};
  app.use = jest.fn();
  app.get = jest.fn((path, handler) => app);
  app.post = jest.fn((path, handler) => app);
  app.put = jest.fn((path, handler) => app);
  app.delete = jest.fn((path, handler) => app);
  app.listen = jest.fn();
  
  const mockRouter = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };
  
  return {
    express: jest.fn(() => app),
    Router: jest.fn(() => mockRouter),
    json: jest.fn(),
    urlencoded: jest.fn(),
    static: jest.fn()
  };
};

module.exports = express;
module.exports.default = express;