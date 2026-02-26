const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/User', () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn()
}));

jest.mock('../../src/models/AuditLog', () => ({
  create: jest.fn()
}));

const User = require('../../src/models/User');
const AuthController = require('../../src/controllers/AuthController');

describe('Auth Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.post('/register', AuthController.register);
    app.post('/login', AuthController.login);
    app.get('/profile', (req, res) => {
      req.user = { userId: 'test-id', email: 'test@example.com', role: 'user' };
      AuthController.getProfile(req, res);
    });
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      User.findByEmail.mockReturnValue(null);
      User.create.mockReturnValue({ id: 'new-id', email: 'new@example.com', role: 'user' });

      const res = await request(app)
        .post('/register')
        .send({ email: 'new@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('new@example.com');
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app)
        .post('/register')
        .send({ password: 'password123' });

      expect(res.status).toBe(400);
    });

    it('should return 409 if user already exists', async () => {
      User.findByEmail.mockReturnValue({ id: 'existing', email: 'existing@example.com' });

      const res = await request(app)
        .post('/register')
        .send({ email: 'existing@example.com', password: 'password123' });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      User.findByEmail.mockReturnValue({ id: 'user-1', email: 'login@example.com', password: hashedPassword, role: 'user' });

      const res = await request(app)
        .post('/login')
        .send({ email: 'login@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 with invalid password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 12);
      User.findByEmail.mockReturnValue({ id: 'user-1', email: 'test@example.com', password: hashedPassword });

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('should return 401 if user not found', async () => {
      User.findByEmail.mockReturnValue(null);

      const res = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });
});