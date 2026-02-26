const mockResponse = {
  status: 200,
  body: {},
  statusCode: 200,
  header: {},
  get: jest.fn(),
  set: jest.fn()
};

const createMockRequest = () => ({
  get: jest.fn().mockReturnThis(),
  post: jest.fn().mockReturnThis(),
  put: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  query: jest.fn().mockReturnThis(),
  then: jest.fn((resolve) => resolve(mockResponse)),
  end: jest.fn()
});

const mockRequest = createMockRequest();

const supertest = jest.fn(() => mockRequest);

supertest.get = jest.fn(() => mockRequest);
supertest.post = jest.fn(() => mockRequest);
supertest.put = jest.fn(() => mockRequest);
supertest.delete = jest.fn(() => mockRequest);

module.exports = supertest;