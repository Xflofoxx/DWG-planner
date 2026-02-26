const request = require('supertest');
const express = require('express');

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

const Task = require('../../src/models/Task');
const TaskController = require('../../src/controllers/TaskController');

describe('Task Controller', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    const authMiddleware = (req, res, next) => {
      req.user = { userId: 'test-user', email: 'test@example.com', role: 'user' };
      next();
    };

    app.post('/tasks', authMiddleware, TaskController.create);
    app.get('/tasks', TaskController.getAll);
    app.get('/tasks/user/:userId', TaskController.getByUser);
    app.get('/tasks/:id', TaskController.getById);
    app.put('/tasks/:id', authMiddleware, TaskController.update);
    app.delete('/tasks/:id', authMiddleware, TaskController.delete);

    jest.clearAllMocks();
  });

  describe('POST /tasks', () => {
    it('should create a new task', async () => {
      Task.create.mockReturnValue({ id: 'task-1', title: 'Test Task', project_id: 'proj-1' });

      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task', project_id: 'proj-1' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Task');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ project_id: 'proj-1' });

      expect(res.status).toBe(400);
    });

    it('should return 400 if project_id is missing', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task' });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      Task.findAll.mockReturnValue([
        { id: '1', title: 'Task 1' },
        { id: '2', title: 'Task 2' }
      ]);

      const res = await request(app).get('/tasks');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should filter tasks by project_id', async () => {
      Task.findByProject.mockReturnValue([{ id: '1', title: 'Task 1', project_id: 'proj-1' }]);

      const res = await request(app).get('/tasks?project_id=proj-1');

      expect(res.status).toBe(200);
      expect(Task.findByProject).toHaveBeenCalledWith('proj-1');
    });
  });

  describe('GET /tasks/user/:userId', () => {
    it('should return tasks for a user', async () => {
      Task.findByUser.mockReturnValue([{ id: '1', title: 'My Task', assigned_to: 'user-1' }]);

      const res = await request(app).get('/tasks/user/user-1');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return task by id', async () => {
      Task.findById.mockReturnValue({ id: 'task-1', title: 'Test Task' });

      const res = await request(app).get('/tasks/task-1');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Task');
    });

    it('should return 404 if task not found', async () => {
      Task.findById.mockReturnValue(null);

      const res = await request(app).get('/tasks/nonexistent');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update a task', async () => {
      Task.findById.mockReturnValue({ id: 'task-1', title: 'Old' });
      Task.update.mockReturnValue({ changes: 1 });

      const res = await request(app)
        .put('/tasks/task-1')
        .send({ title: 'Updated Task', status: 'completed' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task', async () => {
      Task.findById.mockReturnValue({ id: 'task-1', title: 'To Delete' });
      Task.delete.mockReturnValue({ changes: 1 });

      const res = await request(app).delete('/tasks/task-1');

      expect(res.status).toBe(200);
    });
  });
});