const AuditLogModel = require('../../src/models/AuditLog');
const mockDb = require('../../tests/__mocks__/database');

describe('AuditLog Model', () => {
  beforeEach(() => {
    mockDb.reset();
  });

  describe('AuditLog.create', () => {
    it('should create a new audit log entry', () => {
      const userId = 'user-123';
      const action = 'CREATE';
      const resourceType = 'project';
      const resourceId = 'proj-123';
      const details = { name: 'Test Project' };

      const log = AuditLogModel.create(userId, action, resourceType, resourceId, details);

      expect(log).toHaveProperty('id');
      expect(log.user_id).toBe(userId);
      expect(log.action).toBe(action);
      expect(log.resource_type).toBe(resourceType);
      expect(log.resource_id).toBe(resourceId);
    });
  });

  describe('AuditLog.findById', () => {
    it('should find audit log by id', () => {
      const created = AuditLogModel.create('u1', 'CREATE', 'task', 't1', {});
      
      const log = AuditLogModel.findById(created.id);

      expect(log).toBeDefined();
      expect(log.id).toBe(created.id);
    });
  });

  describe('AuditLog.findByUser', () => {
    it('should return audit logs for a user', () => {
      const userId = 'user-test';
      AuditLogModel.create(userId, 'CREATE', 'project', 'p1', {});
      AuditLogModel.create(userId, 'UPDATE', 'task', 't1', {});
      AuditLogModel.create('other-user', 'DELETE', 'task', 't2', {});

      const logs = AuditLogModel.findByUser(userId);

      expect(logs.length).toBe(2);
    });
  });

  describe('AuditLog.findByResource', () => {
    it('should return audit logs for a specific resource', () => {
      const resourceType = 'project';
      const resourceId = 'proj-specific';
      AuditLogModel.create('u1', 'CREATE', resourceType, resourceId, {});
      AuditLogModel.create('u1', 'UPDATE', resourceType, resourceId, {});
      AuditLogModel.create('u1', 'CREATE', 'task', 't1', {});

      const logs = AuditLogModel.findByResource(resourceType, resourceId);

      expect(logs.length).toBe(2);
    });
  });

  describe('AuditLog.findAll', () => {
    it('should return all audit logs', () => {
      AuditLogModel.create('u1', 'CREATE', 'p', 'p1', {});
      AuditLogModel.create('u2', 'DELETE', 't', 't1', {});

      const logs = AuditLogModel.findAll();

      expect(logs.length).toBe(2);
    });
  });
});