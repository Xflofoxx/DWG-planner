const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_super_secret_jwt_key_change_in_production';

describe('Auth Middleware', () => {
  let authMiddleware;

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = JWT_SECRET;
    authMiddleware = require('../../src/middleware/auth');
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should return 401 if no token provided', () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
  });

  it('should return 401 if token is invalid', () => {
    const req = { headers: { authorization: 'Bearer invalidtoken' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should call next() with valid token', () => {
    const token = jwt.sign({ userId: 'user-1', email: 'test@example.com', role: 'user' }, JWT_SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe('user-1');
  });
});

describe('Require Role Middleware', () => {
  let requireRole;

  beforeEach(() => {
    jest.resetModules();
    process.env.JWT_SECRET = JWT_SECRET;
    const middleware = require('../../src/middleware/auth');
    requireRole = middleware.requireRole;
  });

  it('should return 401 if not authenticated', () => {
    const req = {};
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return 403 if user role is insufficient', () => {
    const req = { user: { role: 'user' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Insufficient permissions' });
  });

  it('should call next() if user has required role', () => {
    const req = { user: { role: 'admin' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    requireRole('admin')(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});