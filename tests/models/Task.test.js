const TaskModel = require('../../src/models/Task');
const mockDb = require('../../tests/__mocks__/database');

describe('Task Model', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  describe('Task.create', () => {
    it('should create a new task', () => {
      const projectId = 'proj-123';
      const title = 'Test Task';
      const description = 'Task Description';
      const status = 'pending';
      const priority = 'high';
      const assignedTo = 'user-123';

      const task = TaskModel.create(projectId, title, description, status, priority, assignedTo);

      expect(task).toHaveProperty('id');
      expect(task.title).toBe(title);
      expect(task.description).toBe(description);
      expect(task.status).toBe(status);
      expect(task.priority).toBe(priority);
      expect(task.assigned_to).toBe(assignedTo);
    });

    it('should create task with default values', () => {
      const task = TaskModel.create('proj-1', 'Default Task');

      expect(task).toHaveProperty('id');
      expect(task.status).toBe('pending');
      expect(task.priority).toBe('medium');
    });
  });

  describe('Task.findById', () => {
    it('should find task by id', () => {
      const created = TaskModel.create('proj-1', 'Find Task');
      
      const task = TaskModel.findById(created.id);

      expect(task).toBeDefined();
      expect(task.id).toBe(created.id);
    });
  });

  describe('Task.findByProject', () => {
    it('should return tasks for a project', () => {
      const projectId = 'proj-test';
      TaskModel.create(projectId, 'Task 1');
      TaskModel.create(projectId, 'Task 2');

      const tasks = TaskModel.findByProject(projectId);

      expect(tasks.length).toBe(2);
      expect(tasks[0].project_id).toBe(projectId);
      expect(tasks[1].project_id).toBe(projectId);
    });
  });

  describe('Task.findAll', () => {
    it('should return all tasks', () => {
      TaskModel.create('p1', 'Task A');
      TaskModel.create('p2', 'Task B');

      const tasks = TaskModel.findAll();

      expect(tasks.length).toBe(2);
    });
  });

  describe('Task.findByUser', () => {
    it('should return tasks assigned to a user', () => {
      const userId = 'user-123';
      TaskModel.create('p1', 'Task 1', '', 'pending', 'medium', userId);
      TaskModel.create('p2', 'Task 2', '', 'pending', 'medium', 'other-user');

      const tasks = TaskModel.findByUser(userId);

      expect(tasks.length).toBe(1);
      expect(tasks[0].assigned_to).toBe(userId);
    });
  });

  describe('Task.update', () => {
    it('should update task fields', () => {
      const task = TaskModel.create('proj-1', 'Original');
      
      const result = TaskModel.update(task.id, { 
        title: 'Updated', 
        status: 'completed',
        priority: 'low'
      });

      expect(result.changes).toBe(1);
    });
  });

  describe('Task.delete', () => {
    it('should delete a task', () => {
      const task = TaskModel.create('proj-1', 'Delete Me');
      
      const result = TaskModel.delete(task.id);

      expect(result.changes).toBe(1);
    });
  });
});