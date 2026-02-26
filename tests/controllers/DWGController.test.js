const request = require('supertest');
const express = require('express');

jest.mock('../../src/models/DWGFile', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByProject: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
}));

jest.mock('../../src/models/AuditLog', () => ({
  create: jest.fn()
}));

const DWGFile = require('../../src/models/DWGFile');
const DWGController = require('../../src/controllers/DWGController');

describe('DWG Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    const authMiddleware = (req, res, next) => {
      req.user = { userId: 'test-user', email: 'test@example.com', role: 'user' };
      next();
    };

    app.post('/dwg', authMiddleware, DWGController.create);
    app.get('/dwg', DWGController.getAll);
    app.get('/dwg/project/:projectId', DWGController.getByProject);
    app.get('/dwg/:id', DWGController.getById);
    app.put('/dwg/:id', authMiddleware, DWGController.update);
    app.delete('/dwg/:id', authMiddleware, DWGController.delete);

    jest.clearAllMocks();
  });

  describe('POST /dwg', () => {
    it('should create a new DWG file', async () => {
      DWGFile.create.mockReturnValue({ id: 'dwg-1', name: 'test.dwg', project_id: 'proj-1' });

      const res = await request(app)
        .post('/dwg')
        .send({ name: 'test.dwg', project_id: 'proj-1' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('test.dwg');
    });

    it('should return 400 if name is missing', async () => {
      const res = await request(app)
        .post('/dwg')
        .send({ project_id: 'proj-1' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /dwg', () => {
    it('should return all DWG files', async () => {
      DWGFile.findAll.mockReturnValue([
        { id: '1', name: 'file1.dwg' },
        { id: '2', name: 'file2.dwg' }
      ]);

      const res = await request(app).get('/dwg');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /dwg/project/:projectId', () => {
    it('should return DWG files for a project', async () => {
      DWGFile.findByProject.mockReturnValue([{ id: '1', name: 'test.dwg', project_id: 'proj-1' }]);

      const res = await request(app).get('/dwg/project/proj-1');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /dwg/:id', () => {
    it('should return DWG file by id', async () => {
      DWGFile.findById.mockReturnValue({ id: 'dwg-1', name: 'test.dwg' });

      const res = await request(app).get('/dwg/dwg-1');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('test.dwg');
    });

    it('should return 404 if DWG file not found', async () => {
      DWGFile.findById.mockReturnValue(null);

      const res = await request(app).get('/dwg/nonexistent');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /dwg/:id', () => {
    it('should update a DWG file', async () => {
      DWGFile.findById.mockReturnValue({ id: 'dwg-1', name: 'old.dwg' });
      DWGFile.update.mockReturnValue({ changes: 1 });

      const res = await request(app)
        .put('/dwg/dwg-1')
        .send({ name: 'updated.dwg' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /dwg/:id', () => {
    it('should delete a DWG file', async () => {
      DWGFile.findById.mockReturnValue({ id: 'dwg-1', name: 'delete.dwg' });
      DWGFile.delete.mockReturnValue({ changes: 1 });

      const res = await request(app).delete('/dwg/dwg-1');

      expect(res.status).toBe(200);
    });
  });
});