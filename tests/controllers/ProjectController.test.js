const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/Project', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/AuditLog', () => ({
  create: jest.fn()
}));

const Project = require('../../src/models/Project');
const ProjectController = require('../../src/controllers/ProjectController');

describe('Project Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    const authMiddleware = (req, res, next) => {
      req.user = { userId: 'test-user', email: 'test@example.com', role: 'user' };
      next();
    };

    app.post('/projects', authMiddleware, ProjectController.create);
    app.get('/projects', ProjectController.getAll);
    app.get('/projects/:id', ProjectController.getById);
    app.put('/projects/:id', authMiddleware, ProjectController.update);
    app.delete('/projects/:id', authMiddleware, ProjectController.delete);

    jest.clearAllMocks();
  });

  describe('POST /projects', () => {
    it('should create a new project', async () => {
      Project.create.mockReturnValue({ id: 'proj-1', name: 'Test Project', description: 'Description' });

      const res = await request(app)
        .post('/projects')
        .send({ name: 'Test Project', description: 'Description' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Test Project');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/projects')
        .send({ description: 'No name' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /projects', () => {
    it('should return all projects', async () => {
      Project.findAll.mockReturnValue([
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' }
      ]);

      const res = await request(app).get('/projects');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /projects/:id', () => {
    it('should return project by id', async () => {
      Project.findById.mockReturnValue({ id: 'proj-1', name: 'Test' });

      const res = await request(app).get('/projects/proj-1');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test');
    });

    it('should return 404 if project not found', async () => {
      Project.findById.mockReturnValue(null);

      const res = await request(app).get('/projects/nonexistent');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /projects/:id', () => {
    it('should update a project', async () => {
      Project.findById.mockReturnValue({ id: 'proj-1', name: 'Old' });
      Project.update.mockReturnValue({ changes: 1 });

      const res = await request(app)
        .put('/projects/proj-1')
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /projects/:id', () => {
    it('should delete a project', async () => {
      Project.findById.mockReturnValue({ id: 'proj-1', name: 'To Delete' });
      Project.delete.mockReturnValue({ changes: 1 });

      const res = await request(app).delete('/projects/proj-1');

      expect(res.status).toBe(200);
    });
  });
});