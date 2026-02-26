module.exports = {
  v4: jest.fn(() => 'mock-uuid-' + Math.random().toString(36).substr(2, 9))
};