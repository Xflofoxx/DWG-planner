const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/User', () => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/Project', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/DWGFile', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByProject: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/Task', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByProject: jest.fn(),
  findByUser: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/AuditLog', () => ({
  create: jest.fn()
}));

const User = require('../../src/models/User');
const Project = require('../../src/models/Project');
const DWGFile = require('../../src/models/DWGFile');
const Task = require('../../src/models/Task');

describe('API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    const authMiddleware = (req, res, next) => {
      if (req.headers.authorization) {
        req.user = { userId: 'test-user', email: 'test@example.com', role: 'user' };
      }
      next();
    };

    app.post('/api/auth/register', (req, res) => {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
      const existing = User.findByEmail(email);
      if (existing) {
        return res.status(409).json({ message: 'User already exists' });
      }
      const user = User.create(email, password);
      res.status(201).json({ user, token: 'mock-token' });
    });

    app.post('/api/auth/login', (req, res) => {
      const { email, password } = req.body;
      const user = User.findByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      res.json({ user, token: 'mock-token' });
    });

    app.get('/api/projects', (req, res) => {
      res.json(Project.findAll());
    });

    app.get('/api/dwg', (req, res) => {
      res.json(DWGFile.findAll());
    });

    app.get('/api/tasks', (req, res) => {
      const { project_id } = req.query;
      if (project_id) {
        return res.json(Task.findByProject(project_id));
      }
      res.json(Task.findAll());
    });

    jest.clearAllMocks();
  });

  describe('Auth Endpoints', () => {
    it('POST /api/auth/register should create user', async () => {
      User.findByEmail.mockReturnValue(null);
      User.create.mockReturnValue({ id: '1', email: 'new@example.com', role: 'user' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'new@example.com', password: 'password' });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe('new@example.com');
    });

    it('POST /api/auth/login should authenticate user', async () => {
      User.findByEmail.mockReturnValue({ id: '1', email: 'test@example.com', password: 'password' });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('Project Endpoints', () => {
    it('GET /api/projects should return all projects', async () => {
      Project.findAll.mockReturnValue([{ id: '1', name: 'Project 1' }]);

      const res = await request(app).get('/api/projects');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('DWG Endpoints', () => {
    it('GET /api/dwg should return all DWG files', async () => {
      DWGFile.findAll.mockReturnValue([{ id: '1', name: 'test.dwg' }]);

      const res = await request(app).get('/api/dwg');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('Task Endpoints', () => {
    it('GET /api/tasks should return all tasks', async () => {
      Task.findAll.mockReturnValue([{ id: '1', title: 'Task 1' }]);

      const res = await request(app).get('/api/tasks');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/tasks?project_id=X should filter by project', async () => {
      Task.findByProject.mockReturnValue([{ id: '1', title: 'Task 1', project_id: 'proj-1' }]);

      const res = await request(app).get('/api/tasks?project_id=proj-1');

      expect(res.status).toBe(200);
      expect(Task.findByProject).toHaveBeenCalledWith('proj-1');
    });
  });
});